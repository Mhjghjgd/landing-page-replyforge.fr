-- Deduplicate reviews that have both a full-path and short-path zernio_review_id
-- for the same underlying Google review (caused by the pre-extractShortId code).
-- Migration 010 already normalises full-path IDs, but if both versions coexisted
-- before 010 ran, it would fail on the UNIQUE constraint. This migration handles
-- that by removing the stale full-path duplicates first, then delegating the
-- remaining normalisation to migration 010's logic.

-- Step 1: Delete full-path rows where the short-ID version already exists
DELETE FROM reviews r1
WHERE r1.zernio_review_id LIKE '%/%'
  AND EXISTS (
    SELECT 1 FROM reviews r2
    WHERE r2.user_id = r1.user_id
      AND r2.zernio_review_id = SUBSTRING(r1.zernio_review_id FROM '([^/]+)$')
  );

-- Step 2: Normalise any remaining full-path IDs (idempotent with migration 010)
UPDATE reviews
SET zernio_review_id = SUBSTRING(zernio_review_id FROM '([^/]+)$')
WHERE zernio_review_id LIKE '%/%';

-- Step 3: Remove any remaining semantic duplicates within the same user account
-- (same author + same review text = same review imported twice).
-- Keep the row with the most complete data.
DELETE FROM reviews
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, author_name, review_text
        ORDER BY
          (ai_generated_reply IS NOT NULL) DESC,
          (reply_text IS NOT NULL) DESC,
          updated_at DESC
      ) AS rn
    FROM reviews
    WHERE author_name IS NOT NULL
      AND review_text IS NOT NULL
  ) ranked
  WHERE rn > 1
);
