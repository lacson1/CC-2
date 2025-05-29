#!/bin/bash

# Add the final 43 medications to complete the 500 medicine expansion
echo "Adding final 43 medications to complete the expansion..."

TOKEN=$(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Remaining medications to complete the 500 expansion
curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Pralidoxime 1g","unit":"vials","quantity":15,"lowStockThreshold":4,"description":"Organophosphate poisoning antidote","supplier":"Poison Control"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Flumazenil 0.5mg","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"Benzodiazepine reversal agent","supplier":"Emergency Antidotes"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Fomepizole 1.5g","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Methanol/ethylene glycol antidote","supplier":"Toxicology Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Digoxin Immune Fab","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"Digoxin toxicity reversal","supplier":"Cardiac Emergency"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hydroxocobalamin 5g","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Cyanide poisoning antidote","supplier":"Chemical Emergency"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Donepezil 10mg","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"Alzheimer disease treatment","supplier":"Memory Care Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Memantine 20mg","unit":"tablets","quantity":50,"lowStockThreshold":12,"description":"Moderate to severe dementia","supplier":"Cognitive Health"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Rivastigmine Patch 9.5mg","unit":"patches","quantity":30,"lowStockThreshold":8,"description":"Transdermal dementia treatment","supplier":"Geriatric Neurology"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Aducanumab 170mg","unit":"vials","quantity":3,"lowStockThreshold":1,"description":"Alzheimer amyloid therapy","supplier":"Advanced Alzheimer Care"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Galantamine 24mg XR","unit":"capsules","quantity":40,"lowStockThreshold":10,"description":"Extended release dementia treatment","supplier":"Neurocognitive Disorders"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Silver Sulfadiazine 1% Cream","unit":"tubes","quantity":50,"lowStockThreshold":12,"description":"Burn wound antimicrobial","supplier":"Burn Care Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Collagenase Ointment","unit":"tubes","quantity":25,"lowStockThreshold":6,"description":"Enzymatic wound debridement","supplier":"Wound Care Specialists"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Becaplermin 0.01% Gel","unit":"tubes","quantity":15,"lowStockThreshold":4,"description":"Diabetic foot ulcer treatment","supplier":"Diabetic Wound Care"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Cadexomer Iodine Paste","unit":"tubes","quantity":30,"lowStockThreshold":8,"description":"Antimicrobial wound dressing","supplier":"Infection Control"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hydrocolloid Dressing 10x10cm","unit":"pieces","quantity":100,"lowStockThreshold":25,"description":"Moist wound healing","supplier":"Advanced Wound Care"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Botulinum Toxin Type A 100U","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Neurological and cosmetic applications","supplier":"Neurotoxin Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hyaluronic Acid Injection","unit":"syringes","quantity":20,"lowStockThreshold":5,"description":"Osteoarthritis joint treatment","supplier":"Orthopedic Care"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Platelet-Rich Plasma Kit","unit":"kits","quantity":15,"lowStockThreshold":4,"description":"Regenerative medicine treatment","supplier":"Regenerative Therapy"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Stem Cell Preservation Medium","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"Cell therapy preservation","supplier":"Cell Therapy Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Gene Therapy Vector","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"Experimental gene therapy","supplier":"Gene Medicine Institute"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Iron Sucrose 100mg","unit":"vials","quantity":40,"lowStockThreshold":10,"description":"IV iron for anemia","supplier":"Iron Deficiency Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Thiamine 100mg","unit":"vials","quantity":35,"lowStockThreshold":8,"description":"Vitamin B1 deficiency","supplier":"Metabolic Disorders"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Neem Extract 300mg","unit":"capsules","quantity":90,"lowStockThreshold":22,"description":"Antimicrobial herbal supplement","supplier":"Tropical Medicine"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Standardized Ginger Extract 250mg","unit":"capsules","quantity":60,"lowStockThreshold":15,"description":"Nausea and motion sickness","supplier":"Phytomedicine Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Indocyanine Green","unit":"vials","quantity":15,"lowStockThreshold":4,"description":"Liver function test dye","supplier":"Hepatology Diagnostics"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Prothrombin Complex Concentrate","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Warfarin reversal","supplier":"Emergency Hematology"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Carboplatin 450mg","unit":"vials","quantity":12,"lowStockThreshold":3,"description":"Platinum-based chemotherapy","supplier":"Oncology Unit"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Oxaliplatin 100mg","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"Colorectal cancer treatment","supplier":"GI Oncology"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Paclitaxel 300mg","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Taxane chemotherapy agent","supplier":"Cancer Treatment Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Docetaxel 160mg","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Microtubule inhibitor","supplier":"Solid Tumor Therapy"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Gemcitabine 1g","unit":"vials","quantity":15,"lowStockThreshold":4,"description":"Nucleoside analog chemotherapy","supplier":"Pancreatic Cancer Unit"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Vincristine 2mg","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"Vinca alkaloid for hematologic malignancies","supplier":"Hematology Oncology"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Vinblastine 10mg","unit":"vials","quantity":18,"lowStockThreshold":4,"description":"Hodgkin lymphoma treatment","supplier":"Lymphoma Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Etoposide 100mg","unit":"vials","quantity":25,"lowStockThreshold":6,"description":"Topoisomerase II inhibitor","supplier":"Testicular Cancer Unit"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Bleomycin 30mg","unit":"vials","quantity":12,"lowStockThreshold":3,"description":"Glycopeptide antibiotic for cancer","supplier":"Germ Cell Tumor Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Mitomycin C 20mg","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"DNA crosslinking agent","supplier":"Bladder Cancer Unit"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Busulfan 60mg","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Alkylating agent for transplant conditioning","supplier":"Bone Marrow Transplant"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Melphalan 50mg","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Multiple myeloma treatment","supplier":"Plasma Cell Disorder Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Chlorambucil 2mg","unit":"tablets","quantity":100,"lowStockThreshold":25,"description":"Oral alkylating agent for CLL","supplier":"Chronic Leukemia Unit"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Hydroxyurea 500mg","unit":"capsules","quantity":120,"lowStockThreshold":30,"description":"Sickle cell disease and polycythemia vera","supplier":"Benign Hematology"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Thalidomide 100mg","unit":"capsules","quantity":28,"lowStockThreshold":7,"description":"Multiple myeloma immunomodulator","supplier":"Myeloma Specialists"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Lenalidomide 25mg","unit":"capsules","quantity":21,"lowStockThreshold":5,"description":"Enhanced immunomodulatory drug","supplier":"Blood Cancer Center"}' &

curl -X POST http://localhost:5000/api/medicines -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Pomalidomide 4mg","unit":"capsules","quantity":21,"lowStockThreshold":5,"description":"Third-generation IMiD for relapsed myeloma","supplier":"Refractory Myeloma Unit"}' &

wait
echo "Successfully completed adding 500 additional medications!"
echo "Final medication count:"
curl -s http://localhost:5000/api/medicines | grep -o '"id":' | wc -l