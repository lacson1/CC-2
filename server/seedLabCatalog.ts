import { db } from './db';
import { labTests, labDepartments, labPanels, labPanelTests, LabDepartment, LabTest, LabPanel } from '../shared/schema';

export async function seedLabCatalog() {
  console.log('Starting lab catalog seeding...');

  const departments = await db.insert(labDepartments).values([
    { name: 'Hematology', code: 'HEM', description: 'Blood and blood-forming tissues', isActive: true },
    { name: 'Clinical Chemistry', code: 'CHEM', description: 'Chemical analysis of blood and body fluids', isActive: true },
    { name: 'Microbiology', code: 'MICRO', description: 'Infectious diseases and culture', isActive: true },
    { name: 'Immunology', code: 'IMMUNO', description: 'Immune system and antibodies', isActive: true },
    { name: 'Molecular Diagnostics', code: 'MOLEC', description: 'DNA/RNA and genetic testing', isActive: true },
    { name: 'Serology', code: 'SERO', description: 'Blood serum analysis', isActive: true },
    { name: 'Urinalysis', code: 'URINE', description: 'Urine analysis', isActive: true },
    { name: 'Coagulation', code: 'COAG', description: 'Blood clotting studies', isActive: true },
  ]).returning();

  console.log(`Seeded ${departments.length} lab departments`);

  const deptMap = departments.reduce((acc: Record<string, number>, dept: LabDepartment) => {
    if (dept.code) {
      acc[dept.code] = dept.id;
    }
    return acc;
  }, {} as Record<string, number>);

  const tests = await db.insert(labTests).values([
    // Hematology Tests (Complete Blood Count Panel)
    { name: 'Complete Blood Count (CBC)', code: 'CBC', loincCode: '58410-2', category: 'Hematology', referenceRange: 'See individual components', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '3500.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Hemoglobin', code: 'HGB', loincCode: '718-7', category: 'Hematology', referenceRange: 'M: 13.5-17.5 g/dL, F: 12.0-15.5 g/dL', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Hematocrit', code: 'HCT', loincCode: '4544-3', category: 'Hematology', referenceRange: 'M: 38.8-50.0%, F: 34.9-44.5%', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'White Blood Cell Count', code: 'WBC', loincCode: '6690-2', category: 'Hematology', referenceRange: '4.5-11.0 x10^9/L', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Platelet Count', code: 'PLT', loincCode: '777-3', category: 'Hematology', referenceRange: '150-400 x10^9/L', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Red Blood Cell Count', code: 'RBC', loincCode: '789-8', category: 'Hematology', referenceRange: 'M: 4.5-5.9 x10^12/L, F: 4.1-5.1 x10^12/L', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Mean Corpuscular Volume (MCV)', code: 'MCV', loincCode: '787-2', category: 'Hematology', referenceRange: '80-100 fL', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1000.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Mean Corpuscular Hemoglobin (MCH)', code: 'MCH', loincCode: '785-6', category: 'Hematology', referenceRange: '27-31 pg', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1000.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Mean Corpuscular Hemoglobin Concentration (MCHC)', code: 'MCHC', loincCode: '786-4', category: 'Hematology', referenceRange: '32-36 g/dL', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '2-4 hours', cost: '1000.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Reticulocyte Count', code: 'RETIC', loincCode: '4679-7', category: 'Hematology', referenceRange: '0.5-2.5%', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '4-6 hours', cost: '2500.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Erythrocyte Sedimentation Rate (ESR)', code: 'ESR', loincCode: '4537-7', category: 'Hematology', referenceRange: 'M: 0-15 mm/hr, F: 0-20 mm/hr', sampleType: 'Whole Blood (Citrate)', preparationInstructions: 'No fasting required', estimatedTime: '1-2 hours', cost: '1500.00', departmentId: deptMap['HEM'], isActive: true },

    // Clinical Chemistry - Basic Metabolic Panel (BMP)
    { name: 'Basic Metabolic Panel (BMP)', code: 'BMP', loincCode: '24320-4', category: 'Chemistry', referenceRange: 'See individual components', sampleType: 'Serum', preparationInstructions: '8-12 hour fasting preferred', estimatedTime: '2-4 hours', cost: '5000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Glucose, Fasting', code: 'GLU', loincCode: '1558-6', category: 'Chemistry', referenceRange: '70-100 mg/dL', sampleType: 'Serum/Plasma', preparationInstructions: '8-12 hour fasting required', estimatedTime: '1-2 hours', cost: '800.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Blood Urea Nitrogen (BUN)', code: 'BUN', loincCode: '3094-0', category: 'Chemistry', referenceRange: '7-20 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Creatinine', code: 'CREAT', loincCode: '2160-0', category: 'Chemistry', referenceRange: 'M: 0.7-1.3 mg/dL, F: 0.6-1.1 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Sodium', code: 'NA', loincCode: '2951-2', category: 'Chemistry', referenceRange: '136-145 mmol/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Potassium', code: 'K', loincCode: '2823-3', category: 'Chemistry', referenceRange: '3.5-5.0 mmol/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Chloride', code: 'CL', loincCode: '2075-0', category: 'Chemistry', referenceRange: '98-106 mmol/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Bicarbonate (CO2)', code: 'CO2', loincCode: '2028-9', category: 'Chemistry', referenceRange: '23-29 mmol/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Calcium', code: 'CA', loincCode: '17861-6', category: 'Chemistry', referenceRange: '8.5-10.5 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['CHEM'], isActive: true },

    // Comprehensive Metabolic Panel (CMP)
    { name: 'Comprehensive Metabolic Panel (CMP)', code: 'CMP', loincCode: '24323-8', category: 'Chemistry', referenceRange: 'See individual components', sampleType: 'Serum', preparationInstructions: '8-12 hour fasting required', estimatedTime: '2-4 hours', cost: '7000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Total Protein', code: 'TP', loincCode: '2885-2', category: 'Chemistry', referenceRange: '6.0-8.3 g/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Albumin', code: 'ALB', loincCode: '1751-7', category: 'Chemistry', referenceRange: '3.5-5.5 g/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1200.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Total Bilirubin', code: 'TBIL', loincCode: '1975-2', category: 'Chemistry', referenceRange: '0.1-1.2 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Direct Bilirubin', code: 'DBIL', loincCode: '1968-7', category: 'Chemistry', referenceRange: '0.0-0.3 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Alkaline Phosphatase (ALP)', code: 'ALP', loincCode: '6768-6', category: 'Chemistry', referenceRange: '30-120 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Alanine Aminotransferase (ALT)', code: 'ALT', loincCode: '1742-6', category: 'Chemistry', referenceRange: '7-56 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Aspartate Aminotransferase (AST)', code: 'AST', loincCode: '1920-8', category: 'Chemistry', referenceRange: '10-40 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Lipid Panel
    { name: 'Lipid Panel', code: 'LIPID', loincCode: '24331-1', category: 'Chemistry', referenceRange: 'See individual components', sampleType: 'Serum', preparationInstructions: '9-12 hour fasting required', estimatedTime: '2-4 hours', cost: '6000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Total Cholesterol', code: 'CHOL', loincCode: '2093-3', category: 'Chemistry', referenceRange: '<200 mg/dL', sampleType: 'Serum', preparationInstructions: '9-12 hour fasting required', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Triglycerides', code: 'TRIG', loincCode: '2571-8', category: 'Chemistry', referenceRange: '<150 mg/dL', sampleType: 'Serum', preparationInstructions: '9-12 hour fasting required', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'HDL Cholesterol', code: 'HDL', loincCode: '2085-9', category: 'Chemistry', referenceRange: 'M: >40 mg/dL, F: >50 mg/dL', sampleType: 'Serum', preparationInstructions: '9-12 hour fasting required', estimatedTime: '2-4 hours', cost: '1800.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'LDL Cholesterol', code: 'LDL', loincCode: '13457-7', category: 'Chemistry', referenceRange: '<100 mg/dL', sampleType: 'Serum', preparationInstructions: '9-12 hour fasting required', estimatedTime: '2-4 hours', cost: '1800.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'VLDL Cholesterol', code: 'VLDL', loincCode: '13458-5', category: 'Chemistry', referenceRange: '2-30 mg/dL', sampleType: 'Serum', preparationInstructions: '9-12 hour fasting required', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Liver Function Tests
    { name: 'Liver Function Panel', code: 'LFT', loincCode: '24325-3', category: 'Chemistry', referenceRange: 'See individual components', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '6500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Gamma-Glutamyl Transferase (GGT)', code: 'GGT', loincCode: '2324-2', category: 'Chemistry', referenceRange: 'M: 8-61 U/L, F: 5-36 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Lactate Dehydrogenase (LDH)', code: 'LDH', loincCode: '2532-0', category: 'Chemistry', referenceRange: '140-280 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1800.00', departmentId: deptMap['CHEM'], isActive: true },

    // Thyroid Function Tests
    { name: 'Thyroid Function Panel', code: 'THYROID', loincCode: '24348-5', category: 'Chemistry', referenceRange: 'See individual components', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '8500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Thyroid Stimulating Hormone (TSH)', code: 'TSH', loincCode: '3016-3', category: 'Chemistry', referenceRange: '0.4-4.0 mIU/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '3500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Free T4 (Thyroxine)', code: 'FT4', loincCode: '3024-7', category: 'Chemistry', referenceRange: '0.8-1.8 ng/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '3000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Free T3 (Triiodothyronine)', code: 'FT3', loincCode: '3051-0', category: 'Chemistry', referenceRange: '2.3-4.2 pg/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '3000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Total T4', code: 'TT4', loincCode: '3053-6', category: 'Chemistry', referenceRange: '5.0-12.0 ug/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '2500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Total T3', code: 'TT3', loincCode: '3052-8', category: 'Chemistry', referenceRange: '80-200 ng/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '2500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Diabetes Management
    { name: 'Hemoglobin A1C', code: 'HBA1C', loincCode: '4548-4', category: 'Chemistry', referenceRange: '<5.7% (normal), 5.7-6.4% (prediabetes), >=6.5% (diabetes)', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No fasting required', estimatedTime: '24 hours', cost: '4000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Glucose, Random', code: 'GLUR', loincCode: '2339-0', category: 'Chemistry', referenceRange: '<140 mg/dL', sampleType: 'Serum/Plasma', preparationInstructions: 'No fasting required', estimatedTime: '1-2 hours', cost: '600.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Glucose, 2-Hour Postprandial', code: 'GLU2H', loincCode: '1521-4', category: 'Chemistry', referenceRange: '<140 mg/dL', sampleType: 'Serum/Plasma', preparationInstructions: 'Eat normal meal, test 2 hours after', estimatedTime: '1-2 hours', cost: '800.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Oral Glucose Tolerance Test (OGTT)', code: 'OGTT', loincCode: '1518-0', category: 'Chemistry', referenceRange: 'Fasting: <100, 1hr: <180, 2hr: <140 mg/dL', sampleType: 'Serum/Plasma', preparationInstructions: '8-12 hour fast, drink 75g glucose solution', estimatedTime: '3-4 hours', cost: '3000.00', departmentId: deptMap['CHEM'], isActive: true },

    // Kidney Function
    { name: 'Kidney Function Panel', code: 'KFP', loincCode: '24362-6', category: 'Chemistry', referenceRange: 'See individual components', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '5500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'eGFR (Estimated GFR)', code: 'EGFR', loincCode: '33914-3', category: 'Chemistry', referenceRange: '>60 mL/min/1.73m2', sampleType: 'Calculated', preparationInstructions: 'Based on creatinine', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Uric Acid', code: 'URIC', loincCode: '3084-1', category: 'Chemistry', referenceRange: 'M: 3.7-8.6 mg/dL, F: 2.6-6.0 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Phosphorus', code: 'PHOS', loincCode: '2777-1', category: 'Chemistry', referenceRange: '2.5-4.5 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Magnesium', code: 'MG', loincCode: '2601-3', category: 'Chemistry', referenceRange: '1.7-2.2 mg/dL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Cardiac Markers
    { name: 'Troponin I', code: 'TROPI', loincCode: '10839-9', category: 'Chemistry', referenceRange: '<0.04 ng/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '1-2 hours', cost: '5000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Troponin T', code: 'TROPT', loincCode: '6598-7', category: 'Chemistry', referenceRange: '<0.01 ng/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '1-2 hours', cost: '5000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Creatine Kinase (CK)', code: 'CK', loincCode: '2157-6', category: 'Chemistry', referenceRange: 'M: 52-336 U/L, F: 38-176 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'CK-MB', code: 'CKMB', loincCode: '13969-1', category: 'Chemistry', referenceRange: '<5% of total CK', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'B-Type Natriuretic Peptide (BNP)', code: 'BNP', loincCode: '30934-4', category: 'Chemistry', referenceRange: '<100 pg/mL', sampleType: 'Plasma (EDTA)', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '6000.00', departmentId: deptMap['CHEM'], isActive: true },

    // Coagulation Studies
    { name: 'Prothrombin Time (PT)', code: 'PT', loincCode: '5902-2', category: 'Coagulation', referenceRange: '11-13.5 seconds', sampleType: 'Citrated Plasma', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['COAG'], isActive: true },
    { name: 'INR (International Normalized Ratio)', code: 'INR', loincCode: '6301-6', category: 'Coagulation', referenceRange: '0.8-1.2 (normal)', sampleType: 'Citrated Plasma', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['COAG'], isActive: true },
    { name: 'Activated Partial Thromboplastin Time (aPTT)', code: 'APTT', loincCode: '3173-2', category: 'Coagulation', referenceRange: '25-35 seconds', sampleType: 'Citrated Plasma', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['COAG'], isActive: true },
    { name: 'D-Dimer', code: 'DDIMER', loincCode: '48065-7', category: 'Coagulation', referenceRange: '<500 ng/mL', sampleType: 'Citrated Plasma', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '4000.00', departmentId: deptMap['COAG'], isActive: true },
    { name: 'Fibrinogen', code: 'FIB', loincCode: '3255-7', category: 'Coagulation', referenceRange: '200-400 mg/dL', sampleType: 'Citrated Plasma', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '3000.00', departmentId: deptMap['COAG'], isActive: true },

    // Immunology/Serology - Infectious Diseases
    { name: 'HIV Screening (HIV 1/2 Antibody)', code: 'HIV', loincCode: '7917-8', category: 'Serology', referenceRange: 'Non-reactive', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '2500.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'Hepatitis B Surface Antigen (HBsAg)', code: 'HBSAG', loincCode: '5196-1', category: 'Serology', referenceRange: 'Non-reactive', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '2500.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'Hepatitis C Antibody', code: 'HCVAB', loincCode: '16128-1', category: 'Serology', referenceRange: 'Non-reactive', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '2500.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'Malaria Rapid Test', code: 'MALARIA', loincCode: '32700-7', category: 'Serology', referenceRange: 'Negative', sampleType: 'Whole Blood', preparationInstructions: 'No special preparation', estimatedTime: '30 minutes', cost: '1500.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'Typhoid IgM/IgG', code: 'TYPHOID', loincCode: '23991-7', category: 'Serology', referenceRange: 'Negative', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '2000.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'COVID-19 Antibody (IgG/IgM)', code: 'COVID19AB', loincCode: '94762-2', category: 'Serology', referenceRange: 'Negative', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '5000.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'COVID-19 PCR', code: 'COVID19PCR', loincCode: '94500-6', category: 'Molecular', referenceRange: 'Negative', sampleType: 'Nasopharyngeal Swab', preparationInstructions: 'No eating/drinking 30 min before', estimatedTime: '24-48 hours', cost: '15000.00', departmentId: deptMap['MOLEC'], isActive: true },

    // Pregnancy & Reproductive
    { name: 'Pregnancy Test (hCG)', code: 'HCG', loincCode: '2118-8', category: 'Serology', referenceRange: 'Non-pregnant: <5 mIU/mL', sampleType: 'Serum/Urine', preparationInstructions: 'First morning urine preferred', estimatedTime: '1-2 hours', cost: '1500.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'Prostate Specific Antigen (PSA)', code: 'PSA', loincCode: '2857-1', category: 'Chemistry', referenceRange: '<4.0 ng/mL', sampleType: 'Serum', preparationInstructions: 'No ejaculation 48 hours before test', estimatedTime: '24-48 hours', cost: '4000.00', departmentId: deptMap['CHEM'], isActive: true },

    // Tumor Markers
    { name: 'Carcinoembryonic Antigen (CEA)', code: 'CEA', loincCode: '2039-6', category: 'Chemistry', referenceRange: '<3.0 ng/mL (non-smoker)', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '5000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'CA 125', code: 'CA125', loincCode: '10334-1', category: 'Chemistry', referenceRange: '<35 U/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '5500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'CA 19-9', code: 'CA199', loincCode: '24108-3', category: 'Chemistry', referenceRange: '<37 U/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '5500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Alpha-Fetoprotein (AFP)', code: 'AFP', loincCode: '1834-1', category: 'Chemistry', referenceRange: '<10 ng/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '5000.00', departmentId: deptMap['CHEM'], isActive: true },

    // Urinalysis
    { name: 'Urinalysis, Complete', code: 'UA', loincCode: '24357-6', category: 'Urinalysis', referenceRange: 'See individual components', sampleType: 'Urine (clean catch)', preparationInstructions: 'Mid-stream clean catch specimen', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['URINE'], isActive: true },
    { name: 'Urine Microalbumin', code: 'UALB', loincCode: '14957-5', category: 'Urinalysis', referenceRange: '<30 mg/24hr', sampleType: 'Urine (24-hour)', preparationInstructions: '24-hour urine collection', estimatedTime: '24 hours', cost: '2500.00', departmentId: deptMap['URINE'], isActive: true },
    { name: 'Urine Protein, 24-Hour', code: 'UPROT24', loincCode: '2889-4', category: 'Urinalysis', referenceRange: '<150 mg/24hr', sampleType: 'Urine (24-hour)', preparationInstructions: '24-hour urine collection', estimatedTime: '24 hours', cost: '2000.00', departmentId: deptMap['URINE'], isActive: true },
    { name: 'Urine Culture', code: 'UCULT', loincCode: '630-4', category: 'Microbiology', referenceRange: 'No growth', sampleType: 'Urine (clean catch)', preparationInstructions: 'Mid-stream clean catch specimen', estimatedTime: '48-72 hours', cost: '3500.00', departmentId: deptMap['MICRO'], isActive: true },

    // Microbiology - Cultures
    { name: 'Blood Culture', code: 'BCULT', loincCode: '600-7', category: 'Microbiology', referenceRange: 'No growth', sampleType: 'Whole Blood (sterile)', preparationInstructions: 'Sterile collection technique', estimatedTime: '48-120 hours', cost: '5000.00', departmentId: deptMap['MICRO'], isActive: true },
    { name: 'Throat Culture', code: 'TCULT', loincCode: '626-2', category: 'Microbiology', referenceRange: 'Normal flora', sampleType: 'Throat Swab', preparationInstructions: 'No antibiotics for 24 hours', estimatedTime: '48-72 hours', cost: '2500.00', departmentId: deptMap['MICRO'], isActive: true },
    { name: 'Wound Culture', code: 'WCULT', loincCode: '625-4', category: 'Microbiology', referenceRange: 'No growth/Normal flora', sampleType: 'Wound Swab', preparationInstructions: 'Clean wound before collection', estimatedTime: '48-72 hours', cost: '3000.00', departmentId: deptMap['MICRO'], isActive: true },
    { name: 'Stool Culture', code: 'SCULT', loincCode: '625-4', category: 'Microbiology', referenceRange: 'Normal flora', sampleType: 'Stool', preparationInstructions: 'Fresh specimen preferred', estimatedTime: '48-72 hours', cost: '3500.00', departmentId: deptMap['MICRO'], isActive: true },
    { name: 'Sputum Culture', code: 'SPCULT', loincCode: '624-7', category: 'Microbiology', referenceRange: 'Normal flora', sampleType: 'Sputum', preparationInstructions: 'Early morning specimen', estimatedTime: '48-72 hours', cost: '3000.00', departmentId: deptMap['MICRO'], isActive: true },

    // Special Tests - Vitamins & Minerals
    { name: 'Vitamin D, 25-Hydroxy', code: 'VITD', loincCode: '1989-3', category: 'Chemistry', referenceRange: '30-100 ng/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '3-5 days', cost: '6000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Vitamin B12', code: 'VITB12', loincCode: '2132-9', category: 'Chemistry', referenceRange: '200-900 pg/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '3500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Folate (Folic Acid)', code: 'FOLATE', loincCode: '2284-8', category: 'Chemistry', referenceRange: '>3.0 ng/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '3500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Ferritin', code: 'FERR', loincCode: '2276-4', category: 'Chemistry', referenceRange: 'M: 24-336 ng/mL, F: 11-307 ng/mL', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '3000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Iron, Serum', code: 'FE', loincCode: '2498-4', category: 'Chemistry', referenceRange: 'M: 65-175 ug/dL, F: 50-170 ug/dL', sampleType: 'Serum', preparationInstructions: 'Fasting preferred', estimatedTime: '24 hours', cost: '2000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Total Iron Binding Capacity (TIBC)', code: 'TIBC', loincCode: '2500-7', category: 'Chemistry', referenceRange: '240-450 ug/dL', sampleType: 'Serum', preparationInstructions: 'Fasting preferred', estimatedTime: '24 hours', cost: '2500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Hormones
    { name: 'Cortisol, AM', code: 'CORTAM', loincCode: '2143-6', category: 'Chemistry', referenceRange: '6-23 ug/dL', sampleType: 'Serum', preparationInstructions: 'Draw between 7-9 AM', estimatedTime: '24-48 hours', cost: '4000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Testosterone, Total', code: 'TEST', loincCode: '2986-8', category: 'Chemistry', referenceRange: 'M: 300-1000 ng/dL, F: 15-70 ng/dL', sampleType: 'Serum', preparationInstructions: 'Morning specimen (7-10 AM)', estimatedTime: '24-48 hours', cost: '4500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Estradiol', code: 'E2', loincCode: '2243-4', category: 'Chemistry', referenceRange: 'Varies by age and menstrual cycle', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '4500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Prolactin', code: 'PRL', loincCode: '2842-3', category: 'Chemistry', referenceRange: 'M: 4-15 ng/mL, F: 4-23 ng/mL', sampleType: 'Serum', preparationInstructions: 'Avoid stress, morning specimen', estimatedTime: '24-48 hours', cost: '4000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Luteinizing Hormone (LH)', code: 'LH', loincCode: '10501-5', category: 'Chemistry', referenceRange: 'Varies by age and menstrual cycle', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '4000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Follicle Stimulating Hormone (FSH)', code: 'FSH', loincCode: '15067-2', category: 'Chemistry', referenceRange: 'Varies by age and menstrual cycle', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '4000.00', departmentId: deptMap['CHEM'], isActive: true },

    // Additional Important Tests for Nigerian Clinics
    { name: 'Sickling Test', code: 'SICKLE', loincCode: '18282-3', category: 'Hematology', referenceRange: 'Negative', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Hemoglobin Electrophoresis', code: 'HBELEC', loincCode: '4551-8', category: 'Hematology', referenceRange: 'HbA: 95-98%, HbA2: 2-3%', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No special preparation', estimatedTime: '3-5 days', cost: '6000.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'G6PD Screening', code: 'G6PD', loincCode: '5376-9', category: 'Hematology', referenceRange: 'Normal enzyme activity', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No special preparation', estimatedTime: '24-48 hours', cost: '3500.00', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Widal Test (Typhoid)', code: 'WIDAL', loincCode: '5370-2', category: 'Serology', referenceRange: '<1:80 (titers)', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '2000.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'Mantoux Test (TB Skin Test)', code: 'MANTOUX', loincCode: '11580-8', category: 'Immunology', referenceRange: '<5mm induration', sampleType: 'Intradermal injection', preparationInstructions: 'Read result after 48-72 hours', estimatedTime: '72 hours', cost: '2500.00', departmentId: deptMap['IMMUNO'], isActive: true },

    // Stool Tests
    { name: 'Stool for Ova and Parasites', code: 'STOOLOP', loincCode: '673-6', category: 'Microbiology', referenceRange: 'No parasites seen', sampleType: 'Stool', preparationInstructions: 'Fresh specimen, no preservatives', estimatedTime: '24 hours', cost: '2000.00', departmentId: deptMap['MICRO'], isActive: true },
    { name: 'Stool Occult Blood', code: 'FOBT', loincCode: '2335-8', category: 'Chemistry', referenceRange: 'Negative', sampleType: 'Stool', preparationInstructions: 'Avoid red meat 3 days before test', estimatedTime: '24 hours', cost: '1500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Inflammatory Markers
    { name: 'C-Reactive Protein (CRP)', code: 'CRP', loincCode: '1988-5', category: 'Chemistry', referenceRange: '<10 mg/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '2500.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'High Sensitivity CRP (hs-CRP)', code: 'HSCRP', loincCode: '30522-7', category: 'Chemistry', referenceRange: '<3.0 mg/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '3500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Amylase and Lipase (Pancreatic function)
    { name: 'Amylase', code: 'AMY', loincCode: '1798-8', category: 'Chemistry', referenceRange: '30-110 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '2000.00', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Lipase', code: 'LIP', loincCode: '3040-3', category: 'Chemistry', referenceRange: '13-60 U/L', sampleType: 'Serum', preparationInstructions: 'No special preparation', estimatedTime: '24 hours', cost: '2500.00', departmentId: deptMap['CHEM'], isActive: true },

    // Blood Group and Cross-match
    { name: 'ABO Blood Grouping and Rh Typing', code: 'BLOODTYPE', loincCode: '882-1', category: 'Serology', referenceRange: 'A/B/O/AB, Rh Positive/Negative', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '2000.00', departmentId: deptMap['SERO'], isActive: true },
    { name: 'Cross Match (Type and Screen)', code: 'XMATCH', loincCode: '890-4', category: 'Serology', referenceRange: 'Compatible', sampleType: 'Whole Blood (EDTA)', preparationInstructions: 'No special preparation', estimatedTime: '2-4 hours', cost: '3500.00', departmentId: deptMap['SERO'], isActive: true },

  ]).returning();

  console.log(`Seeded ${tests.length} lab tests`);

  const panels = await db.insert(labPanels).values([
    { name: 'Complete Blood Count (CBC)', code: 'CBC_PANEL', description: 'Comprehensive blood cell evaluation', category: 'Hematology', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Basic Metabolic Panel (BMP)', code: 'BMP_PANEL', description: 'Basic chemistry panel for kidney function and electrolytes', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Comprehensive Metabolic Panel (CMP)', code: 'CMP_PANEL', description: 'Extended chemistry panel with liver and kidney function', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Lipid Panel', code: 'LIPID_PANEL', description: 'Cholesterol and triglyceride screening', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Liver Function Panel', code: 'LFT_PANEL', description: 'Comprehensive liver enzyme and function tests', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Thyroid Function Panel', code: 'THYROID_PANEL', description: 'Comprehensive thyroid hormone evaluation', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Kidney Function Panel', code: 'KFP_PANEL', description: 'Renal function and electrolyte assessment', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Coagulation Panel', code: 'COAG_PANEL', description: 'Blood clotting studies', category: 'Coagulation', departmentId: deptMap['COAG'], isActive: true },
    { name: 'Diabetes Screening Panel', code: 'DIAB_PANEL', description: 'Glucose and HbA1c for diabetes management', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Anemia Panel', code: 'ANEMIA_PANEL', description: 'Iron studies and related tests', category: 'Hematology', departmentId: deptMap['HEM'], isActive: true },
    { name: 'Cardiac Panel', code: 'CARDIAC_PANEL', description: 'Heart health markers', category: 'Chemistry', departmentId: deptMap['CHEM'], isActive: true },
    { name: 'Infectious Disease Screening', code: 'INFECT_PANEL', description: 'Common infectious disease tests (HIV, Hep B, Hep C)', category: 'Serology', departmentId: deptMap['SERO'], isActive: true },
  ]).returning();

  console.log(`Seeded ${panels.length} lab panels`);

  const testMap = tests.reduce((acc: Record<string, number>, test: LabTest) => {
    if (test.code) {
      acc[test.code] = test.id;
    }
    return acc;
  }, {} as Record<string, number>);

  const panelMap = panels.reduce((acc: Record<string, number>, panel: LabPanel) => {
    if (panel.code) {
      acc[panel.code] = panel.id;
    }
    return acc;
  }, {} as Record<string, number>);

  const panelTests = await db.insert(labPanelTests).values([
    // CBC Panel
    { panelId: panelMap['CBC_PANEL'], testId: testMap['HGB'], displayOrder: 1 },
    { panelId: panelMap['CBC_PANEL'], testId: testMap['HCT'], displayOrder: 2 },
    { panelId: panelMap['CBC_PANEL'], testId: testMap['WBC'], displayOrder: 3 },
    { panelId: panelMap['CBC_PANEL'], testId: testMap['PLT'], displayOrder: 4 },
    { panelId: panelMap['CBC_PANEL'], testId: testMap['RBC'], displayOrder: 5 },
    { panelId: panelMap['CBC_PANEL'], testId: testMap['MCV'], displayOrder: 6 },
    { panelId: panelMap['CBC_PANEL'], testId: testMap['MCH'], displayOrder: 7 },
    { panelId: panelMap['CBC_PANEL'], testId: testMap['MCHC'], displayOrder: 8 },

    // BMP Panel
    { panelId: panelMap['BMP_PANEL'], testId: testMap['GLU'], displayOrder: 1 },
    { panelId: panelMap['BMP_PANEL'], testId: testMap['BUN'], displayOrder: 2 },
    { panelId: panelMap['BMP_PANEL'], testId: testMap['CREAT'], displayOrder: 3 },
    { panelId: panelMap['BMP_PANEL'], testId: testMap['NA'], displayOrder: 4 },
    { panelId: panelMap['BMP_PANEL'], testId: testMap['K'], displayOrder: 5 },
    { panelId: panelMap['BMP_PANEL'], testId: testMap['CL'], displayOrder: 6 },
    { panelId: panelMap['BMP_PANEL'], testId: testMap['CO2'], displayOrder: 7 },
    { panelId: panelMap['BMP_PANEL'], testId: testMap['CA'], displayOrder: 8 },

    // CMP Panel (includes all BMP tests plus liver tests)
    { panelId: panelMap['CMP_PANEL'], testId: testMap['GLU'], displayOrder: 1 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['BUN'], displayOrder: 2 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['CREAT'], displayOrder: 3 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['NA'], displayOrder: 4 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['K'], displayOrder: 5 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['CL'], displayOrder: 6 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['CO2'], displayOrder: 7 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['CA'], displayOrder: 8 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['TP'], displayOrder: 9 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['ALB'], displayOrder: 10 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['TBIL'], displayOrder: 11 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['ALP'], displayOrder: 12 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['ALT'], displayOrder: 13 },
    { panelId: panelMap['CMP_PANEL'], testId: testMap['AST'], displayOrder: 14 },

    // Lipid Panel
    { panelId: panelMap['LIPID_PANEL'], testId: testMap['CHOL'], displayOrder: 1 },
    { panelId: panelMap['LIPID_PANEL'], testId: testMap['TRIG'], displayOrder: 2 },
    { panelId: panelMap['LIPID_PANEL'], testId: testMap['HDL'], displayOrder: 3 },
    { panelId: panelMap['LIPID_PANEL'], testId: testMap['LDL'], displayOrder: 4 },
    { panelId: panelMap['LIPID_PANEL'], testId: testMap['VLDL'], displayOrder: 5 },

    // Liver Function Panel
    { panelId: panelMap['LFT_PANEL'], testId: testMap['ALT'], displayOrder: 1 },
    { panelId: panelMap['LFT_PANEL'], testId: testMap['AST'], displayOrder: 2 },
    { panelId: panelMap['LFT_PANEL'], testId: testMap['ALP'], displayOrder: 3 },
    { panelId: panelMap['LFT_PANEL'], testId: testMap['TBIL'], displayOrder: 4 },
    { panelId: panelMap['LFT_PANEL'], testId: testMap['DBIL'], displayOrder: 5 },
    { panelId: panelMap['LFT_PANEL'], testId: testMap['TP'], displayOrder: 6 },
    { panelId: panelMap['LFT_PANEL'], testId: testMap['ALB'], displayOrder: 7 },
    { panelId: panelMap['LFT_PANEL'], testId: testMap['GGT'], displayOrder: 8 },

    // Thyroid Panel
    { panelId: panelMap['THYROID_PANEL'], testId: testMap['TSH'], displayOrder: 1 },
    { panelId: panelMap['THYROID_PANEL'], testId: testMap['FT4'], displayOrder: 2 },
    { panelId: panelMap['THYROID_PANEL'], testId: testMap['FT3'], displayOrder: 3 },
    { panelId: panelMap['THYROID_PANEL'], testId: testMap['TT4'], displayOrder: 4 },
    { panelId: panelMap['THYROID_PANEL'], testId: testMap['TT3'], displayOrder: 5 },

    // Kidney Function Panel
    { panelId: panelMap['KFP_PANEL'], testId: testMap['BUN'], displayOrder: 1 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['CREAT'], displayOrder: 2 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['EGFR'], displayOrder: 3 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['URIC'], displayOrder: 4 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['NA'], displayOrder: 5 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['K'], displayOrder: 6 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['CL'], displayOrder: 7 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['CA'], displayOrder: 8 },
    { panelId: panelMap['KFP_PANEL'], testId: testMap['PHOS'], displayOrder: 9 },

    // Coagulation Panel
    { panelId: panelMap['COAG_PANEL'], testId: testMap['PT'], displayOrder: 1 },
    { panelId: panelMap['COAG_PANEL'], testId: testMap['INR'], displayOrder: 2 },
    { panelId: panelMap['COAG_PANEL'], testId: testMap['APTT'], displayOrder: 3 },
    { panelId: panelMap['COAG_PANEL'], testId: testMap['DDIMER'], displayOrder: 4 },

    // Diabetes Screening Panel
    { panelId: panelMap['DIAB_PANEL'], testId: testMap['GLU'], displayOrder: 1 },
    { panelId: panelMap['DIAB_PANEL'], testId: testMap['HBA1C'], displayOrder: 2 },

    // Anemia Panel
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['HGB'], displayOrder: 1 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['HCT'], displayOrder: 2 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['RBC'], displayOrder: 3 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['MCV'], displayOrder: 4 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['MCH'], displayOrder: 5 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['MCHC'], displayOrder: 6 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['RETIC'], displayOrder: 7 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['FE'], displayOrder: 8 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['FERR'], displayOrder: 9 },
    { panelId: panelMap['ANEMIA_PANEL'], testId: testMap['TIBC'], displayOrder: 10 },

    // Cardiac Panel
    { panelId: panelMap['CARDIAC_PANEL'], testId: testMap['TROPI'], displayOrder: 1 },
    { panelId: panelMap['CARDIAC_PANEL'], testId: testMap['CK'], displayOrder: 2 },
    { panelId: panelMap['CARDIAC_PANEL'], testId: testMap['CKMB'], displayOrder: 3 },
    { panelId: panelMap['CARDIAC_PANEL'], testId: testMap['BNP'], displayOrder: 4 },

    // Infectious Disease Screening
    { panelId: panelMap['INFECT_PANEL'], testId: testMap['HIV'], displayOrder: 1 },
    { panelId: panelMap['INFECT_PANEL'], testId: testMap['HBSAG'], displayOrder: 2 },
    { panelId: panelMap['INFECT_PANEL'], testId: testMap['HCVAB'], displayOrder: 3 },
  ]).returning();

  console.log(`Seeded ${panelTests.length} panel-test associations`);

  console.log('Lab catalog seeding completed successfully!');
  
  return {
    departments: departments.length,
    tests: tests.length,
    panels: panels.length,
    panelTests: panelTests.length,
  };
}
