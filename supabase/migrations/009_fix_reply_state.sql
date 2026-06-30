-- Drop the old check constraint
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reply_state_check;

-- Add new constraint with all needed values
ALTER TABLE reviews ADD CONSTRAINT reviews_reply_state_check
  CHECK (reply_state IS NULL OR reply_state IN (
    'PENDING', 'ACTIVE', 'REJECTED',  -- Google review states (existing)
    'generated',                        -- IA a généré une réponse, pas encore publiée
    'published',                        -- réponse publiée sur Google
    'edited',                           -- modifiée manuellement
    'failed'                            -- échec de génération IA
  ));
