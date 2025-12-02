import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, Users, Syringe, Plus, Trash2, CheckCircle2, 
  AlertCircle, Calendar, User, Save, X, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatPatientName } from '@/lib/patient-utils';
import { STANDARD_VACCINE_SCHEDULES } from '@/lib/vaccine-schedules';
import { useAuth } from '@/contexts/AuthContext';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
}

interface BatchVaccinationRecorderProps {
  patients: Patient[];
  onComplete: () => void;
}

interface BatchEntry {
  patientId: number;
  patient: Patient;
  vaccineName: string;
  doseNumber: string;
  selected: boolean;
}

export function BatchVaccinationRecorder({ patients, onComplete }: BatchVaccinationRecorderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [batchEntries, setBatchEntries] = useState<BatchEntry[]>([]);
  const [commonDetails, setCommonDetails] = useState({
    dateAdministered: new Date().toISOString().split('T')[0],
    administeredBy: user?.username || '',
    lotNumber: '',
    manufacturer: '',
    site: 'left-arm',
    route: 'intramuscular',
    notes: '',
  });

  // Filter patients based on search
  const filteredPatients = patients.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
           p.phone?.includes(query);
  }).slice(0, 50);

  // Add patient to batch
  const addToBatch = (patient: Patient) => {
    if (batchEntries.some(e => e.patientId === patient.id)) {
      toast({ 
        title: 'Already Added', 
        description: `${formatPatientName(patient)} is already in the batch`,
        variant: 'default'
      });
      return;
    }
    
    setBatchEntries(prev => [...prev, {
      patientId: patient.id,
      patient,
      vaccineName: selectedVaccine,
      doseNumber: '1',
      selected: true,
    }]);
  };

  // Remove from batch
  const removeFromBatch = (patientId: number) => {
    setBatchEntries(prev => prev.filter(e => e.patientId !== patientId));
  };

  // Toggle selection
  const toggleSelection = (patientId: number) => {
    setBatchEntries(prev => prev.map(e => 
      e.patientId === patientId ? { ...e, selected: !e.selected } : e
    ));
  };

  // Update entry
  const updateEntry = (patientId: number, field: string, value: string) => {
    setBatchEntries(prev => prev.map(e => 
      e.patientId === patientId ? { ...e, [field]: value } : e
    ));
  };

  // Select all
  const selectAll = () => {
    const allSelected = batchEntries.every(e => e.selected);
    setBatchEntries(prev => prev.map(e => ({ ...e, selected: !allSelected })));
  };

  // Apply vaccine to all
  const applyVaccineToAll = () => {
    if (!selectedVaccine) return;
    setBatchEntries(prev => prev.map(e => ({ ...e, vaccineName: selectedVaccine })));
  };

  // Batch save mutation
  const batchSaveMutation = useMutation({
    mutationFn: async () => {
      const selectedEntries = batchEntries.filter(e => e.selected && e.vaccineName);
      
      const promises = selectedEntries.map(entry => 
        apiRequest(`/api/patients/${entry.patientId}/immunizations`, 'POST', {
          vaccineName: entry.vaccineName,
          doseNumber: entry.doseNumber,
          dateAdministered: commonDetails.dateAdministered,
          administeredBy: commonDetails.administeredBy,
          lotNumber: commonDetails.lotNumber || undefined,
          manufacturer: commonDetails.manufacturer || undefined,
          site: commonDetails.site || undefined,
          route: commonDetails.route || undefined,
          notes: commonDetails.notes || undefined,
        })
      );

      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({ 
        title: 'Success', 
        description: `${batchEntries.filter(e => e.selected).length} vaccinations recorded successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vaccinations/all'] });
      onComplete();
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: 'Failed to save some vaccinations',
        variant: 'destructive'
      });
    },
  });

  const handleSave = () => {
    const selectedCount = batchEntries.filter(e => e.selected && e.vaccineName).length;
    if (selectedCount === 0) {
      toast({ 
        title: 'No Patients Selected', 
        description: 'Please select at least one patient with a vaccine assigned',
        variant: 'destructive'
      });
      return;
    }
    batchSaveMutation.mutate();
  };

  const selectedCount = batchEntries.filter(e => e.selected).length;

  return (
    <div className="space-y-6">
      {/* Common Vaccination Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Syringe className="h-5 w-5 text-emerald-600" />
            Vaccination Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Vaccine *</Label>
              <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vaccine" />
                </SelectTrigger>
                <SelectContent>
                  {STANDARD_VACCINE_SCHEDULES.map(v => (
                    <SelectItem key={v.id} value={v.name}>
                      {v.shortName} - {v.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other (specify in notes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Administered *</Label>
              <Input 
                type="date" 
                value={commonDetails.dateAdministered}
                onChange={(e) => setCommonDetails(prev => ({ ...prev, dateAdministered: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Administered By *</Label>
              <Input 
                value={commonDetails.administeredBy}
                onChange={(e) => setCommonDetails(prev => ({ ...prev, administeredBy: e.target.value }))}
                placeholder="Healthcare provider name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Lot Number</Label>
              <Input 
                value={commonDetails.lotNumber}
                onChange={(e) => setCommonDetails(prev => ({ ...prev, lotNumber: e.target.value }))}
                placeholder="Batch/Lot #"
              />
            </div>
            <div className="space-y-2">
              <Label>Manufacturer</Label>
              <Input 
                value={commonDetails.manufacturer}
                onChange={(e) => setCommonDetails(prev => ({ ...prev, manufacturer: e.target.value }))}
                placeholder="e.g., Pfizer, Moderna"
              />
            </div>
            <div className="space-y-2">
              <Label>Injection Site</Label>
              <Select 
                value={commonDetails.site} 
                onValueChange={(v) => setCommonDetails(prev => ({ ...prev, site: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left-arm">Left Arm</SelectItem>
                  <SelectItem value="right-arm">Right Arm</SelectItem>
                  <SelectItem value="left-thigh">Left Thigh</SelectItem>
                  <SelectItem value="right-thigh">Right Thigh</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Route</Label>
              <Select 
                value={commonDetails.route} 
                onValueChange={(v) => setCommonDetails(prev => ({ ...prev, route: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intramuscular">Intramuscular (IM)</SelectItem>
                  <SelectItem value="subcutaneous">Subcutaneous (SC)</SelectItem>
                  <SelectItem value="intradermal">Intradermal (ID)</SelectItem>
                  <SelectItem value="oral">Oral</SelectItem>
                  <SelectItem value="nasal">Nasal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea 
              value={commonDetails.notes}
              onChange={(e) => setCommonDetails(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes (applies to all selected patients)"
              rows={2}
            />
          </div>

          {selectedVaccine && batchEntries.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={applyVaccineToAll}
            >
              Apply "{selectedVaccine}" to all patients
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Patient Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search and Add Patients */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Add Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search patients..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-64 border rounded-lg">
              {filteredPatients.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No patients found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredPatients.map(patient => {
                    const isAdded = batchEntries.some(e => e.patientId === patient.id);
                    return (
                      <div 
                        key={patient.id}
                        className={`p-3 flex items-center justify-between hover:bg-slate-50 ${
                          isAdded ? 'bg-emerald-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded-full">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{formatPatientName(patient)}</p>
                            <p className="text-xs text-slate-500">
                              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isAdded ? 'secondary' : 'outline'}
                          onClick={() => addToBatch(patient)}
                          disabled={isAdded}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Batch List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Syringe className="h-5 w-5 text-emerald-600" />
                Batch List
                {batchEntries.length > 0 && (
                  <Badge variant="secondary">{batchEntries.length}</Badge>
                )}
              </CardTitle>
              {batchEntries.length > 0 && (
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  {batchEntries.every(e => e.selected) ? 'Deselect All' : 'Select All'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 border rounded-lg">
              {batchEntries.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Syringe className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No patients added yet</p>
                  <p className="text-xs text-slate-400 mt-1">Search and add patients from the left panel</p>
                </div>
              ) : (
                <div className="divide-y">
                  {batchEntries.map(entry => (
                    <div 
                      key={entry.patientId}
                      className={`p-3 ${entry.selected ? 'bg-emerald-50/50' : 'bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={entry.selected}
                          onCheckedChange={() => toggleSelection(entry.patientId)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {formatPatientName(entry.patient)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Select 
                              value={entry.vaccineName} 
                              onValueChange={(v) => updateEntry(entry.patientId, 'vaccineName', v)}
                            >
                              <SelectTrigger className="h-7 text-xs w-40">
                                <SelectValue placeholder="Select vaccine" />
                              </SelectTrigger>
                              <SelectContent>
                                {STANDARD_VACCINE_SCHEDULES.map(v => (
                                  <SelectItem key={v.id} value={v.name}>
                                    {v.shortName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={entry.doseNumber} 
                              onValueChange={(v) => updateEntry(entry.patientId, 'doseNumber', v)}
                            >
                              <SelectTrigger className="h-7 text-xs w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Dose 1</SelectItem>
                                <SelectItem value="2">Dose 2</SelectItem>
                                <SelectItem value="3">Dose 3</SelectItem>
                                <SelectItem value="4">Dose 4</SelectItem>
                                <SelectItem value="5">Dose 5</SelectItem>
                                <SelectItem value="Booster">Booster</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromBatch(entry.patientId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {!entry.vaccineName && entry.selected && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Please select a vaccine
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Summary and Save */}
      <Card className="bg-slate-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-slate-500">Selected Patients</p>
                <p className="text-2xl font-bold text-slate-900">{selectedCount}</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-sm text-slate-500">Vaccine</p>
                <p className="font-medium text-slate-900">
                  {selectedVaccine || 'Not selected'}
                </p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(commonDetails.dateAdministered).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onComplete}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={selectedCount === 0 || batchSaveMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {batchSaveMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save {selectedCount} Vaccinations
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

