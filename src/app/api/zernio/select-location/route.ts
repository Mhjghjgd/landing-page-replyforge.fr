import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio, ZernioError, type ZernioReview } from "@/lib/zernio";

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

    console.log("[select-location] Zernio account response:", JSON.stringify(account));

    await service
      .from("zernio_connections")
      .update({
        zernio_account_id: account.accountId,
        business_name: account.selectedLocationName ?? account.displayName ?? null,
        business_address: null,
        business_city: null,
        sync_status: "idle",
        connect_token: null,
        connect_token_expires_at: null,
        temp_token: null,
        pending_data_token: null,
      })
      .eq("user_id", user.id);

    await syncReviews(user.id, account.accountId, service);

    return NextResponse.json({
      success: true,
      business_name: account.selectedLocationName ?? account.displayName ?? null
    });
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
    let reviews: ZernioReview[] = [];
    try {
      const result = await zernio.getReviews(accountId);
      reviews = result.reviews ?? [];
    } catch (err) {
      console.error("[sync] getReviews failed:", err);
      reviews = [];
    }
    console.log("[sync] Processing", reviews.length, "reviews");

    if (reviews.length > 0) {
      const rows = reviews.map((r: any) => ({
        user_id: userId,
        zernio_review_id: r.id ?? r._id ?? r.reviewId,
        author_name:
          r.author?.name ??
          r.author?.displayName ??
          r.reviewer?.name ??
          r.reviewer?.displayName ??
          r.authorName ??
          null,
        author_photo_url:
          r.author?.photoUrl ??
          r.author?.picture ??
          r.reviewer?.profilePhotoUrl ??
          null,
        rating: r.rating ?? r.starRating ?? r.stars ?? null,
        review_text: r.comment ?? r.text ?? r.content ?? r.body ?? r.message ?? null,
        review_language: r.language ?? r.locale ?? null,
        review_created_at: r.createTime ?? r.createdAt ?? r.created_at ?? null,
        review_updated_at: r.updateTime ?? r.updatedAt ?? null,
        reply_text: r.reply?.comment ?? r.reply?.text ?? null,
        reply_published_at: r.reply?.updateTime ?? r.reply?.updatedAt ?? null,
        reply_state: null,
        updated_at: new Date().toISOString(),
      }));

      // Log mapping for diagnostic
      if (rows.length > 0) {
        console.log("[sync] First mapped row:", JSON.stringify(rows[0], null, 2));
      }

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
