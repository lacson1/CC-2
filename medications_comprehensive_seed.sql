-- Comprehensive Medication Database Seed
-- This script adds a wide range of commonly prescribed medications

INSERT INTO medications (name, category, description, dosage_forms, common_dosages, side_effects, contraindications, generic_name, brand_names) VALUES

-- Cardiovascular Medications
('Amlodipine', 'Cardiovascular', 'Calcium channel blocker used to treat high blood pressure and chest pain', 'Tablet', '2.5mg, 5mg, 10mg', 'Swelling of ankles, dizziness, flushing', 'Severe aortic stenosis', 'Amlodipine', 'Norvasc, Amlopres'),
('Lisinopril', 'Cardiovascular', 'ACE inhibitor for hypertension and heart failure', 'Tablet', '5mg, 10mg, 20mg', 'Dry cough, dizziness, hyperkalemia', 'Pregnancy, angioedema', 'Lisinopril', 'Prinivil, Zestril'),
('Metoprolol', 'Cardiovascular', 'Beta-blocker for hypertension and angina', 'Tablet', '25mg, 50mg, 100mg', 'Fatigue, dizziness, cold hands', 'Severe bradycardia, asthma', 'Metoprolol', 'Lopressor, Toprol-XL'),
('Atorvastatin', 'Cardiovascular', 'Statin for cholesterol management', 'Tablet', '10mg, 20mg, 40mg, 80mg', 'Muscle pain, liver enzyme elevation', 'Active liver disease, pregnancy', 'Atorvastatin', 'Lipitor'),
('Warfarin', 'Cardiovascular', 'Anticoagulant for blood clot prevention', 'Tablet', '1mg, 2mg, 5mg, 10mg', 'Bleeding, bruising', 'Active bleeding, pregnancy', 'Warfarin', 'Coumadin'),

-- Antibiotics
('Amoxicillin', 'Antibiotic', 'Penicillin antibiotic for bacterial infections', 'Capsule, Suspension', '250mg, 500mg, 875mg', 'Nausea, diarrhea, allergic reactions', 'Penicillin allergy', 'Amoxicillin', 'Amoxil, Trimox'),
('Azithromycin', 'Antibiotic', 'Macrolide antibiotic for respiratory infections', 'Tablet, Suspension', '250mg, 500mg', 'Nausea, diarrhea, abdominal pain', 'Macrolide allergy', 'Azithromycin', 'Zithromax, Z-Pak'),
('Ciprofloxacin', 'Antibiotic', 'Fluoroquinolone for urinary and respiratory infections', 'Tablet', '250mg, 500mg, 750mg', 'Nausea, diarrhea, tendon rupture', 'Pregnancy, children under 18', 'Ciprofloxacin', 'Cipro'),
('Doxycycline', 'Antibiotic', 'Tetracycline antibiotic for various infections', 'Capsule', '50mg, 100mg', 'Nausea, photosensitivity', 'Pregnancy, children under 8', 'Doxycycline', 'Vibramycin'),
('Cephalexin', 'Antibiotic', 'Cephalosporin antibiotic for skin and soft tissue infections', 'Capsule', '250mg, 500mg', 'Nausea, diarrhea, allergic reactions', 'Cephalosporin allergy', 'Cephalexin', 'Keflex'),

-- Pain Management
('Ibuprofen', 'Pain Relief', 'NSAID for pain and inflammation', 'Tablet, Suspension', '200mg, 400mg, 600mg, 800mg', 'Stomach upset, bleeding, kidney problems', 'Peptic ulcer, severe heart failure', 'Ibuprofen', 'Advil, Motrin'),
('Acetaminophen', 'Pain Relief', 'Analgesic and antipyretic', 'Tablet, Suspension', '325mg, 500mg, 650mg', 'Liver damage with overdose', 'Severe liver disease', 'Acetaminophen', 'Tylenol, Panadol'),
('Diclofenac', 'Pain Relief', 'NSAID for arthritis and pain', 'Tablet, Gel', '25mg, 50mg, 75mg', 'Stomach upset, cardiovascular risk', 'Heart disease, peptic ulcer', 'Diclofenac', 'Voltaren'),
('Tramadol', 'Pain Relief', 'Opioid analgesic for moderate pain', 'Tablet', '50mg, 100mg', 'Nausea, dizziness, constipation', 'Respiratory depression, seizure history', 'Tramadol', 'Ultram'),

