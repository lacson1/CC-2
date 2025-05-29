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
('Antinuclear Antibody (ANA)', 'Immunology', 'Negative', 'Qualitative', 'Autoantibody screening test'),

-- Extended Hematology Tests
('Reticulocyte Count', 'Hematology', '0.5-2.5%', '%', 'Immature red blood cells indicating bone marrow activity'),
('Mean Corpuscular Volume (MCV)', 'Hematology', '80-100 fL', 'fL', 'Average volume of red blood cells'),
('Mean Corpuscular Hemoglobin (MCH)', 'Hematology', '27-32 pg', 'pg', 'Average hemoglobin content per red blood cell'),
('Mean Corpuscular Hemoglobin Concentration (MCHC)', 'Hematology', '32-36 g/dL', 'g/dL', 'Average hemoglobin concentration in red blood cells'),
('Red Cell Distribution Width (RDW)', 'Hematology', '11.5-14.5%', '%', 'Variation in red blood cell size'),
('Haptoglobin', 'Hematology', '41-165 mg/dL', 'mg/dL', 'Protein that binds free hemoglobin'),
('Ferritin', 'Hematology', 'Male: 12-300 ng/mL, Female: 12-150 ng/mL', 'ng/mL', 'Iron storage protein'),
('Iron Studies (Total Iron)', 'Hematology', '60-170 μg/dL', 'μg/dL', 'Total iron in blood'),
('Total Iron Binding Capacity (TIBC)', 'Hematology', '240-450 μg/dL', 'μg/dL', 'Capacity of transferrin to bind iron'),
('Transferrin Saturation', 'Hematology', '20-50%', '%', 'Percentage of transferrin saturated with iron'),
('Vitamin B12', 'Hematology', '200-900 pg/mL', 'pg/mL', 'Vitamin B12 levels for anemia evaluation'),
('Folate (Folic Acid)', 'Hematology', '2.7-17.0 ng/mL', 'ng/mL', 'Folate levels for anemia evaluation'),
('Direct Coombs Test', 'Hematology', 'Negative', 'Qualitative', 'Test for antibodies attached to red blood cells'),
('Indirect Coombs Test', 'Hematology', 'Negative', 'Qualitative', 'Test for circulating antibodies against red blood cells'),

-- Extended Clinical Chemistry
('Glucose Tolerance Test (GTT)', 'Clinical Chemistry', 'Fasting: <100, 2hr: <140 mg/dL', 'mg/dL', 'Glucose tolerance assessment over time'),
('Oral Glucose Tolerance Test (OGTT)', 'Clinical Chemistry', 'Fasting: <100, 2hr: <140 mg/dL', 'mg/dL', 'Standard glucose tolerance test'),
('Microalbumin', 'Clinical Chemistry', '<30 mg/g creatinine', 'mg/g', 'Early kidney damage marker'),
('Cystatin C', 'Clinical Chemistry', '0.53-0.95 mg/L', 'mg/L', 'Alternative kidney function marker'),
('Estimated GFR (eGFR)', 'Clinical Chemistry', '>60 mL/min/1.73m²', 'mL/min/1.73m²', 'Estimated glomerular filtration rate'),
('Lactate Dehydrogenase (LDH)', 'Clinical Chemistry', '122-222 U/L', 'U/L', 'Enzyme indicating tissue damage'),
('Amylase', 'Clinical Chemistry', '30-110 U/L', 'U/L', 'Pancreatic enzyme'),
('Lipase', 'Clinical Chemistry', '10-140 U/L', 'U/L', 'Pancreatic enzyme more specific than amylase'),
('Creatine Kinase (CK)', 'Clinical Chemistry', 'Male: 38-174 U/L, Female: 26-140 U/L', 'U/L', 'Muscle enzyme'),

-- Extended Liver Function Tests
('Gamma-Glutamyl Transferase (GGT)', 'Liver Function', 'Male: 9-48 U/L, Female: 9-32 U/L', 'U/L', 'Liver enzyme sensitive to alcohol'),
('5-Nucleotidase', 'Liver Function', '0-17 U/L', 'U/L', 'Liver enzyme specific to liver disease'),
('Prealbumin', 'Liver Function', '15-40 mg/dL', 'mg/dL', 'Protein marker of nutritional status'),
('Alpha-Fetoprotein (AFP)', 'Liver Function', '<10 ng/mL', 'ng/mL', 'Liver cancer marker'),

