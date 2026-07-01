import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId } = body as { reviewId: string };

  if (!reviewId) {
    return NextResponse.json({ error: "Missing reviewId" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/generate-reply-internal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
      },
      body: JSON.stringify({ reviewId, userId: user.id }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("[generate-reply] Internal call failed:", data);
    return NextResponse.json({ error: data.error ?? "Génération échouée" }, { status: res.status });
  }

  return NextResponse.json(data);
}
