-- Enhanced Laboratory System Comprehensive Seed Data
-- This script populates the database with realistic lab tests, departments, and equipment

-- Lab Departments
INSERT INTO lab_departments (name, description, organization_id, is_active) VALUES
('Clinical Chemistry', 'Routine biochemical analysis including glucose, electrolytes, liver function, kidney function', 1, true),
('Hematology', 'Blood cell counts, coagulation studies, blood smears', 1, true),
('Microbiology', 'Bacterial cultures, antibiotic sensitivity, parasitology', 1, true),
('Immunology & Serology', 'Immune system markers, infectious disease serology, autoimmune markers', 1, true),
('Endocrinology', 'Hormone levels, thyroid function, diabetes markers', 1, true),
('Cardiology Markers', 'Cardiac enzymes, lipid profiles, cardiovascular risk markers', 1, true),
('Toxicology', 'Drug levels, poison screening, therapeutic drug monitoring', 1, true),
('Molecular Diagnostics', 'DNA/RNA analysis, genetic testing, PCR-based tests', 1, true);

-- Lab Equipment
INSERT INTO lab_equipment (name, model, manufacturer, department_id, status, organization_id) VALUES
('Chemistry Analyzer', 'Cobas c311', 'Roche Diagnostics', 1, 'active', 1),
('Hematology Analyzer', 'XN-1000', 'Sysmex', 2, 'active', 1),
('Blood Gas Analyzer', 'ABL90 FLEX', 'Radiometer', 1, 'active', 1),
('Microscope', 'Eclipse Ci-L', 'Nikon', 2, 'active', 1),
('Centrifuge', 'Heraeus Multifuge X3R', 'Thermo Scientific', 1, 'active', 1),
('Incubator', 'Heraeus B6120', 'Thermo Scientific', 3, 'active', 1),
('PCR Machine', 'QuantStudio 5', 'Applied Biosystems', 8, 'active', 1),
('ELISA Reader', 'Multiskan FC', 'Thermo Scientific', 4, 'active', 1);

-- Comprehensive Lab Tests
INSERT INTO lab_tests (name, category, description, units, reference_range, organization_id, is_active, priority, sample_type, method_of_collection, estimated_time, cost) VALUES

-- Clinical Chemistry
('Glucose (Fasting)', 'Clinical Chemistry', 'Fasting blood glucose level', 'mg/dL', '70-100', 1, true, 'routine', 'blood', 'Venipuncture after 8-12 hour fast', '15 minutes', '25.00'),
('Glucose (Random)', 'Clinical Chemistry', 'Random blood glucose level', 'mg/dL', '<200', 1, true, 'routine', 'blood', 'Venipuncture', '15 minutes', '25.00'),
('HbA1c', 'Clinical Chemistry', 'Glycated hemoglobin - diabetes monitoring', '%', '4.0-5.6', 1, true, 'routine', 'blood', 'Venipuncture', '30 minutes', '45.00'),
('Creatinine', 'Clinical Chemistry', 'Kidney function marker', 'mg/dL', '0.6-1.2', 1, true, 'routine', 'blood', 'Venipuncture', '20 minutes', '30.00'),
('Blood Urea Nitrogen (BUN)', 'Clinical Chemistry', 'Kidney function and protein metabolism', 'mg/dL', '7-20', 1, true, 'routine', 'blood', 'Venipuncture', '20 minutes', '28.00'),
('Sodium', 'Clinical Chemistry', 'Electrolyte balance', 'mEq/L', '136-145', 1, true, 'routine', 'blood', 'Venipuncture', '15 minutes', '22.00'),
('Potassium', 'Clinical Chemistry', 'Electrolyte balance', 'mEq/L', '3.5-5.0', 1, true, 'urgent', 'blood', 'Venipuncture', '15 minutes', '22.00'),
('Chloride', 'Clinical Chemistry', 'Electrolyte balance', 'mEq/L', '98-107', 1, true, 'routine', 'blood', 'Venipuncture', '15 minutes', '22.00'),
('Total Protein', 'Clinical Chemistry', 'Protein synthesis and nutrition', 'g/dL', '6.0-8.3', 1, true, 'routine', 'blood', 'Venipuncture', '20 minutes', '25.00'),
('Albumin', 'Clinical Chemistry', 'Protein synthesis and liver function', 'g/dL', '3.5-5.0', 1, true, 'routine', 'blood', 'Venipuncture', '20 minutes', '28.00'),
('ALT (SGPT)', 'Clinical Chemistry', 'Liver enzyme', 'U/L', '7-56', 1, true, 'routine', 'blood', 'Venipuncture', '25 minutes', '35.00'),
('AST (SGOT)', 'Clinical Chemistry', 'Liver enzyme', 'U/L', '10-40', 1, true, 'routine', 'blood', 'Venipuncture', '25 minutes', '35.00'),
('Alkaline Phosphatase', 'Clinical Chemistry', 'Liver and bone enzyme', 'U/L', '44-147', 1, true, 'routine', 'blood', 'Venipuncture', '25 minutes', '32.00'),
('Total Bilirubin', 'Clinical Chemistry', 'Liver function and hemolysis', 'mg/dL', '0.2-1.2', 1, true, 'routine', 'blood', 'Venipuncture', '30 minutes', '38.00'),
('Direct Bilirubin', 'Clinical Chemistry', 'Conjugated bilirubin', 'mg/dL', '0.0-0.3', 1, true, 'routine', 'blood', 'Venipuncture', '30 minutes', '40.00'),