-- Extended Electrolytes and Minerals
('Bicarbonate (HCO3-)', 'Electrolytes', '22-28 mEq/L', 'mEq/L', 'Acid-base balance indicator'),
('Anion Gap', 'Electrolytes', '8-16 mEq/L', 'mEq/L', 'Calculated value for acid-base disorders'),
('Osmolality', 'Electrolytes', '275-295 mOsm/kg', 'mOsm/kg', 'Concentration of particles in blood'),
('Iron', 'Electrolytes', '60-170 μg/dL', 'μg/dL', 'Iron levels in blood'),
('Zinc', 'Electrolytes', '70-120 μg/dL', 'μg/dL', 'Zinc levels for nutritional assessment'),
('Copper', 'Electrolytes', '70-155 μg/dL', 'μg/dL', 'Copper levels'),

-- Extended Infectious Disease Screening
('Hepatitis A Antibody (HAV IgM)', 'Serology', 'Negative', 'Qualitative', 'Acute hepatitis A infection'),
('Hepatitis A Antibody (HAV IgG)', 'Serology', 'Negative/Positive', 'Qualitative', 'Past hepatitis A infection or immunity'),
('Hepatitis B Core Antibody (HBc IgM)', 'Serology', 'Negative', 'Qualitative', 'Acute hepatitis B infection'),
('Hepatitis B Core Antibody (HBc IgG)', 'Serology', 'Negative/Positive', 'Qualitative', 'Past hepatitis B infection'),
('Hepatitis B Surface Antibody (HBsAb)', 'Serology', 'Negative/Positive', 'Qualitative', 'Hepatitis B immunity'),
('Hepatitis B e Antigen (HBeAg)', 'Serology', 'Negative', 'Qualitative', 'Hepatitis B infectivity marker'),
('Hepatitis B e Antibody (HBeAb)', 'Serology', 'Negative/Positive', 'Qualitative', 'Hepatitis B recovery marker'),
('Hepatitis D Antibody', 'Serology', 'Negative', 'Qualitative', 'Hepatitis D co-infection'),
('Cytomegalovirus (CMV) IgM', 'Serology', 'Negative', 'Qualitative', 'Acute CMV infection'),
('Cytomegalovirus (CMV) IgG', 'Serology', 'Negative/Positive', 'Qualitative', 'Past CMV infection'),
('Epstein-Barr Virus (EBV) IgM', 'Serology', 'Negative', 'Qualitative', 'Acute EBV infection'),
('Epstein-Barr Virus (EBV) IgG', 'Serology', 'Negative/Positive', 'Qualitative', 'Past EBV infection'),
('Rubella IgM', 'Serology', 'Negative', 'Qualitative', 'Acute rubella infection'),
('Rubella IgG', 'Serology', 'Negative/Positive', 'Qualitative', 'Rubella immunity'),
('Toxoplasma IgM', 'Serology', 'Negative', 'Qualitative', 'Acute toxoplasma infection'),
('Toxoplasma IgG', 'Serology', 'Negative/Positive', 'Qualitative', 'Past toxoplasma infection'),
('Helicobacter Pylori Antigen', 'Serology', 'Negative', 'Qualitative', 'H. pylori infection'),
('Helicobacter Pylori Antibody', 'Serology', 'Negative', 'Qualitative', 'H. pylori antibody'),
('Dengue NS1 Antigen', 'Serology', 'Negative', 'Qualitative', 'Early dengue infection'),
('Dengue IgM', 'Serology', 'Negative', 'Qualitative', 'Recent dengue infection'),
('Dengue IgG', 'Serology', 'Negative/Positive', 'Qualitative', 'Past dengue infection'),
('Yellow Fever Antibody', 'Serology', 'Negative/Positive', 'Qualitative', 'Yellow fever immunity'),
('Meningitis Antigen', 'Serology', 'Negative', 'Qualitative', 'Bacterial meningitis'),

