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

  // If already connected with an account, return alreadyConnected
  const { data: existing } = await service
    .from("zernio_connections")
    .select("zernio_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.zernio_account_id) {
    return NextResponse.json({ alreadyConnected: true });
  }

  try {
    // 1. Create Zernio profile
    const { profile: zernioProfile } = await zernio.createProfile(
      profile?.hotel_name ?? "Hôtel"
    );

    // 2. Get OAuth URL
    const { authUrl } = await zernio.getOAuthUrl(zernioProfile._id);

    // 3. Upsert connection (no account_id yet)
    await service.from("zernio_connections").upsert(
      {
        user_id: user.id,
        zernio_profile_id: zernioProfile._id,
        zernio_account_id: null,
        connected_at: new Date().toISOString(),
        sync_status: "idle",
        sync_error: null,
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({ authUrl });
  } catch (err) {
    const message =
      err instanceof ZernioError
        ? err.message
        : "Impossible de démarrer la connexion Google. Réessayez.";
    console.error("[zernio/start-connection]", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
