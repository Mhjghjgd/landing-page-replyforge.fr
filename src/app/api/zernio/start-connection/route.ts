import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { zernio, ZernioError } from "@/lib/zernio";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_name, subscription_status")
    .eq("id", user.id)
    .single();

  if (profile?.subscription_status !== "active") {
    return NextResponse.json({ error: "Subscription not active" }, { status: 403 });
  }

  const service = createServiceClient();
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.replyforge.fr").replace(/\/$/, "");
  const redirectUrl = `${baseUrl}/api/zernio/oauth-callback`;

  // If already connected with an account, return alreadyConnected
  const { data: existing } = await service
    .from("zernio_connections")
    .select("zernio_profile_id, zernio_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.zernio_account_id) {
    return NextResponse.json({ alreadyConnected: true });
  }

  try {
    let profileId: string;

    if (existing?.zernio_profile_id) {
      // Stale row — profile may have been deleted in Zernio dashboard.
      // Try to reuse it; if Zernio returns 4xx, wipe and recreate.
      try {
        const { authUrl } = await zernio.getGoogleBusinessConnectUrl(existing.zernio_profile_id, redirectUrl);
        return NextResponse.json({ authUrl });
      } catch (reuseErr) {
        const isStale =
          reuseErr instanceof ZernioError &&
          (reuseErr.status === 400 || reuseErr.status === 404);
        if (!isStale) throw reuseErr;
        console.warn(
          "[start-connection] Stale profile detected, wiping and recreating",
          existing.zernio_profile_id
        );
        await service.from("zernio_connections").delete().eq("user_id", user.id);
      }
    }

    // 1. Create Zernio profile
    const { profile: zernioProfile } = await zernio.createProfile(
      profile?.hotel_name ?? "Hôtel"
    );
    profileId = zernioProfile._id;

    // 2. Get OAuth URL (headless mode, redirect to our callback)
    const { authUrl } = await zernio.getGoogleBusinessConnectUrl(profileId, redirectUrl);

    // 3. Upsert connection (account_id empty until OAuth completes)
    await service.from("zernio_connections").upsert(
      {
        user_id: user.id,
        zernio_profile_id: profileId,
        zernio_account_id: null,
        connected_at: new Date().toISOString(),
        sync_status: "idle",
        sync_error: null,
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({ authUrl });
  } catch (err) {
    if (err instanceof ZernioError) {
      console.error("[start-connection] ZernioError", {
        status: err.status,
        code: err.code,
        message: err.message,
      });
      return NextResponse.json(
        { error: err.message, zernioStatus: err.status, zernioCode: err.code },
        { status: 502 }
      );
    }
    console.error("[start-connection] Unexpected error", err);
    return NextResponse.json(
      { error: "Impossible de démarrer la connexion Google. Réessayez." },
      { status: 502 }
    );
  }
}
