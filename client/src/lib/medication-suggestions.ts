// Smart medication suggestions based on diagnosis
export interface MedicationSuggestion {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    category: string;
}

export interface DiagnosisMedicationMap {
    diagnosis: string;
    keywords: string[];
    medications: MedicationSuggestion[];
    instructions?: string;
}

export const diagnosisMedicationSuggestions: DiagnosisMedicationMap[] = [
    {
        diagnosis: "Upper Respiratory Tract Infection (URTI)",
        keywords: ["urti", "cold", "common cold", "rhinitis", "pharyngitis", "sore throat", "cough"],
        medications: [
            {
                name: "Paracetamol",
                dosage: "500-1000mg",
                frequency: "Every 6-8 hours",
                duration: "3-5 days",
                route: "Oral",
                category: "Analgesic/Antipyretic"
            },
            {
                name: "Cetirizine",
                dosage: "10mg",
                frequency: "Once daily",
                duration: "5-7 days",
                route: "Oral",
                category: "Antihistamine"
            },
            {
                name: "Vitamin C",
                dosage: "500mg",
                frequency: "Twice daily",
                duration: "7 days",
                route: "Oral",
                category: "Supplement"
            }
        ],
        instructions: "Symptomatic treatment. No antibiotics needed unless bacterial infection suspected."
    },
    {
        diagnosis: "Hypertension",
        keywords: ["hypertension", "high blood pressure", "htn", "elevated bp"],
        medications: [
            {
                name: "Amlodipine",
                dosage: "5-10mg",
                frequency: "Once daily",
                duration: "Ongoing",
                route: "Oral",
                category: "Calcium Channel Blocker"
            },
            {
                name: "Lisinopril",
                dosage: "10-20mg",
                frequency: "Once daily",
                duration: "Ongoing",
                route: "Oral",
                category: "ACE Inhibitor"
            },
            {
                name: "Hydrochlorothiazide",
                dosage: "12.5-25mg",
                frequency: "Once daily",
                duration: "Ongoing",
                route: "Oral",
                category: "Diuretic"
            }
        ],
        instructions: "Lifestyle modifications essential. Monitor blood pressure regularly."
    },
    {
        diagnosis: "Type 2 Diabetes Mellitus",
        keywords: ["diabetes", "t2dm", "type 2 diabetes", "hyperglycemia", "high blood sugar"],
        medications: [
            {
                name: "Metformin",
                dosage: "500-1000mg",
                frequency: "Twice daily with meals",
                duration: "Ongoing",
                route: "Oral",
                category: "Biguanide"
            },
            {
                name: "Glimepiride",
                dosage: "1-2mg",
                frequency: "Once daily before breakfast",
                duration: "Ongoing",
                route: "Oral",
                category: "Sulfonylurea"
            }
        ],
        instructions: "Diet and exercise crucial. Monitor blood glucose regularly."
    },
    {
        diagnosis: "Acute Gastroenteritis",
        keywords: ["gastroenteritis", "diarrhea", "vomiting", "stomach flu", "food poisoning"],
        medications: [
            {
                name: "ORS (Oral Rehydration Solution)",
                dosage: "200-400ml",
                frequency: "After each loose stool",
                duration: "Until diarrhea stops",
                route: "Oral",
                category: "Rehydration"
            },
            {
                name: "Ondansetron",
                dosage: "4-8mg",
                frequency: "Every 8 hours as needed",
                duration: "1-2 days",
                route: "Oral",
                category: "Antiemetic"
            },
            {
                name: "Probiotics",
                dosage: "As directed",
                frequency: "Twice daily",
                duration: "5-7 days",
                route: "Oral",
                category: "Probiotic"
            },
            {
                name: "Zinc sulfate",
                dosage: "20mg",
                frequency: "Once daily",
                duration: "10-14 days",
                route: "Oral",
                category: "Supplement"
            }
        ],
        instructions: "Hydration is key. Avoid solid foods initially, bland diet as tolerated."
    },
    {
        diagnosis: "Musculoskeletal Pain",
        keywords: ["back pain", "neck pain", "joint pain", "muscle pain", "strain", "sprain", "arthritis"],
        medications: [
            {
                name: "Ibuprofen",
                dosage: "400-600mg",
                frequency: "Every 6-8 hours with food",
                duration: "5-7 days",
                route: "Oral",
                category: "NSAID"
            },
            {
                name: "Diclofenac gel",
                dosage: "Apply to affected area",
                frequency: "3-4 times daily",
                duration: "7-10 days",
                route: "Topical",
                category: "Topical NSAID"
            },
            {
                name: "Methocarbamol",
                dosage: "750-1500mg",
                frequency: "3-4 times daily",
                duration: "3-5 days",
                route: "Oral",
                category: "Muscle Relaxant"
            }
        ],
        instructions: "Rest, ice/heat therapy, gentle stretching. Physical therapy if persistent."
    },
    {
        diagnosis: "Allergic Rhinitis",
        keywords: ["allergic rhinitis", "hay fever", "allergies", "nasal allergy", "seasonal allergy"],
        medications: [
            {
                name: "Loratadine",
                dosage: "10mg",
                frequency: "Once daily",
                duration: "As needed",
                route: "Oral",
                category: "Antihistamine"
            },
            {
                name: "Fluticasone nasal spray",
                dosage: "2 sprays per nostril",
                frequency: "Once daily",
                duration: "As needed",
                route: "Nasal",
                category: "Nasal Corticosteroid"
            },
            {
                name: "Pseudoephedrine",
                dosage: "60mg",
                frequency: "Every 4-6 hours",
                duration: "3-5 days",
                route: "Oral",
                category: "Decongestant"
            }
        ],
        instructions: "Avoid allergen triggers. Consider allergy testing if symptoms persistent."
    },
    {
        diagnosis: "Urinary Tract Infection",
        keywords: ["uti", "urinary tract infection", "cystitis", "dysuria", "bladder infection"],
        medications: [
            {
                name: "Nitrofurantoin",
                dosage: "100mg",
                frequency: "Twice daily",
                duration: "5-7 days",
                route: "Oral",
                category: "Antibiotic"
            },
            {
                name: "Trimethoprim-Sulfamethoxazole",
                dosage: "160/800mg",
                frequency: "Twice daily",
                duration: "3 days",
                route: "Oral",
                category: "Antibiotic"
            },
            {
                name: "Phenazopyridine",
                dosage: "200mg",
                frequency: "Three times daily",
                duration: "2 days",
                route: "Oral",
                category: "Urinary Analgesic"
            }
        ],
        instructions: "Increase fluid intake. Complete full course of antibiotics."
    },
    {
        diagnosis: "Asthma",
        keywords: ["asthma", "bronchial asthma", "wheezing", "bronchospasm"],
        medications: [
            {
                name: "Salbutamol inhaler",
                dosage: "2 puffs",
                frequency: "Every 4-6 hours as needed",
                duration: "Ongoing (rescue)",
                route: "Inhalation",
                category: "Bronchodilator"
            },
            {
                name: "Beclomethasone inhaler",
                dosage: "2 puffs",
                frequency: "Twice daily",
                duration: "Ongoing (controller)",
                route: "Inhalation",
                category: "Inhaled Corticosteroid"
            },
            {
                name: "Montelukast",
                dosage: "10mg",
                frequency: "Once daily at bedtime",
                duration: "Ongoing",
                route: "Oral",
                category: "Leukotriene Modifier"
            }
        ],
        instructions: "Avoid triggers. Use spacer with inhaler. Monitor peak flow."
    },
    {
        diagnosis: "Migraine",
        keywords: ["migraine", "severe headache", "headache"],
        medications: [
            {
                name: "Sumatriptan",
                dosage: "50-100mg",
                frequency: "At onset of migraine",
                duration: "As needed",
                route: "Oral",
                category: "Triptan"
            },
            {
                name: "Ibuprofen",
                dosage: "400-600mg",
                frequency: "Every 6-8 hours",
                duration: "As needed",
                route: "Oral",
                category: "NSAID"
            },
            {
                name: "Metoclopramide",
                dosage: "10mg",
                frequency: "With pain medication",
                duration: "As needed",
                route: "Oral",
                category: "Antiemetic"
            }
        ],
        instructions: "Identify and avoid triggers. Rest in dark, quiet room during attacks."
    },
    {
        diagnosis: "Anxiety Disorder",
        keywords: ["anxiety", "gad", "panic", "nervousness", "anxious"],
        medications: [
            {
                name: "Sertraline",
                dosage: "25-50mg",
                frequency: "Once daily",
                duration: "Ongoing",
                route: "Oral",
                category: "SSRI"
            },
            {
                name: "Propranolol",
                dosage: "10-40mg",
                frequency: "As needed for symptoms",
                duration: "As needed",
                route: "Oral",
                category: "Beta Blocker"
            },
            {
                name: "Buspirone",
                dosage: "5-10mg",
                frequency: "Twice daily",
                duration: "Ongoing",
                route: "Oral",
                category: "Anxiolytic"
            }
        ],
        instructions: "Therapy recommended alongside medication. Avoid alcohol and caffeine."
    },
    {
        diagnosis: "Depression",
        keywords: ["depression", "major depressive disorder", "mdd", "depressed", "low mood"],
        medications: [
            {
                name: "Escitalopram",
                dosage: "10-20mg",
                frequency: "Once daily",
                duration: "Ongoing",
                route: "Oral",
                category: "SSRI"
            },
            {
                name: "Fluoxetine",
                dosage: "20-40mg",
                frequency: "Once daily in morning",
                duration: "Ongoing",
                route: "Oral",
                category: "SSRI"
            },
            {
                name: "Mirtazapine",
                dosage: "15-30mg",
                frequency: "Once daily at bedtime",
                duration: "Ongoing",
                route: "Oral",
                category: "Tetracyclic Antidepressant"
            }
        ],
        instructions: "Counseling/therapy strongly recommended. Monitor for suicidal ideation."
    },
    {
        diagnosis: "Pneumonia",
        keywords: ["pneumonia", "lung infection", "chest infection"],
        medications: [
            {
                name: "Amoxicillin-Clavulanate",
                dosage: "875/125mg",
                frequency: "Twice daily",
                duration: "7-10 days",
                route: "Oral",
                category: "Antibiotic"
            },
            {
                name: "Azithromycin",
                dosage: "500mg",
                frequency: "Once daily",
                duration: "5 days",
                route: "Oral",
                category: "Antibiotic"
            },
            {
                name: "Paracetamol",
                dosage: "500-1000mg",
                frequency: "Every 6 hours",
                duration: "5-7 days",
                route: "Oral",
                category: "Antipyretic"
            }
        ],
        instructions: "Rest, hydration essential. Follow up if symptoms worsen or persist."
    }
];

// Get medication suggestions based on diagnosis
export function getMedicationSuggestions(diagnosis: string): MedicationSuggestion[] {
    if (!diagnosis) return [];

    const lowerDiagnosis = diagnosis.toLowerCase();

    // Find matching diagnosis
    const match = diagnosisMedicationSuggestions.find(item =>
        item.keywords.some(keyword => lowerDiagnosis.includes(keyword))
    );

    return match ? match.medications : [];
}

// Get treatment instructions based on diagnosis
export function getTreatmentInstructions(diagnosis: string): string | undefined {
    if (!diagnosis) return undefined;

    const lowerDiagnosis = diagnosis.toLowerCase();

    const match = diagnosisMedicationSuggestions.find(item =>
        item.keywords.some(keyword => lowerDiagnosis.includes(keyword))
    );

    return match?.instructions;
}

// Get all available diagnosis patterns
export function getAllDiagnosisPatterns(): string[] {
    return diagnosisMedicationSuggestions.map(item => item.diagnosis);
}

// Format medication for display
export function formatMedication(med: MedicationSuggestion): string {
    return `${med.name} ${med.dosage} ${med.frequency} for ${med.duration}`;
}

