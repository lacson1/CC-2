-- Laboratory Tests Seed Data for Nigerian Clinic
-- Common tests ordered in primary and secondary healthcare facilities

INSERT INTO lab_tests (name, category, reference_range, unit, description) VALUES
-- Hematology Tests
('Full Blood Count (FBC)', 'Hematology', 'WBC: 4.0-11.0, RBC: 4.5-5.5, Hb: 12-16 g/dL', 'Various', 'Complete blood count including WBC, RBC, hemoglobin, hematocrit, platelets'),
('Hemoglobin Level', 'Hematology', 'Male: 13.5-17.5 g/dL, Female: 12.0-15.5 g/dL', 'g/dL', 'Measurement of hemoglobin concentration in blood'),
('Packed Cell Volume (PCV)', 'Hematology', 'Male: 40-50%, Female: 36-46%', '%', 'Percentage of blood volume occupied by red blood cells'),
('White Blood Cell Count', 'Hematology', '4,000-11,000 cells/μL', 'cells/μL', 'Total count of white blood cells'),
('Platelet Count', 'Hematology', '150,000-450,000 platelets/μL', 'platelets/μL', 'Count of blood platelets for clotting assessment'),
('Erythrocyte Sedimentation Rate (ESR)', 'Hematology', 'Male: <15 mm/hr, Female: <20 mm/hr', 'mm/hr', 'Rate at which red blood cells settle, indicates inflammation'),
('Blood Film (Peripheral Smear)', 'Hematology', 'Normal morphology', 'Qualitative', 'Microscopic examination of blood cells for abnormalities'),

-- Clinical Chemistry
('Fasting Blood Sugar', 'Clinical Chemistry', '70-100 mg/dL (3.9-5.6 mmol/L)', 'mg/dL', 'Blood glucose level after 8-hour fast'),
('Random Blood Sugar', 'Clinical Chemistry', '<140 mg/dL (<7.8 mmol/L)', 'mg/dL', 'Blood glucose level at any time of day'),
('HbA1c (Glycated Hemoglobin)', 'Clinical Chemistry', '<5.7% (normal), 5.7-6.4% (prediabetes)', '%', 'Average blood sugar over 2-3 months'),
('Total Cholesterol', 'Clinical Chemistry', '<200 mg/dL (<5.2 mmol/L)', 'mg/dL', 'Total cholesterol in blood'),
('HDL Cholesterol', 'Clinical Chemistry', 'Male: >40 mg/dL, Female: >50 mg/dL', 'mg/dL', 'High-density lipoprotein cholesterol'),
('LDL Cholesterol', 'Clinical Chemistry', '<100 mg/dL (<2.6 mmol/L)', 'mg/dL', 'Low-density lipoprotein cholesterol'),
('Triglycerides', 'Clinical Chemistry', '<150 mg/dL (<1.7 mmol/L)', 'mg/dL', 'Fat levels in blood'),
('Creatinine', 'Clinical Chemistry', 'Male: 0.7-1.3 mg/dL, Female: 0.6-1.1 mg/dL', 'mg/dL', 'Kidney function marker'),
('Blood Urea Nitrogen (BUN)', 'Clinical Chemistry', '7-20 mg/dL (2.5-7.1 mmol/L)', 'mg/dL', 'Kidney function and protein metabolism marker'),
('Uric Acid', 'Clinical Chemistry', 'Male: 3.4-7.0 mg/dL, Female: 2.4-6.0 mg/dL', 'mg/dL', 'Uric acid levels for gout assessment'),

-- Liver Function Tests
('Alanine Aminotransferase (ALT)', 'Liver Function', 'Male: 10-40 U/L, Female: 7-35 U/L', 'U/L', 'Liver enzyme indicating liver damage'),
('Aspartate Aminotransferase (AST)', 'Liver Function', '10-40 U/L', 'U/L', 'Liver enzyme for hepatic function assessment'),
('Alkaline Phosphatase (ALP)', 'Liver Function', '44-147 U/L', 'U/L', 'Enzyme indicating liver or bone disorders'),
('Total Bilirubin', 'Liver Function', '0.2-1.2 mg/dL (3.4-20.5 μmol/L)', 'mg/dL', 'Breakdown product of red blood cells'),
('Direct Bilirubin', 'Liver Function', '0.0-0.3 mg/dL (0-5.1 μmol/L)', 'mg/dL', 'Conjugated bilirubin'),
('Total Protein', 'Liver Function', '6.0-8.3 g/dL (60-83 g/L)', 'g/dL', 'Total protein in blood'),
('Albumin', 'Liver Function', '3.5-5.0 g/dL (35-50 g/L)', 'g/dL', 'Major protein produced by liver'),