-- Extended Hormonal Tests
('Luteinizing Hormone (LH)', 'Endocrinology', 'Male: 1.2-8.6 mIU/mL, Female: varies with cycle', 'mIU/mL', 'Reproductive hormone'),
('Follicle Stimulating Hormone (FSH)', 'Endocrinology', 'Male: 1.5-12.4 mIU/mL, Female: varies with cycle', 'mIU/mL', 'Reproductive hormone'),
('Prolactin', 'Endocrinology', 'Male: 4-15 ng/mL, Female: 4-23 ng/mL', 'ng/mL', 'Hormone affecting reproduction'),
('Testosterone (Total)', 'Endocrinology', 'Male: 264-916 ng/dL, Female: 15-70 ng/dL', 'ng/dL', 'Male sex hormone'),
('Testosterone (Free)', 'Endocrinology', 'Male: 9-30 ng/dL, Female: 0.3-3.2 ng/dL', 'ng/dL', 'Bioavailable testosterone'),
('Estradiol (E2)', 'Endocrinology', 'Male: 7.6-42.6 pg/mL, Female: varies with cycle', 'pg/mL', 'Female sex hormone'),
('Progesterone', 'Endocrinology', 'Male: 0.2-1.4 ng/mL, Female: varies with cycle', 'ng/mL', 'Female reproductive hormone'),
('Cortisol (Morning)', 'Endocrinology', '6.2-19.4 μg/dL', 'μg/dL', 'Stress hormone'),
('ACTH', 'Endocrinology', '7.2-63.3 pg/mL', 'pg/mL', 'Adrenocorticotropic hormone'),
('Growth Hormone (GH)', 'Endocrinology', '<10 ng/mL', 'ng/mL', 'Growth hormone'),
('IGF-1', 'Endocrinology', '115-358 ng/mL (age dependent)', 'ng/mL', 'Insulin-like growth factor'),
('Insulin', 'Endocrinology', '2.6-24.9 μIU/mL', 'μIU/mL', 'Insulin hormone levels'),
('C-Peptide', 'Endocrinology', '1.1-4.4 ng/mL', 'ng/mL', 'Insulin production marker'),
('Parathyroid Hormone (PTH)', 'Endocrinology', '15-65 pg/mL', 'pg/mL', 'Calcium regulation hormone'),
('25-Hydroxyvitamin D', 'Endocrinology', '30-100 ng/mL', 'ng/mL', 'Vitamin D status'),
('1,25-Dihydroxyvitamin D', 'Endocrinology', '19.9-79.3 pg/mL', 'pg/mL', 'Active vitamin D'),

-- Tumor Markers
('Prostate Specific Antigen (PSA)', 'Tumor Markers', '<4.0 ng/mL', 'ng/mL', 'Prostate cancer screening'),
('PSA Free/Total Ratio', 'Tumor Markers', '>25%', '%', 'Prostate cancer risk assessment'),
('Carcinoembryonic Antigen (CEA)', 'Tumor Markers', '<3.0 ng/mL (non-smoker)', 'ng/mL', 'Colorectal cancer marker'),
('CA 19-9', 'Tumor Markers', '<37 U/mL', 'U/mL', 'Pancreatic cancer marker'),
('CA 125', 'Tumor Markers', '<35 U/mL', 'U/mL', 'Ovarian cancer marker'),
('CA 15-3', 'Tumor Markers', '<30 U/mL', 'U/mL', 'Breast cancer marker'),
('CA 27-29', 'Tumor Markers', '<38.6 U/mL', 'U/mL', 'Breast cancer marker'),
('Beta-2 Microglobulin', 'Tumor Markers', '0.7-1.8 mg/L', 'mg/L', 'Multiple myeloma marker'),

-- Extended Cardiac Markers
('Pro-BNP (NT-proBNP)', 'Cardiac Markers', '<125 pg/mL', 'pg/mL', 'Heart failure marker'),
('BNP', 'Cardiac Markers', '<100 pg/mL', 'pg/mL', 'Heart failure marker'),
('Myoglobin', 'Cardiac Markers', 'Male: 28-72 ng/mL, Female: 25-58 ng/mL', 'ng/mL', 'Early cardiac marker'),
('Homocysteine', 'Cardiac Markers', '5-15 μmol/L', 'μmol/L', 'Cardiovascular risk factor'),
('Lipoprotein(a)', 'Cardiac Markers', '<30 mg/dL', 'mg/dL', 'Cardiovascular risk marker'),
('Apolipoprotein A1', 'Cardiac Markers', 'Male: 94-178 mg/dL, Female: 101-199 mg/dL', 'mg/dL', 'HDL component'),
('Apolipoprotein B', 'Cardiac Markers', 'Male: 63-133 mg/dL, Female: 60-126 mg/dL', 'mg/dL', 'LDL component'),

