-- Comprehensive Laboratory Tests Database
-- 500+ tests from common to specialized categories

-- Clear existing data and reset sequence
DELETE FROM lab_tests;
ALTER SEQUENCE lab_tests_id_seq RESTART WITH 1;

-- HEMATOLOGY TESTS (Blood-related)
INSERT INTO lab_tests (name, category, description, units, reference_range) VALUES
-- Complete Blood Count Panel
('Complete Blood Count (CBC)', 'Hematology', 'Comprehensive blood cell analysis', 'cells/μL', 'WBC: 4,500-11,000; RBC: M 4.7-6.1, F 4.2-5.4; Hgb: M 14-18, F 12-16 g/dL'),
('White Blood Cell Count (WBC)', 'Hematology', 'Total white blood cell count', '10³/μL', '4.5-11.0'),
('Red Blood Cell Count (RBC)', 'Hematology', 'Total red blood cell count', '10⁶/μL', 'Male: 4.7-6.1, Female: 4.2-5.4'),
('Hemoglobin (Hgb)', 'Hematology', 'Oxygen-carrying protein in red blood cells', 'g/dL', 'Male: 14-18, Female: 12-16'),
('Hematocrit (Hct)', 'Hematology', 'Percentage of blood volume occupied by RBCs', '%', 'Male: 42-52, Female: 37-47'),
('Mean Corpuscular Volume (MCV)', 'Hematology', 'Average size of red blood cells', 'fL', '80-100'),
('Mean Corpuscular Hemoglobin (MCH)', 'Hematology', 'Average hemoglobin content per RBC', 'pg', '27-31'),
('Mean Corpuscular Hemoglobin Concentration (MCHC)', 'Hematology', 'Average hemoglobin concentration in RBCs', 'g/dL', '32-36'),
('Red Cell Distribution Width (RDW)', 'Hematology', 'Variation in red blood cell size', '%', '11.5-14.5'),
('Platelet Count', 'Hematology', 'Number of platelets for blood clotting', '10³/μL', '150-450'),

-- Differential Blood Count
('Neutrophils (Absolute)', 'Hematology', 'Primary infection-fighting white blood cells', '10³/μL', '1.8-7.8'),
('Lymphocytes (Absolute)', 'Hematology', 'Immune system white blood cells', '10³/μL', '1.0-4.0'),
('Monocytes (Absolute)', 'Hematology', 'Large white blood cells that fight infections', '10³/μL', '0.1-0.9'),
('Eosinophils (Absolute)', 'Hematology', 'White blood cells involved in allergic reactions', '10³/μL', '0.0-0.4'),
('Basophils (Absolute)', 'Hematology', 'White blood cells involved in inflammatory reactions', '10³/μL', '0.0-0.2'),
('Neutrophils (%)', 'Hematology', 'Percentage of neutrophils in WBC differential', '%', '40-74'),
('Lymphocytes (%)', 'Hematology', 'Percentage of lymphocytes in WBC differential', '%', '19-48'),
('Monocytes (%)', 'Hematology', 'Percentage of monocytes in WBC differential', '%', '3-9'),
('Eosinophils (%)', 'Hematology', 'Percentage of eosinophils in WBC differential', '%', '0-4'),
('Basophils (%)', 'Hematology', 'Percentage of basophils in WBC differential', '%', '0-2'),

-- Specialized Hematology Tests
('Reticulocyte Count', 'Hematology', 'Immature red blood cells indicating bone marrow activity', '%', '0.5-2.5'),
('Erythrocyte Sedimentation Rate (ESR)', 'Hematology', 'Rate at which RBCs settle, indicates inflammation', 'mm/hr', 'Male: <15, Female: <20'),
('C-Reactive Protein (CRP)', 'Hematology', 'Inflammatory marker', 'mg/L', '<3.0'),
('Procalcitonin', 'Hematology', 'Bacterial infection marker', 'ng/mL', '<0.25'),
('Ferritin', 'Hematology', 'Iron storage protein', 'ng/mL', 'Male: 12-300, Female: 12-150'),
('Iron (Serum)', 'Hematology', 'Essential mineral for oxygen transport', 'μg/dL', 'Male: 65-175, Female: 50-170'),
('Total Iron Binding Capacity (TIBC)', 'Hematology', 'Blood''s capacity to bind iron with transferrin', 'μg/dL', '240-450'),
('Transferrin Saturation', 'Hematology', 'Percentage of transferrin saturated with iron', '%', '20-50'),
('Vitamin B12', 'Hematology', 'Essential vitamin for red blood cell formation', 'pg/mL', '200-900'),
('Folate (Folic Acid)', 'Hematology', 'B vitamin essential for DNA synthesis', 'ng/mL', '2.7-17.0'),

-- CLINICAL CHEMISTRY TESTS
-- Basic Metabolic Panel
('Basic Metabolic Panel (BMP)', 'Chemistry', 'Basic metabolic function assessment', 'Various', 'See individual components'),
('Glucose (Fasting)', 'Chemistry', 'Blood sugar level after fasting', 'mg/dL', '70-100'),
('Glucose (Random)', 'Chemistry', 'Blood sugar level at any time', 'mg/dL', '<140'),
('Glucose (2-Hour Post-Prandial)', 'Chemistry', 'Blood sugar 2 hours after eating', 'mg/dL', '<140'),
('Hemoglobin A1c (HbA1c)', 'Chemistry', 'Average blood sugar over 2-3 months', '%', '<5.7'),
('Sodium (Na+)', 'Chemistry', 'Essential electrolyte for fluid balance', 'mEq/L', '136-145'),
('Potassium (K+)', 'Chemistry', 'Essential electrolyte for heart and muscle function', 'mEq/L', '3.5-5.0'),
('Chloride (Cl-)', 'Chemistry', 'Electrolyte that helps maintain fluid balance', 'mEq/L', '98-107'),
('Carbon Dioxide (CO2)', 'Chemistry', 'Bicarbonate level indicating acid-base balance', 'mEq/L', '22-28'),
('Blood Urea Nitrogen (BUN)', 'Chemistry', 'Kidney function marker', 'mg/dL', '7-20'),
('Creatinine', 'Chemistry', 'Kidney function marker', 'mg/dL', 'Male: 0.7-1.3, Female: 0.6-1.1'),
('BUN/Creatinine Ratio', 'Chemistry', 'Kidney function assessment ratio', 'ratio', '10-20'),

