import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Syringe, User, Calendar, FileText, ChevronRight, 
  CheckCircle2, AlertTriangle, Clock, Baby
} from 'lucide-react';
import { formatPatientName } from '@/lib/patient-utils';
import { 
  calculatePatientAge, 
  getRecommendedVaccines,
  STANDARD_VACCINE_SCHEDULES 
} from '@/lib/vaccine-schedules';
import { Link } from 'wouter';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
}

interface Vaccination {
  id: number;
  vaccineName: string;
  dateAdministered: string;
  doseNumber?: string;
  nextDueDate?: string;
}

interface PatientVaccinationCardProps {
  patient: Patient;
  onViewDetails: () => void;
  onGenerateCertificate: () => void;
}

export function PatientVaccinationCard({ 
  patient, 
  onViewDetails, 
  onGenerateCertificate 
}: PatientVaccinationCardProps) {
  // Fetch patient vaccinations
  const { data: vaccinations = [], isLoading } = useQuery<Vaccination[]>({
    queryKey: [`/api/patients/${patient.id}/immunizations`],
  });

  const age = calculatePatientAge(patient.dateOfBirth);
  
  // Calculate compliance status
  const getComplianceStatus = () => {
    const today = new Date();
    let overdueCount = 0;
    let upcomingCount = 0;

    vaccinations.forEach(v => {
      if (v.nextDueDate) {
        const dueDate = new Date(v.nextDueDate);
        if (dueDate < today) {
          overdueCount++;
        } else {
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilDue <= 30) {
            upcomingCount++;
          }
        }
      }
    });

    // Get recommended vaccines based on age
    const previousVaccinations = vaccinations.map(v => ({
      vaccineName: v.vaccineName,
      doseNumber: v.doseNumber ? parseInt(v.doseNumber) : undefined
    }));
    const recommended = getRecommendedVaccines(age.months, previousVaccinations);

    if (overdueCount > 0) {
      return { status: 'overdue', label: `${overdueCount} Overdue`, color: 'bg-red-500' };
    }
    if (upcomingCount > 0) {
      return { status: 'due-soon', label: `${upcomingCount} Due Soon`, color: 'bg-amber-500' };
    }
    if (recommended.length > 0) {
      return { status: 'incomplete', label: `${recommended.length} Recommended`, color: 'bg-blue-500' };
    }
    return { status: 'up-to-date', label: 'Up to Date', color: 'bg-emerald-500' };
  };

  const compliance = getComplianceStatus();

  // Calculate vaccination progress
  const getVaccinationProgress = () => {
    // For children under 6, track against childhood vaccine schedule
    if (age.months <= 72) {
      const childhoodVaccines = STANDARD_VACCINE_SCHEDULES.filter(
        v => v.category === 'routine' && 
        v.ageGroups.some(g => {
          const minMonths = g.minAge === 'birth' ? 0 : parseInt(g.minAge) || 0;
          return minMonths <= 72;
        })
      );
      
      const completedCount = vaccinations.length;
      const expectedCount = childhoodVaccines.reduce((sum, v) => 
        sum + v.ageGroups.filter(g => {
          const minMonths = g.minAge === 'birth' ? 0 : parseInt(g.minAge) || 0;
          return minMonths <= age.months && g.recommended;
        }).length, 0);
      
      return Math.min(100, Math.round((completedCount / Math.max(expectedCount, 1)) * 100));
    }
    
    // For adults, just show percentage based on common adult vaccines
    return vaccinations.length > 0 ? Math.min(100, vaccinations.length * 10) : 0;
  };

  const progress = getVaccinationProgress();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              age.months <= 12 ? 'bg-pink-100' : 
              age.months <= 72 ? 'bg-blue-100' : 
              age.months <= 216 ? 'bg-purple-100' : 'bg-emerald-100'
            }`}>
              {age.months <= 12 ? (
                <Baby className="h-5 w-5 text-pink-600" />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{formatPatientName(patient)}</h4>
              <p className="text-sm text-slate-500">{age.display} • {patient.gender}</p>
            </div>
          </div>
          <Badge className={`${compliance.color} text-white`}>
            {compliance.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {compliance.status === 'due-soon' && <Clock className="w-3 h-3 mr-1" />}
            {compliance.status === 'up-to-date' && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {compliance.label}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-500">Vaccination Progress</span>
            <span className="font-medium text-slate-700">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Vaccination Summary */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1 text-slate-600">
            <Syringe className="h-4 w-4 text-emerald-500" />
            <span>{vaccinations.length} vaccines recorded</span>
          </div>
          {vaccinations.length > 0 && (
            <span className="text-slate-400">
              Last: {new Date(vaccinations[0]?.dateAdministered).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Recent Vaccines */}
        {vaccinations.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">Recent Vaccinations</p>
            <div className="flex flex-wrap gap-1">
              {vaccinations.slice(0, 4).map(v => (
                <Badge key={v.id} variant="secondary" className="text-xs">
                  {v.vaccineName.split(' ')[0]}
                </Badge>
              ))}
              {vaccinations.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{vaccinations.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/patients/${patient.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <ChevronRight className="h-4 w-4 mr-1" />
              View Records
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onGenerateCertificate}
            disabled={vaccinations.length === 0}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

