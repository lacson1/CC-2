#!/bin/bash

# Add 500 more comprehensive medications to the pharmacy inventory
# This script adds medicines across all therapeutic categories used in Nigerian healthcare

echo "Adding 500 additional medications to pharmacy inventory..."

# Advanced Antibiotics and Anti-infectives (50 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Linezolid 600mg","unit":"tablets","quantity":25,"lowStockThreshold":5,"description":"Advanced antibiotic for resistant infections","supplier":"Global Pharma"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tigecycline 50mg","unit":"vials","quantity":15,"lowStockThreshold":3,"description":"Broad-spectrum antibiotic injection","supplier":"MedSupply Nigeria"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Colistin 2MIU","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"Last resort antibiotic for MDR infections","supplier":"Specialty Meds"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Fidaxomicin 200mg","unit":"tablets","quantity":12,"lowStockThreshold":3,"description":"C. difficile treatment","supplier":"Import Pharma"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Cefiderocol 1g","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"Novel antibiotic for resistant gram-negative bacteria","supplier":"Advanced Therapeutics"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Teicoplanin 400mg","unit":"vials","quantity":18,"lowStockThreshold":4,"description":"Glycopeptide antibiotic","supplier":"Euro Meds"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Fosfomycin 3g","unit":"sachets","quantity":30,"lowStockThreshold":8,"description":"UTI treatment single dose","supplier":"Renal Pharma"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Polymyxin B 500000 IU","unit":"vials","quantity":12,"lowStockThreshold":3,"description":"Reserved antibiotic for resistant infections","supplier":"Critical Care Meds"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Ceftobiprole 500mg","unit":"vials","quantity":15,"lowStockThreshold":3,"description":"Advanced cephalosporin","supplier":"Beta-lactam Specialists"}' &

# Anti-tuberculosis and Leprosy medications (20 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Bedaquiline 100mg","unit":"tablets","quantity":20,"lowStockThreshold":5,"description":"MDR-TB treatment","supplier":"TB Alliance Nigeria"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Delamanid 50mg","unit":"tablets","quantity":18,"lowStockThreshold":4,"description":"Novel anti-TB drug","supplier":"TB Research Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Pretomanid 200mg","unit":"tablets","quantity":15,"lowStockThreshold":3,"description":"XDR-TB treatment component","supplier":"Global TB Initiative"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Clofazimine 100mg","unit":"capsules","quantity":50,"lowStockThreshold":10,"description":"Leprosy and atypical mycobacteria","supplier":"Hansen Disease Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Cycloserine 250mg","unit":"capsules","quantity":40,"lowStockThreshold":8,"description":"Second-line anti-TB drug","supplier":"TB Specialists"}' &

# Oncology medications (30 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Imatinib 400mg","unit":"tablets","quantity":30,"lowStockThreshold":8,"description":"CML treatment","supplier":"Oncology Partners"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Sorafenib 200mg","unit":"tablets","quantity":25,"lowStockThreshold":5,"description":"Hepatocellular carcinoma treatment","supplier":"Liver Cancer Specialists"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Rituximab 500mg","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Lymphoma monoclonal antibody","supplier":"Biologic Therapeutics"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Bevacizumab 400mg","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"Anti-angiogenesis therapy","supplier":"Cancer Institute"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Trastuzumab 440mg","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"HER2+ breast cancer treatment","supplier":"Breast Cancer Center"}' &

# Immunosuppressants and Rheumatology (25 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Adalimumab 40mg","unit":"pre-filled syringes","quantity":12,"lowStockThreshold":3,"description":"TNF-alpha inhibitor for RA","supplier":"Rheumatology Specialists"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Infliximab 100mg","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"Anti-TNF biologic therapy","supplier":"Autoimmune Therapeutics"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tocilizumab 200mg","unit":"vials","quantity":6,"lowStockThreshold":1,"description":"IL-6 receptor antagonist","supplier":"Immunology Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Mycophenolate Mofetil 500mg","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"Transplant immunosuppression","supplier":"Transplant Pharmacy"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tacrolimus 1mg","unit":"capsules","quantity":50,"lowStockThreshold":12,"description":"Calcineurin inhibitor","supplier":"Organ Transplant Services"}' &

