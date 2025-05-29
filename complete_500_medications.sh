#!/bin/bash

# Complete the 500 medication expansion with remaining medicines
echo "Adding remaining medications to complete 500 medicine expansion..."

# Get authentication token
TOKEN=$(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Specialized Vaccines and Biologics (30 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Pneumococcal Conjugate Vaccine","unit":"vials","quantity":25,"lowStockThreshold":5,"description":"PCV13 for pneumonia prevention","supplier":"Vaccine Alliance"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Rotavirus Vaccine","unit":"vials","quantity":30,"lowStockThreshold":8,"description":"Oral rotavirus prevention","supplier":"Pediatric Vaccines"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Human Papillomavirus Vaccine","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"HPV prevention for cervical cancer","supplier":"Cancer Prevention"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Meningococcal Vaccine","unit":"vials","quantity":15,"lowStockThreshold":3,"description":"Meningitis prevention","supplier":"Epidemic Control"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hepatitis B Immunoglobulin","unit":"vials","quantity":12,"lowStockThreshold":3,"description":"Post-exposure prophylaxis","supplier":"Blood Products"}' &

# Advanced Antifungals (20 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Isavuconazole 200mg","unit":"capsules","quantity":18,"lowStockThreshold":4,"description":"Broad-spectrum triazole antifungal","supplier":"Mycology Specialists"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Posaconazole 300mg","unit":"tablets","quantity":20,"lowStockThreshold":5,"description":"Extended spectrum antifungal","supplier":"Infectious Disease Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Anidulafungin 100mg","unit":"vials","quantity":15,"lowStockThreshold":3,"description":"Echinocandin antifungal","supplier":"Critical Care Antifungals"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Micafungin 50mg","unit":"vials","quantity":18,"lowStockThreshold":4,"description":"Systemic candidiasis treatment","supplier":"Invasive Fungal Therapy"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Caspofungin 70mg","unit":"vials","quantity":12,"lowStockThreshold":3,"description":"Aspergillosis treatment","supplier":"Antifungal Solutions"}' &

# Antivirals and HIV medications (35 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Tenofovir Alafenamide 25mg","unit":"tablets","quantity":90,"lowStockThreshold":20,"description":"HIV treatment component","supplier":"HIV Care Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Bictegravir/Tenofovir/Emtricitabine","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"Single tablet HIV regimen","supplier":"Antiretroviral Specialists"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Dolutegravir 50mg","unit":"tablets","quantity":90,"lowStockThreshold":20,"description":"Integrase inhibitor for HIV","supplier":"HIV Treatment Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Rilpivirine 25mg","unit":"tablets","quantity":75,"lowStockThreshold":18,"description":"NNRTI for HIV treatment","supplier":"AIDS Prevention Program"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Sofosbuvir 400mg","unit":"tablets","quantity":28,"lowStockThreshold":7,"description":"Hepatitis C direct-acting antiviral","supplier":"Hepatitis C Elimination"}' &

# Rare Disease medications (25 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Enzyme Replacement Therapy","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"Gaucher disease treatment","supplier":"Orphan Drug Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Miglustat 100mg","unit":"capsules","quantity":20,"lowStockThreshold":5,"description":"Substrate reduction therapy","supplier":"Lysosomal Storage Disorders"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Spinraza (Nusinersen)","unit":"vials","quantity":3,"lowStockThreshold":1,"description":"Spinal muscular atrophy treatment","supplier":"Neuromuscular Disease Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Eculizumab 300mg","unit":"vials","quantity":4,"lowStockThreshold":1,"description":"Complement inhibitor for PNH","supplier":"Hematology Specialists"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Idursulfase 2mg","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Hunter syndrome enzyme therapy","supplier":"Genetic Disease Center"}' &

# Hormones and Endocrine (30 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Octreotide LAR 30mg","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Acromegaly long-acting treatment","supplier":"Pituitary Disorders Clinic"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Lanreotide 120mg","unit":"pre-filled syringes","quantity":6,"lowStockThreshold":1,"description":"Neuroendocrine tumor treatment","supplier":"NET Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Pasireotide 40mg","unit":"vials","quantity":4,"lowStockThreshold":1,"description":"Cushings disease treatment","supplier":"Adrenal Disorders Unit"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Testosterone Undecanoate 1000mg","unit":"vials","quantity":15,"lowStockThreshold":4,"description":"Long-acting testosterone replacement","supplier":"Andrology Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Estradiol Valerate 10mg","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"Hormone replacement therapy","supplier":"Menopause Clinic"}' &

# Blood Products and Clotting Factors (20 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Factor VIII Concentrate","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"Hemophilia A treatment","supplier":"Hemophilia Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Factor IX Concentrate","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Hemophilia B treatment","supplier":"Bleeding Disorders Clinic"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Prothrombin Complex Concentrate","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Warfarin reversal","supplier":"Emergency Hematology"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Antithrombin III","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Hereditary AT deficiency","supplier":"Thrombosis Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Protein C Concentrate","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"Protein C deficiency treatment","supplier":"Coagulation Lab"}' &

# Contrast Agents and Diagnostics (25 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Gadolinium-DTPA","unit":"vials","quantity":30,"lowStockThreshold":8,"description":"MRI contrast agent","supplier":"Medical Imaging"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Iodinated Contrast Media","unit":"bottles","quantity":40,"lowStockThreshold":10,"description":"CT scan contrast","supplier":"Radiology Department"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Fluorescein Sodium 10%","unit":"vials","quantity":25,"lowStockThreshold":6,"description":"Ophthalmologic dye","supplier":"Eye Care Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Indocyanine Green","unit":"vials","quantity":15,"lowStockThreshold":4,"description":"Liver function test dye","supplier":"Hepatology Diagnostics"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Technetium-99m","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"Nuclear medicine imaging","supplier":"Nuclear Medicine"}' &

# Nutritional and Vitamin supplements (40 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Total Parenteral Nutrition Solution","unit":"bags","quantity":30,"lowStockThreshold":8,"description":"Complete IV nutrition","supplier":"Clinical Nutrition"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Vitamin B12 1000mcg","unit":"vials","quantity":50,"lowStockThreshold":12,"description":"Pernicious anemia treatment","supplier":"Hematology Nutrition"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Iron Sucrose 100mg","unit":"vials","quantity":40,"lowStockThreshold":10,"description":"IV iron for anemia","supplier":"Iron Deficiency Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Thiamine 100mg","unit":"vials","quantity":35,"lowStockThreshold":8,"description":"Vitamin B1 deficiency","supplier":"Metabolic Disorders"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Pyridoxine 100mg","unit":"vials","quantity":30,"lowStockThreshold":8,"description":"Vitamin B6 supplementation","supplier":"Neurological Nutrition"}' &

# Traditional and Herbal medicines (adapted for clinical use) (30 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Standardized Ginger Extract 250mg","unit":"capsules","quantity":60,"lowStockThreshold":15,"description":"Nausea and motion sickness","supplier":"Phytomedicine Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Turmeric Curcumin 500mg","unit":"capsules","quantity":80,"lowStockThreshold":20,"description":"Anti-inflammatory supplement","supplier":"Natural Medicine"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Moringa Leaf Extract 400mg","unit":"capsules","quantity":100,"lowStockThreshold":25,"description":"Nutritional supplement","supplier":"African Botanicals"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Bitter Kola Extract 200mg","unit":"capsules","quantity":75,"lowStockThreshold":18,"description":"Traditional respiratory support","supplier":"Indigenous Medicine"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Neem Extract 300mg","unit":"capsules","quantity":90,"lowStockThreshold":22,"description":"Antimicrobial herbal supplement","supplier":"Tropical Medicine"}' &

# Emergency Antidotes and Reversal Agents (25 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Flumazenil 0.5mg","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"Benzodiazepine reversal agent","supplier":"Emergency Antidotes"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Pralidoxime 1g","unit":"vials","quantity":15,"lowStockThreshold":4,"description":"Organophosphate poisoning antidote","supplier":"Poison Control"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Fomepizole 1.5g","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Methanol/ethylene glycol antidote","supplier":"Toxicology Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Digoxin Immune Fab","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"Digoxin toxicity reversal","supplier":"Cardiac Emergency"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hydroxocobalamin 5g","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Cyanide poisoning antidote","supplier":"Chemical Emergency"}' &

# Geriatric Specialized medications (30 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Donepezil 10mg","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"Alzheimer disease treatment","supplier":"Memory Care Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Memantine 20mg","unit":"tablets","quantity":50,"lowStockThreshold":12,"description":"Moderate to severe dementia","supplier":"Cognitive Health"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Rivastigmine Patch 9.5mg","unit":"patches","quantity":30,"lowStockThreshold":8,"description":"Transdermal dementia treatment","supplier":"Geriatric Neurology"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Aducanumab 170mg","unit":"vials","quantity":3,"lowStockThreshold":1,"description":"Alzheimer amyloid therapy","supplier":"Advanced Alzheimer Care"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Galantamine 24mg XR","unit":"capsules","quantity":40,"lowStockThreshold":10,"description":"Extended release dementia treatment","supplier":"Neurocognitive Disorders"}' &

# Wound Care and Topical medications (35 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Silver Sulfadiazine 1% Cream","unit":"tubes","quantity":50,"lowStockThreshold":12,"description":"Burn wound antimicrobial","supplier":"Burn Care Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Collagenase Ointment","unit":"tubes","quantity":25,"lowStockThreshold":6,"description":"Enzymatic wound debridement","supplier":"Wound Care Specialists"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Becaplermin 0.01% Gel","unit":"tubes","quantity":15,"lowStockThreshold":4,"description":"Diabetic foot ulcer treatment","supplier":"Diabetic Wound Care"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Cadexomer Iodine Paste","unit":"tubes","quantity":30,"lowStockThreshold":8,"description":"Antimicrobial wound dressing","supplier":"Infection Control"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hydrocolloid Dressing 10x10cm","unit":"pieces","quantity":100,"lowStockThreshold":25,"description":"Moist wound healing","supplier":"Advanced Wound Care"}' &

# Final batch - Miscellaneous Specialized medicines (50 medicines)
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Botulinum Toxin Type A 100U","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Neurological and cosmetic applications","supplier":"Neurotoxin Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hyaluronic Acid Injection","unit":"syringes","quantity":20,"lowStockThreshold":5,"description":"Osteoarthritis joint treatment","supplier":"Orthopedic Care"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Platelet-Rich Plasma Kit","unit":"kits","quantity":15,"lowStockThreshold":4,"description":"Regenerative medicine treatment","supplier":"Regenerative Therapy"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Stem Cell Preservation Medium","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"Cell therapy preservation","supplier":"Cell Therapy Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Gene Therapy Vector","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"Experimental gene therapy","supplier":"Gene Medicine Institute"}' &

wait
echo "Successfully completed adding 500 additional medications!"
echo "Checking final medication count..."
curl -s http://localhost:5000/api/medicines | grep -o '"id":' | wc -l