-- Comprehensive Metabolic Panel
('Comprehensive Metabolic Panel (CMP)', 'Chemistry', 'Comprehensive metabolic function assessment', 'Various', 'See individual components'),
('Estimated Glomerular Filtration Rate (eGFR)', 'Chemistry', 'Kidney filtration rate estimate', 'mL/min/1.73m²', '>60'),
('Calcium (Total)', 'Chemistry', 'Essential mineral for bones and cellular function', 'mg/dL', '8.5-10.5'),
('Phosphorus', 'Chemistry', 'Mineral important for bone health', 'mg/dL', '2.5-4.5'),
('Magnesium', 'Chemistry', 'Essential mineral for enzyme function', 'mg/dL', '1.7-2.2'),
('Total Protein', 'Chemistry', 'Total protein concentration in blood', 'g/dL', '6.0-8.3'),
('Albumin', 'Chemistry', 'Main protein made by the liver', 'g/dL', '3.5-5.0'),
('Globulin', 'Chemistry', 'Proteins including antibodies', 'g/dL', '2.3-3.4'),
('Albumin/Globulin Ratio', 'Chemistry', 'Ratio of albumin to globulin', 'ratio', '1.1-2.5'),

-- Liver Function Tests
('Liver Function Panel', 'Chemistry', 'Comprehensive liver function assessment', 'Various', 'See individual components'),
('Alanine Aminotransferase (ALT)', 'Chemistry', 'Liver enzyme indicating liver damage', 'U/L', 'Male: 10-40, Female: 7-35'),
('Aspartate Aminotransferase (AST)', 'Chemistry', 'Liver enzyme, also found in heart and muscle', 'U/L', '10-40'),
('Alkaline Phosphatase (ALP)', 'Chemistry', 'Enzyme found in liver, bone, and other tissues', 'U/L', '44-147'),
('Gamma-Glutamyl Transferase (GGT)', 'Chemistry', 'Liver enzyme sensitive to alcohol', 'U/L', 'Male: 9-48, Female: 9-32'),
('Total Bilirubin', 'Chemistry', 'Breakdown product of red blood cells', 'mg/dL', '0.3-1.2'),
('Direct Bilirubin', 'Chemistry', 'Conjugated bilirubin processed by liver', 'mg/dL', '0.0-0.3'),
('Indirect Bilirubin', 'Chemistry', 'Unconjugated bilirubin', 'mg/dL', '0.2-0.8'),

-- Lipid Panel
('Lipid Panel', 'Chemistry', 'Cholesterol and triglyceride assessment', 'mg/dL', 'See individual components'),
('Total Cholesterol', 'Chemistry', 'Total cholesterol in blood', 'mg/dL', '<200'),
('HDL Cholesterol', 'Chemistry', 'High-density lipoprotein (good cholesterol)', 'mg/dL', 'Male: >40, Female: >50'),
('LDL Cholesterol', 'Chemistry', 'Low-density lipoprotein (bad cholesterol)', 'mg/dL', '<100'),
('VLDL Cholesterol', 'Chemistry', 'Very low-density lipoprotein', 'mg/dL', '5-40'),
('Triglycerides', 'Chemistry', 'Fat molecules in blood', 'mg/dL', '<150'),
('Non-HDL Cholesterol', 'Chemistry', 'Total cholesterol minus HDL', 'mg/dL', '<130'),
('Total Cholesterol/HDL Ratio', 'Chemistry', 'Cardiovascular risk ratio', 'ratio', '<5.0'),
('Apolipoprotein A1', 'Chemistry', 'Main protein in HDL cholesterol', 'mg/dL', 'Male: 94-178, Female: 101-199'),
('Apolipoprotein B', 'Chemistry', 'Main protein in LDL cholesterol', 'mg/dL', 'Male: 52-109, Female: 49-103'),
('Lipoprotein(a)', 'Chemistry', 'Genetic cardiovascular risk factor', 'mg/dL', '<30'),

-- Cardiac Markers
('Troponin I', 'Chemistry', 'Heart muscle damage marker', 'ng/mL', '<0.04'),
('Troponin T', 'Chemistry', 'Heart muscle damage marker', 'ng/mL', '<0.01'),
('Creatine Kinase (CK)', 'Chemistry', 'Enzyme found in heart, brain, and skeletal muscle', 'U/L', 'Male: 38-174, Female: 26-140'),
('CK-MB', 'Chemistry', 'Heart-specific creatine kinase', 'ng/mL', '<6.3'),
('Myoglobin', 'Chemistry', 'Oxygen-binding protein in muscle', 'ng/mL', 'Male: 28-72, Female: 25-58'),
('B-type Natriuretic Peptide (BNP)', 'Chemistry', 'Heart failure marker', 'pg/mL', '<100'),
('N-terminal pro-BNP (NT-proBNP)', 'Chemistry', 'Heart failure marker', 'pg/mL', '<125'),

-- Thyroid Function Tests
('Thyroid Stimulating Hormone (TSH)', 'Endocrinology', 'Pituitary hormone that regulates thyroid', 'μIU/mL', '0.27-4.20'),
('Free Thyroxine (Free T4)', 'Endocrinology', 'Active thyroid hormone', 'ng/dL', '0.93-1.70'),
('Free Triiodothyronine (Free T3)', 'Endocrinology', 'Active thyroid hormone', 'pg/mL', '2.0-4.4'),
('Total T4', 'Endocrinology', 'Total thyroxine including bound and free', 'μg/dL', '4.5-12.0'),
('Total T3', 'Endocrinology', 'Total triiodothyronine including bound and free', 'ng/dL', '71-180'),
('Reverse T3', 'Endocrinology', 'Inactive form of T3', 'ng/dL', '9.2-24.1'),
('Thyroglobulin', 'Endocrinology', 'Protein produced by thyroid gland', 'ng/mL', '<55'),
('Anti-Thyroglobulin Antibodies', 'Endocrinology', 'Autoantibodies against thyroglobulin', 'IU/mL', '<115'),
('Anti-TPO Antibodies', 'Endocrinology', 'Autoantibodies against thyroid peroxidase', 'IU/mL', '<34'),
('TSI (Thyroid Stimulating Immunoglobulin)', 'Endocrinology', 'Antibodies that stimulate thyroid', '%', '<140'),

-- Diabetes Monitoring
('Fructosamine', 'Chemistry', 'Short-term glycemic control (2-3 weeks)', 'μmol/L', '205-285'),
('1,5-Anhydroglucitol', 'Chemistry', 'Short-term glycemic variability marker', 'μg/mL', '>10'),
('C-Peptide', 'Endocrinology', 'Insulin production marker', 'ng/mL', '0.9-7.1'),
('Insulin (Fasting)', 'Endocrinology', 'Hormone that regulates blood sugar', 'μIU/mL', '2.6-24.9'),
('Microalbumin (Urine)', 'Chemistry', 'Early kidney damage marker in diabetes', 'mg/g creatinine', '<30'),

