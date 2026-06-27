-- Phase 4.1: headless OAuth — add connect_token fields to zernio_connections

ALTER TABLE public.zernio_connections
  ADD COLUMN IF NOT EXISTS connect_token text,
  ADD COLUMN IF NOT EXISTS connect_token_expires_at timestamptz;