-- Diabetes Medications
('Metformin', 'Diabetes', 'Biguanide for type 2 diabetes', 'Tablet', '500mg, 850mg, 1000mg', 'Nausea, diarrhea, lactic acidosis', 'Kidney disease, severe heart failure', 'Metformin', 'Glucophage'),
('Glimepiride', 'Diabetes', 'Sulfonylurea for type 2 diabetes', 'Tablet', '1mg, 2mg, 4mg', 'Hypoglycemia, weight gain', 'Type 1 diabetes, severe kidney disease', 'Glimepiride', 'Amaryl'),
('Insulin', 'Diabetes', 'Hormone for blood sugar control', 'Injection', 'Various units', 'Hypoglycemia, injection site reactions', 'Hypoglycemia', 'Insulin', 'Humalog, Novolog'),

-- Respiratory Medications
('Salbutamol', 'Respiratory', 'Beta-2 agonist for asthma and COPD', 'Inhaler, Nebulizer', '100mcg per puff', 'Tremor, palpitations, headache', 'Hypersensitivity', 'Salbutamol', 'Ventolin, Proventil'),
('Prednisolone', 'Respiratory', 'Corticosteroid for inflammation', 'Tablet, Syrup', '5mg, 10mg, 20mg', 'Weight gain, mood changes, infections', 'Systemic fungal infections', 'Prednisolone', 'Prelone'),
('Montelukast', 'Respiratory', 'Leukotriene receptor antagonist for asthma', 'Tablet', '4mg, 5mg, 10mg', 'Headache, mood changes', 'Hypersensitivity', 'Montelukast', 'Singulair'),

-- Gastrointestinal Medications
('Omeprazole', 'Gastrointestinal', 'Proton pump inhibitor for acid reflux', 'Capsule', '20mg, 40mg', 'Headache, nausea, diarrhea', 'Hypersensitivity', 'Omeprazole', 'Prilosec'),
('Ranitidine', 'Gastrointestinal', 'H2 receptor blocker for acid reduction', 'Tablet', '150mg, 300mg', 'Headache, dizziness', 'Hypersensitivity', 'Ranitidine', 'Zantac'),
('Loperamide', 'Gastrointestinal', 'Anti-diarrheal medication', 'Capsule', '2mg', 'Constipation, dizziness', 'Bloody diarrhea, bacterial enterocolitis', 'Loperamide', 'Imodium'),

-- Mental Health Medications
('Sertraline', 'Mental Health', 'SSRI antidepressant', 'Tablet', '25mg, 50mg, 100mg', 'Nausea, insomnia, sexual dysfunction', 'MAOI use, pregnancy concerns', 'Sertraline', 'Zoloft'),
('Fluoxetine', 'Mental Health', 'SSRI antidepressant', 'Capsule', '10mg, 20mg, 40mg', 'Nausea, anxiety, insomnia', 'MAOI use', 'Fluoxetine', 'Prozac'),
('Lorazepam', 'Mental Health', 'Benzodiazepine for anxiety', 'Tablet', '0.5mg, 1mg, 2mg', 'Drowsiness, confusion, dependence', 'Severe respiratory depression', 'Lorazepam', 'Ativan'),

-- Neurological Medications
('Carbamazepine', 'Neurological', 'Anticonvulsant for epilepsy', 'Tablet', '200mg, 400mg', 'Dizziness, drowsiness, rash', 'Bone marrow depression', 'Carbamazepine', 'Tegretol'),
('Phenytoin', 'Neurological', 'Anticonvulsant for seizures', 'Capsule', '100mg, 300mg', 'Gum overgrowth, dizziness', 'Heart block, pregnancy', 'Phenytoin', 'Dilantin'),

