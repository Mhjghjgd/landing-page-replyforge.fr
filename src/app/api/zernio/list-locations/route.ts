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
    .select("connect_token, connect_token_expires_at")
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
    const pendingData = await zernio.listConnectLocations(connection.connect_token);
    return NextResponse.json({ locations: pendingData.locations ?? [] });
  } catch (err) {
    if (err instanceof ZernioError) {
      console.error("[list-locations] ZernioError", {
        status: err.status,
        code: err.code,
        message: err.message,
      });
      return NextResponse.json(
        { error: err.message, zernioStatus: err.status, zernioCode: err.code },
        { status: 502 }
      );
    }
    console.error("[list-locations] Unexpected error", err);
    return NextResponse.json(
      { error: "Impossible de récupérer la liste des établissements." },
      { status: 502 }
    );
  }
}
