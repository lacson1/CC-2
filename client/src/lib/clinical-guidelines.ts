export interface ClinicalGuideline {
  id: string;
  title: string;
  category: string;
  condition: string;
  summary: string;
  diagnosis: {
    criteria: string[];
    investigations: string[];
  };
  treatment: {
    firstLine: string[];
    secondLine?: string[];
    duration?: string;
    contraindications?: string[];
  };
  management: string[];
  referralCriteria?: string[];
  followUp?: string;
  sources: string[];
  lastUpdated: string;
}

export const clinicalGuidelines: ClinicalGuideline[] = [
  {
    id: 'malaria-treatment',
    title: 'Malaria Treatment Guidelines',
    category: 'Infectious Disease',
    condition: 'Malaria',
    summary: 'WHO guidelines for uncomplicated and severe malaria treatment',
    diagnosis: {
      criteria: [
        'Fever + positive RDT or microscopy',
        'Recent travel to endemic area',
        'Clinical signs: fever, chills, headache, myalgia'
      ],
      investigations: [
        'Malaria RDT (rapid diagnostic test)',
        'Thick and thin blood smears',
        'Complete blood count',
        'If severe: Blood glucose, renal function, liver function'
      ]
    },
    treatment: {
      firstLine: [
        'Uncomplicated P. falciparum: Artemether-Lumefantrine (20/120mg) for 3 days',
        'Adult dosing: 4 tablets twice daily for 3 days',
        'Pediatric: Based on weight bands'
      ],
      secondLine: [
        'Artesunate + Amodiaquine',
        'Dihydroartemisinin-Piperaquine',
        'Severe malaria: IV Artesunate 2.4mg/kg at 0, 12, 24h then daily'
      ],
      duration: '3 days for uncomplicated, 7 days total for severe',
      contraindications: [
        'First trimester pregnancy (use quinine)',
        'Known hypersensitivity to artemisinin derivatives'
      ]
    },
    management: [
      'Ensure patient takes full course with food',
      'Antipyretics for fever (paracetamol)',
      'Maintain hydration',
      'Monitor for danger signs',
      'Prevent mosquito bites'
    ],
    referralCriteria: [
      'Signs of severe malaria: altered consciousness, convulsions, respiratory distress',
      'Severe anemia (Hb <5g/dL)',
      'Hypoglycemia',
      'Acute renal failure',
      'Pregnant women with complications'
    ],
    followUp: 'Review on day 3, 7, 14, 28. Repeat RDT if symptoms persist.',
    sources: ['WHO Malaria Treatment Guidelines 2021'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'hypertension-management',
    title: 'Hypertension Management Guidelines',
    category: 'Cardiovascular',
    condition: 'Hypertension',
    summary: 'Evidence-based approach to diagnosing and managing hypertension',
    diagnosis: {
      criteria: [
        'BP ≥140/90 mmHg on 2+ separate occasions',
        'Or confirmed by ambulatory BP monitoring',
        'Exclude white coat hypertension'
      ],
      investigations: [
        'Baseline: Fasting glucose, lipid profile, electrolytes, creatinine, urinalysis',
        'ECG (check for LVH)',
        'Fundoscopy if indicated',
        'Cardiovascular risk assessment'
      ]
    },
    treatment: {
      firstLine: [
        'Lifestyle modifications for all patients',
        'Age <55 or diabetic: ACE inhibitor or ARB (e.g., Lisinopril 10mg daily)',
        'Age ≥55 or Afro-Caribbean: Calcium channel blocker (e.g., Amlodipine 5mg daily)',
        'Consider low-dose thiazide diuretic'
      ],
      secondLine: [
        'Combination therapy: ACEi/ARB + CCB',
        'Or ACEi/ARB + thiazide diuretic',
        'Resistant HTN: Add spironolactone or beta-blocker'
      ],
      duration: 'Lifelong unless contraindicated'
    },
    management: [
      'Lifestyle: Weight loss, DASH diet, reduce salt intake (<5g/day)',
      'Regular exercise (150min/week moderate intensity)',
      'Limit alcohol, stop smoking',
      'Home BP monitoring',
      'Manage cardiovascular risk factors'
    ],
    referralCriteria: [
      'Resistant hypertension (uncontrolled on 3+ drugs)',
      'Secondary hypertension suspected',
      'Hypertensive emergency (BP >180/120 with organ damage)',
      'Age <40 with no risk factors'
    ],
    followUp: 'Monthly until controlled, then 3-6 monthly. Annual bloods and cardiovascular risk review.',
    sources: ['ESC/ESH 2023 Guidelines', 'NICE Hypertension Guidelines'],
    lastUpdated: '2024-02-01'
  },
  {
    id: 'diabetes-t2dm',
    title: 'Type 2 Diabetes Management',
    category: 'Endocrinology',
    condition: 'Type 2 Diabetes Mellitus',
    summary: 'Comprehensive management of Type 2 Diabetes',
    diagnosis: {
      criteria: [
        'HbA1c ≥6.5% (48 mmol/mol)',
        'Fasting glucose ≥126mg/dL (7.0 mmol/L)',
        'Random glucose ≥200mg/dL with symptoms',
        '2-hour OGTT glucose ≥200mg/dL'
      ],
      investigations: [
        'HbA1c, fasting glucose',
        'Lipid profile, renal function, liver function',
        'Urinary albumin:creatinine ratio',
        'Retinal screening',
        'Foot examination'
      ]
    },
    treatment: {
      firstLine: [
        'Metformin 500mg OD, increase to 1000mg BD as tolerated',
        'Target HbA1c: 53mmol/mol (7%) initially',
        'Diet and lifestyle modifications essential'
      ],
      secondLine: [
        'Add SGLT2 inhibitor (cardiovascular/renal benefit)',
        'Or GLP-1 agonist (weight loss, CV benefit)',
        'Or DPP4 inhibitor',
        'Consider insulin if HbA1c >75mmol/mol'
      ],
      contraindications: [
        'Metformin: eGFR <30, metabolic acidosis',
        'SGLT2i: Type 1 diabetes, DKA risk'
      ]
    },
    management: [
      'Structured education program',
      'Dietary advice: Low GI, portion control',
      'Weight loss if BMI >25',
      'Regular exercise 150min/week',
      'Self-monitoring of blood glucose',
      'Annual review: feet, eyes, kidneys, CV risk'
    ],
    referralCriteria: [
      'Unable to achieve glycemic targets',
      'Suspicion of Type 1 or MODY',
      'Pregnancy or planning pregnancy',
      'Severe complications',
      'Recurrent hypoglycemia'
    ],
    followUp: '3-6 monthly HbA1c, annual comprehensive review',
    sources: ['ADA Standards of Care 2024', 'NICE Diabetes Guidelines'],
    lastUpdated: '2024-01-10'
  },
  {
    id: 'copd-management',
    title: 'COPD Management Guidelines',
    category: 'Respiratory',
    condition: 'Chronic Obstructive Pulmonary Disease',
    summary: 'Evidence-based management of stable and acute COPD',
    diagnosis: {
      criteria: [
        'Post-bronchodilator FEV1/FVC <0.7',
        'Typical symptoms: dyspnea, chronic cough, sputum production',
        'Risk factors: smoking, occupational exposure'
      ],
      investigations: [
        'Spirometry with bronchodilator reversibility',
        'Chest X-ray',
        'Consider: FBC, BMI, oxygen saturation, CT chest if indicated'
      ]
    },
    treatment: {
      firstLine: [
        'Smoking cessation - most important intervention',
        'SABA or SAMA prn for symptom relief',
        'LABA or LAMA for persistent symptoms',
        'Pneumococcal and annual influenza vaccines'
      ],
      secondLine: [
        'LABA + LAMA combination for severe symptoms',
        'Add ICS if frequent exacerbations (≥2/year)',
        'LABA+LAMA+ICS triple therapy if inadequate control',
        'Consider theophylline, carbocysteine if refractory'
      ],
      duration: 'Lifelong maintenance therapy'
    },
    management: [
      'Pulmonary rehabilitation if MRC grade ≥3',
      'Nutritional support if underweight',
      'Long-term oxygen if chronic hypoxemia',
      'Manage comorbidities',
      'Self-management education and action plan'
    ],
    referralCriteria: [
      'Diagnostic uncertainty',
      'Severe COPD (FEV1 <30%)',
      'Frequent exacerbations despite treatment',
      'Cor pulmonale',
      'Assessment for oxygen/non-invasive ventilation'
    ],
    followUp: 'Review 3 months after diagnosis, then annually or sooner if exacerbations',
    sources: ['GOLD 2024 Guidelines'],
    lastUpdated: '2024-03-01'
  },
  {
    id: 'uti-treatment',
    title: 'Urinary Tract Infection Treatment',
    category: 'Infectious Disease',
    condition: 'Uncomplicated UTI',
    summary: 'Antibiotic treatment for uncomplicated lower UTI',
    diagnosis: {
      criteria: [
        'Dysuria, frequency, urgency',
        'Suprapubic pain',
        'No fever, flank pain, or systemic symptoms',
        'Positive urine dipstick (nitrites, leukocytes)'
      ],
      investigations: [
        'Urine dipstick',
        'Urine culture if: pregnant, male, recurrent UTI, no improvement',
        'Consider STI screening if appropriate'
      ]
    },
    treatment: {
      firstLine: [
        'Nitrofurantoin 100mg BD for 3 days (women)',
        'Or Trimethoprim 200mg BD for 3 days',
        'Men: 7 days treatment',
        'Pregnant: 7 days nitrofurantoin or cephalexin'
      ],
      secondLine: [
        'Fosfomycin 3g single dose',
        'Ciprofloxacin 500mg BD for 3 days (reserve for resistant cases)'
      ],
      contraindications: [
        'Nitrofurantoin: eGFR <45, term pregnancy',
        'Trimethoprim: first trimester pregnancy, folate deficiency'
      ]
    },
    management: [
      'Increase fluid intake',
      'Urinary alkalinizers for symptom relief',
      'Cranberry products may help prevent recurrence',
      'Good perineal hygiene',
      'Post-coital voiding if recurrent UTI'
    ],
    referralCriteria: [
      'Recurrent UTI (≥3 in 12 months)',
      'Suspected pyelonephritis',
      'Men with recurrent UTI',
      'Structural abnormality suspected',
      'Immunocompromised'
    ],
    followUp: 'No routine follow-up if resolved. Return if no improvement in 48 hours.',
    sources: ['IDSA UTI Guidelines'],
    lastUpdated: '2024-01-20'
  }
];

export function searchGuidelines(query: string): ClinicalGuideline[] {
  const lowerQuery = query.toLowerCase();
  return clinicalGuidelines.filter(guideline => 
    guideline.title.toLowerCase().includes(lowerQuery) ||
    guideline.condition.toLowerCase().includes(lowerQuery) ||
    guideline.category.toLowerCase().includes(lowerQuery) ||
    guideline.summary.toLowerCase().includes(lowerQuery)
  );
}

export function getGuidelinesByCategory(category: string): ClinicalGuideline[] {
  return clinicalGuidelines.filter(g => g.category === category);
}

export function getGuidelineById(id: string): ClinicalGuideline | undefined {
  return clinicalGuidelines.find(g => g.id === id);
}

export function getAllCategories(): string[] {
  const categories = new Set(clinicalGuidelines.map(g => g.category));
  return Array.from(categories).sort();
}
