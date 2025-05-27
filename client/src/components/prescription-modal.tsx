import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPrescriptionSchema, type InsertPrescription, type Patient, type Medicine } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { MedicationAutocomplete } from "@/components/smart-autocomplete";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Pill, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId?: number;
  visitId?: number;
}

export default function PrescriptionModal({
  open,
  onOpenChange,
  patientId,
  visitId,
}: PrescriptionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(patientId);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
    enabled: !patientId,
  });

  const form = useForm<Omit<InsertPrescription, "patientId" | "medicineId">>({
    resolver: zodResolver(insertPrescriptionSchema.omit({ patientId: true, medicineId: true })),
    defaultValues: {
      visitId: visitId || undefined,
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      prescribedBy: "Dr. Adebayo",
      status: "active",
      startDate: new Date(),
      endDate: undefined,
    },
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: async (data: InsertPrescription) => {
      const response = await apiRequest("POST", `/api/patients/${data.patientId}/prescriptions`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      if (selectedPatientId) {
        queryClient.invalidateQueries({ queryKey: ["/api/patients", selectedPatientId, "prescriptions"] });
        queryClient.invalidateQueries({ queryKey: ["/api/patients", selectedPatientId, "prescriptions", "active"] });
      }
      if (visitId) {
        queryClient.invalidateQueries({ queryKey: ["/api/visits", visitId, "prescriptions"] });
      }
      toast({
        title: "Success",
        description: "Prescription created successfully!",
      });
      form.reset();
      setSelectedPatientId(undefined);
      setSelectedMedicine(null);
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create prescription. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Smart Auto-Fill Function - This automatically fills dosage and instructions!
  const handleMedicationSelect = (medication: Medicine) => {
    setSelectedMedicine(medication);
    
    // Auto-fill form fields from pharmacy database defaults
    if (medication.defaultDosage) {
      form.setValue("dosage", medication.defaultDosage);
    }
    if (medication.defaultFrequency) {
      form.setValue("frequency", medication.defaultFrequency);
    }
    if (medication.defaultDuration) {
      form.setValue("duration", medication.defaultDuration);
    }
    if (medication.defaultInstructions) {
      form.setValue("instructions", medication.defaultInstructions);
    }

    toast({
      title: "Smart Auto-Fill Applied!",
      description: `Prescription details auto-filled from ${medication.name} database defaults.`,
    });
  };

  const onSubmit = (data: Omit<InsertPrescription, "patientId" | "medicineId">) => {
    if (!selectedPatientId) {
      toast({
        title: "Error",
        description: "Please select a patient.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMedicine) {
      toast({
        title: "Error",
        description: "Please select a medicine.",
        variant: "destructive",
      });
      return;
    }

    const prescriptionData: InsertPrescription = {
      ...data,
      patientId: selectedPatientId,
      medicineId: selectedMedicine.id,
    };

    createPrescriptionMutation.mutate(prescriptionData);
  };

  const selectedPatient = patients?.find(p => p.id === selectedPatientId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-green-600" />
            Create New Prescription
          </DialogTitle>
          <DialogDescription>
            Add a new prescription for the patient. Smart auto-fill will help speed up the process!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Selection */}
            {!patientId && (
              <FormField
                control={form.control}
                name="patientId"
                render={() => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={patientSearchOpen}
                          className="w-full justify-between"
                        >
                          {selectedPatient 
                            ? `${selectedPatient.firstName} ${selectedPatient.lastName}` 
                            : "Select patient..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search patients..." />
                          <CommandEmpty>No patient found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {patients?.map((patient) => (
                                <CommandItem
                                  key={patient.id}
                                  onSelect={() => {
                                    setSelectedPatientId(patient.id);
                                    setPatientSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {patient.firstName} {patient.lastName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Smart Medication Selection with Auto-Fill */}
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Medication (Smart Auto-Fill Enabled)
              </FormLabel>
              <MedicationAutocomplete
                value={selectedMedicine}
                onSelect={handleMedicationSelect}
                onAutoFill={handleMedicationSelect}
                placeholder="Search medications..."
                className="w-full"
              />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dosage */}
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 500mg, 1 tablet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Frequency */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Twice daily, Every 8 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 7 days, 2 weeks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Instructions */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Take with food, Before meals, Avoid alcohol"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Auto-Fill Preview */}
            {selectedMedicine && (selectedMedicine.defaultDosage || selectedMedicine.defaultInstructions) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Smart Auto-Fill Applied</span>
                </div>
                <div className="text-sm text-blue-700">
                  Form fields have been automatically populated with pharmacy database defaults for {selectedMedicine.name}. 
                  You can modify any values as needed.
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMedicine.defaultDosage && (
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Dosage: {selectedMedicine.defaultDosage}
                    </Badge>
                  )}
                  {selectedMedicine.defaultFrequency && (
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Frequency: {selectedMedicine.defaultFrequency}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPrescriptionMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createPrescriptionMutation.isPending ? "Creating..." : "Create Prescription"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}