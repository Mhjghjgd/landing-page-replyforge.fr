import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS. Use ONLY in server-side code (webhooks, cron).
// Never expose SUPABASE_SECRET_KEY to the browser.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
