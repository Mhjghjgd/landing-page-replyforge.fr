import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.replyforge.fr").replace(/\/$/, "");

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/connexion`);
  }

  // Extraire TOUS les tokens du redirect Zernio
  const connectToken = req.nextUrl.searchParams.get("connect_token");
  const pendingDataToken = req.nextUrl.searchParams.get("pendingDataToken");
  const profileId = req.nextUrl.searchParams.get("profileId");
  const tempToken = req.nextUrl.searchParams.get("tempToken");

  console.log("[oauth-callback] ALL QUERY PARAMS:", {
    profileId,
    pendingDataToken: pendingDataToken ? `${pendingDataToken.slice(0, 20)}...` : null,
    connect_token: connectToken ? `${connectToken.slice(0, 20)}...` : null,
    tempToken: tempToken ? `${tempToken.slice(0, 20)}...` : null,
  });

  if (!connectToken) {
    console.error("[oauth-callback] Missing connect_token in callback URL");
    return NextResponse.redirect(`${baseUrl}/onboarding/google?error=missing_token`);
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const service = createServiceClient();

  // Construire l'objet UPDATE — stocker uniquement les tokens présents
  const updates: Record<string, string | null> = {
    connect_token: connectToken,
    connect_token_expires_at: expiresAt,
  };
  if (pendingDataToken) updates.pending_data_token = pendingDataToken;
  if (tempToken) updates.temp_token = tempToken;
  if (profileId) updates.zernio_profile_id = profileId;

  const { error } = await service
    .from("zernio_connections")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    console.error("[oauth-callback] Failed to store tokens", error);
    return NextResponse.redirect(`${baseUrl}/onboarding/google?error=db_error`);
  }

  return NextResponse.redirect(`${baseUrl}/onboarding/google/select-location`);
}
