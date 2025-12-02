-- Migration: Fix prescription medication_id to be nullable and medication_name to be not null
-- Created: 2025-11-29
-- Purpose: Allow manual medication entries without requiring a reference to the medicines table

-- Make medication_id nullable (if not already)
ALTER TABLE prescriptions 
  ALTER COLUMN medication_id DROP NOT NULL;

-- Make medication_name not null (with a default empty string for existing records)
UPDATE prescriptions 
  SET medication_name = COALESCE(medication_name, '')
  WHERE medication_name IS NULL;

ALTER TABLE prescriptions 
  ALTER COLUMN medication_name SET NOT NULL;

-- Add comment to clarify the design
COMMENT ON COLUMN prescriptions.medication_id IS 'Optional FK to medicines table. NULL when medication is manually entered.';
COMMENT ON COLUMN prescriptions.medication_name IS 'Medication name. Required field that stores either the name from medicines table or manual entry.';