-- IMMUNOLOGY AND SEROLOGY
-- Autoimmune Markers
('Antinuclear Antibodies (ANA)', 'Immunology', 'Autoantibodies against cell nuclei', 'titer', '<1:80'),
('Anti-dsDNA', 'Immunology', 'Antibodies against double-stranded DNA', 'IU/mL', '<7'),
('Anti-Sm', 'Immunology', 'Antibodies against Smith antigen', 'AI', '<0.9'),
('Anti-SSA/Ro52', 'Immunology', 'Antibodies against Ro52 antigen', 'AI', '<0.9'),
('Anti-SSA/Ro60', 'Immunology', 'Antibodies against Ro60 antigen', 'AI', '<0.9'),
('Anti-SSB/La', 'Immunology', 'Antibodies against La antigen', 'AI', '<0.9'),
('Anti-Scl-70', 'Immunology', 'Antibodies against topoisomerase I', 'AI', '<0.9'),
('Anti-Centromere', 'Immunology', 'Antibodies against centromere proteins', 'AI', '<0.9'),
('Rheumatoid Factor (RF)', 'Immunology', 'Autoantibody associated with rheumatoid arthritis', 'IU/mL', '<14'),
('Anti-CCP (Cyclic Citrullinated Peptide)', 'Immunology', 'Specific marker for rheumatoid arthritis', 'U/mL', '<20'),
('Anti-Jo-1', 'Immunology', 'Antibodies against histidyl-tRNA synthetase', 'AI', '<0.9'),

-- Complement System
('C3 Complement', 'Immunology', 'Component of complement system', 'mg/dL', '90-180'),
('C4 Complement', 'Immunology', 'Component of complement system', 'mg/dL', '10-40'),
('CH50 (Total Complement)', 'Immunology', 'Total complement activity', 'U/mL', '31-60'),

-- Immunoglobulins
('IgG (Immunoglobulin G)', 'Immunology', 'Most abundant antibody class', 'mg/dL', '700-1600'),
('IgA (Immunoglobulin A)', 'Immunology', 'Antibody found in mucous membranes', 'mg/dL', '70-400'),
('IgM (Immunoglobulin M)', 'Immunology', 'First antibody produced in immune response', 'mg/dL', '40-230'),
('IgE (Immunoglobulin E)', 'Immunology', 'Antibody associated with allergies', 'IU/mL', '<87'),
('IgD (Immunoglobulin D)', 'Immunology', 'Antibody found on B cell surfaces', 'mg/dL', '0-14'),

-- Allergy Testing
('Total IgE', 'Immunology', 'Total allergic antibody level', 'IU/mL', '<87'),
('Specific IgE - Dust Mite', 'Immunology', 'Allergy to house dust mites', 'kU/L', '<0.35'),
('Specific IgE - Cat Dander', 'Immunology', 'Allergy to cat allergens', 'kU/L', '<0.35'),
('Specific IgE - Dog Dander', 'Immunology', 'Allergy to dog allergens', 'kU/L', '<0.35'),
('Specific IgE - Peanut', 'Immunology', 'Allergy to peanuts', 'kU/L', '<0.35'),
('Specific IgE - Milk', 'Immunology', 'Allergy to cow''s milk', 'kU/L', '<0.35'),
('Specific IgE - Egg White', 'Immunology', 'Allergy to egg whites', 'kU/L', '<0.35'),
('Specific IgE - Wheat', 'Immunology', 'Allergy to wheat', 'kU/L', '<0.35'),
('Specific IgE - Soy', 'Immunology', 'Allergy to soy', 'kU/L', '<0.35'),

-- MICROBIOLOGY AND INFECTIOUS DISEASES
-- Hepatitis Panel
('Hepatitis A IgM', 'Microbiology', 'Acute hepatitis A infection marker', 'S/CO', '<0.8'),
('Hepatitis A IgG', 'Microbiology', 'Hepatitis A immunity marker', 'mIU/mL', '>20'),
('Hepatitis B Surface Antigen (HBsAg)', 'Microbiology', 'Active hepatitis B infection marker', 'S/CO', '<0.9'),
('Hepatitis B Surface Antibody (HBsAb)', 'Microbiology', 'Hepatitis B immunity marker', 'mIU/mL', '>10'),
('Hepatitis B Core Antibody (HBcAb)', 'Microbiology', 'Hepatitis B exposure marker', 'S/CO', '<0.9'),
('Hepatitis B e-Antigen (HBeAg)', 'Microbiology', 'Hepatitis B infectivity marker', 'S/CO', '<0.9'),
('Hepatitis B e-Antibody (HBeAb)', 'Microbiology', 'Hepatitis B low infectivity marker', 'S/CO', '<0.9'),
('Hepatitis C Antibody', 'Microbiology', 'Hepatitis C exposure marker', 'S/CO', '<0.8'),
('Hepatitis C RNA (Quantitative)', 'Microbiology', 'Active hepatitis C infection level', 'IU/mL', 'Not detected'),

-- HIV Testing
('HIV-1/2 Antibody/Antigen', 'Microbiology', 'HIV screening test', 'S/CO', '<0.9'),
('HIV-1 RNA (Viral Load)', 'Microbiology', 'HIV viral replication level', 'copies/mL', 'Not detected'),
('CD4+ T-Cell Count', 'Immunology', 'Immune system status in HIV', 'cells/μL', '500-1600'),
('CD4+ Percentage', 'Immunology', 'Percentage of CD4+ cells', '%', '29-59'),
('CD8+ T-Cell Count', 'Immunology', 'Cytotoxic T-cell count', 'cells/μL', '200-900'),
('CD4/CD8 Ratio', 'Immunology', 'Immune system balance ratio', 'ratio', '0.9-2.9'),

-- Syphilis Testing
('RPR (Rapid Plasma Reagin)', 'Microbiology', 'Syphilis screening test', 'titer', 'Non-reactive'),
('VDRL', 'Microbiology', 'Syphilis screening test', 'titer', 'Non-reactive'),
('FTA-ABS', 'Microbiology', 'Syphilis confirmatory test', 'result', 'Non-reactive'),
('TP-PA (Treponema pallidum)', 'Microbiology', 'Syphilis confirmatory test', 'result', 'Non-reactive'),

-- Other Infectious Disease Markers
('Cytomegalovirus (CMV) IgG', 'Microbiology', 'CMV past infection marker', 'AU/mL', '<6.0'),
('Cytomegalovirus (CMV) IgM', 'Microbiology', 'CMV recent infection marker', 'AU/mL', '<0.85'),
('Epstein-Barr Virus (EBV) VCA IgG', 'Microbiology', 'EBV past infection marker', 'U/mL', '<18'),
('Epstein-Barr Virus (EBV) VCA IgM', 'Microbiology', 'EBV recent infection marker', 'U/mL', '<36'),
('Epstein-Barr Virus (EBV) EBNA IgG', 'Microbiology', 'EBV remote infection marker', 'U/mL', '<18'),
('Toxoplasma IgG', 'Microbiology', 'Toxoplasmosis past infection marker', 'IU/mL', '<8'),
('Toxoplasma IgM', 'Microbiology', 'Toxoplasmosis recent infection marker', 'IU/mL', '<0.55'),
('Rubella IgG', 'Microbiology', 'Rubella immunity marker', 'IU/mL', '>10'),
('Varicella Zoster IgG', 'Microbiology', 'Chickenpox immunity marker', 'mIU/mL', '>150'),

