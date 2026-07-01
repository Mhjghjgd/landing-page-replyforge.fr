-- Zernio returns Google resource names as review IDs (e.g. "accounts/x/locations/y/reviews/AbFvOq...")
-- We only need the last segment for the Zernio API endpoints.
-- This migration extracts the short ID for any existing dirty records.

UPDATE reviews
SET zernio_review_id = SUBSTRING(zernio_review_id FROM '([^/]+)$')
WHERE zernio_review_id LIKE '%/%';