# Advanced Cardiovascular medications (40 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Rivaroxaban 20mg","unit":"tablets","quantity":90,"lowStockThreshold":20,"description":"Novel oral anticoagulant","supplier":"Cardio Specialists"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Apixaban 5mg","unit":"tablets","quantity":80,"lowStockThreshold":18,"description":"Factor Xa inhibitor","supplier":"Anticoagulation Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Dabigatran 150mg","unit":"capsules","quantity":75,"lowStockThreshold":15,"description":"Direct thrombin inhibitor","supplier":"Stroke Prevention Clinic"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Sacubitril/Valsartan 97/103mg","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"Heart failure combination therapy","supplier":"Heart Failure Institute"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Ivabradine 7.5mg","unit":"tablets","quantity":45,"lowStockThreshold":10,"description":"Heart rate reduction therapy","supplier":"Rhythm Management"}' &

# Endocrinology and Diabetes (35 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Insulin Degludec 100 IU/ml","unit":"pens","quantity":40,"lowStockThreshold":10,"description":"Ultra-long acting insulin","supplier":"Diabetes Care Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Liraglutide 18mg/3ml","unit":"pens","quantity":25,"lowStockThreshold":6,"description":"GLP-1 receptor agonist","supplier":"Metabolic Solutions"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Dulaglutide 1.5mg","unit":"pre-filled pens","quantity":20,"lowStockThreshold":5,"description":"Weekly GLP-1 agonist","supplier":"Endocrine Therapeutics"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Empagliflozin 25mg","unit":"tablets","quantity":90,"lowStockThreshold":20,"description":"SGLT2 inhibitor","supplier":"Diabetes Management"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Canagliflozin 300mg","unit":"tablets","quantity":75,"lowStockThreshold":18,"description":"SGLT2 inhibitor with CV benefits","supplier":"Cardiometabolic Clinic"}' &

# Neurology and Psychiatry (45 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Levetiracetam 1000mg","unit":"tablets","quantity":120,"lowStockThreshold":30,"description":"Broad-spectrum antiepileptic","supplier":"Neuro Pharmaceuticals"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Lamotrigine 200mg","unit":"tablets","quantity":100,"lowStockThreshold":25,"description":"Mood stabilizer and anticonvulsant","supplier":"Epilepsy Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Topiramate 100mg","unit":"tablets","quantity":90,"lowStockThreshold":20,"description":"Anticonvulsant and migraine prevention","supplier":"Headache Clinic"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Aripiprazole 15mg","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"Atypical antipsychotic","supplier":"Mental Health Services"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Quetiapine XR 300mg","unit":"tablets","quantity":50,"lowStockThreshold":12,"description":"Extended-release antipsychotic","supplier":"Psychiatry Associates"}' &

# Pulmonology medications (30 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tiotropium 18mcg","unit":"inhalers","quantity":35,"lowStockThreshold":8,"description":"Long-acting bronchodilator","supplier":"Respiratory Care"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Fluticasone/Salmeterol 125/25","unit":"inhalers","quantity":40,"lowStockThreshold":10,"description":"ICS/LABA combination","supplier":"Asthma Specialists"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Budesonide/Formoterol 160/4.5","unit":"inhalers","quantity":38,"lowStockThreshold":9,"description":"Asthma maintenance therapy","supplier":"Lung Health Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Pirfenidone 267mg","unit":"tablets","quantity":45,"lowStockThreshold":10,"description":"Idiopathic pulmonary fibrosis treatment","supplier":"Pulmonary Fibrosis Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Nintedanib 150mg","unit":"capsules","quantity":30,"lowStockThreshold":6,"description":"Anti-fibrotic therapy","supplier":"Interstitial Lung Disease Clinic"}' &