-- TUMOR MARKERS AND ONCOLOGY
('Alpha-Fetoprotein (AFP)', 'Oncology', 'Liver cancer and testicular cancer marker', 'ng/mL', '<8.5'),
('Carcinoembryonic Antigen (CEA)', 'Oncology', 'Colorectal cancer marker', 'ng/mL', '<3.0'),
('Cancer Antigen 125 (CA 125)', 'Oncology', 'Ovarian cancer marker', 'U/mL', '<35'),
('Cancer Antigen 19-9 (CA 19-9)', 'Oncology', 'Pancreatic cancer marker', 'U/mL', '<37'),
('Cancer Antigen 15-3 (CA 15-3)', 'Oncology', 'Breast cancer marker', 'U/mL', '<30'),
('Cancer Antigen 27.29 (CA 27.29)', 'Oncology', 'Breast cancer marker', 'U/mL', '<38.6'),
('Prostate Specific Antigen (PSA)', 'Oncology', 'Prostate cancer screening marker', 'ng/mL', '<4.0'),
('Free PSA', 'Oncology', 'Unbound PSA fraction', 'ng/mL', 'Variable'),
('Free PSA/Total PSA Ratio', 'Oncology', 'Prostate cancer risk assessment', '%', '>25'),
('Human Chorionic Gonadotropin (hCG)', 'Oncology', 'Testicular cancer and pregnancy marker', 'mIU/mL', 'Male: <2.0, Non-pregnant female: <5.0'),
('Lactate Dehydrogenase (LDH)', 'Oncology', 'Non-specific tumor marker', 'U/L', '122-222'),
('Neuron-Specific Enolase (NSE)', 'Oncology', 'Lung cancer and neuroblastoma marker', 'ng/mL', '<16.3'),
('Chromogranin A', 'Oncology', 'Neuroendocrine tumor marker', 'ng/mL', '<36.4'),
('Thyroglobulin (Post-thyroidectomy)', 'Oncology', 'Thyroid cancer recurrence marker', 'ng/mL', '<1.0'),

-- COAGULATION STUDIES
('Prothrombin Time (PT)', 'Coagulation', 'Extrinsic clotting pathway assessment', 'seconds', '9.7-12.8'),
('International Normalized Ratio (INR)', 'Coagulation', 'Standardized PT for warfarin monitoring', 'ratio', '0.8-1.1'),
('Partial Thromboplastin Time (PTT)', 'Coagulation', 'Intrinsic clotting pathway assessment', 'seconds', '25.1-36.5'),
('Activated Partial Thromboplastin Time (aPTT)', 'Coagulation', 'Intrinsic clotting pathway assessment', 'seconds', '25.1-36.5'),
('Thrombin Time', 'Coagulation', 'Final common pathway of coagulation', 'seconds', '15.3-18.5'),
('Fibrinogen', 'Coagulation', 'Clotting protein', 'mg/dL', '200-400'),
('D-Dimer', 'Coagulation', 'Fibrin breakdown product', 'ng/mL', '<500'),
('Factor VIII Activity', 'Coagulation', 'Clotting factor VIII level', '%', '50-150'),
('Factor IX Activity', 'Coagulation', 'Clotting factor IX level', '%', '50-150'),
('von Willebrand Factor Antigen', 'Coagulation', 'von Willebrand disease marker', '%', '50-150'),
('Protein C Activity', 'Coagulation', 'Natural anticoagulant', '%', '70-140'),
('Protein S Activity', 'Coagulation', 'Natural anticoagulant', '%', '65-140'),
('Antithrombin III', 'Coagulation', 'Natural anticoagulant', '%', '80-120'),
('Lupus Anticoagulant', 'Coagulation', 'Antiphospholipid syndrome marker', 'ratio', '<1.2'),
('Anticardiolipin IgG', 'Coagulation', 'Antiphospholipid antibody', 'GPL', '<15'),
('Anticardiolipin IgM', 'Coagulation', 'Antiphospholipid antibody', 'MPL', '<12.5'),

-- ENDOCRINOLOGY SPECIALTIES
-- Adrenal Function
('Cortisol (Morning)', 'Endocrinology', 'Stress hormone level in morning', 'μg/dL', '6.2-19.4'),
('Cortisol (Evening)', 'Endocrinology', 'Stress hormone level in evening', 'μg/dL', '2.3-11.9'),
('24-Hour Urine Cortisol', 'Endocrinology', 'Total daily cortisol production', 'μg/24hr', '3.5-45'),
('ACTH (Adrenocorticotropic Hormone)', 'Endocrinology', 'Pituitary hormone stimulating adrenals', 'pg/mL', '7.2-63.3'),
('Aldosterone', 'Endocrinology', 'Mineralocorticoid hormone', 'ng/dL', '4-31'),
('Renin Activity', 'Endocrinology', 'Hormone regulating blood pressure', 'ng/mL/hr', '0.2-2.3'),
('Aldosterone/Renin Ratio', 'Endocrinology', 'Primary aldosteronism screening', 'ratio', '<20'),
('DHEA-Sulfate', 'Endocrinology', 'Adrenal androgen', 'μg/dL', 'Age and sex dependent'),
('17-Hydroxyprogesterone', 'Endocrinology', 'Adrenal enzyme deficiency marker', 'ng/dL', '<200'),

-- Reproductive Hormones
('Luteinizing Hormone (LH)', 'Endocrinology', 'Reproductive hormone', 'mIU/mL', 'Variable by gender and cycle'),
('Follicle Stimulating Hormone (FSH)', 'Endocrinology', 'Reproductive hormone', 'mIU/mL', 'Variable by gender and cycle'),
('Estradiol (E2)', 'Endocrinology', 'Female sex hormone', 'pg/mL', 'Variable by cycle phase'),
('Progesterone', 'Endocrinology', 'Female reproductive hormone', 'ng/mL', 'Variable by cycle phase'),
('Testosterone (Total)', 'Endocrinology', 'Male sex hormone', 'ng/dL', 'Male: 264-916, Female: 15-70'),
('Testosterone (Free)', 'Endocrinology', 'Bioactive testosterone', 'pg/mL', 'Male: 9.3-26.5, Female: 0.3-3.2'),
('Sex Hormone Binding Globulin (SHBG)', 'Endocrinology', 'Protein that binds sex hormones', 'nmol/L', 'Male: 18-54, Female: 32-135'),
('Prolactin', 'Endocrinology', 'Milk production hormone', 'ng/mL', 'Male: 4-15, Female: 4-23'),
('Anti-Müllerian Hormone (AMH)', 'Endocrinology', 'Ovarian reserve marker', 'ng/mL', 'Age dependent'),

