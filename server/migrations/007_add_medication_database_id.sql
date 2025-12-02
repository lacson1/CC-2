-- Migration: Add medication_database_id column to reference medications table
-- Created: 2025-11-29
-- Purpose: Support both medicines (simple) and medications (comprehensive) databases

-- Add new column for medications database reference
ALTER TABLE prescriptions 
  ADD COLUMN IF NOT EXISTS medication_database_id INTEGER;

-- Add foreign key constraint to medications table
ALTER TABLE prescriptions 
  ADD CONSTRAINT prescriptions_medication_database_id_medications_id_fk 
  FOREIGN KEY (medication_database_id) 
  REFERENCES medications(id);

-- Remove old foreign key constraint if it exists
ALTER TABLE prescriptions 
  DROP CONSTRAINT IF EXISTS prescriptions_medication_id_medicines_id_fk;

-- Add comments
COMMENT ON COLUMN prescriptions.medication_id IS 'Legacy/simple medication ID. No FK constraint for flexibility with manual entries.';
COMMENT ON COLUMN prescriptions.medication_database_id IS 'Optional FK to comprehensive medications database.';
COMMENT ON COLUMN prescriptions.medication_name IS 'Medication name. Required field that stores either the name from database or manual entry.';

