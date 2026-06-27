import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio, ZernioError } from "@/lib/zernio";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  const { data: connection } = await service
    .from("zernio_connections")
    .select("zernio_profile_id, zernio_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!connection) {
    return NextResponse.json(
      { error: "Aucune connexion Zernio initiée. Recommencez depuis le début." },
      { status: 400 }
    );
  }

  // Already finalized
  if (connection.zernio_account_id) {
    return NextResponse.json({ success: true, alreadyFinalized: true });
  }

  try {
    // 1. Fetch the Google Business account created after OAuth
    const { accounts } = await zernio.listAccounts(connection.zernio_profile_id);
    const gbAccount = accounts.find((a) => a.platform === "googlebusiness") ?? accounts[0];

    if (!gbAccount) {
      return NextResponse.json(
        {
          error:
            "Aucun compte Google Business trouvé. Assurez-vous d'avoir autorisé l'accès lors de l'étape OAuth.",
        },
        { status: 404 }
      );
    }

    // 2. Update connection with account info
    await service
      .from("zernio_connections")
      .update({
        zernio_account_id: gbAccount._id,
        business_name: gbAccount.name ?? null,
        business_address: gbAccount.address ?? null,
        business_city: gbAccount.city ?? null,
        sync_status: "idle",
      })
      .eq("user_id", user.id);

    // 3. Trigger initial sync
    await syncReviews(user.id, gbAccount._id, service);

    return NextResponse.json({ success: true, business_name: gbAccount.name ?? null });
  } catch (err) {
    const message =
      err instanceof ZernioError
        ? err.message
        : "Erreur lors de la finalisation de la connexion.";
    console.error("[zernio/finalize-connection]", err);
    return NextResponse.json({ error: message }, { status: 502 });
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

      await service
        .from("reviews")
        .upsert(rows, { onConflict: "zernio_review_id" });
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