-- Hematology
('Complete Blood Count (CBC)', 'Hematology', 'Full blood count with differential', 'Various', 'See individual components', 1, true, 'routine', 'blood', 'Venipuncture in EDTA tube', '30 minutes', '45.00'),
('Hemoglobin', 'Hematology', 'Oxygen-carrying protein in blood', 'g/dL', 'M: 13.8-17.2, F: 12.1-15.1', 1, true, 'routine', 'blood', 'Venipuncture in EDTA tube', '15 minutes', '25.00'),
('Hematocrit', 'Hematology', 'Percentage of red blood cells', '%', 'M: 40.7-50.3, F: 36.1-44.3', 1, true, 'routine', 'blood', 'Venipuncture in EDTA tube', '15 minutes', '20.00'),
('White Blood Cell Count', 'Hematology', 'Total white blood cells', 'cells/μL', '4,500-11,000', 1, true, 'routine', 'blood', 'Venipuncture in EDTA tube', '15 minutes', '22.00'),
('Platelet Count', 'Hematology', 'Blood clotting cells', 'cells/μL', '150,000-450,000', 1, true, 'routine', 'blood', 'Venipuncture in EDTA tube', '15 minutes', '25.00'),
('ESR (Erythrocyte Sedimentation Rate)', 'Hematology', 'Inflammation marker', 'mm/hr', 'M: <15, F: <20', 1, true, 'routine', 'blood', 'Venipuncture in EDTA tube', '60 minutes', '30.00'),
('Prothrombin Time (PT)', 'Hematology', 'Blood clotting time', 'seconds', '11-13', 1, true, 'urgent', 'blood', 'Venipuncture in citrate tube', '30 minutes', '40.00'),
('INR', 'Hematology', 'International normalized ratio', 'ratio', '0.8-1.1', 1, true, 'urgent', 'blood', 'Venipuncture in citrate tube', '30 minutes', '35.00'),
('APTT', 'Hematology', 'Activated partial thromboplastin time', 'seconds', '25-35', 1, true, 'urgent', 'blood', 'Venipuncture in citrate tube', '30 minutes', '42.00'),