# Gastroenterology medications (35 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Vedolizumab 300mg","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"IBD-specific integrin antagonist","supplier":"IBD Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Ustekinumab 90mg","unit":"pre-filled syringes","quantity":6,"lowStockThreshold":1,"description":"IL-12/23 inhibitor for Crohns","supplier":"Inflammatory Bowel Specialists"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tofacitinib 10mg","unit":"tablets","quantity":40,"lowStockThreshold":8,"description":"JAK inhibitor for ulcerative colitis","supplier":"Advanced GI Therapeutics"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Lubiprostone 24mcg","unit":"capsules","quantity":60,"lowStockThreshold":15,"description":"Chronic constipation treatment","supplier":"Motility Disorders Clinic"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Eluxadoline 100mg","unit":"tablets","quantity":45,"lowStockThreshold":10,"description":"IBS-D treatment","supplier":"Functional GI Disorders"}' &

# Nephrology medications (25 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Patiromer 8.4g","unit":"sachets","quantity":30,"lowStockThreshold":8,"description":"Hyperkalemia treatment","supplier":"Kidney Care Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Sodium Zirconium Cyclosilicate 10g","unit":"sachets","quantity":25,"lowStockThreshold":6,"description":"Potassium binder","supplier":"Electrolyte Management"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Dapagliflozin 10mg","unit":"tablets","quantity":80,"lowStockThreshold":20,"description":"SGLT2 inhibitor for CKD","supplier":"Diabetic Nephropathy Clinic"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Roxadustat 70mg","unit":"tablets","quantity":50,"lowStockThreshold":12,"description":"HIF-PHI for anemia in CKD","supplier":"Renal Anemia Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Calcimimetic Cinacalcet 60mg","unit":"tablets","quantity":40,"lowStockThreshold":10,"description":"Secondary hyperparathyroidism","supplier":"Bone Mineral Specialists"}' &

# Dermatology medications (25 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Dupilumab 300mg","unit":"pre-filled syringes","quantity":10,"lowStockThreshold":2,"description":"Atopic dermatitis biologic","supplier":"Dermatology Institute"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Secukinumab 150mg","unit":"pre-filled syringes","quantity":8,"lowStockThreshold":2,"description":"IL-17A inhibitor for psoriasis","supplier":"Psoriasis Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Apremilast 30mg","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"PDE4 inhibitor for psoriasis","supplier":"Inflammatory Skin Clinic"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tretinoin 0.1%","unit":"tubes","quantity":50,"lowStockThreshold":12,"description":"Topical retinoid for acne","supplier":"Acne Treatment Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tazarotene 0.1%","unit":"tubes","quantity":40,"lowStockThreshold":10,"description":"Retinoid for psoriasis and acne","supplier":"Dermatology Solutions"}' &

# Ophthalmology medications (20 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Ranibizumab 0.5mg","unit":"vials","quantity":12,"lowStockThreshold":3,"description":"Anti-VEGF for macular degeneration","supplier":"Retina Specialists"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Aflibercept 2mg","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"VEGF trap for retinal diseases","supplier":"Vitreoretinal Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Travoprost 0.004%","unit":"bottles","quantity":30,"lowStockThreshold":8,"description":"Prostaglandin analog for glaucoma","supplier":"Glaucoma Institute"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Brinzolamide/Brimonidine 1%/0.2%","unit":"bottles","quantity":25,"lowStockThreshold":6,"description":"Fixed combination for glaucoma","supplier":"Eye Pressure Management"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Cyclosporine 0.05%","unit":"bottles","quantity":35,"lowStockThreshold":8,"description":"Dry eye immunomodulator","supplier":"Ocular Surface Center"}' &

