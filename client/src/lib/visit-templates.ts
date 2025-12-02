// Visit Templates for Common Clinical Scenarios
export interface VisitTemplate {
  id: string;
  name: string;
  category: string;
  visitType: string;
  description: string;
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  generalAppearance?: string;
  cardiovascularSystem?: string;
  respiratorySystem?: string;
  gastrointestinalSystem?: string;
  neurologicalSystem?: string;
  musculoskeletalSystem?: string;
  assessment?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  patientInstructions?: string;
  followUpInstructions?: string;
}

export const visitTemplates: VisitTemplate[] = [
  // Common Cold/URTI
  {
    id: 'common-cold',
    name: 'Upper Respiratory Tract Infection (Common Cold)',
    category: 'Respiratory',
    visitType: 'consultation',
    description: 'Template for common cold and URTI cases',
    chiefComplaint: 'Cough, runny nose, and sore throat',
    historyOfPresentIllness: 'Patient presents with symptoms of upper respiratory tract infection including nasal congestion, rhinorrhea, and mild throat discomfort. Symptoms began [X] days ago.',
    generalAppearance: 'Alert and oriented, appears mildly uncomfortable',
    cardiovascularSystem: 'Heart sounds normal, regular rate and rhythm',
    respiratorySystem: 'Clear breath sounds bilaterally, no wheezing or crackles',
    gastrointestinalSystem: 'Soft, non-tender abdomen',
    neurologicalSystem: 'Alert and oriented x3, cranial nerves intact',
    assessment: 'Likely viral upper respiratory tract infection based on clinical presentation',
    diagnosis: 'Acute viral upper respiratory tract infection',
    treatmentPlan: 'Symptomatic treatment with rest, hydration, and over-the-counter medications. Advise patient to return if symptoms worsen or persist beyond 7-10 days.',
    patientInstructions: 'Rest adequately, drink plenty of fluids, use steam inhalation, and take paracetamol for fever/discomfort. Avoid close contact with others.',
    followUpInstructions: 'Return if fever persists beyond 3 days, difficulty breathing develops, or symptoms worsen.'
  },
  
  // Hypertension Follow-up
  {
    id: 'hypertension-followup',
    name: 'Hypertension Follow-up',
    category: 'Cardiovascular',
    visitType: 'follow-up',
    description: 'Template for routine hypertension follow-up visits',
    chiefComplaint: 'Routine follow-up for hypertension',
    historyOfPresentIllness: 'Patient returns for routine blood pressure monitoring. Currently on antihypertensive medication. Reports compliance with medication regimen.',
    generalAppearance: 'Well-appearing, no acute distress',
    cardiovascularSystem: 'Regular rate and rhythm, no murmurs, gallops, or rubs',
    assessment: 'Blood pressure [within/above/below] target range. Medication compliance reported.',
    diagnosis: 'Essential hypertension, [controlled/uncontrolled]',
    treatmentPlan: 'Continue current antihypertensive regimen. Reinforce lifestyle modifications including low-salt diet, regular exercise, and weight management.',
    patientInstructions: 'Continue medications as prescribed, monitor blood pressure at home if possible, maintain healthy lifestyle habits.',
    followUpInstructions: 'Return in 3 months for blood pressure check and medication review. Seek immediate care if severe headache, chest pain, or shortness of breath develops.'
  },
  
  // Diabetes Follow-up
  {
    id: 'diabetes-followup',
    name: 'Diabetes Mellitus Follow-up',
    category: 'Endocrine',
    visitType: 'follow-up',
    description: 'Template for diabetes management follow-up',
    chiefComplaint: 'Routine diabetes follow-up',
    historyOfPresentIllness: 'Patient with known diabetes mellitus returns for routine follow-up. Reports blood glucose monitoring compliance. [Describe any symptoms of hypoglycemia or hyperglycemia].',
    generalAppearance: 'Well-appearing, no acute distress',
    cardiovascularSystem: 'Regular rate and rhythm',
    neurologicalSystem: 'Peripheral sensation intact, reflexes normal',
    assessment: 'Diabetes mellitus with [good/fair/poor] glycemic control based on home glucose readings',
    diagnosis: 'Type 2 Diabetes Mellitus',
    treatmentPlan: 'Continue current diabetic medications. Reinforce importance of diet control, regular exercise, and glucose monitoring. Consider HbA1c testing.',
    patientInstructions: 'Continue medications as prescribed, monitor blood glucose regularly, maintain diabetic diet, exercise regularly, foot care education.',
    followUpInstructions: 'Return in 3 months with HbA1c results. Seek immediate care if signs of hypoglycemia or diabetic ketoacidosis develop.'
  },
  
  // Acute Gastroenteritis
  {
    id: 'acute-gastroenteritis',
    name: 'Acute Gastroenteritis',
    category: 'Gastrointestinal',
    visitType: 'consultation',
    description: 'Template for acute gastroenteritis cases',
    chiefComplaint: 'Diarrhea and vomiting',
    historyOfPresentIllness: 'Patient presents with acute onset of watery diarrhea and vomiting. Symptoms began [X] hours/days ago. [Describe frequency, presence of blood, fever, abdominal pain].',
    generalAppearance: 'Alert, appears [mildly/moderately] dehydrated',
    cardiovascularSystem: 'Regular rate and rhythm, capillary refill normal',
    gastrointestinalSystem: 'Abdomen soft, diffusely tender, hyperactive bowel sounds',
    assessment: 'Acute gastroenteritis, likely viral/bacterial etiology. [Mild/Moderate] dehydration present.',
    diagnosis: 'Acute gastroenteritis with dehydration',
    treatmentPlan: 'Oral rehydration therapy, anti-emetics as needed, probiotics. Stool culture if bloody diarrhea or severe symptoms.',
    patientInstructions: 'Increase fluid intake with ORS, eat bland diet as tolerated, hand hygiene, rest adequately.',
    followUpInstructions: 'Return if unable to keep fluids down, blood in stool, signs of severe dehydration, or symptoms persist beyond 48-72 hours.'
  },
  
  // Musculoskeletal Pain
  {
    id: 'musculoskeletal-pain',
    name: 'Musculoskeletal Pain',
    category: 'Musculoskeletal',
    visitType: 'consultation',
    description: 'Template for acute musculoskeletal pain',
    chiefComplaint: 'Back/neck/joint pain',
    historyOfPresentIllness: 'Patient presents with [acute/chronic] [location] pain. Onset [X] days/weeks ago. [Describe mechanism of injury if applicable, aggravating/relieving factors].',
    generalAppearance: 'Appears uncomfortable, moves carefully',
    musculoskeletalSystem: 'Tenderness over [location], range of motion [limited/normal], no obvious deformity, neurovascular status intact',
    assessment: 'Musculoskeletal pain, likely [strain/sprain/overuse injury]',
    diagnosis: 'Acute musculoskeletal pain - [specific location]',
    treatmentPlan: 'Rest, ice/heat therapy, NSAIDs for pain relief. Physical therapy if symptoms persist. Consider imaging if red flags present.',
    patientInstructions: 'Rest affected area, apply ice for first 48 hours then heat, gentle stretching, avoid aggravating activities.',
    followUpInstructions: 'Return if pain worsens, numbness/tingling develops, or no improvement in 1-2 weeks.'
  },
  
  // Antenatal Visit
  {
    id: 'antenatal-routine',
    name: 'Routine Antenatal Visit',
    category: 'Obstetrics',
    visitType: 'routine-checkup',
    description: 'Template for routine antenatal care visits',
    chiefComplaint: 'Routine antenatal check-up',
    historyOfPresentIllness: 'Patient at [X] weeks gestation presents for routine antenatal care. Reports [fetal movements/no concerns/specific symptoms].',
    generalAppearance: 'Well-appearing, appropriate for gestational age',
    cardiovascularSystem: 'Regular rate and rhythm, no murmurs',
    assessment: 'Pregnancy progressing normally at [X] weeks gestation',
    diagnosis: 'Intrauterine pregnancy, [X] weeks',
    treatmentPlan: 'Continue prenatal vitamins, routine antenatal screening as appropriate for gestational age. Discuss delivery plans.',
    patientInstructions: 'Continue prenatal vitamins, balanced nutrition, adequate rest, fetal movement monitoring.',
    followUpInstructions: 'Return in 4 weeks for next antenatal visit. Seek immediate care if vaginal bleeding, severe headache, decreased fetal movements, or abdominal pain occurs.'
  },
  
  // Pediatric Fever
  {
    id: 'pediatric-fever',
    name: 'Pediatric Fever Evaluation',
    category: 'Pediatrics',
    visitType: 'consultation',
    description: 'Template for evaluating fever in children',
    chiefComplaint: 'Fever in child',
    historyOfPresentIllness: 'Child presents with fever of [X]°C for [X] days. [Associated symptoms: cough, rash, vomiting, diarrhea, irritability]. Feeding and activity level [normal/decreased].',
    generalAppearance: 'Alert/irritable, appears [well/mildly ill/toxic]',
    cardiovascularSystem: 'Regular rate and rhythm, capillary refill <2 seconds',
    respiratorySystem: 'Clear breath sounds, no respiratory distress',
    gastrointestinalSystem: 'Soft, non-tender abdomen',
    neurologicalSystem: 'Alert, appropriate for age, no meningeal signs',
    assessment: 'Febrile child with [likely viral illness/specific diagnosis]',
    diagnosis: 'Fever, [specify etiology if identified]',
    treatmentPlan: 'Symptomatic treatment with antipyretics, encourage fluid intake. [Antibiotics if bacterial infection suspected]. Monitor for danger signs.',
    patientInstructions: 'Give paracetamol/ibuprofen for fever, ensure adequate fluid intake, monitor temperature, watch for warning signs.',
    followUpInstructions: 'Return immediately if fever >40°C, seizures, difficulty breathing, severe headache, refusal to feed, or lethargy develops.'
  },
  
  // Allergic Reaction
  {
    id: 'allergic-reaction',
    name: 'Allergic Reaction',
    category: 'Allergy/Immunology',
    visitType: 'consultation',
    description: 'Template for mild to moderate allergic reactions',
    chiefComplaint: 'Rash and itching',
    historyOfPresentIllness: 'Patient presents with sudden onset of [rash/hives/itching]. Possible exposure to [food/medication/environmental allergen]. No respiratory distress or angioedema.',
    generalAppearance: 'Alert, appears uncomfortable from itching',
    cardiovascularSystem: 'Regular rate and rhythm, no signs of anaphylaxis',
    respiratorySystem: 'Clear breath sounds, no wheezing or stridor',
    assessment: 'Allergic reaction, [mild/moderate severity], no signs of anaphylaxis',
    diagnosis: 'Allergic reaction to [suspected allergen]',
    treatmentPlan: 'Antihistamine therapy, avoid suspected allergen. Prescribe emergency epinephrine if indicated. Consider allergy testing.',
    patientInstructions: 'Take antihistamines as prescribed, avoid identified allergens, carry emergency medication if prescribed.',
    followUpInstructions: 'Seek immediate emergency care if difficulty breathing, swelling of face/throat, or dizziness occurs. Follow up with allergist if recurrent reactions.'
  },
  
  // Vaccination Visit
  {
    id: 'vaccination',
    name: 'Vaccination Visit',
    category: 'Preventive Care',
    visitType: 'vaccination',
    description: 'Template for vaccination visits',
    chiefComplaint: 'Vaccination',
    historyOfPresentIllness: 'Patient presents for scheduled vaccination. No current illness. No previous adverse reactions to vaccines.',
    generalAppearance: 'Well-appearing, no acute illness',
    assessment: 'Patient suitable for vaccination',
    diagnosis: 'Prophylactic immunization',
    treatmentPlan: 'Administer [specific vaccine(s)] as per immunization schedule. Observe for 15-30 minutes post-vaccination.',
    patientInstructions: 'May experience mild pain/swelling at injection site, low-grade fever. Treat with paracetamol if needed. Apply cold compress to injection site.',
    followUpInstructions: 'Return as per immunization schedule for next vaccines. Seek immediate care if high fever, severe allergic reaction, or unusual symptoms develop.'
  },
  
  // Mental Health - Anxiety/Depression
  {
    id: 'mental-health-screening',
    name: 'Mental Health Screening',
    category: 'Mental Health',
    visitType: 'consultation',
    description: 'Template for anxiety/depression screening',
    chiefComplaint: 'Feeling anxious/depressed',
    historyOfPresentIllness: 'Patient reports [symptoms of anxiety/depression] for [duration]. [Impact on daily functioning, sleep, appetite, social activities]. [Suicidal ideation assessment].',
    generalAppearance: 'Appears [anxious/flat affect/tearful]',
    neurologicalSystem: 'Alert and oriented, no focal neurological deficits',
    assessment: 'Symptoms consistent with [anxiety disorder/depression]. [Severity assessment]. No immediate safety concerns/requires urgent intervention.',
    diagnosis: '[Generalized anxiety disorder/Major depressive disorder/Adjustment disorder]',
    treatmentPlan: 'Counseling, consider pharmacotherapy if indicated. Referral to mental health specialist. Safety planning. Lifestyle modifications including exercise, sleep hygiene, stress management.',
    patientInstructions: 'Follow up with counselor/psychiatrist as arranged. Practice stress management techniques. Maintain regular sleep schedule, exercise, and social connections.',
    followUpInstructions: 'Return in 2-4 weeks to assess treatment response. Seek immediate help if suicidal thoughts develop or crisis situation arises.'
  },
  // Malaria
  {
    id: 'malaria',
    name: 'Malaria',
    category: 'Infectious Disease',
    visitType: 'consultation',
    description: 'Template for suspected or confirmed malaria',
    chiefComplaint: 'Fever, chills, and body aches',
    historyOfPresentIllness: 'Patient presents with cyclical fever, chills, headache, and myalgia for [X] days. [Travel history to endemic areas]. [Previous malaria episodes].',
    generalAppearance: 'Febrile, appears ill',
    cardiovascularSystem: 'Tachycardia may be present',
    respiratorySystem: 'Clear lung fields',
    gastrointestinalSystem: 'May have hepatosplenomegaly',
    assessment: 'Clinical presentation consistent with malaria. Rapid diagnostic test [positive/negative/pending]. Microscopy [results].',
    diagnosis: 'Malaria - [P. falciparum/P. vivax/species pending]',
    treatmentPlan: 'Start antimalarial therapy per protocol: [Artemether-Lumefantrine/Quinine/as per guidelines]. Monitor for complications. Supportive care with antipyretics and hydration.',
    patientInstructions: 'Complete full course of antimalarials even if feeling better. Rest adequately, maintain hydration. Use mosquito nets. Take medications with food.',
    followUpInstructions: 'Return in 3 days for reassessment. Seek immediate care if severe symptoms develop: altered consciousness, severe anemia, respiratory distress.'
  },

  // Urinary Tract Infection
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    category: 'Infectious Disease',
    visitType: 'consultation',
    description: 'Template for urinary tract infection',
    chiefComplaint: 'Burning during urination and frequent urination',
    historyOfPresentIllness: 'Patient reports dysuria, urinary frequency, and urgency for [X] days. [Hematuria, suprapubic pain, fever]. [Previous UTI history].',
    generalAppearance: 'Alert, appears uncomfortable',
    gastrointestinalSystem: 'Suprapubic tenderness may be present. No costovertebral angle tenderness (uncomplicated UTI).',
    assessment: 'Clinical presentation consistent with lower urinary tract infection. Urinalysis shows [pyuria, hematuria, nitrites, bacteria].',
    diagnosis: 'Acute uncomplicated urinary tract infection',
    treatmentPlan: 'Antibiotics: [Nitrofurantoin/Ciprofloxacin/Trimethoprim-sulfamethoxazole] for [3-7] days. Increase oral fluids. Urinary analgesics if needed.',
    patientInstructions: 'Complete full antibiotic course. Drink 8-10 glasses of water daily. Urinate frequently, empty bladder completely. Avoid irritants (caffeine, alcohol). Wipe front to back.',
    followUpInstructions: 'Return if no improvement in 48 hours, fever develops, or symptoms worsen. Consider urine culture if recurrent infections.'
  },

  // Gastroenteritis/Diarrhea
  {
    id: 'gastroenteritis',
    name: 'Acute Gastroenteritis',
    category: 'Gastrointestinal',
    visitType: 'consultation',
    description: 'Template for acute gastroenteritis/diarrhea',
    chiefComplaint: 'Diarrhea and vomiting',
    historyOfPresentIllness: 'Patient presents with [acute watery/bloody] diarrhea, [X] episodes per day for [X] days. [Associated vomiting, fever, abdominal cramps]. [Food/water source, contacts with similar illness].',
    generalAppearance: 'Alert, [signs of dehydration: dry mucous membranes, decreased skin turgor, sunken eyes]',
    cardiovascularSystem: 'Normal heart sounds, [tachycardia if dehydrated]',
    gastrointestinalSystem: 'Abdomen soft, diffuse tenderness, hyperactive bowel sounds. No peritoneal signs.',
    assessment: 'Acute gastroenteritis, likely [viral/bacterial]. [Mild/Moderate/Severe] dehydration.',
    diagnosis: 'Acute gastroenteritis with [mild/moderate/severe] dehydration',
    treatmentPlan: 'Oral rehydration therapy with ORS. [IV fluids if severe dehydration]. Zinc supplementation (children). Probiotics. Avoid anti-diarrheals initially. [Antibiotics only if indicated].',
    patientInstructions: 'Drink ORS frequently, small sips if vomiting. Continue eating (BRAT diet if preferred). Maintain hand hygiene. Avoid dairy temporarily.',
    followUpInstructions: 'Return if severe dehydration signs, bloody diarrhea worsens, high fever, or no improvement in 48 hours.'
  },

  // Skin Infection/Cellulitis
  {
    id: 'cellulitis',
    name: 'Cellulitis/Skin Infection',
    category: 'Dermatology',
    visitType: 'consultation',
    description: 'Template for bacterial skin infection',
    chiefComplaint: 'Red, swollen, painful skin lesion',
    historyOfPresentIllness: 'Patient presents with [location] skin lesion that is red, warm, swollen, and tender for [X] days. [History of trauma, insect bite]. [Fever, spreading erythema].',
    generalAppearance: 'Alert, appears uncomfortable',
    musculoskeletalSystem: 'Affected area shows erythema, warmth, swelling, tenderness. [Measure and mark borders]. [Lymphangitis, lymphadenopathy].',
    assessment: 'Clinical features consistent with bacterial cellulitis. [Abscess formation present/absent].',
    diagnosis: 'Cellulitis of [location]',
    treatmentPlan: 'Oral antibiotics: [Flucloxacillin/Cephalexin/Clindamycin] for 7-10 days. Elevate affected limb. Warm compresses. [Incision and drainage if abscess present]. Mark borders to monitor progression.',
    patientInstructions: 'Take antibiotics as prescribed. Elevate limb when resting. Apply warm compresses. Keep area clean and dry. Watch for spreading redness.',
    followUpInstructions: 'Return in 48 hours to assess response. Seek immediate care if rapidly spreading, fever worsens, or severe pain develops.'
  },

  // Asthma Exacerbation
  {
    id: 'asthma-exacerbation',
    name: 'Asthma Exacerbation',
    category: 'Respiratory',
    visitType: 'consultation',
    description: 'Template for acute asthma attack',
    chiefComplaint: 'Difficulty breathing and wheezing',
    historyOfPresentIllness: 'Known asthmatic presents with worsening shortness of breath, wheezing, and cough for [X] days/hours. [Triggers: infection, allergens, poor compliance]. [Home medication use, previous hospitalizations].',
    generalAppearance: 'Respiratory distress, [able/unable] to speak in full sentences',
    respiratorySystem: 'Bilateral wheezing, prolonged expiration. [Use of accessory muscles]. Peak flow [value] ([%] of personal best). SpO2 [value]%.',
    assessment: '[Mild/Moderate/Severe/Life-threatening] asthma exacerbation based on clinical severity and peak flow.',
    diagnosis: 'Acute asthma exacerbation',
    treatmentPlan: 'Nebulized bronchodilators (salbutamol) [frequency]. Oral/IV corticosteroids. Oxygen if hypoxic. Monitor response. [Admit if severe/not responding].',
    patientInstructions: 'Use rescue inhaler as prescribed. Continue controller medications. Avoid triggers. Monitor peak flow at home. Keep inhaler technique correct.',
    followUpInstructions: 'Return to clinic in 3-5 days. Seek emergency care if worsening breathlessness, chest pain, or confusion develops.'
  },

  // Headache/Migraine
  {
    id: 'migraine',
    name: 'Migraine Headache',
    category: 'Neurology',
    visitType: 'consultation',
    description: 'Template for migraine presentation',
    chiefComplaint: 'Severe headache with nausea',
    historyOfPresentIllness: 'Patient presents with [unilateral/bilateral] throbbing headache of [X] hours/days duration. [Associated nausea, vomiting, photophobia, phonophobia, visual aura]. [Triggers, similar episodes].',
    generalAppearance: 'Appears uncomfortable, prefers dark quiet room',
    neurologicalSystem: 'Alert and oriented. Cranial nerves intact. No focal neurological deficits. No meningeal signs.',
    assessment: 'Clinical presentation consistent with migraine headache. No red flags for secondary headache.',
    diagnosis: 'Migraine [with/without] aura',
    treatmentPlan: 'Acute treatment: NSAIDs + antiemetic. [Consider triptan if severe]. Rest in dark quiet room. [Preventive therapy if frequent episodes].',
    patientInstructions: 'Take medications at onset of symptoms. Rest in dark room. Apply cold compress. Identify and avoid triggers. Maintain regular sleep and meals.',
    followUpInstructions: 'Return if headache pattern changes, neurological symptoms develop, or headaches become more frequent. Consider headache diary.'
  },

  // Conjunctivitis
  {
    id: 'conjunctivitis',
    name: 'Conjunctivitis (Pink Eye)',
    category: 'Ophthalmology',
    visitType: 'consultation',
    description: 'Template for eye infection',
    chiefComplaint: 'Red, itchy eyes with discharge',
    historyOfPresentIllness: 'Patient presents with [unilateral/bilateral] red eye, [watery/purulent] discharge, and [itching/irritation] for [X] days. [Contact lens use, recent upper respiratory infection, exposure to infected individuals].',
    generalAppearance: 'Alert, eyes appear inflamed',
    assessment: 'Conjunctival injection, [watery/mucopurulent] discharge. [Viral/Bacterial/Allergic] features. Vision normal. No corneal involvement.',
    diagnosis: '[Viral/Bacterial/Allergic] conjunctivitis',
    treatmentPlan: '[Bacterial: Antibiotic eye drops/ointment]. [Viral: Supportive care]. [Allergic: Antihistamine drops]. Cool compresses. Good hygiene.',
    patientInstructions: 'Apply eye drops as prescribed. Avoid touching eyes. Wash hands frequently. Use separate towels. Avoid contact lenses until resolved. Clean discharge with clean water.',
    followUpInstructions: 'Return if no improvement in 3-4 days, vision changes, severe pain, or light sensitivity develops.'
  },

  // Sprains/Strains
  {
    id: 'ankle-sprain',
    name: 'Ankle Sprain',
    category: 'Orthopedics',
    visitType: 'consultation',
    description: 'Template for ankle sprain/soft tissue injury',
    chiefComplaint: 'Ankle pain and swelling after injury',
    historyOfPresentIllness: 'Patient sustained ankle injury [mechanism] [X] hours/days ago. [Immediate swelling, ability to weight bear, previous injuries].',
    generalAppearance: 'Alert, limping or using crutches',
    musculoskeletalSystem: '[Location] swelling, tenderness, ecchymosis. [Able/Unable] to weight bear. [Range of motion assessment]. Ottawa ankle rules [applied].',
    assessment: '[Mild/Moderate/Severe] ankle sprain. [X-ray indicated/not indicated based on Ottawa rules].',
    diagnosis: 'Ankle sprain, [Grade I/II/III]',
    treatmentPlan: 'RICE protocol: Rest, Ice, Compression, Elevation. NSAIDs for pain. [Crutches/ankle brace if severe]. Gradual weight-bearing as tolerated. Physiotherapy.',
    patientInstructions: 'Rest ankle, apply ice 20 min every 2-3 hours. Use compression bandage. Elevate above heart level. Avoid weight-bearing initially. Start gentle exercises after 48 hours.',
    followUpInstructions: 'Return in 7-10 days or if severe pain, inability to bear weight, or no improvement.'
  },

  // Allergic Reaction
  {
    id: 'allergic-reaction',
    name: 'Allergic Reaction',
    category: 'Allergy/Immunology',
    visitType: 'consultation',
    description: 'Template for non-anaphylactic allergic reaction',
    chiefComplaint: 'Skin rash and itching',
    historyOfPresentIllness: 'Patient developed [urticaria/rash] and itching [X] hours after [food/medication/insect bite/unknown exposure]. [Progression, associated symptoms]. No respiratory distress or angioedema.',
    generalAppearance: 'Alert, scratching, appears uncomfortable',
    assessment: 'Urticarial rash consistent with allergic reaction. No signs of anaphylaxis. Vital signs stable.',
    diagnosis: 'Allergic reaction [to identified allergen]',
    treatmentPlan: 'Oral antihistamine (cetirizine/loratadine). [Topical corticosteroid if needed]. Remove/avoid allergen. Monitor for progression. [Oral corticosteroid if severe].',
    patientInstructions: 'Take antihistamines as prescribed. Avoid identified allergen. Cool compress for itching. Watch for worsening symptoms.',
    followUpInstructions: 'Seek immediate care if difficulty breathing, swelling of face/tongue, dizziness develops (signs of anaphylaxis). Return if rash worsens or persists beyond 72 hours.'
  },

  // Back Pain
  {
    id: 'low-back-pain',
    name: 'Acute Low Back Pain',
    category: 'Orthopedics',
    visitType: 'consultation',
    description: 'Template for non-specific low back pain',
    chiefComplaint: 'Lower back pain',
    historyOfPresentIllness: 'Patient presents with [acute/chronic] low back pain for [X] days/weeks. [Mechanism of injury if any]. Pain is [localized/radiating]. [Red flags assessed: trauma, fever, weight loss, neurological symptoms, bowel/bladder dysfunction].',
    generalAppearance: 'Alert, moving cautiously',
    musculoskeletalSystem: 'Tenderness over [location]. [Paraspinal muscle spasm]. Normal straight leg raise. No neurological deficits. Normal gait.',
    neurologicalSystem: 'Lower extremity strength 5/5. Sensation intact. Reflexes normal.',
    assessment: 'Acute mechanical low back pain. No red flags present.',
    diagnosis: 'Acute non-specific low back pain/lumbar strain',
    treatmentPlan: 'NSAIDs, muscle relaxants if needed. Advise continuation of normal activities as tolerated. Avoid bed rest. Heat therapy. Physiotherapy referral. [Imaging not indicated at this stage].',
    patientInstructions: 'Stay active, avoid prolonged bed rest. Use proper lifting techniques. Apply heat. Take medications as prescribed. Gentle stretching exercises.',
    followUpInstructions: 'Return if red flags develop: leg weakness, numbness, bowel/bladder problems, or no improvement in 4-6 weeks.'
  },

  // Pneumonia
  {
    id: 'pneumonia',
    name: 'Community-Acquired Pneumonia',
    category: 'Respiratory',
    visitType: 'consultation',
    description: 'Template for pneumonia',
    chiefComplaint: 'Cough with fever and difficulty breathing',
    historyOfPresentIllness: 'Patient presents with productive cough, fever, and dyspnea for [X] days. [Sputum characteristics, pleuritic chest pain, rigors]. [Risk factors: age, comorbidities, smoking].',
    generalAppearance: 'Appears acutely ill, [respiratory distress/tachypneic]',
    respiratorySystem: 'Decreased breath sounds [location], crackles, bronchial breathing. Dull to percussion. Respiratory rate [value]. SpO2 [value]%.',
    assessment: 'Clinical and [radiological] findings consistent with pneumonia. CURB-65 score: [value]. [Severity assessment].',
    diagnosis: 'Community-acquired pneumonia, [lobar/bronchopneumonia]',
    treatmentPlan: 'Antibiotics: [Amoxicillin/Amoxicillin-clavulanate/Azithromycin/Ceftriaxone] based on severity. Antipyretics, analgesics. Oxygen if hypoxic. Hydration. [Outpatient vs admission decision based on CURB-65].',
    patientInstructions: 'Complete full antibiotic course. Rest adequately. Maintain hydration. Monitor temperature. Deep breathing exercises. Avoid smoking.',
    followUpInstructions: 'Return in 48-72 hours if not improving. Seek immediate care if worsening breathlessness, confusion, or chest pain. Follow-up chest X-ray in 6 weeks if >50 years or smoker.'
  },

  // Eczema/Dermatitis
  {
    id: 'eczema',
    name: 'Atopic Dermatitis/Eczema',
    category: 'Dermatology',
    visitType: 'consultation',
    description: 'Template for eczema/atopic dermatitis',
    chiefComplaint: 'Itchy, dry skin rash',
    historyOfPresentIllness: 'Patient presents with [acute flare/chronic] itchy rash affecting [locations] for [X] duration. [Triggers, previous episodes, personal/family history of atopy]. [Impact on sleep, quality of life].',
    generalAppearance: 'Alert, actively scratching',
    assessment: 'Erythematous, dry, scaly patches with excoriations. [Distribution pattern consistent with atopic dermatitis]. [Lichenification in chronic cases]. [Secondary infection present/absent].',
    diagnosis: 'Atopic dermatitis/Eczema [mild/moderate/severe]',
    treatmentPlan: 'Emollients (frequent application). Topical corticosteroids [potency based on location/severity]. [Oral antihistamines for itch]. Avoid triggers. [Oral antibiotics if secondarily infected]. Wet wrap therapy if severe.',
    patientInstructions: 'Apply moisturizer frequently (at least twice daily). Use prescribed steroid cream on affected areas only. Avoid hot showers, harsh soaps. Identify and avoid triggers. Keep nails short. Use cotton clothing.',
    followUpInstructions: 'Return in 2 weeks to assess response. Return sooner if signs of infection (weeping, crusting, fever) develop.'
  },


];

// Get templates by category
export function getTemplatesByCategory(category: string): VisitTemplate[] {
  return visitTemplates.filter(template => template.category === category);
}

// Get all categories
export function getAllCategories(): string[] {
  const categories = new Set(visitTemplates.map(template => template.category));
  return Array.from(categories).sort();
}

// Get template by ID
export function getTemplateById(id: string): VisitTemplate | undefined {
  return visitTemplates.find(template => template.id === id);
}

// Search templates
export function searchTemplates(query: string): VisitTemplate[] {
  const lowerQuery = query.toLowerCase();
  return visitTemplates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.category.toLowerCase().includes(lowerQuery)
  );
}

