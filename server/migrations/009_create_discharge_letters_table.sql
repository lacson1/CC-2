-- Create discharge_letters table
CREATE TABLE IF NOT EXISTS discharge_letters (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  visit_id INTEGER REFERENCES visits(id) ON DELETE SET NULL,
  admission_date DATE NOT NULL,
  discharge_date DATE NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment_summary TEXT NOT NULL,
  medications_on_discharge TEXT,
  follow_up_instructions TEXT,
  follow_up_date DATE,
  attending_physician_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  discharge_condition VARCHAR(50) NOT NULL,
  special_instructions TEXT,
  restrictions TEXT,
  dietary_advice TEXT,
  warning_symptoms TEXT,
  emergency_contact VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_discharge_letters_patient_id ON discharge_letters(patient_id);
CREATE INDEX IF NOT EXISTS idx_discharge_letters_visit_id ON discharge_letters(visit_id);
CREATE INDEX IF NOT EXISTS idx_discharge_letters_organization_id ON discharge_letters(organization_id);
CREATE INDEX IF NOT EXISTS idx_discharge_letters_status ON discharge_letters(status);
CREATE INDEX IF NOT EXISTS idx_discharge_letters_discharge_date ON discharge_letters(discharge_date);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_discharge_letters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_discharge_letters_updated_at
  BEFORE UPDATE ON discharge_letters
  FOR EACH ROW
  EXECUTE FUNCTION update_discharge_letters_updated_at();

-- Add comment for documentation
COMMENT ON TABLE discharge_letters IS 'Stores patient discharge letters and summaries';
COMMENT ON COLUMN discharge_letters.discharge_condition IS 'Patient condition at discharge: improved, stable, unchanged, critical, deceased';
COMMENT ON COLUMN discharge_letters.status IS 'Letter status: draft, finalized, sent';

