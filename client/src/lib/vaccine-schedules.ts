/**
 * Standard Vaccine Schedules based on CDC and WHO recommendations
 * https://www.cdc.gov/vaccines/schedules/
 * https://www.who.int/immunization/policy/Immunization_routine_table2.pdf
 */

export interface VaccineSchedule {
  id: string;
  name: string;
  shortName: string;
  diseasesPrevented: string[];
  ageGroups: VaccineAgeGroup[];
  contraindications: string[];
  sideEffects: string[];
  manufacturer?: string[];
  route: 'intramuscular' | 'subcutaneous' | 'intradermal' | 'oral' | 'nasal';
  category: 'routine' | 'catch-up' | 'travel' | 'occupational' | 'special';
  source: 'CDC' | 'WHO' | 'Both';
}

export interface VaccineAgeGroup {
  minAge: string; // e.g., "birth", "2 months", "4 years"
  maxAge: string;
  doseNumber: number;
  recommended: boolean;
  catchUp: boolean;
  intervalFromPrevious?: string; // e.g., "4 weeks", "6 months"
  notes?: string;
}

export interface VaccineDueAlert {
  patientId: number;
  patientName: string;
  vaccineName: string;
  dueDate: string;
  status: 'upcoming' | 'due' | 'overdue';
  daysUntilDue: number;
  ageAtDue: string;
}