-- Electrolytes and Minerals
('Sodium (Na+)', 'Electrolytes', '136-145 mEq/L (136-145 mmol/L)', 'mEq/L', 'Sodium levels in blood'),
('Potassium (K+)', 'Electrolytes', '3.5-5.0 mEq/L (3.5-5.0 mmol/L)', 'mEq/L', 'Potassium levels in blood'),
('Chloride (Cl-)', 'Electrolytes', '98-107 mEq/L (98-107 mmol/L)', 'mEq/L', 'Chloride levels in blood'),
('Calcium', 'Electrolytes', '8.5-10.5 mg/dL (2.12-2.62 mmol/L)', 'mg/dL', 'Calcium levels in blood'),
('Phosphorus', 'Electrolytes', '2.5-4.5 mg/dL (0.81-1.45 mmol/L)', 'mg/dL', 'Phosphorus levels in blood'),
('Magnesium', 'Electrolytes', '1.7-2.2 mg/dL (0.70-0.90 mmol/L)', 'mg/dL', 'Magnesium levels in blood'),

-- Infectious Disease Screening
('Malaria Parasite (MP)', 'Parasitology', 'Negative', 'Qualitative', 'Microscopic examination for malaria parasites'),
('Malaria Rapid Diagnostic Test (RDT)', 'Parasitology', 'Negative', 'Qualitative', 'Rapid test for malaria antigens'),
('Typhoid Test (Widal)', 'Serology', 'Negative or <1:80', 'Titer', 'Antibody test for typhoid fever'),
('Hepatitis B Surface Antigen (HBsAg)', 'Serology', 'Negative', 'Qualitative', 'Screening for hepatitis B infection'),
('Hepatitis C Antibody', 'Serology', 'Negative', 'Qualitative', 'Screening for hepatitis C infection'),
('HIV Screening Test', 'Serology', 'Negative', 'Qualitative', 'Initial screening for HIV infection'),
('VDRL/RPR (Syphilis)', 'Serology', 'Non-reactive', 'Qualitative', 'Screening test for syphilis'),
('Tuberculosis (TB) Test', 'Microbiology', 'Negative', 'Qualitative', 'Sputum examination for TB bacteria'),

-- Urine Analysis
('Urinalysis (Complete)', 'Urine Analysis', 'Normal', 'Various', 'Complete urine examination including microscopy'),
('Urine Protein', 'Urine Analysis', 'Negative or trace', 'Qualitative', 'Protein levels in urine'),
('Urine Glucose', 'Urine Analysis', 'Negative', 'Qualitative', 'Glucose in urine'),
('Urine Microscopy', 'Urine Analysis', 'Normal cells and casts', 'Qualitative', 'Microscopic examination of urine sediment'),
('Urine Culture', 'Microbiology', 'No growth or <10^5 CFU/mL', 'CFU/mL', 'Bacterial culture of urine'),

-- Hormonal Tests
('Thyroid Stimulating Hormone (TSH)', 'Endocrinology', '0.4-4.0 mIU/L', 'mIU/L', 'Thyroid function assessment'),
('Free T4 (Thyroxine)', 'Endocrinology', '0.8-1.8 ng/dL (10-23 pmol/L)', 'ng/dL', 'Free thyroxine hormone levels'),
('Free T3 (Triiodothyronine)', 'Endocrinology', '2.3-4.2 pg/mL (3.5-6.5 pmol/L)', 'pg/mL', 'Free triiodothyronine hormone levels'),
('Pregnancy Test (β-hCG)', 'Endocrinology', 'Negative (non-pregnant)', 'Qualitative', 'Human chorionic gonadotropin test'),

-- Cardiac Markers
('Troponin I', 'Cardiac Markers', '<0.04 ng/mL', 'ng/mL', 'Cardiac enzyme for heart attack diagnosis'),
('CK-MB', 'Cardiac Markers', '<6.3 ng/mL', 'ng/mL', 'Creatine kinase-MB for cardiac muscle damage'),

-- Stool Analysis
('Stool Examination', 'Parasitology', 'No parasites, normal consistency', 'Qualitative', 'Microscopic examination for parasites and bacteria'),
('Stool Culture', 'Microbiology', 'Normal flora', 'Qualitative', 'Bacterial culture of stool sample'),
('Occult Blood Test', 'Clinical Chemistry', 'Negative', 'Qualitative', 'Hidden blood in stool'),

-- Additional Important Tests
('Prothrombin Time (PT)', 'Coagulation', '11-15 seconds', 'seconds', 'Blood clotting time assessment'),
('Activated Partial Thromboplastin Time (aPTT)', 'Coagulation', '25-35 seconds', 'seconds', 'Blood clotting pathway assessment'),
('International Normalized Ratio (INR)', 'Coagulation', '0.8-1.2', 'ratio', 'Standardized PT ratio for anticoagulation monitoring'),
('C-Reactive Protein (CRP)', 'Inflammatory Markers', '<3.0 mg/L', 'mg/L', 'Inflammatory marker for infection or inflammation'),
('Rheumatoid Factor (RF)', 'Immunology', '<20 IU/mL', 'IU/mL', 'Autoantibody test for rheumatoid arthritis'),
('Antinuclear Antibody (ANA)', 'Immunology', 'Negative', 'Qualitative', 'Autoantibody screening test');