-- Lipid Profile
('Total Cholesterol', 'Clinical Chemistry', 'Total cholesterol level', 'mg/dL', '<200', 1, true, 'routine', 'blood', 'Venipuncture after 9-12 hour fast', '20 minutes', '30.00'),
('HDL Cholesterol', 'Clinical Chemistry', 'High-density lipoprotein cholesterol', 'mg/dL', 'M: >40, F: >50', 1, true, 'routine', 'blood', 'Venipuncture after 9-12 hour fast', '25 minutes', '35.00'),
('LDL Cholesterol', 'Clinical Chemistry', 'Low-density lipoprotein cholesterol', 'mg/dL', '<100', 1, true, 'routine', 'blood', 'Venipuncture after 9-12 hour fast', '25 minutes', '35.00'),
('Triglycerides', 'Clinical Chemistry', 'Blood fat levels', 'mg/dL', '<150', 1, true, 'routine', 'blood', 'Venipuncture after 9-12 hour fast', '25 minutes', '32.00'),

-- Cardiac Markers
('Troponin I', 'Cardiology Markers', 'Heart muscle damage marker', 'ng/mL', '<0.04', 1, true, 'stat', 'blood', 'Venipuncture', '45 minutes', '85.00'),
('CK-MB', 'Cardiology Markers', 'Creatine kinase muscle-brain', 'ng/mL', '<6.3', 1, true, 'urgent', 'blood', 'Venipuncture', '30 minutes', '65.00'),
('BNP', 'Cardiology Markers', 'B-type natriuretic peptide', 'pg/mL', '<100', 1, true, 'urgent', 'blood', 'Venipuncture', '60 minutes', '95.00'),

-- Thyroid Function
('TSH', 'Endocrinology', 'Thyroid stimulating hormone', 'mIU/L', '0.27-4.20', 1, true, 'routine', 'blood', 'Venipuncture', '45 minutes', '55.00'),
('Free T4', 'Endocrinology', 'Free thyroxine', 'ng/dL', '0.93-1.70', 1, true, 'routine', 'blood', 'Venipuncture', '45 minutes', '60.00'),
('Free T3', 'Endocrinology', 'Free triiodothyronine', 'pg/mL', '2.0-4.4', 1, true, 'routine', 'blood', 'Venipuncture', '45 minutes', '65.00'),

-- Immunology & Serology
('C-Reactive Protein (CRP)', 'Immunology & Serology', 'Inflammation marker', 'mg/L', '<3.0', 1, true, 'routine', 'blood', 'Venipuncture', '30 minutes', '40.00'),
('Rheumatoid Factor', 'Immunology & Serology', 'Autoimmune marker', 'IU/mL', '<14', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '50.00'),
('ANA (Antinuclear Antibodies)', 'Immunology & Serology', 'Autoimmune screening', 'titer', '<1:80', 1, true, 'routine', 'blood', 'Venipuncture', '120 minutes', '75.00'),
('Hepatitis B Surface Antigen', 'Immunology & Serology', 'Hepatitis B infection marker', 'index', '<1.0', 1, true, 'routine', 'blood', 'Venipuncture', '90 minutes', '65.00'),
('Hepatitis C Antibody', 'Immunology & Serology', 'Hepatitis C infection marker', 'index', '<1.0', 1, true, 'routine', 'blood', 'Venipuncture', '90 minutes', '65.00'),
('HIV 1/2 Antibody', 'Immunology & Serology', 'HIV infection screening', 'index', '<1.0', 1, true, 'routine', 'blood', 'Venipuncture', '120 minutes', '70.00'),

-- Microbiology
('Blood Culture', 'Microbiology', 'Bacterial growth in blood', 'growth', 'No growth', 1, true, 'stat', 'blood', 'Sterile venipuncture', '48-72 hours', '120.00'),
('Urine Culture', 'Microbiology', 'Bacterial growth in urine', 'CFU/mL', '<10^5', 1, true, 'routine', 'urine', 'Clean catch midstream', '24-48 hours', '80.00'),
('Stool Culture', 'Microbiology', 'Enteric pathogens', 'growth', 'Normal flora', 1, true, 'routine', 'stool', 'Fresh stool sample', '48-72 hours', '90.00'),
('Throat Culture', 'Microbiology', 'Throat bacterial pathogens', 'growth', 'Normal flora', 1, true, 'routine', 'throat swab', 'Throat swab', '24-48 hours', '60.00'),

