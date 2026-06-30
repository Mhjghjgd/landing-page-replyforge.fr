ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS ai_generated_reply TEXT,
  ADD COLUMN IF NOT EXISTS ai_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_model_used TEXT;

-- reply_state values: null (rien), 'generated' (IA a généré, pas publié),
-- 'published' (publié sur Google), 'edited' (modifié manuellement), 'failed' (erreur génération)
-- Plus les états Zernio existants: 'PENDING', 'ACTIVE', 'REJECTED'