-- Extended Coagulation Studies
('Fibrinogen', 'Coagulation', '200-400 mg/dL', 'mg/dL', 'Clotting protein'),
('D-Dimer', 'Coagulation', '<0.50 mg/L FEU', 'mg/L', 'Fibrin degradation product'),
('Bleeding Time', 'Coagulation', '2-7 minutes', 'minutes', 'Platelet function test'),
('Thrombin Time', 'Coagulation', '14-21 seconds', 'seconds', 'Fibrinogen function'),
('Factor VIII', 'Coagulation', '50-150%', '%', 'Clotting factor for hemophilia'),
('Factor IX', 'Coagulation', '50-150%', '%', 'Clotting factor for hemophilia B'),
('Protein C', 'Coagulation', '70-140%', '%', 'Natural anticoagulant'),
('Protein S', 'Coagulation', '65-140%', '%', 'Natural anticoagulant'),
('Antithrombin III', 'Coagulation', '80-120%', '%', 'Natural anticoagulant'),

-- Extended Immunology and Autoimmune
('Complement C3', 'Immunology', '90-180 mg/dL', 'mg/dL', 'Complement system component'),
('Complement C4', 'Immunology', '10-40 mg/dL', 'mg/dL', 'Complement system component'),
('Immunoglobulin A (IgA)', 'Immunology', '70-400 mg/dL', 'mg/dL', 'Antibody class'),
('Immunoglobulin G (IgG)', 'Immunology', '700-1600 mg/dL', 'mg/dL', 'Antibody class'),
('Immunoglobulin M (IgM)', 'Immunology', '40-230 mg/dL', 'mg/dL', 'Antibody class'),
('Immunoglobulin E (IgE)', 'Immunology', '<100 IU/mL', 'IU/mL', 'Allergy antibody'),
('Anti-dsDNA', 'Immunology', '<30 IU/mL', 'IU/mL', 'Lupus-specific antibody'),
('Anti-Sm', 'Immunology', 'Negative', 'Qualitative', 'Lupus-specific antibody'),
('Anti-SSA/Ro', 'Immunology', 'Negative', 'Qualitative', 'Autoantibody'),
('Anti-SSB/La', 'Immunology', 'Negative', 'Qualitative', 'Autoantibody'),
('Anti-Scl-70', 'Immunology', 'Negative', 'Qualitative', 'Scleroderma antibody'),
('Anti-Centromere', 'Immunology', 'Negative', 'Qualitative', 'Autoantibody'),
('Anti-Jo-1', 'Immunology', 'Negative', 'Qualitative', 'Myositis antibody'),
('ANCA (c-ANCA)', 'Immunology', 'Negative', 'Qualitative', 'Vasculitis antibody'),
('ANCA (p-ANCA)', 'Immunology', 'Negative', 'Qualitative', 'Vasculitis antibody'),
('Anti-CCP', 'Immunology', '<20 U/mL', 'U/mL', 'Rheumatoid arthritis antibody'),

-- Inflammatory Markers
('Interleukin-6 (IL-6)', 'Inflammatory Markers', '<5 pg/mL', 'pg/mL', 'Inflammatory cytokine'),
('Tumor Necrosis Factor-α (TNF-α)', 'Inflammatory Markers', '<8.1 pg/mL', 'pg/mL', 'Inflammatory cytokine'),
('Procalcitonin', 'Inflammatory Markers', '<0.25 ng/mL', 'ng/mL', 'Bacterial infection marker'),

-- Allergy Testing
('Total IgE', 'Allergy', '<100 IU/mL', 'IU/mL', 'Total allergic antibodies'),
('Specific IgE - Food Panel', 'Allergy', '<0.35 kUA/L', 'kUA/L', 'Food allergy testing'),
('Specific IgE - Environmental Panel', 'Allergy', '<0.35 kUA/L', 'kUA/L', 'Environmental allergy testing'),