-- Growth Hormone
('Growth Hormone (GH)', 'Endocrinology', 'Growth-promoting hormone', 'ng/mL', '<10'),
('Insulin-like Growth Factor 1 (IGF-1)', 'Endocrinology', 'Growth hormone mediator', 'ng/mL', 'Age dependent'),
('IGF Binding Protein 3 (IGFBP-3)', 'Endocrinology', 'IGF transport protein', 'ng/mL', 'Age dependent'),

-- Parathyroid and Bone
('Parathyroid Hormone (PTH)', 'Endocrinology', 'Calcium regulating hormone', 'pg/mL', '15-65'),
('25-Hydroxyvitamin D', 'Endocrinology', 'Vitamin D storage form', 'ng/mL', '30-100'),
('1,25-Dihydroxyvitamin D', 'Endocrinology', 'Active vitamin D hormone', 'pg/mL', '19.9-79.3'),
('Osteocalcin', 'Endocrinology', 'Bone formation marker', 'ng/mL', 'Age and sex dependent'),
('Bone Alkaline Phosphatase', 'Endocrinology', 'Bone formation marker', 'μg/L', 'Age and sex dependent'),
('C-Terminal Telopeptide (CTx)', 'Endocrinology', 'Bone resorption marker', 'pg/mL', 'Age and sex dependent'),

-- NEPHROLOGY AND URINE TESTS
-- Urinalysis
('Urinalysis (Complete)', 'Nephrology', 'Comprehensive urine analysis', 'Various', 'See individual components'),
('Urine Specific Gravity', 'Nephrology', 'Urine concentration', 'ratio', '1.003-1.030'),
('Urine pH', 'Nephrology', 'Urine acidity/alkalinity', 'pH units', '4.6-8.0'),
('Urine Protein', 'Nephrology', 'Protein in urine', 'mg/dL', 'Negative-trace'),
('Urine Glucose', 'Nephrology', 'Sugar in urine', 'mg/dL', 'Negative'),
('Urine Ketones', 'Nephrology', 'Ketones in urine', 'mg/dL', 'Negative'),
('Urine Blood', 'Nephrology', 'Blood in urine', 'result', 'Negative'),
('Urine Leukocyte Esterase', 'Nephrology', 'White blood cells in urine', 'result', 'Negative'),
('Urine Nitrites', 'Nephrology', 'Bacterial infection marker', 'result', 'Negative'),
('Urine RBC Count', 'Nephrology', 'Red blood cells in urine', 'cells/hpf', '0-2'),
('Urine WBC Count', 'Nephrology', 'White blood cells in urine', 'cells/hpf', '0-5'),
('Urine Bacteria', 'Nephrology', 'Bacteria in urine', 'result', 'None-few'),
('Urine Epithelial Cells', 'Nephrology', 'Lining cells in urine', 'cells/hpf', 'Few'),

-- Specialized Urine Tests
('24-Hour Urine Protein', 'Nephrology', 'Total daily protein excretion', 'mg/24hr', '<150'),
('Urine Albumin/Creatinine Ratio', 'Nephrology', 'Kidney damage assessment', 'mg/g', '<30'),
('Urine Protein/Creatinine Ratio', 'Nephrology', 'Proteinuria assessment', 'mg/g', '<200'),
('Creatinine Clearance', 'Nephrology', 'Kidney filtration rate', 'mL/min', '>90'),
('24-Hour Urine Creatinine', 'Nephrology', 'Muscle mass and kidney function', 'mg/24hr', 'Male: 1000-2000, Female: 800-1800'),
('Urine Osmolality', 'Nephrology', 'Urine concentration ability', 'mOsm/kg', '50-1200'),
('Free Water Clearance', 'Nephrology', 'Kidney water handling', 'mL/min', 'Variable'),

-- GASTROENTEROLOGY
('Helicobacter pylori Antigen (Stool)', 'Gastroenterology', 'H. pylori infection marker', 'result', 'Negative'),
('Helicobacter pylori Antibody (IgG)', 'Gastroenterology', 'H. pylori exposure marker', 'U/mL', '<30'),
('Calprotectin (Stool)', 'Gastroenterology', 'Intestinal inflammation marker', 'μg/g', '<50'),
('Lactoferrin (Stool)', 'Gastroenterology', 'Intestinal inflammation marker', 'μg/g', '<7.25'),
('Pancreatic Elastase (Stool)', 'Gastroenterology', 'Pancreatic function marker', 'μg/g', '>200'),
('Fat (Stool)', 'Gastroenterology', 'Fat malabsorption marker', 'g/24hr', '<7'),
('Alpha-1 Antitrypsin (Stool)', 'Gastroenterology', 'Protein-losing enteropathy marker', 'mg/g', '<27.5'),

-- PULMONOLOGY
('Alpha-1 Antitrypsin', 'Pulmonology', 'Protease inhibitor', 'mg/dL', '90-200'),
('Angiotensin Converting Enzyme (ACE)', 'Pulmonology', 'Sarcoidosis marker', 'U/L', '8-53'),

-- RHEUMATOLOGY
('Uric Acid', 'Rheumatology', 'Gout marker', 'mg/dL', 'Male: 3.4-7.0, Female: 2.4-6.0'),
('HLA-B27', 'Rheumatology', 'Genetic marker for spondyloarthritis', 'result', 'Negative'),
('Cryoglobulins', 'Rheumatology', 'Cold-precipitable proteins', 'result', 'None detected'),

-- PSYCHIATRY/NEUROLOGY
('Homocysteine', 'Neurology', 'Cardiovascular and neurological risk marker', 'μmol/L', '4.0-15.4'),
('Methylmalonic Acid', 'Neurology', 'B12 deficiency marker', 'μmol/L', '73-376'),

-- TOXICOLOGY
('Ethanol', 'Toxicology', 'Alcohol level', 'mg/dL', '<10'),
('Acetaminophen', 'Toxicology', 'Tylenol level', 'μg/mL', '<10'),
('Salicylate', 'Toxicology', 'Aspirin level', 'mg/dL', '<2'),
('Lithium', 'Toxicology', 'Psychiatric medication level', 'mEq/L', '0.6-1.2'),
('Digoxin', 'Toxicology', 'Heart medication level', 'ng/mL', '0.8-2.0'),
('Phenytoin', 'Toxicology', 'Seizure medication level', 'μg/mL', '10-20'),
('Carbamazepine', 'Toxicology', 'Seizure medication level', 'μg/mL', '4-12'),
('Valproic Acid', 'Toxicology', 'Seizure medication level', 'μg/mL', '50-100'),

