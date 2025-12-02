import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Visit {
  id: number;
  patientId: number;
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  assessment?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  medications?: any[];
  vitals?: any;
  createdAt: string;
}

export function useCloneVisit(patientId: number) {
  const [clonedData, setClonedData] = useState<Partial<Visit> | null>(null);
  const { toast } = useToast();

  // Fetch patient's previous visits
  const { data: previousVisits = [], isLoading } = useQuery<Visit[]>({
    queryKey: [`/api/patients/${patientId}/visits`],
    enabled: !!patientId
  });

  const cloneFromVisit = (visitId: number) => {
    const visit = previousVisits.find(v => v.id === visitId);
    
    if (!visit) {
      toast({
        title: 'Visit not found',
        description: 'Could not find the selected visit to clone.',
        variant: 'destructive'
      });
      return null;
    }

    // Clone relevant fields, excluding visit-specific data
    const cloned: Partial<Visit> = {
      // Don't clone: id, patientId, createdAt, visitDate
      // Clone: clinical information that might be similar
      chiefComplaint: '', // Keep empty, but show previous in UI
      historyOfPresentIllness: '', // Keep empty
      assessment: visit.assessment, // Clone if chronic condition
      diagnosis: visit.diagnosis, // Clone for follow-ups
      treatmentPlan: visit.treatmentPlan, // Can be modified
      medications: visit.medications?.map(med => ({
        ...med,
        id: undefined, // Remove ID to create new prescription
      })),
      vitals: {} // Don't clone vitals, always measure fresh
    };

    setClonedData(cloned);

    toast({
      title: 'Visit data copied',
      description: 'Previous visit data has been loaded. Please review and modify as needed.',
    });

    return cloned;
  };

  const cloneFromLastVisit = () => {
    if (previousVisits.length === 0) {
      toast({
        title: 'No previous visits',
        description: 'This patient has no previous visits to clone from.',
        variant: 'destructive'
      });
      return null;
    }

    // Get most recent visit
    const lastVisit = previousVisits[0];
    return cloneFromVisit(lastVisit.id);
  };

  const getMostRecentVisit = () => {
    return previousVisits[0] || null;
  };

  const getVisitsByDiagnosis = (diagnosis: string) => {
    return previousVisits.filter(visit => 
      visit.diagnosis?.toLowerCase().includes(diagnosis.toLowerCase())
    );
  };

  const clearClonedData = () => {
    setClonedData(null);
  };

  return {
    previousVisits,
    isLoading,
    clonedData,
    cloneFromVisit,
    cloneFromLastVisit,
    getMostRecentVisit,
    getVisitsByDiagnosis,
    clearClonedData
  };
}

// Component to show clone options
export function CloneVisitButton({ 
  patientId, 
  onClone 
}: { 
  patientId: number; 
  onClone: (data: Partial<Visit>) => void;
}) {
  const { 
    previousVisits, 
    isLoading, 
    cloneFromLastVisit, 
    cloneFromVisit 
  } = useCloneVisit(patientId);

  const handleCloneFromLast = () => {
    const data = cloneFromLastVisit();
    if (data) onClone(data);
  };

  if (isLoading || previousVisits.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCloneFromLast}
      >
        Copy from Last Visit
      </Button>
      
      {previousVisits.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Copy from Other Visit
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {previousVisits.slice(0, 10).map((visit) => (
              <DropdownMenuItem
                key={visit.id}
                onClick={() => {
                  const data = cloneFromVisit(visit.id);
                  if (data) onClone(data);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{visit.diagnosis || 'No diagnosis'}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(visit.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
