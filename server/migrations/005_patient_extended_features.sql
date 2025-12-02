-- Migration: Add tables for patient allergies, immunizations, imaging, and procedures
-- Created: 2025-11-29

-- =====================
-- PATIENT ALLERGIES
-- =====================
CREATE TABLE IF NOT EXISTS patient_allergies (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  allergen VARCHAR(255) NOT NULL,
  allergy_type VARCHAR(50) NOT NULL CHECK (allergy_type IN ('drug', 'food', 'environmental', 'other')),
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')),
  reaction TEXT NOT NULL,
  onset_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_allergies_patient_id ON patient_allergies(patient_id);
CREATE INDEX idx_patient_allergies_severity ON patient_allergies(severity);

-- =====================
-- PATIENT IMMUNIZATIONS
-- =====================
CREATE TABLE IF NOT EXISTS patient_immunizations (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(255) NOT NULL,
  date_administered DATE NOT NULL,
  dose_number VARCHAR(50),
  administered_by VARCHAR(255),
  lot_number VARCHAR(100),
  manufacturer VARCHAR(255),
  site VARCHAR(100),
  route VARCHAR(100),
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_immunizations_patient_id ON patient_immunizations(patient_id);
CREATE INDEX idx_patient_immunizations_date ON patient_immunizations(date_administered);
CREATE INDEX idx_patient_immunizations_next_due ON patient_immunizations(next_due_date);

-- =====================
-- PATIENT IMAGING
-- =====================
CREATE TABLE IF NOT EXISTS patient_imaging (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  study_type VARCHAR(100) NOT NULL,
  study_date DATE NOT NULL,
  body_part VARCHAR(255) NOT NULL,
  indication TEXT NOT NULL,
  findings TEXT,
  impression TEXT,
  radiologist VARCHAR(255),
  referring_physician VARCHAR(255),
  modality VARCHAR(255),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('routine', 'urgent', 'stat')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('ordered', 'scheduled', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_imaging_patient_id ON patient_imaging(patient_id);
CREATE INDEX idx_patient_imaging_study_date ON patient_imaging(study_date);
CREATE INDEX idx_patient_imaging_status ON patient_imaging(status);

-- =====================
-- PATIENT PROCEDURES
-- =====================
CREATE TABLE IF NOT EXISTS patient_procedures (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  procedure_name VARCHAR(255) NOT NULL,
  procedure_date DATE NOT NULL,
  procedure_type VARCHAR(50) NOT NULL CHECK (procedure_type IN ('surgical', 'diagnostic', 'therapeutic', 'minor', 'other')),
  performed_by VARCHAR(255),
  assistant VARCHAR(255),
  indication TEXT NOT NULL,
  description TEXT,
  outcome TEXT,
  complications TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  location VARCHAR(255),
  anesthesia_type VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_procedures_patient_id ON patient_procedures(patient_id);
CREATE INDEX idx_patient_procedures_date ON patient_procedures(procedure_date);
CREATE INDEX idx_patient_procedures_type ON patient_procedures(procedure_type);
CREATE INDEX idx_patient_procedures_follow_up ON patient_procedures(follow_up_required, follow_up_date);

-- Add comments for documentation
COMMENT ON TABLE patient_allergies IS 'Stores patient allergy and adverse reaction information';
COMMENT ON TABLE patient_immunizations IS 'Stores patient immunization and vaccination records';
COMMENT ON TABLE patient_imaging IS 'Stores patient imaging studies and radiology reports';
COMMENT ON TABLE patient_procedures IS 'Stores patient medical procedures and interventions';

