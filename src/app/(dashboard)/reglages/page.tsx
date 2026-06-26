import { createClient } from "@/lib/supabase/server";
import { ToneSettingsForm } from "@/components/dashboard/ToneSettingsForm";

export const metadata = { title: "Réglages de ton — ReplyForge" };

export default async function ReglagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: toneProfile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("hotel_name")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("tone_profiles")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle(),
  ]);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[var(--color-foreground)] mb-2">
          Réglages de ton
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-[15px]">
          Configurez la voix de votre établissement. L&apos;IA adaptera chaque réponse à votre style.
        </p>
      </div>

      <ToneSettingsForm
        userId={user!.id}
        hotelName={profile?.hotel_name ?? ""}
        initialProfile={toneProfile}
      />
    </div>
  );
}
