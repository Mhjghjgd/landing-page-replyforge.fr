CREATE TABLE catchup_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent TEXT,
  amount_paid INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  processed_by TEXT
);

ALTER TABLE catchup_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own catchup orders"
  ON catchup_orders FOR SELECT
  USING (auth.uid() = user_id);