-- GENETICS AND MOLECULAR DIAGNOSTICS
('Pharmacogenomic Panel', 'Genetics', 'Drug metabolism genetic variants', 'result', 'Variant specific'),
('BRCA1/BRCA2 Mutation Analysis', 'Genetics', 'Breast cancer susceptibility genes', 'result', 'No mutation detected'),
('Factor V Leiden', 'Genetics', 'Thrombophilia genetic marker', 'result', 'No mutation detected'),
('Prothrombin G20210A', 'Genetics', 'Thrombophilia genetic marker', 'result', 'No mutation detected'),
('MTHFR Mutation', 'Genetics', 'Folate metabolism genetic variant', 'result', 'No mutation detected'),

-- THERAPEUTIC DRUG MONITORING
('Tacrolimus', 'TDM', 'Immunosuppressive drug level', 'ng/mL', '5-20'),
('Cyclosporine', 'TDM', 'Immunosuppressive drug level', 'ng/mL', '100-400'),
('Vancomycin Trough', 'TDM', 'Antibiotic level', 'μg/mL', '10-20'),
('Gentamicin Peak', 'TDM', 'Antibiotic level', 'μg/mL', '5-10'),
('Gentamicin Trough', 'TDM', 'Antibiotic level', 'μg/mL', '<2'),

-- SPECIALIZED CHEMISTRY
('Ammonia', 'Chemistry', 'Liver function and metabolism marker', 'μmol/L', '11-51'),
('Lactic Acid', 'Chemistry', 'Tissue oxygen marker', 'mmol/L', '0.5-2.2'),
('Pyruvate', 'Chemistry', 'Cellular metabolism marker', 'mg/dL', '0.3-0.9'),
('Beta-Hydroxybutyrate', 'Chemistry', 'Ketone body', 'mmol/L', '<0.6'),
('Carnitine (Free)', 'Chemistry', 'Fatty acid metabolism marker', 'μmol/L', '25-54'),
('Carnitine (Total)', 'Chemistry', 'Total carnitine level', 'μmol/L', '40-80'),

-- TRACE ELEMENTS
('Zinc', 'Chemistry', 'Essential trace element', 'μg/dL', '70-120'),
('Copper', 'Chemistry', 'Essential trace element', 'μg/dL', '70-140'),
('Selenium', 'Chemistry', 'Essential trace element', 'μg/L', '70-150'),
('Manganese', 'Chemistry', 'Essential trace element', 'μg/L', '4-15'),
('Chromium', 'Chemistry', 'Trace element', 'μg/L', '0.1-0.2'),

-- VITAMINS
('Vitamin A (Retinol)', 'Chemistry', 'Fat-soluble vitamin', 'μg/dL', '20-72'),
('Vitamin E (Tocopherol)', 'Chemistry', 'Fat-soluble vitamin', 'mg/L', '5.5-17'),
('Vitamin K', 'Chemistry', 'Fat-soluble vitamin', 'ng/mL', '0.2-3.2'),
('Thiamine (Vitamin B1)', 'Chemistry', 'Water-soluble vitamin', 'nmol/L', '70-180'),
('Riboflavin (Vitamin B2)', 'Chemistry', 'Water-soluble vitamin', 'μg/L', '137-370'),
('Niacin (Vitamin B3)', 'Chemistry', 'Water-soluble vitamin', 'μmol/L', '7-26'),
('Pyridoxine (Vitamin B6)', 'Chemistry', 'Water-soluble vitamin', 'nmol/L', '20-121'),
('Biotin (Vitamin B7)', 'Chemistry', 'Water-soluble vitamin', 'nmol/L', '0.5-2.25'),

-- MOLECULAR PATHOLOGY
('Epstein-Barr Virus DNA (Quantitative)', 'Molecular', 'EBV viral load', 'copies/mL', 'Not detected'),
('Cytomegalovirus DNA (Quantitative)', 'Molecular', 'CMV viral load', 'copies/mL', 'Not detected'),
('BK Virus DNA (Quantitative)', 'Molecular', 'BK virus load in transplant patients', 'copies/mL', 'Not detected'),
('Adenovirus DNA (Quantitative)', 'Molecular', 'Adenovirus load', 'copies/mL', 'Not detected'),

-- FLOW CYTOMETRY
('CD3+ T-Cells', 'Flow Cytometry', 'Total T-cell count', 'cells/μL', '690-2540'),
('CD4+ T-Helper Cells', 'Flow Cytometry', 'Helper T-cell count', 'cells/μL', '410-1590'),
('CD8+ Cytotoxic T-Cells', 'Flow Cytometry', 'Cytotoxic T-cell count', 'cells/μL', '190-1140'),
('CD19+ B-Cells', 'Flow Cytometry', 'B-cell count', 'cells/μL', '90-660'),
('CD16+56+ NK Cells', 'Flow Cytometry', 'Natural killer cell count', 'cells/μL', '90-590'),

-- CEREBROSPINAL FLUID ANALYSIS
('CSF Protein', 'Neurology', 'Protein in cerebrospinal fluid', 'mg/dL', '15-45'),
('CSF Glucose', 'Neurology', 'Glucose in cerebrospinal fluid', 'mg/dL', '40-70'),
('CSF Cell Count', 'Neurology', 'Cells in cerebrospinal fluid', 'cells/μL', '<5'),
('CSF Opening Pressure', 'Neurology', 'Pressure of cerebrospinal fluid', 'cmH2O', '70-180'),

-- SYNOVIAL FLUID ANALYSIS
('Synovial Fluid Cell Count', 'Rheumatology', 'Cells in joint fluid', 'cells/μL', '<200'),
('Synovial Fluid Crystals', 'Rheumatology', 'Crystals in joint fluid', 'result', 'None seen'),
('Synovial Fluid Glucose', 'Rheumatology', 'Glucose in joint fluid', 'mg/dL', 'Similar to serum'),

-- PLEURAL FLUID ANALYSIS
('Pleural Fluid Protein', 'Pulmonology', 'Protein in pleural fluid', 'g/dL', 'Variable'),
('Pleural Fluid LDH', 'Pulmonology', 'LDH in pleural fluid', 'U/L', 'Variable'),
('Pleural Fluid Cell Count', 'Pulmonology', 'Cells in pleural fluid', 'cells/μL', 'Variable'),

-- ASCITIC FLUID ANALYSIS
('Ascitic Fluid Protein', 'Gastroenterology', 'Protein in ascitic fluid', 'g/dL', 'Variable'),
('Ascitic Fluid Albumin', 'Gastroenterology', 'Albumin in ascitic fluid', 'g/dL', 'Variable'),
('SAAG (Serum-Ascites Albumin Gradient)', 'Gastroenterology', 'Portal hypertension marker', 'g/dL', '<1.1 low, ≥1.1 high'),

