import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, AlertCircle, Info, X, CheckCircle, Pill } from 'lucide-react';

interface Medication {
  id?: number;
  name: string;
  genericName?: string;
}

interface DrugInteraction {
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  drug1: string;
  drug2: string;
  description: string;
  clinicalEffects: string;
  management: string;
  alternatives?: string[];
}

interface DrugInteractionCheckerProps {
  medications: Medication[];
  patientAllergies?: string[];
  onRemoveMedication?: (medication: Medication) => void;
  className?: string;
}

// Common drug interactions database (simplified - in production, use comprehensive database)
const COMMON_INTERACTIONS: DrugInteraction[] = [
  {
    severity: 'critical',
    drug1: 'warfarin',
    drug2: 'aspirin',
    description: 'Increased bleeding risk',
    clinicalEffects: 'Concurrent use significantly increases risk of bleeding, including GI bleeding and hemorrhagic stroke.',
    management: 'Avoid combination if possible. If necessary, use lowest effective doses and monitor INR closely. Consider alternatives.',
    alternatives: ['Use clopidogrel instead of aspirin', 'Use NOACs instead of warfarin']
  },
  {
    severity: 'critical',
    drug1: 'methotrexate',
    drug2: 'trimethoprim',
    description: 'Increased methotrexate toxicity',
    clinicalEffects: 'May result in severe bone marrow suppression, megaloblastic anemia, and pancytopenia.',
    management: 'Avoid combination. Use alternative antibiotic.',
    alternatives: ['Amoxicillin', 'Nitrofurantoin', 'Ciprofloxacin']
  },
  {
    severity: 'major',
    drug1: 'fluconazole',
    drug2: 'simvastatin',
    description: 'Increased statin levels',
    clinicalEffects: 'Risk of myopathy and rhabdomyolysis due to CYP3A4 inhibition.',
    management: 'Reduce statin dose during fluconazole therapy or temporarily discontinue. Monitor for muscle pain/weakness.',
    alternatives: ['Pravastatin (not metabolized by CYP3A4)', 'Rosuvastatin (minimal CYP3A4 metabolism)']
  },
  {
    severity: 'major',
    drug1: 'ace inhibitor',
    drug2: 'spironolactone',
    description: 'Hyperkalemia risk',
    clinicalEffects: 'Both drugs increase potassium levels, leading to potentially dangerous hyperkalemia.',
    management: 'Monitor potassium levels closely. Consider lower doses. Avoid potassium supplements.',
    alternatives: []
  },
  {
    severity: 'major',
    drug1: 'metformin',
    drug2: 'contrast media',
    description: 'Lactic acidosis risk',
    clinicalEffects: 'Contrast-induced nephropathy may impair metformin excretion, increasing lactic acidosis risk.',
    management: 'Hold metformin 48 hours before contrast study. Resume after confirming normal renal function.',
    alternatives: []
  },
  {
    severity: 'moderate',
    drug1: 'nsaid',
    drug2: 'ace inhibitor',
    description: 'Reduced antihypertensive effect',
    clinicalEffects: 'NSAIDs may reduce blood pressure lowering effects and increase risk of renal impairment.',
    management: 'Use NSAIDs for shortest duration at lowest effective dose. Monitor BP and renal function.',
    alternatives: ['Acetaminophen for pain relief']
  },
  {
    severity: 'moderate',
    drug1: 'ciprofloxacin',
    drug2: 'theophylline',
    description: 'Increased theophylline levels',
    clinicalEffects: 'May lead to theophylline toxicity: nausea, vomiting, arrhythmias, seizures.',
    management: 'Consider alternative antibiotic or reduce theophylline dose by 50% and monitor levels.',
    alternatives: ['Amoxicillin', 'Azithromycin']
  },
  {
    severity: 'minor',
    drug1: 'calcium',
    drug2: 'levothyroxine',
    description: 'Reduced levothyroxine absorption',
    clinicalEffects: 'Calcium may decrease levothyroxine absorption.',
    management: 'Separate administration by at least 4 hours.',
    alternatives: []
  }
];