-- Urinalysis
('Urinalysis (Complete)', 'Clinical Chemistry', 'Complete urine examination', 'Various', 'See individual components', 1, true, 'routine', 'urine', 'Clean catch midstream', '30 minutes', '35.00'),
('Urine Protein', 'Clinical Chemistry', 'Protein in urine', 'mg/dL', 'Negative to trace', 1, true, 'routine', 'urine', 'Clean catch midstream', '15 minutes', '20.00'),
('Urine Glucose', 'Clinical Chemistry', 'Glucose in urine', 'mg/dL', 'Negative', 1, true, 'routine', 'urine', 'Clean catch midstream', '15 minutes', '18.00'),
('Urine Ketones', 'Clinical Chemistry', 'Ketones in urine', 'mg/dL', 'Negative', 1, true, 'routine', 'urine', 'Clean catch midstream', '15 minutes', '18.00'),

-- Vitamins and Minerals
('Vitamin D (25-OH)', 'Clinical Chemistry', '25-hydroxyvitamin D', 'ng/mL', '30-100', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '85.00'),
('Vitamin B12', 'Clinical Chemistry', 'Vitamin B12 level', 'pg/mL', '200-900', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '70.00'),
('Folate', 'Clinical Chemistry', 'Folic acid level', 'ng/mL', '2.7-17.0', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '65.00'),
('Iron', 'Clinical Chemistry', 'Serum iron level', 'μg/dL', 'M: 65-175, F: 50-170', 1, true, 'routine', 'blood', 'Venipuncture', '30 minutes', '40.00'),
('Ferritin', 'Clinical Chemistry', 'Iron storage protein', 'ng/mL', 'M: 12-300, F: 12-150', 1, true, 'routine', 'blood', 'Venipuncture', '45 minutes', '55.00'),

-- Tumor Markers
('PSA (Prostate Specific Antigen)', 'Clinical Chemistry', 'Prostate cancer screening', 'ng/mL', '<4.0', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '75.00'),
('CEA (Carcinoembryonic Antigen)', 'Clinical Chemistry', 'Tumor marker', 'ng/mL', '<5.0', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '80.00'),
('CA 125', 'Clinical Chemistry', 'Ovarian cancer marker', 'U/mL', '<35', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '85.00'),
('CA 19-9', 'Clinical Chemistry', 'Pancreatic cancer marker', 'U/mL', '<37', 1, true, 'routine', 'blood', 'Venipuncture', '60 minutes', '85.00'),

-- Special Tests
('Arterial Blood Gas (ABG)', 'Clinical Chemistry', 'Blood gas and acid-base status', 'Various', 'pH: 7.35-7.45', 1, true, 'stat', 'arterial blood', 'Arterial puncture', '10 minutes', '95.00'),
('Lactate', 'Clinical Chemistry', 'Lactic acid level', 'mmol/L', '0.5-2.2', 1, true, 'urgent', 'blood', 'Venipuncture', '20 minutes', '45.00'),
('Ammonia', 'Clinical Chemistry', 'Ammonia level', 'μmol/L', '11-35', 1, true, 'urgent', 'blood', 'Venipuncture on ice', '30 minutes', '60.00');

-- Sample Lab Worksheets
INSERT INTO lab_worksheets (name, department_id, technician_id, status, organization_id) VALUES
('Morning Chemistry Batch - Routine', 1, 1, 'open', 1),
('Hematology Urgent Samples', 2, 1, 'in_progress', 1),
('Microbiology Cultures - Daily', 3, 1, 'open', 1),
('Cardiac Markers - STAT', 6, 1, 'completed', 1);

-- Sample notification: This would be handled by the application
-- The seed data provides a comprehensive foundation for a modern laboratory information system