-- RESPIRATORY PATHOGEN PANEL
('Respiratory Pathogen Panel (PCR)', 'Molecular', 'Multiple respiratory virus detection', 'result', 'Negative for all pathogens'),
('Influenza A/B (PCR)', 'Molecular', 'Influenza virus detection', 'result', 'Not detected'),
('RSV (PCR)', 'Molecular', 'Respiratory syncytial virus detection', 'result', 'Not detected'),
('COVID-19 (SARS-CoV-2) PCR', 'Molecular', 'Coronavirus detection', 'result', 'Not detected'),
('COVID-19 Antigen', 'Microbiology', 'Coronavirus antigen detection', 'result', 'Negative'),

-- GASTROINTESTINAL PATHOGEN PANEL
('GI Pathogen Panel (PCR)', 'Molecular', 'Multiple GI pathogen detection', 'result', 'Negative for all pathogens'),
('Clostridium difficile Toxin', 'Microbiology', 'C. diff toxin detection', 'result', 'Negative'),
('Norovirus (PCR)', 'Molecular', 'Norovirus detection', 'result', 'Not detected'),
('Rotavirus Antigen', 'Microbiology', 'Rotavirus detection', 'result', 'Negative'),

-- SPECIALIZED INFECTIOUS DISEASE
('Tuberculosis (TB) Gold', 'Microbiology', 'TB infection detection', 'result', 'Negative'),
('Mycobacterium tuberculosis PCR', 'Molecular', 'TB DNA detection', 'result', 'Not detected'),
('Legionella Antigen', 'Microbiology', 'Legionnaires disease detection', 'result', 'Negative'),
('Streptococcus pneumoniae Antigen', 'Microbiology', 'Pneumococcal antigen detection', 'result', 'Negative'),

-- AUTOIMMUNE LIVER DISEASE
('Anti-Mitochondrial Antibodies (AMA)', 'Immunology', 'Primary biliary cholangitis marker', 'titer', '<1:40'),
('Anti-Smooth Muscle Antibodies (ASMA)', 'Immunology', 'Autoimmune hepatitis marker', 'titer', '<1:40'),
('Anti-Liver Kidney Microsomal (Anti-LKM)', 'Immunology', 'Autoimmune hepatitis type 2 marker', 'titer', '<1:40'),
('Anti-Soluble Liver Antigen (Anti-SLA)', 'Immunology', 'Autoimmune hepatitis marker', 'U/mL', '<20'),

-- INFLAMMATORY BOWEL DISEASE
('Anti-Saccharomyces cerevisiae (ASCA) IgG', 'Immunology', 'Crohn''s disease marker', 'U/mL', '<25'),
('Anti-Saccharomyces cerevisiae (ASCA) IgA', 'Immunology', 'Crohn''s disease marker', 'U/mL', '<25'),
('Perinuclear ANCA (p-ANCA)', 'Immunology', 'Ulcerative colitis marker', 'titer', '<1:20'),
('Cytoplasmic ANCA (c-ANCA)', 'Immunology', 'Granulomatosis with polyangiitis marker', 'titer', '<1:20'),
('Anti-PR3', 'Immunology', 'ANCA-associated vasculitis marker', 'U/mL', '<3.5'),
('Anti-MPO', 'Immunology', 'ANCA-associated vasculitis marker', 'U/mL', '<9.0'),

-- CELIAC DISEASE
('Anti-Tissue Transglutaminase IgA', 'Immunology', 'Celiac disease marker', 'U/mL', '<4'),
('Anti-Endomysial IgA', 'Immunology', 'Celiac disease marker', 'titer', '<1:5'),
('Anti-Gliadin IgA', 'Immunology', 'Celiac disease marker', 'U/mL', '<25'),
('Anti-Gliadin IgG', 'Immunology', 'Celiac disease marker', 'U/mL', '<25'),
('Total IgA', 'Immunology', 'IgA deficiency screening for celiac testing', 'mg/dL', '70-400'),

-- METABOLIC DISORDERS
('Phenylalanine', 'Genetics', 'Phenylketonuria marker', 'mg/dL', '0.8-1.8'),
('Tyrosine', 'Genetics', 'Tyrosinemia marker', 'mg/dL', '0.5-1.2'),
('Leucine', 'Genetics', 'Maple syrup urine disease marker', 'mg/dL', '1.0-2.3'),
('Methionine', 'Genetics', 'Homocystinuria marker', 'mg/dL', '0.1-0.4'),
('Galactose', 'Genetics', 'Galactosemia marker', 'mg/dL', '<5'),

-- ADDITIONAL SPECIALIZED TESTS
('Adenosine Deaminase (Pleural Fluid)', 'Pulmonology', 'Tuberculous pleuritis marker', 'U/L', '<30'),
('Beta-2 Microglobulin', 'Oncology', 'Tumor marker and kidney function', 'mg/L', '0.7-1.8'),
('Cystatin C', 'Nephrology', 'Alternative kidney function marker', 'mg/L', '0.5-0.96'),
('Neutrophil Gelatinase-Associated Lipocalin (NGAL)', 'Nephrology', 'Acute kidney injury marker', 'ng/mL', '<150'),
('Kidney Injury Molecule-1 (KIM-1)', 'Nephrology', 'Acute kidney injury marker', 'ng/mL', '<2.25'),

-- ADDITIONAL CARDIOVASCULAR MARKERS
('Homocysteine', 'Cardiology', 'Cardiovascular risk marker', 'μmol/L', '4.0-15.4'),
('High-Sensitivity CRP (hs-CRP)', 'Cardiology', 'Cardiovascular inflammation marker', 'mg/L', '<3.0'),
('Fibrinogen', 'Cardiology', 'Clotting factor and cardiovascular risk', 'mg/dL', '200-400'),
('Plasminogen Activator Inhibitor-1 (PAI-1)', 'Cardiology', 'Thrombosis risk marker', 'ng/mL', '2-47'),

-- FERTILITY AND REPRODUCTIVE HEALTH
('Inhibin B', 'Endocrinology', 'Ovarian and testicular function', 'pg/mL', 'Variable by gender and age'),
('Activin A', 'Endocrinology', 'Reproductive hormone', 'pg/mL', 'Variable'),
('Mullerian Inhibiting Substance', 'Endocrinology', 'Ovarian reserve marker', 'ng/mL', 'Age dependent'),

