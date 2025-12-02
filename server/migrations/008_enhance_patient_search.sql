-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN indexes for fuzzy text search on patients table
CREATE INDEX IF NOT EXISTS idx_patients_first_name_trgm ON patients USING gin (first_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_patients_last_name_trgm ON patients USING gin (last_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_patients_phone_trgm ON patients USING gin (phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_patients_email_trgm ON patients USING gin (email gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_patients_national_id ON patients (national_id) WHERE national_id IS NOT NULL; -- Commented out as national_id column may not exist

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_patients_org_created ON patients (organization_id, created_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_patients_org_updated ON patients (organization_id, updated_at DESC); -- Commented out as updated_at column may not exist

-- Add index for patient ID searches
CREATE INDEX IF NOT EXISTS idx_patients_id_org ON patients (id, organization_id);