function checkInteractions(medications: Medication[]): DrugInteraction[] {
  const interactions: DrugInteraction[] = [];
  
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const med1 = (medications[i].genericName || medications[i].name).toLowerCase();
      const med2 = (medications[j].genericName || medications[j].name).toLowerCase();
      
      COMMON_INTERACTIONS.forEach(interaction => {
        const drug1Lower = interaction.drug1.toLowerCase();
        const drug2Lower = interaction.drug2.toLowerCase();
        
        if (
          (med1.includes(drug1Lower) && med2.includes(drug2Lower)) ||
          (med1.includes(drug2Lower) && med2.includes(drug1Lower))
        ) {
          interactions.push({
            ...interaction,
            drug1: medications[i].name,
            drug2: medications[j].name
          });
        }
      });
    }
  }
  
  return interactions.sort((a, b) => {
    const severityOrder = { critical: 0, major: 1, moderate: 2, minor: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

function checkAllergies(medications: Medication[], allergies: string[]): string[] {
  const allergyWarnings: string[] = [];
  
  medications.forEach(med => {
    const medName = (med.genericName || med.name).toLowerCase();
    allergies.forEach(allergy => {
      if (medName.includes(allergy.toLowerCase()) || 
          allergy.toLowerCase().includes(medName)) {
        allergyWarnings.push(`${med.name} may cause allergic reaction (known allergy: ${allergy})`);
      }
      
      // Check for class allergies
      if (allergy.toLowerCase().includes('penicillin') && 
          (medName.includes('cillin') || medName.includes('amox'))) {
        allergyWarnings.push(`${med.name} is a penicillin derivative (patient allergic to penicillin)`);
      }
      
      if (allergy.toLowerCase().includes('sulfa') && 
          (medName.includes('sulfa') || medName.includes('sulfamethoxazole'))) {
        allergyWarnings.push(`${med.name} contains sulfonamide (patient allergic to sulfa drugs)`);
      }
    });
  });
  
  return allergyWarnings;
}

export function DrugInteractionChecker({
  medications,
  patientAllergies = [],
  onRemoveMedication,
  className = ''
}: DrugInteractionCheckerProps) {
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [allergyWarnings, setAllergyWarnings] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (medications.length >= 2) {
      const foundInteractions = checkInteractions(medications);
      setInteractions(foundInteractions);
    } else {
      setInteractions([]);
    }
    
    if (patientAllergies.length > 0) {
      const warnings = checkAllergies(medications, patientAllergies);
      setAllergyWarnings(warnings);
    } else {
      setAllergyWarnings([]);
    }
  }, [medications, patientAllergies]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'major':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'moderate':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'minor':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-300';
      case 'major':
        return 'bg-orange-50 border-orange-300';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-300';
      case 'minor':
        return 'bg-blue-50 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  if (medications.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Allergy Warnings */}
      {allergyWarnings.length > 0 && (
        <Alert className="mb-4 bg-red-50 border-red-500">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900 font-bold">
            ALLERGY ALERT!
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 text-red-800">
              {allergyWarnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Drug Interactions */}
      {interactions.length > 0 ? (
        <Card className="border-orange-200 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="h-5 w-5 text-orange-600" />
              Drug Interactions Detected ({interactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {interactions.map((interaction, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 ${getSeverityColor(interaction.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getSeverityIcon(interaction.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={interaction.severity === 'critical' ? 'destructive' : 'default'}
                              className="uppercase text-xs"
                            >
                              {interaction.severity}
                            </Badge>
                            <span className="font-semibold">
                              {interaction.drug1} + {interaction.drug2}
                            </span>
                          </div>
                          
                          <p className="text-sm font-medium mb-1">
                            {interaction.description}
                          </p>
                          
                          {showDetails[`${idx}`] && (
                            <div className="mt-3 space-y-2 text-sm">
                              <div>
                                <strong>Clinical Effects:</strong>
                                <p className="text-gray-700">{interaction.clinicalEffects}</p>
                              </div>
                              <div>
                                <strong>Management:</strong>
                                <p className="text-gray-700">{interaction.management}</p>
                              </div>
                              {interaction.alternatives && interaction.alternatives.length > 0 && (
                                <div>
                                  <strong>Alternatives:</strong>
                                  <ul className="list-disc list-inside text-gray-700">
                                    {interaction.alternatives.map((alt, altIdx) => (
                                      <li key={altIdx}>{alt}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            variant="link"
                            className="px-0 h-auto mt-2"
                            onClick={() => setShowDetails(prev => ({
                              ...prev,
                              [`${idx}`]: !prev[`${idx}`]
                            }))}
                          >
                            {showDetails[`${idx}`] ? 'Show less' : 'Show details'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : allergyWarnings.length === 0 ? (
        <Alert className="bg-green-50 border-green-300">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">
            No Drug Interactions Detected
          </AlertTitle>
          <AlertDescription className="text-green-800">
            The selected medications appear safe to use together.
            {medications.length === 1 && ' Add more medications to check for interactions.'}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
