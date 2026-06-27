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

  const connectToken = req.nextUrl.searchParams.get("connect_token");

  if (!connectToken) {
    console.error("[oauth-callback] Missing connect_token in callback URL");
    return NextResponse.redirect(`${baseUrl}/onboarding/google?error=missing_token`);
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const service = createServiceClient();

  const { error } = await service
    .from("zernio_connections")
    .update({
      connect_token: connectToken,
      connect_token_expires_at: expiresAt,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("[oauth-callback] Failed to store connect_token", error);
    return NextResponse.redirect(`${baseUrl}/onboarding/google?error=db_error`);
  }

  return NextResponse.redirect(`${baseUrl}/onboarding/google/select-location`);
}