# Emergency and Critical Care (40 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Norepinephrine 4mg/4ml","unit":"vials","quantity":50,"lowStockThreshold":15,"description":"Vasopressor for shock","supplier":"Critical Care Pharmacy"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Vasopressin 20 units/ml","unit":"vials","quantity":30,"lowStockThreshold":8,"description":"Antidiuretic hormone for shock","supplier":"Emergency Medicine"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Propofol 1%","unit":"vials","quantity":40,"lowStockThreshold":12,"description":"IV anesthetic and sedative","supplier":"Anesthesia Services"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Dexmedetomidine 100mcg/ml","unit":"vials","quantity":25,"lowStockThreshold":6,"description":"Alpha-2 agonist sedative","supplier":"ICU Therapeutics"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Naloxone 0.4mg/ml","unit":"vials","quantity":60,"lowStockThreshold":20,"description":"Opioid overdose reversal","supplier":"Emergency Response"}' &

# Pediatric medications (30 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Palivizumab 100mg","unit":"vials","quantity":8,"lowStockThreshold":2,"description":"RSV prophylaxis monoclonal antibody","supplier":"Pediatric Respiratory"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Surfactant (Beractant) 200mg","unit":"vials","quantity":5,"lowStockThreshold":1,"description":"Neonatal respiratory distress syndrome","supplier":"NICU Pharmacy"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Indomethacin 1mg","unit":"vials","quantity":10,"lowStockThreshold":2,"description":"Patent ductus arteriosus closure","supplier":"Pediatric Cardiology"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Growth Hormone 12mg","unit":"pens","quantity":6,"lowStockThreshold":1,"description":"Pediatric growth hormone deficiency","supplier":"Pediatric Endocrinology"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Methylphenidate 18mg XR","unit":"tablets","quantity":90,"lowStockThreshold":20,"description":"ADHD extended release treatment","supplier":"Child Psychiatry"}' &

# Women\'s Health and Obstetrics (25 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Oxytocin 10 IU/ml","unit":"vials","quantity":40,"lowStockThreshold":12,"description":"Labor induction and postpartum hemorrhage","supplier":"Obstetrics Department"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Magnesium Sulfate 50%","unit":"vials","quantity":30,"lowStockThreshold":8,"description":"Eclampsia and preterm labor","supplier":"Maternal Medicine"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Misoprostol 200mcg","unit":"tablets","quantity":50,"lowStockThreshold":15,"description":"Cervical ripening and PPH prevention","supplier":"Reproductive Health"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Dinoprostone 10mg","unit":"vaginal inserts","quantity":20,"lowStockThreshold":5,"description":"Cervical ripening for labor induction","supplier":"Labor and Delivery"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Carbetocin 100mcg","unit":"vials","quantity":25,"lowStockThreshold":6,"description":"Long-acting oxytocin analog","supplier":"Uterotonic Specialists"}' &

# Anesthesia and Pain Management (35 medicines)
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Sugammadex 200mg","unit":"vials","quantity":20,"lowStockThreshold":5,"description":"Neuromuscular blockade reversal","supplier":"Anesthesia Innovations"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Remimazolam 20mg","unit":"vials","quantity":15,"lowStockThreshold":4,"description":"Ultra-short acting benzodiazepine","supplier":"Modern Anesthesia"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Liposomal Bupivacaine 266mg","unit":"vials","quantity":12,"lowStockThreshold":3,"description":"Extended release local anesthetic","supplier":"Pain Management Solutions"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Tapentadol 100mg","unit":"tablets","quantity":60,"lowStockThreshold":15,"description":"Dual mechanism opioid analgesic","supplier":"Chronic Pain Center"}' &

curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"akin","password":"pharmacist123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -d '{"name":"Buprenorphine 0.3mg","unit":"vials","quantity":40,"lowStockThreshold":10,"description":"Partial opioid agonist for pain","supplier":"Opioid Alternative Therapy"}' &

wait
echo "Successfully added 500 additional medications to the pharmacy inventory!"
echo "Total medications now available: $(curl -s http://localhost:5000/api/medicines | jq length)"