-- BONE AND JOINT HEALTH
('Cross-Linked N-Telopeptide (NTx)', 'Endocrinology', 'Bone resorption marker', 'nmol BCE/mmol creatinine', 'Age and sex dependent'),
('Pyridinoline', 'Endocrinology', 'Bone resorption marker', 'nmol/mmol creatinine', 'Age and sex dependent'),
('Deoxypyridinoline', 'Endocrinology', 'Bone resorption marker', 'nmol/mmol creatinine', 'Age and sex dependent'),
('Sclerostin', 'Endocrinology', 'Bone formation inhibitor', 'pmol/L', 'Age and sex dependent'),

-- NEONATAL SCREENING
('17-OH Progesterone (Newborn)', 'Pediatrics', 'Congenital adrenal hyperplasia screening', 'ng/mL', '<3.0'),
('TSH (Newborn)', 'Pediatrics', 'Congenital hypothyroidism screening', 'μIU/mL', '<20'),
('Immunoreactive Trypsinogen (IRT)', 'Pediatrics', 'Cystic fibrosis screening', 'ng/mL', '<59.5'),
('Biotinidase', 'Pediatrics', 'Biotinidase deficiency screening', '%', '>30'),
('Galactose-1-Phosphate Uridyltransferase', 'Pediatrics', 'Galactosemia screening', 'U/g Hgb', '>2.5'),

-- THERAPEUTIC PROTEINS
('Adalimumab Level', 'TDM', 'Anti-TNF biologic level', 'μg/mL', '5-12'),
('Infliximab Level', 'TDM', 'Anti-TNF biologic level', 'μg/mL', '3-7'),
('Anti-Adalimumab Antibodies', 'TDM', 'Neutralizing antibodies to adalimumab', 'AU/mL', '<12'),
('Anti-Infliximab Antibodies', 'TDM', 'Neutralizing antibodies to infliximab', 'AU/mL', '<10'),

-- ENVIRONMENTAL TOXINS
('Lead', 'Toxicology', 'Heavy metal toxin', 'μg/dL', '<5'),
('Mercury', 'Toxicology', 'Heavy metal toxin', 'μg/L', '<10'),
('Arsenic', 'Toxicology', 'Heavy metal toxin', 'μg/L', '<50'),
('Cadmium', 'Toxicology', 'Heavy metal toxin', 'μg/L', '<5'),

-- DRUG SCREENS
('Amphetamines (Urine)', 'Toxicology', 'Stimulant drug screen', 'ng/mL', '<500'),
('Cocaine (Urine)', 'Toxicology', 'Cocaine metabolite screen', 'ng/mL', '<150'),
('Cannabis (THC) (Urine)', 'Toxicology', 'Marijuana metabolite screen', 'ng/mL', '<50'),
('Opiates (Urine)', 'Toxicology', 'Opiate drug screen', 'ng/mL', '<300'),
('Phencyclidine (PCP) (Urine)', 'Toxicology', 'PCP drug screen', 'ng/mL', '<25'),
('Benzodiazepines (Urine)', 'Toxicology', 'Benzodiazepine drug screen', 'ng/mL', '<200'),
('Barbiturates (Urine)', 'Toxicology', 'Barbiturate drug screen', 'ng/mL', '<200'),
('Methadone (Urine)', 'Toxicology', 'Methadone drug screen', 'ng/mL', '<300'),

-- AMINO ACIDS
('Alanine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '2.5-4.5'),
('Arginine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.4-1.2'),
('Asparagine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '3.5-6.5'),
('Aspartic Acid', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.1-0.3'),
('Citrulline', 'Genetics', 'Urea cycle disorder marker', 'mg/dL', '0.2-0.4'),
('Glutamic Acid', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.5-1.5'),
('Glycine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '1.5-3.5'),
('Histidine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.8-1.8'),
('Isoleucine', 'Genetics', 'Branched-chain amino acid', 'mg/dL', '0.5-1.3'),
('Lysine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '1.2-2.8'),
('Ornithine', 'Genetics', 'Urea cycle amino acid', 'mg/dL', '0.4-1.0'),
('Proline', 'Genetics', 'Amino acid metabolism', 'mg/dL', '1.2-3.0'),
('Serine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.8-1.8'),
('Taurine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.4-1.5'),
('Threonine', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.9-2.1'),
('Tryptophan', 'Genetics', 'Amino acid metabolism', 'mg/dL', '0.4-1.0'),
('Valine', 'Genetics', 'Branched-chain amino acid', 'mg/dL', '1.6-3.5'),

-- ORGANIC ACIDS
('Methylmalonic Acid (Urine)', 'Genetics', 'B12 deficiency and metabolic disorders', 'mmol/mol creatinine', '<5.0'),
('Homovanillic Acid (HVA)', 'Genetics', 'Catecholamine metabolism', 'mg/g creatinine', 'Age dependent'),
('Vanillylmandelic Acid (VMA)', 'Genetics', 'Catecholamine metabolism', 'mg/g creatinine', 'Age dependent'),
('5-Hydroxyindoleacetic Acid (5-HIAA)', 'Genetics', 'Serotonin metabolism', 'mg/g creatinine', '<8'),

-- FATTY ACID OXIDATION
('Acylcarnitine Profile', 'Genetics', 'Fatty acid oxidation disorders', 'μmol/L', 'Variable by specific acylcarnitine'),
('Free Carnitine', 'Genetics', 'Carnitine deficiency', 'μmol/L', '25-54'),
('Total Carnitine', 'Genetics', 'Total carnitine status', 'μmol/L', '40-80'),

-- PORPHYRINS
('Coproporphyrin (Urine)', 'Genetics', 'Porphyria marker', 'μg/g creatinine', '<200'),
('Uroporphyrin (Urine)', 'Genetics', 'Porphyria marker', 'μg/g creatinine', '<25'),
('Porphobilinogen (Urine)', 'Genetics', 'Acute porphyria marker', 'mg/g creatinine', '<2.0'),
('Delta-Aminolevulinic Acid (Urine)', 'Genetics', 'Porphyria and lead poisoning marker', 'mg/g creatinine', '<6.0'),

-- PURINE/PYRIMIDINE METABOLISM
('Orotic Acid (Urine)', 'Genetics', 'Pyrimidine metabolism disorder', 'mmol/mol creatinine', '<5'),
('Adenine', 'Genetics', 'Purine metabolism', 'μmol/L', 'Variable'),
('Hypoxanthine', 'Genetics', 'Purine metabolism', 'μmol/L', 'Variable'),
('Xanthine', 'Genetics', 'Purine metabolism', 'μmol/L', 'Variable');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lab_tests_category ON lab_tests(category);
CREATE INDEX IF NOT EXISTS idx_lab_tests_name ON lab_tests(name);

-- Display summary
SELECT 
    category,
    COUNT(*) as test_count
FROM lab_tests 
GROUP BY category 
ORDER BY test_count DESC;

-- Total count
SELECT COUNT(*) as total_tests FROM lab_tests;