-- Add 'scheduled' to reply_state valid values
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reply_state_check;
ALTER TABLE reviews ADD CONSTRAINT reviews_reply_state_check
  CHECK (reply_state IS NULL OR reply_state IN (
    'PENDING', 'ACTIVE', 'REJECTED',
    'generated', 'published', 'edited', 'failed', 'scheduled'
  ));

-- Column for delayed publish timestamp
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;

-- catchup_orders: tracks paid Pack Rattrapage orders (bypasses connected_at date filter)
CREATE TABLE IF NOT EXISTS public.catchup_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  stripe_payment_intent_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS catchup_orders_user_id_idx ON public.catchup_orders(user_id);

ALTER TABLE public.catchup_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages catchup_orders"
  ON public.catchup_orders FOR ALL
  USING (auth.role() = 'service_role');
