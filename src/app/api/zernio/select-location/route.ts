import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio, ZernioError } from "@/lib/zernio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let locationId: string;
  let accountId: string;
  try {
    const body = await req.json();
    locationId = body.locationId;
    accountId = body.accountId;
    if (!locationId || typeof locationId !== "string") {
      return NextResponse.json({ error: "locationId requis" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const service = createServiceClient();
  const { data: connection } = await service
    .from("zernio_connections")
    .select("connect_token, connect_token_expires_at, zernio_profile_id, pending_data_token")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!connection?.connect_token) {
    return NextResponse.json(
      { error: "Aucun token de connexion. Recommencez depuis le début." },
      { status: 400 }
    );
  }

  const expiresAt = connection.connect_token_expires_at
    ? new Date(connection.connect_token_expires_at)
    : null;

  if (expiresAt && expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Le token de connexion a expiré. Reconnectez votre compte Google." },
      { status: 400 }
    );
  }

  try {
    console.log("[select-location] About to send to Zernio:", {
      locationId,
      locationIdType: typeof locationId,
      locationIdLength: locationId?.length,
      locationIdStartsWithLocations: locationId?.startsWith?.("locations/"),
      accountId,
      accountIdEmpty: !accountId || accountId === "",
      accountIdStartsWithAccounts: accountId?.startsWith?.("accounts/"),
      profileId: connection.zernio_profile_id,
      pendingDataTokenPresent: !!connection.pending_data_token,
      pendingDataTokenLength: connection.pending_data_token?.length,
    });
    const { account } = await zernio.selectConnectLocation(
      connection.connect_token,
      connection.zernio_profile_id ?? "",
      locationId,
      accountId ?? "",
      connection.pending_data_token ?? ""
    );

    await service
      .from("zernio_connections")
      .update({
        zernio_account_id: account._id,
        business_name: account.name ?? null,
        business_address: account.address ?? null,
        business_city: account.city ?? null,
        sync_status: "idle",
        connect_token: null,
        connect_token_expires_at: null,
        temp_token: null,
        pending_data_token: null,
      })
      .eq("user_id", user.id);

    await syncReviews(user.id, account._id, service);

    return NextResponse.json({ success: true, business_name: account.name ?? null });
  } catch (err) {
    if (err instanceof ZernioError) {
      console.error("[select-location] ZernioError", {
        status: err.status,
        code: err.code,
        message: err.message,
      });
      return NextResponse.json(
        { error: err.message, zernioStatus: err.status, zernioCode: err.code },
        { status: 502 }
      );
    }
    console.error("[select-location] Unexpected error", err);
    return NextResponse.json(
      { error: "Impossible de finaliser la connexion." },
      { status: 502 }
    );
  }
}

async function syncReviews(
  userId: string,
  accountId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any
) {
  await service
    .from("zernio_connections")
    .update({ sync_status: "syncing" })
    .eq("user_id", userId);

  try {
    const { reviews } = await zernio.getReviews(accountId);

    if (reviews.length > 0) {
      const rows = reviews.map((r) => ({
        user_id: userId,
        zernio_review_id: r.id,
        author_name: r.author?.name ?? null,
        author_photo_url: r.author?.photoUrl ?? null,
        rating: r.rating ?? null,
        review_text: r.comment ?? null,
        review_language: r.language ?? null,
        review_created_at: r.createTime ?? null,
        review_updated_at: r.updateTime ?? null,
        reply_text: r.reply?.comment ?? null,
        reply_published_at: r.reply?.updateTime ?? null,
        reply_state: null,
        updated_at: new Date().toISOString(),
      }));

      await service.from("reviews").upsert(rows, { onConflict: "zernio_review_id" });
    }

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
        : null;

    await service
      .from("zernio_connections")
      .update({
        sync_status: "idle",
        sync_error: null,
        last_sync_at: new Date().toISOString(),
        review_count: reviews.length,
        rating: avgRating ? Math.round(avgRating * 100) / 100 : null,
      })
      .eq("user_id", userId);
  } catch (err) {
    await service
      .from("zernio_connections")
      .update({
        sync_status: "error",
        sync_error: err instanceof Error ? err.message : "Sync failed",
      })
      .eq("user_id", userId);
    throw err;
  }
}
