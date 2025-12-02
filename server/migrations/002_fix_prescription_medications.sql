-- Fix prescription medications foreign key constraint
-- This migration allows prescriptions to reference the comprehensive medications database

-- Step 1: Drop the existing foreign key constraint on medication_id
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS prescriptions_medication_id_medicines_id_fk;

-- Step 2: medication_id is now just an integer without foreign key (for backward compatibility with medicines inventory)
-- No changes needed for medication_id column itself

-- Step 3: Add new column for comprehensive medications database reference
ALTER TABLE prescriptions 
ADD COLUMN IF NOT EXISTS medication_database_id INTEGER REFERENCES medications(id);

-- Step 4: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_medication_database_id ON prescriptions(medication_database_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medication_name ON prescriptions(medication_name);

-- Verification
SELECT 'Prescription medications schema updated successfully' AS status;

