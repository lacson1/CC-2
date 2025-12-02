-- Enable pg_trgm extension for fuzzy text matching in medication search
-- This extension provides similarity() function and trigram-based text search

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verify extension is installed
SELECT 'pg_trgm extension enabled successfully' AS status;