// CDC & WHO Recommended Vaccine Schedules
export const STANDARD_VACCINE_SCHEDULES: VaccineSchedule[] = [
  // ===== CHILDHOOD VACCINES =====
  {
    id: 'hepb',
    name: 'Hepatitis B Vaccine',
    shortName: 'HepB',
    diseasesPrevented: ['Hepatitis B'],
    ageGroups: [
      { minAge: 'birth', maxAge: '1 month', doseNumber: 1, recommended: true, catchUp: false, notes: 'Within 24 hours of birth' },
      { minAge: '1 month', maxAge: '2 months', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '6 months', maxAge: '18 months', doseNumber: 3, recommended: true, catchUp: true, intervalFromPrevious: '8 weeks', notes: 'Final dose no earlier than 24 weeks of age' },
    ],
    contraindications: ['Severe allergic reaction to previous dose', 'Yeast allergy'],
    sideEffects: ['Soreness at injection site', 'Mild fever', 'Fatigue'],
    manufacturer: ['GSK', 'Merck'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'rotavirus',
    name: 'Rotavirus Vaccine',
    shortName: 'RV',
    diseasesPrevented: ['Rotavirus gastroenteritis'],
    ageGroups: [
      { minAge: '2 months', maxAge: '4 months', doseNumber: 1, recommended: true, catchUp: false, notes: 'First dose by 14 weeks 6 days' },
      { minAge: '4 months', maxAge: '6 months', doseNumber: 2, recommended: true, catchUp: false, intervalFromPrevious: '4 weeks' },
      { minAge: '6 months', maxAge: '8 months', doseNumber: 3, recommended: true, catchUp: false, intervalFromPrevious: '4 weeks', notes: 'RV5 only; final dose by 8 months 0 days' },
    ],
    contraindications: ['Severe combined immunodeficiency (SCID)', 'History of intussusception'],
    sideEffects: ['Mild diarrhea', 'Vomiting', 'Irritability'],
    manufacturer: ['Merck (RotaTeq)', 'GSK (Rotarix)'],
    route: 'oral',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'dtap',
    name: 'Diphtheria, Tetanus, Pertussis Vaccine',
    shortName: 'DTaP',
    diseasesPrevented: ['Diphtheria', 'Tetanus', 'Pertussis (Whooping Cough)'],
    ageGroups: [
      { minAge: '2 months', maxAge: '4 months', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '4 months', maxAge: '6 months', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '6 months', maxAge: '15 months', doseNumber: 3, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '15 months', maxAge: '18 months', doseNumber: 4, recommended: true, catchUp: true, intervalFromPrevious: '6 months' },
      { minAge: '4 years', maxAge: '6 years', doseNumber: 5, recommended: true, catchUp: true, intervalFromPrevious: '6 months' },
    ],
    contraindications: ['Encephalopathy within 7 days of previous dose', 'Severe allergic reaction'],
    sideEffects: ['Fever', 'Redness/swelling at injection site', 'Fussiness', 'Drowsiness'],
    manufacturer: ['Sanofi', 'GSK'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'hib',
    name: 'Haemophilus influenzae type b Vaccine',
    shortName: 'Hib',
    diseasesPrevented: ['Haemophilus influenzae type b infections', 'Meningitis', 'Pneumonia'],
    ageGroups: [
      { minAge: '2 months', maxAge: '4 months', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '4 months', maxAge: '6 months', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '6 months', maxAge: '12 months', doseNumber: 3, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks', notes: 'Depending on vaccine brand' },
      { minAge: '12 months', maxAge: '15 months', doseNumber: 4, recommended: true, catchUp: true, intervalFromPrevious: '8 weeks', notes: 'Booster dose' },
    ],
    contraindications: ['Age < 6 weeks', 'Severe allergic reaction to previous dose'],
    sideEffects: ['Redness/swelling at injection site', 'Fever'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'pcv',
    name: 'Pneumococcal Conjugate Vaccine',
    shortName: 'PCV13/PCV15/PCV20',
    diseasesPrevented: ['Pneumococcal disease', 'Pneumonia', 'Meningitis', 'Bacteremia'],
    ageGroups: [
      { minAge: '2 months', maxAge: '4 months', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '4 months', maxAge: '6 months', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '6 months', maxAge: '12 months', doseNumber: 3, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '12 months', maxAge: '15 months', doseNumber: 4, recommended: true, catchUp: true, intervalFromPrevious: '8 weeks', notes: 'Booster dose' },
    ],
    contraindications: ['Severe allergic reaction to previous dose or vaccine component'],
    sideEffects: ['Drowsiness', 'Loss of appetite', 'Fever', 'Injection site reactions'],
    manufacturer: ['Pfizer (Prevnar)', 'Merck (Vaxneuvance)'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'ipv',
    name: 'Inactivated Poliovirus Vaccine',
    shortName: 'IPV',
    diseasesPrevented: ['Poliomyelitis'],
    ageGroups: [
      { minAge: '2 months', maxAge: '4 months', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '4 months', maxAge: '6 months', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '6 months', maxAge: '18 months', doseNumber: 3, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
      { minAge: '4 years', maxAge: '6 years', doseNumber: 4, recommended: true, catchUp: true, intervalFromPrevious: '6 months' },
    ],
    contraindications: ['Severe allergic reaction to previous dose', 'Streptomycin/polymyxin B/neomycin allergy'],
    sideEffects: ['Redness at injection site', 'Mild fever'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'mmr',
    name: 'Measles, Mumps, Rubella Vaccine',
    shortName: 'MMR',
    diseasesPrevented: ['Measles', 'Mumps', 'Rubella'],
    ageGroups: [
      { minAge: '12 months', maxAge: '15 months', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '4 years', maxAge: '6 years', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '4 weeks' },
    ],
    contraindications: ['Pregnancy', 'Severe immunodeficiency', 'Gelatin allergy', 'Neomycin allergy'],
    sideEffects: ['Fever', 'Mild rash', 'Swelling of glands', 'Joint pain (adults)'],
    manufacturer: ['Merck (M-M-R II)'],
    route: 'subcutaneous',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'varicella',
    name: 'Varicella (Chickenpox) Vaccine',
    shortName: 'VAR',
    diseasesPrevented: ['Varicella (Chickenpox)'],
    ageGroups: [
      { minAge: '12 months', maxAge: '15 months', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '4 years', maxAge: '6 years', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '3 months' },
    ],
    contraindications: ['Pregnancy', 'Severe immunodeficiency', 'Gelatin allergy', 'Neomycin allergy'],
    sideEffects: ['Soreness at injection site', 'Fever', 'Mild rash'],
    manufacturer: ['Merck (Varivax)'],
    route: 'subcutaneous',
    category: 'routine',
    source: 'CDC',
  },
  {
    id: 'hepa',
    name: 'Hepatitis A Vaccine',
    shortName: 'HepA',
    diseasesPrevented: ['Hepatitis A'],
    ageGroups: [
      { minAge: '12 months', maxAge: '23 months', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '18 months', maxAge: '23 months', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '6 months' },
    ],
    contraindications: ['Severe allergic reaction to previous dose'],
    sideEffects: ['Soreness at injection site', 'Headache', 'Fatigue'],
    manufacturer: ['Merck', 'GSK'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  
  // ===== ADOLESCENT VACCINES =====
  {
    id: 'tdap',
    name: 'Tetanus, Diphtheria, Pertussis (Adolescent/Adult)',
    shortName: 'Tdap',
    diseasesPrevented: ['Tetanus', 'Diphtheria', 'Pertussis'],
    ageGroups: [
      { minAge: '11 years', maxAge: '12 years', doseNumber: 1, recommended: true, catchUp: true, notes: 'Adolescent booster' },
    ],
    contraindications: ['Encephalopathy within 7 days of previous dose'],
    sideEffects: ['Pain at injection site', 'Fatigue', 'Headache', 'Muscle aches'],
    manufacturer: ['Sanofi (Adacel)', 'GSK (Boostrix)'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'hpv',
    name: 'Human Papillomavirus Vaccine',
    shortName: 'HPV',
    diseasesPrevented: ['HPV infection', 'Cervical cancer', 'Genital warts', 'Other HPV-related cancers'],
    ageGroups: [
      { minAge: '11 years', maxAge: '12 years', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '11 years', maxAge: '12 years', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '6-12 months', notes: '2 doses if started before 15' },
    ],
    contraindications: ['Severe allergic reaction to yeast', 'Pregnancy'],
    sideEffects: ['Pain/redness at injection site', 'Dizziness', 'Fainting', 'Headache'],
    manufacturer: ['Merck (Gardasil 9)'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'meningococcal_acwy',
    name: 'Meningococcal ACWY Vaccine',
    shortName: 'MenACWY',
    diseasesPrevented: ['Meningococcal disease (serogroups A, C, W, Y)'],
    ageGroups: [
      { minAge: '11 years', maxAge: '12 years', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '16 years', maxAge: '18 years', doseNumber: 2, recommended: true, catchUp: true, notes: 'Booster dose' },
    ],
    contraindications: ['Severe allergic reaction to previous dose or vaccine component'],
    sideEffects: ['Pain at injection site', 'Fatigue', 'Headache', 'Muscle pain'],
    manufacturer: ['Sanofi (Menactra)', 'Pfizer (Trumenba)', 'GSK (Menveo)'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  
  // ===== ADULT VACCINES =====
  {
    id: 'influenza',
    name: 'Influenza (Flu) Vaccine',
    shortName: 'Flu',
    diseasesPrevented: ['Influenza'],
    ageGroups: [
      { minAge: '6 months', maxAge: '8 years', doseNumber: 1, recommended: true, catchUp: false, notes: '2 doses first season, 4 weeks apart' },
      { minAge: '9 years', maxAge: '65+ years', doseNumber: 1, recommended: true, catchUp: false, notes: 'Annual vaccination' },
    ],
    contraindications: ['Severe egg allergy (for egg-based vaccines)', 'Previous severe reaction'],
    sideEffects: ['Soreness at injection site', 'Low-grade fever', 'Muscle aches'],
    manufacturer: ['Various'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'covid19',
    name: 'COVID-19 Vaccine',
    shortName: 'COVID-19',
    diseasesPrevented: ['COVID-19'],
    ageGroups: [
      { minAge: '6 months', maxAge: '4 years', doseNumber: 1, recommended: true, catchUp: true, notes: 'Series varies by vaccine' },
      { minAge: '5 years', maxAge: '65+ years', doseNumber: 1, recommended: true, catchUp: true, notes: 'Primary series + boosters as recommended' },
    ],
    contraindications: ['Severe allergic reaction to previous dose or component'],
    sideEffects: ['Pain at injection site', 'Fatigue', 'Headache', 'Muscle pain', 'Fever', 'Chills'],
    manufacturer: ['Pfizer-BioNTech', 'Moderna', 'Novavax'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'pneumococcal_adult',
    name: 'Pneumococcal Vaccine (Adult)',
    shortName: 'PPSV23/PCV20',
    diseasesPrevented: ['Pneumococcal disease', 'Pneumonia'],
    ageGroups: [
      { minAge: '65 years', maxAge: '99 years', doseNumber: 1, recommended: true, catchUp: true, notes: 'PCV20 or PCV15 followed by PPSV23' },
    ],
    contraindications: ['Severe allergic reaction to previous dose'],
    sideEffects: ['Pain at injection site', 'Fatigue', 'Muscle pain'],
    route: 'intramuscular',
    category: 'routine',
    source: 'Both',
  },
  {
    id: 'shingles',
    name: 'Shingles (Herpes Zoster) Vaccine',
    shortName: 'RZV',
    diseasesPrevented: ['Shingles', 'Postherpetic neuralgia'],
    ageGroups: [
      { minAge: '50 years', maxAge: '99 years', doseNumber: 1, recommended: true, catchUp: true },
      { minAge: '50 years', maxAge: '99 years', doseNumber: 2, recommended: true, catchUp: true, intervalFromPrevious: '2-6 months' },
    ],
    contraindications: ['Severe allergic reaction to previous dose', 'Current shingles outbreak'],
    sideEffects: ['Pain at injection site', 'Fatigue', 'Muscle pain', 'Headache', 'Shivering', 'Fever'],
    manufacturer: ['GSK (Shingrix)'],
    route: 'intramuscular',
    category: 'routine',
    source: 'CDC',
  },
  {
    id: 'rsv',
    name: 'Respiratory Syncytial Virus Vaccine',
    shortName: 'RSV',
    diseasesPrevented: ['RSV infection'],
    ageGroups: [
      { minAge: '60 years', maxAge: '99 years', doseNumber: 1, recommended: true, catchUp: false, notes: 'Single dose for adults 60+' },
    ],
    contraindications: ['Severe allergic reaction to previous dose'],
    sideEffects: ['Fatigue', 'Headache', 'Muscle pain', 'Joint pain'],
    manufacturer: ['GSK (Arexvy)', 'Pfizer (Abrysvo)'],
    route: 'intramuscular',
    category: 'routine',
    source: 'CDC',
  },
  
  // ===== TRAVEL VACCINES =====
  {
    id: 'typhoid',
    name: 'Typhoid Vaccine',
    shortName: 'Typhoid',
    diseasesPrevented: ['Typhoid fever'],
    ageGroups: [
      { minAge: '2 years', maxAge: '99 years', doseNumber: 1, recommended: false, catchUp: false, notes: 'For travelers to endemic areas' },
    ],
    contraindications: ['Severe allergic reaction to previous dose'],
    sideEffects: ['Fever', 'Headache', 'Pain at injection site'],
    route: 'intramuscular',
    category: 'travel',
    source: 'Both',
  },
  {
    id: 'yellow_fever',
    name: 'Yellow Fever Vaccine',
    shortName: 'YF',
    diseasesPrevented: ['Yellow fever'],
    ageGroups: [
      { minAge: '9 months', maxAge: '99 years', doseNumber: 1, recommended: false, catchUp: false, notes: 'Required for travel to certain countries' },
    ],
    contraindications: ['Egg allergy', 'Immunodeficiency', 'Age < 6 months', 'Thymus disorder'],
    sideEffects: ['Headache', 'Muscle aches', 'Low-grade fever'],
    route: 'subcutaneous',
    category: 'travel',
    source: 'Both',
  },
  {
    id: 'rabies',
    name: 'Rabies Vaccine',
    shortName: 'Rabies',
    diseasesPrevented: ['Rabies'],
    ageGroups: [
      { minAge: 'any', maxAge: '99 years', doseNumber: 1, recommended: false, catchUp: false, notes: 'Pre-exposure or post-exposure' },
    ],
    contraindications: ['None for post-exposure'],
    sideEffects: ['Pain at injection site', 'Headache', 'Nausea', 'Dizziness'],
    route: 'intramuscular',
    category: 'travel',
    source: 'Both',
  },
  {
    id: 'japanese_encephalitis',
    name: 'Japanese Encephalitis Vaccine',
    shortName: 'JE',
    diseasesPrevented: ['Japanese encephalitis'],
    ageGroups: [
      { minAge: '2 months', maxAge: '99 years', doseNumber: 1, recommended: false, catchUp: false, notes: 'For travelers to endemic areas' },
      { minAge: '2 months', maxAge: '99 years', doseNumber: 2, recommended: false, catchUp: false, intervalFromPrevious: '28 days' },
    ],
    contraindications: ['Severe allergic reaction to previous dose'],
    sideEffects: ['Headache', 'Muscle aches', 'Injection site pain'],
    manufacturer: ['Valneva (Ixiaro)'],
    route: 'intramuscular',
    category: 'travel',
    source: 'Both',
  },
  {
    id: 'cholera',
    name: 'Cholera Vaccine',
    shortName: 'Cholera',
    diseasesPrevented: ['Cholera'],
    ageGroups: [
      { minAge: '2 years', maxAge: '99 years', doseNumber: 1, recommended: false, catchUp: false, notes: 'Oral vaccine for travelers' },
    ],
    contraindications: ['Acute gastrointestinal illness'],
    sideEffects: ['Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea'],
    manufacturer: ['Emergent (Vaxchora)'],
    route: 'oral',
    category: 'travel',
    source: 'CDC',
  },
];

// Utility functions for vaccine schedule management
export function getVaccinesByCategory(category: VaccineSchedule['category']): VaccineSchedule[] {
  return STANDARD_VACCINE_SCHEDULES.filter(v => v.category === category);
}

export function getVaccinesByAgeRange(ageInMonths: number): VaccineSchedule[] {
  return STANDARD_VACCINE_SCHEDULES.filter(vaccine => 
    vaccine.ageGroups.some(group => {
      const minMonths = parseAgeToMonths(group.minAge);
      const maxMonths = parseAgeToMonths(group.maxAge);
      return ageInMonths >= minMonths && ageInMonths <= maxMonths;
    })
  );
}

export function parseAgeToMonths(age: string): number {
  if (age === 'birth' || age === 'any') return 0;
  
  const match = age.match(/(\d+)\s*(month|year|week|day)/i);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'day': return value / 30;
    case 'week': return value / 4;
    case 'month': return value;
    case 'year': return value * 12;
    default: return 0;
  }
}

export function calculatePatientAge(dateOfBirth: string): { months: number; years: number; display: string } {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += today.getMonth();
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  let display = '';
  if (years > 0) {
    display = `${years} year${years > 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      display += `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  } else {
    display = `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  return { months, years, display };
}

export function getRecommendedVaccines(
  ageInMonths: number, 
  previousVaccinations: { vaccineName: string; doseNumber?: number }[]
): VaccineSchedule[] {
  const recommendedVaccines: VaccineSchedule[] = [];
  
  STANDARD_VACCINE_SCHEDULES.forEach(vaccine => {
    const givenDoses = previousVaccinations.filter(v => 
      v.vaccineName.toLowerCase().includes(vaccine.shortName.toLowerCase()) ||
      vaccine.name.toLowerCase().includes(v.vaccineName.toLowerCase())
    );
    
    const applicableAgeGroup = vaccine.ageGroups.find(group => {
      const minMonths = parseAgeToMonths(group.minAge);
      const maxMonths = parseAgeToMonths(group.maxAge);
      return ageInMonths >= minMonths && ageInMonths <= maxMonths && group.recommended;
    });
    
    if (applicableAgeGroup && givenDoses.length < applicableAgeGroup.doseNumber) {
      recommendedVaccines.push(vaccine);
    }
  });
  
  return recommendedVaccines;
}

export function calculateNextDueDate(
  vaccine: VaccineSchedule,
  lastDoseDate: string,
  currentDose: number
): string | null {
  const nextDoseGroup = vaccine.ageGroups.find(g => g.doseNumber === currentDose + 1);
  if (!nextDoseGroup?.intervalFromPrevious) return null;
  
  const lastDate = new Date(lastDoseDate);
  const interval = nextDoseGroup.intervalFromPrevious;
  
  const match = interval.match(/(\d+)\s*(week|month|day)/i);
  if (!match) return null;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'day':
      lastDate.setDate(lastDate.getDate() + value);
      break;
    case 'week':
      lastDate.setDate(lastDate.getDate() + (value * 7));
      break;
    case 'month':
      lastDate.setMonth(lastDate.getMonth() + value);
      break;
  }
  
  return lastDate.toISOString().split('T')[0];
}

// Vaccine compliance status calculation
export type ComplianceStatus = 'up-to-date' | 'due-soon' | 'overdue' | 'incomplete' | 'not-started';

export function calculateVaccineCompliance(
  vaccine: VaccineSchedule,
  patientAgeMonths: number,
  vaccinations: { dateAdministered: string; doseNumber?: string | number }[]
): { status: ComplianceStatus; missedDoses: number; nextDue: string | null; message: string } {
  const givenDoses = vaccinations.length;
  const today = new Date();
  
  // Find applicable age groups for patient's age
  const applicableGroups = vaccine.ageGroups.filter(group => {
    const maxMonths = parseAgeToMonths(group.maxAge);
    return patientAgeMonths <= maxMonths + 12; // Allow 1 year grace period
  });
  
  if (applicableGroups.length === 0) {
    return { 
      status: 'up-to-date', 
      missedDoses: 0, 
      nextDue: null, 
      message: 'Outside recommended age range' 
    };
  }
  
  const requiredDoses = applicableGroups.filter(g => 
    parseAgeToMonths(g.minAge) <= patientAgeMonths && g.recommended
  ).length;
  
  const missedDoses = Math.max(0, requiredDoses - givenDoses);
  
  if (missedDoses > 0) {
    const lastDose = vaccinations[vaccinations.length - 1];
    if (lastDose) {
      const nextDue = calculateNextDueDate(vaccine, lastDose.dateAdministered, givenDoses);
      if (nextDue && new Date(nextDue) < today) {
        return { 
          status: 'overdue', 
          missedDoses, 
          nextDue, 
          message: `${missedDoses} dose(s) overdue` 
        };
      }
    }
    return { 
      status: 'incomplete', 
      missedDoses, 
      nextDue: null, 
      message: `Missing ${missedDoses} dose(s)` 
    };
  }
  
  // Check for upcoming doses
  const nextGroup = vaccine.ageGroups.find(g => 
    parseAgeToMonths(g.minAge) > patientAgeMonths && g.recommended
  );
  
  if (nextGroup) {
    const lastDose = vaccinations[vaccinations.length - 1];
    const nextDue = lastDose 
      ? calculateNextDueDate(vaccine, lastDose.dateAdministered, givenDoses)
      : null;
    
    if (nextDue) {
      const daysUntilDue = Math.ceil((new Date(nextDue).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 30 && daysUntilDue > 0) {
        return { 
          status: 'due-soon', 
          missedDoses: 0, 
          nextDue, 
          message: `Next dose due in ${daysUntilDue} days` 
        };
      }
    }
    return { 
      status: 'up-to-date', 
      missedDoses: 0, 
      nextDue, 
      message: 'Up to date' 
    };
  }
  
  return { 
    status: 'up-to-date', 
    missedDoses: 0, 
    nextDue: null, 
    message: 'Vaccination series complete' 
  };
}

export default STANDARD_VACCINE_SCHEDULES;

