import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Star,
  Pin,
  PinOff,
  Save,
  CheckCircle2,
  Sparkles,
  Grid3x3,
  List,
  Filter,
  X,
} from "lucide-react";

interface ConsultationForm {
  id: number;
  name: string;
  description: string;
  specialistRole: string;
  formStructure: {
    fields: FormField[];
  };
  isActive: boolean;
  isPinned?: boolean;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "date" | "checkbox" | "radio";
  required?: boolean;
  section?: string;
  placeholder?: string;
  options?: string[];
  medicalCategory?: string;
}

interface IntegratedConsultationFormsProps {
  patientId: number;
  visitId?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFormSubmit?: () => void;
}

export function IntegratedConsultationForms({
  patientId,
  visitId,
  open,
  onOpenChange,
  onFormSubmit,
}: IntegratedConsultationFormsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedForm, setSelectedForm] = useState<ConsultationForm | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pinnedForms, setPinnedForms] = useState<number[]>([]);

  // Fetch available consultation forms
  const { data: forms = [], isLoading: formsLoading } = useQuery<ConsultationForm[]>({
    queryKey: ["/api/consultation-forms"],
    enabled: open,
  });

  // Fetch patient data
  const { data: patient } = useQuery({
    queryKey: [`/api/patients/${patientId}`],
    enabled: !!patientId && open,
  });

  // Create dynamic schema based on selected form
  const createFormSchema = (fields: FormField[]) => {
    const schemaFields: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "number") {
        schemaFields[field.id] = field.required
          ? z.number().min(0, `${field.label} is required`)
          : z.number().optional();
      } else if (field.type === "checkbox") {
        schemaFields[field.id] = z.boolean().optional();
      } else {
        schemaFields[field.id] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
      }
    });

    return z.object(schemaFields);
  };

  // Initialize form with dynamic schema
  const form = useForm({
    resolver: selectedForm
      ? zodResolver(createFormSchema(selectedForm.formStructure.fields))
      : undefined,
    defaultValues: formData,
  });

  // Submit consultation record
  const submitConsultationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/patients/${patientId}/consultation-records`, {
        method: "POST",
        body: {
          formId: selectedForm!.id,
          patientId,
          visitId,
          data: data,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "✅ Consultation Saved",
        description: "Specialist consultation has been successfully recorded.",
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/patients/${patientId}/consultation-records`],
      });
      if (onFormSubmit) onFormSubmit();
      resetForm();
      if (onOpenChange) onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Failed to save consultation record.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedForm(null);
    setFormData({});
    form.reset();
  };

  const onSubmit = (data: any) => {
    submitConsultationMutation.mutate(data);
  };

  // Toggle pin form
  const togglePin = (formId: number) => {
    setPinnedForms((prev) =>
      prev.includes(formId) ? prev.filter((id) => id !== formId) : [...prev, formId]
    );
  };

  // Filter forms
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || form.specialistRole === filterRole;
    return matchesSearch && matchesRole && form.isActive;
  });

  // Separate pinned and unpinned forms
  const pinnedFormsList = filteredForms.filter((f) => pinnedForms.includes(f.id));
  const unpinnedFormsList = filteredForms.filter((f) => !pinnedForms.includes(f.id));

  // Get unique specialist roles
  const specialistRoles = Array.from(new Set(forms.map((f) => f.specialistRole)));

  // Group form fields by section
  const groupedFields = selectedForm
    ? selectedForm.formStructure.fields.reduce((acc, field) => {
        const section = field.section || "General";
        if (!acc[section]) acc[section] = [];
        acc[section].push(field);
        return acc;
      }, {} as Record<string, FormField[]>)
    : {};

  // Render form field based on type
  const renderFormField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "textarea":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea {...formField} {...commonProps} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={formField.onChange} value={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || "Select..."} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "number":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    {...commonProps}
                    type="number"
                    onChange={(e) => formField.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "date":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input {...formField} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={formField.value}
                    onChange={formField.onChange}
                    className="rounded border-gray-300"
                  />
                </FormControl>
                <FormLabel className="font-normal">{field.label}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input {...formField} {...commonProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              {selectedForm ? (
                <>
                  <div>{selectedForm.name}</div>
                  <DialogDescription className="text-base mt-1">
                    {selectedForm.description}
                  </DialogDescription>
                </>
              ) : (
                <>
                  <div>Specialist Consultation Forms</div>
                  <DialogDescription className="text-base mt-1">
                    Select a specialized consultation form for detailed assessment
                  </DialogDescription>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {!selectedForm ? (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search consultation forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {specialistRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pinned Forms */}
            {pinnedFormsList.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pin className="h-4 w-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Pinned Forms</h3>
                </div>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-3"
                  }
                >
                  {pinnedFormsList.map((form) => (
                    <FormCard
                      key={form.id}
                      form={form}
                      onSelect={setSelectedForm}
                      onTogglePin={togglePin}
                      isPinned={true}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Forms */}
            {formsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading forms...</p>
              </div>
            ) : unpinnedFormsList.length > 0 ? (
              <div>
                {pinnedFormsList.length > 0 && (
                  <h3 className="font-semibold text-gray-900 mb-3">All Forms</h3>
                )}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-3"
                  }
                >
                  {unpinnedFormsList.map((form) => (
                    <FormCard
                      key={form.id}
                      form={form}
                      onSelect={setSelectedForm}
                      onTogglePin={togglePin}
                      isPinned={false}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No consultation forms found</p>
                {searchQuery && (
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button */}
            <Button variant="outline" size="sm" onClick={resetForm}>
              ← Back to Form Selection
            </Button>

            {/* Form Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {selectedForm.specialistRole}
              </Badge>
              <Badge variant="outline">{selectedForm.formStructure.fields.length} fields</Badge>
            </div>

            {/* Dynamic Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {Object.entries(groupedFields).map(([sectionName, fields]) => (
                  <Card key={sectionName}>
                    <CardHeader>
                      {sectionName !== "General" && (
                        <CardTitle className="text-lg">{sectionName}</CardTitle>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field) => (
                          <div
                            key={field.id}
                            className={field.type === "textarea" ? "md:col-span-2" : ""}
                          >
                            {renderFormField(field)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitConsultationMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {submitConsultationMutation.isPending ? "Saving..." : "Save Consultation"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Form Card Component
interface FormCardProps {
  form: ConsultationForm;
  onSelect: (form: ConsultationForm) => void;
  onTogglePin: (formId: number) => void;
  isPinned: boolean;
  viewMode: "grid" | "list";
}

function FormCard({ form, onSelect, onTogglePin, isPinned, viewMode }: FormCardProps) {
  if (viewMode === "list") {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 cursor-pointer" onClick={() => onSelect(form)}>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{form.name}</h4>
              <Badge variant="secondary" className="text-xs">
                {form.specialistRole}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{form.formStructure.fields.length} fields</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(form.id);
            }}
          >
            {isPinned ? (
              <PinOff className="h-4 w-4 text-purple-600" />
            ) : (
              <Pin className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(form.id);
        }}
      >
        {isPinned ? (
          <PinOff className="h-4 w-4 text-purple-600" />
        ) : (
          <Pin className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </Button>

      <div onClick={() => onSelect(form)}>
        <CardHeader>
          <CardTitle className="text-lg pr-8">{form.name}</CardTitle>
          <CardDescription className="line-clamp-2">{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {form.specialistRole}
            </Badge>
            <span className="text-xs text-gray-500">
              {form.formStructure.fields.length} fields
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