-- Dermatological Medications
('Hydrocortisone', 'Dermatological', 'Topical corticosteroid for skin inflammation', 'Cream, Ointment', '0.5%, 1%, 2.5%', 'Skin thinning, burning', 'Viral skin infections', 'Hydrocortisone', 'Cortef'),
('Clotrimazole', 'Dermatological', 'Antifungal for skin infections', 'Cream', '1%', 'Local irritation, burning', 'Hypersensitivity', 'Clotrimazole', 'Lotrimin'),

-- Vitamins and Supplements
('Vitamin D3', 'Vitamin', 'Vitamin D supplement for bone health', 'Tablet, Drops', '400IU, 800IU, 1000IU', 'Hypercalcemia with overdose', 'Hypercalcemia', 'Cholecalciferol', 'Various brands'),
('Folic Acid', 'Vitamin', 'B-vitamin for anemia prevention', 'Tablet', '1mg, 5mg', 'Generally well tolerated', 'B12 deficiency masking', 'Folic Acid', 'Various brands'),
('Iron Sulphate', 'Mineral', 'Iron supplement for anemia', 'Tablet', '200mg, 300mg', 'Constipation, nausea, dark stools', 'Hemochromatosis', 'Ferrous Sulfate', 'Various brands'),

-- Additional Common Medications
('Chlorpheniramine', 'Antihistamine', 'First-generation antihistamine for allergies', 'Tablet', '4mg', 'Drowsiness, dry mouth', 'Newborns, nursing mothers', 'Chlorpheniramine', 'Chlor-Trimeton'),
('Cetirizine', 'Antihistamine', 'Second-generation antihistamine', 'Tablet', '5mg, 10mg', 'Drowsiness, headache', 'Severe kidney disease', 'Cetirizine', 'Zyrtec'),
('Simvastatin', 'Cardiovascular', 'Statin for cholesterol management', 'Tablet', '10mg, 20mg, 40mg', 'Muscle pain, liver problems', 'Active liver disease', 'Simvastatin', 'Zocor'),
('Levothyroxine', 'Endocrine', 'Thyroid hormone replacement', 'Tablet', '25mcg, 50mcg, 100mcg', 'Heart palpitations, insomnia', 'Untreated adrenal insufficiency', 'Levothyroxine', 'Synthroid'),
('Hydrochlorothiazide', 'Cardiovascular', 'Thiazide diuretic for hypertension', 'Tablet', '12.5mg, 25mg, 50mg', 'Dehydration, electrolyte imbalance', 'Anuria, severe kidney disease', 'Hydrochlorothiazide', 'Microzide'),

-- Antimalarial Medications (Important for Nigeria)
('Artemether-Lumefantrine', 'Antimalarial', 'Combination therapy for malaria treatment', 'Tablet', '20mg/120mg', 'Nausea, vomiting, dizziness', 'Severe malaria, pregnancy in first trimester', 'Artemether-Lumefantrine', 'Coartem'),
('Chloroquine', 'Antimalarial', 'Antimalarial for prevention and treatment', 'Tablet', '250mg', 'Nausea, headache, visual disturbances', 'Retinal damage, epilepsy', 'Chloroquine', 'Aralen'),
('Doxycycline', 'Antimalarial', 'Antibiotic also used for malaria prevention', 'Capsule', '100mg', 'Photosensitivity, nausea', 'Pregnancy, children under 8', 'Doxycycline', 'Vibramycin'),

-- Pediatric Medications
('Paracetamol Syrup', 'Pain Relief', 'Liquid acetaminophen for children', 'Syrup', '120mg/5ml, 250mg/5ml', 'Liver damage with overdose', 'Severe liver disease', 'Acetaminophen', 'Calpol, Tylenol'),
('Amoxicillin Suspension', 'Antibiotic', 'Liquid penicillin for children', 'Suspension', '125mg/5ml, 250mg/5ml', 'Nausea, diarrhea, rash', 'Penicillin allergy', 'Amoxicillin', 'Amoxil'),
('ORS', 'Rehydration', 'Oral rehydration salts for dehydration', 'Powder', 'Sachet for 200ml', 'Generally well tolerated', 'Severe dehydration requiring IV', 'ORS', 'Various brands');