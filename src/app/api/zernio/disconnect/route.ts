import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function DELETE(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  const { error } = await service
    .from("zernio_connections")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("[zernio/disconnect]", error);
    return NextResponse.json({ error: "Impossible de déconnecter la fiche." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
