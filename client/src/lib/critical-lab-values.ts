export interface CriticalLabRange {
  testName: string;
  unit: string;
  criticalLow?: number;
  criticalHigh?: number;
  normalLow: number;
  normalHigh: number;
  category: string;
}

export const criticalLabRanges: CriticalLabRange[] = [
  // Hematology
  {
    testName: 'Hemoglobin',
    unit: 'g/dL',
    criticalLow: 5,
    criticalHigh: 20,
    normalLow: 12,
    normalHigh: 16,
    category: 'Hematology'
  },
  {
    testName: 'WBC Count',
    unit: '×10³/µL',
    criticalLow: 2,
    criticalHigh: 30,
    normalLow: 4,
    normalHigh: 11,
    category: 'Hematology'
  },
  {
    testName: 'Platelet Count',
    unit: '×10³/µL',
    criticalLow: 50,
    criticalHigh: 1000,
    normalLow: 150,
    normalHigh: 400,
    category: 'Hematology'
  },

  // Chemistry
  {
    testName: 'Glucose',
    unit: 'mg/dL',
    criticalLow: 40,
    criticalHigh: 500,
    normalLow: 70,
    normalHigh: 100,
    category: 'Chemistry'
  },
  {
    testName: 'Potassium',
    unit: 'mEq/L',
    criticalLow: 2.5,
    criticalHigh: 6.5,
    normalLow: 3.5,
    normalHigh: 5.0,
    category: 'Chemistry'
  },
  {
    testName: 'Sodium',
    unit: 'mEq/L',
    criticalLow: 120,
    criticalHigh: 160,
    normalLow: 135,
    normalHigh: 145,
    category: 'Chemistry'
  },
  {
    testName: 'Creatinine',
    unit: 'mg/dL',
    criticalHigh: 5,
    normalLow: 0.6,
    normalHigh: 1.2,
    category: 'Chemistry'
  },
  {
    testName: 'Calcium',
    unit: 'mg/dL',
    criticalLow: 6,
    criticalHigh: 13,
    normalLow: 8.5,
    normalHigh: 10.5,
    category: 'Chemistry'
  },

  // Liver Function
  {
    testName: 'Bilirubin (Total)',
    unit: 'mg/dL',
    criticalHigh: 15,
    normalLow: 0.1,
    normalHigh: 1.2,
    category: 'Liver Function'
  },

  // Cardiac
  {
    testName: 'Troponin I',
    unit: 'ng/mL',
    criticalHigh: 0.4,
    normalLow: 0,
    normalHigh: 0.04,
    category: 'Cardiac'
  },

  // Coagulation
  {
    testName: 'INR',
    unit: '',
    criticalHigh: 5,
    normalLow: 0.8,
    normalHigh: 1.2,
    category: 'Coagulation'
  },
  {
    testName: 'PTT',
    unit: 'seconds',
    criticalHigh: 70,
    normalLow: 25,
    normalHigh: 35,
    category: 'Coagulation'
  }
];

export function checkCriticalValue(testName: string, value: number) {
  const range = criticalLabRanges.find(r => 
    r.testName.toLowerCase() === testName.toLowerCase()
  );

  if (!range) {
    return { isCritical: false, isAbnormal: false };
  }

  const isCriticalLow = range.criticalLow !== undefined && value < range.criticalLow;
  const isCriticalHigh = range.criticalHigh !== undefined && value > range.criticalHigh;
  const isCritical = isCriticalLow || isCriticalHigh;

  const isAbnormalLow = value < range.normalLow;
  const isAbnormalHigh = value > range.normalHigh;
  const isAbnormal = !isCritical && (isAbnormalLow || isAbnormalHigh);

  let severity: 'critical' | 'abnormal' | 'normal' = 'normal';
  let message = '';

  if (isCritical) {
    severity = 'critical';
    message = isCriticalLow 
      ? `CRITICAL LOW: ${value} ${range.unit} (Critical threshold: ${range.criticalLow})`
      : `CRITICAL HIGH: ${value} ${range.unit} (Critical threshold: ${range.criticalHigh})`;
  } else if (isAbnormal) {
    severity = 'abnormal';
    message = isAbnormalLow
      ? `Low: ${value} ${range.unit} (Normal: ${range.normalLow}-${range.normalHigh})`
      : `High: ${value} ${range.unit} (Normal: ${range.normalLow}-${range.normalHigh})`;
  }

  return {
    isCritical,
    isAbnormal,
    severity,
    message,
    range
  };
}

export function getCriticalLabActions(testName: string, value: number) {
  const check = checkCriticalValue(testName, value);
  
  if (!check.isCritical) return [];

  const actions: string[] = [];

  // Test-specific actions
  switch (testName.toLowerCase()) {
    case 'potassium':
      if (value > 6.5) {
        actions.push('ECG immediately');
        actions.push('Consider calcium gluconate IV');
        actions.push('Insulin + glucose protocol');
        actions.push('Recheck in 1 hour');
      } else if (value < 2.5) {
        actions.push('ECG monitoring');
        actions.push('IV potassium replacement');
        actions.push('Monitor cardiac rhythm');
      }
      break;

    case 'glucose':
      if (value < 40) {
        actions.push('Give oral glucose if conscious');
        actions.push('IV dextrose if altered mental status');
        actions.push('Recheck in 15 minutes');
      } else if (value > 500) {
        actions.push('Check for DKA/HHS');
        actions.push('IV fluids');
        actions.push('Insulin therapy');
        actions.push('Monitor electrolytes');
      }
      break;

    case 'hemoglobin':
      if (value < 5) {
        actions.push('Type and crossmatch');
        actions.push('Consider blood transfusion');
        actions.push('Check for active bleeding');
        actions.push('Oxygen therapy');
      }
      break;

    case 'platelet count':
      if (value < 50) {
        actions.push('Avoid invasive procedures');
        actions.push('Bleeding precautions');
        actions.push('Consider platelet transfusion if bleeding or surgery planned');
      }
      break;

    case 'inr':
      if (value > 5) {
        actions.push('Hold warfarin');
        actions.push('Check for bleeding');
        actions.push('Consider vitamin K');
        actions.push('Recheck INR in 24 hours');
      }
      break;

    case 'creatinine':
      if (value > 5) {
        actions.push('Check for acute kidney injury');
        actions.push('Review medications (hold nephrotoxic drugs)');
        actions.push('Consider nephrology consult');
        actions.push('Monitor fluid status');
      }
      break;

    case 'troponin i':
      if (value > 0.4) {
        actions.push('ECG immediately');
        actions.push('Aspirin 300mg stat');
        actions.push('Consider acute coronary syndrome');
        actions.push('Cardiology consult');
      }
      break;
  }

  // General critical value actions
  if (actions.length === 0) {
    actions.push('Notify ordering physician immediately');
    actions.push('Repeat test to confirm');
    actions.push('Review patient clinical status');
  }

  return actions;
}