-- Vitamins and Nutrition
('Vitamin A', 'Vitamins', '30-65 μg/dL', 'μg/dL', 'Vitamin A levels'),
('Vitamin E', 'Vitamins', '5.5-17 mg/L', 'mg/L', 'Vitamin E levels'),
('Vitamin C', 'Vitamins', '0.4-2.0 mg/dL', 'mg/dL', 'Vitamin C levels'),
('Thiamine (B1)', 'Vitamins', '2.5-7.5 μg/dL', 'μg/dL', 'Vitamin B1 levels'),
('Riboflavin (B2)', 'Vitamins', '4-24 μg/dL', 'μg/dL', 'Vitamin B2 levels'),
('Niacin (B3)', 'Vitamins', '0.5-8.5 μg/mL', 'μg/mL', 'Vitamin B3 levels'),
('Pyridoxine (B6)', 'Vitamins', '5-50 ng/mL', 'ng/mL', 'Vitamin B6 levels'),
('Biotin (B7)', 'Vitamins', '0.5-2.2 ng/mL', 'ng/mL', 'Biotin levels'),

-- Drug Levels (Therapeutic Drug Monitoring)
('Digoxin', 'Drug Levels', '0.8-2.0 ng/mL', 'ng/mL', 'Cardiac medication level'),
('Phenytoin', 'Drug Levels', '10-20 μg/mL', 'μg/mL', 'Anticonvulsant level'),
('Carbamazepine', 'Drug Levels', '4-12 μg/mL', 'μg/mL', 'Anticonvulsant level'),
('Valproic Acid', 'Drug Levels', '50-100 μg/mL', 'μg/mL', 'Anticonvulsant level'),
('Lithium', 'Drug Levels', '0.6-1.2 mEq/L', 'mEq/L', 'Mood stabilizer level'),
('Theophylline', 'Drug Levels', '10-20 μg/mL', 'μg/mL', 'Bronchodilator level'),

-- Cerebrospinal Fluid (CSF) Analysis
('CSF Protein', 'CSF Analysis', '15-45 mg/dL', 'mg/dL', 'Protein in cerebrospinal fluid'),
('CSF Glucose', 'CSF Analysis', '50-80 mg/dL', 'mg/dL', 'Glucose in cerebrospinal fluid'),
('CSF Cell Count', 'CSF Analysis', '<5 cells/μL', 'cells/μL', 'White blood cells in CSF'),
('CSF Culture', 'CSF Analysis', 'No growth', 'Qualitative', 'Bacterial culture of CSF'),

-- Pleural Fluid Analysis
('Pleural Fluid Protein', 'Body Fluids', 'Variable', 'mg/dL', 'Protein in pleural fluid'),
('Pleural Fluid LDH', 'Body Fluids', 'Variable', 'U/L', 'LDH in pleural fluid'),
('Pleural Fluid Cell Count', 'Body Fluids', 'Variable', 'cells/μL', 'Cells in pleural fluid'),

-- Genetic Testing
('Karyotype', 'Genetics', '46,XY or 46,XX', 'Qualitative', 'Chromosome analysis'),
('BRCA1/BRCA2 Mutation', 'Genetics', 'No mutation detected', 'Qualitative', 'Breast cancer gene testing'),
('Factor V Leiden', 'Genetics', 'Normal', 'Qualitative', 'Thrombophilia genetic test'),
('Prothrombin Gene Mutation', 'Genetics', 'Normal', 'Qualitative', 'Thrombophilia genetic test'),

-- Arterial Blood Gas
('pH', 'Blood Gas', '7.35-7.45', 'pH units', 'Blood acidity'),
('pCO2', 'Blood Gas', '35-45 mmHg', 'mmHg', 'Carbon dioxide partial pressure'),
('pO2', 'Blood Gas', '75-100 mmHg', 'mmHg', 'Oxygen partial pressure'),
('HCO3-', 'Blood Gas', '22-26 mEq/L', 'mEq/L', 'Bicarbonate in blood'),
('Oxygen Saturation', 'Blood Gas', '95-100%', '%', 'Oxygen saturation'),
('Base Excess', 'Blood Gas', '-2 to +2 mEq/L', 'mEq/L', 'Acid-base balance indicator');