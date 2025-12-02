import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scan, Plus, Trash, Edit, Calendar, Download, Eye, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/apiRequest';
import { useToast } from '@/hooks/use-toast';

const imagingSchema = z.object({
  studyType: z.string().min(1, "Study type is required"),
  studyDate: z.string().min(1, "Date is required"),
  bodyPart: z.string().min(1, "Body part is required"),
  indication: z.string().min(1, "Indication is required"),
  findings: z.string().optional(),
  impression: z.string().optional(),
  radiologist: z.string().optional(),
  referringPhysician: z.string().optional(),
  modality: z.string().optional(),
  priority: z.enum(["routine", "urgent", "stat"]),
  status: z.enum(["ordered", "scheduled", "in-progress", "completed", "cancelled"]),
});

type ImagingFormData = z.infer<typeof imagingSchema>;

interface PatientImagingProps {
  patientId: number;
}

export function PatientImaging({ patientId }: PatientImagingProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<any>(null);
  const [viewingStudy, setViewingStudy] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ImagingFormData>({
    resolver: zodResolver(imagingSchema),
    defaultValues: {
      studyType: '',
      studyDate: '',
      bodyPart: '',
      indication: '',
      findings: '',
      impression: '',
      radiologist: '',
      referringPhysician: '',
      modality: '',
      priority: 'routine',
      status: 'ordered',
    },
  });

  // Fetch imaging studies
  const { data: imagingStudies, isLoading } = useQuery({
    queryKey: [`/api/patients/${patientId}/imaging`],
  });

  // Add imaging study mutation
  const addImagingMutation = useMutation({
    mutationFn: async (data: ImagingFormData) => {
      const response = await apiRequest(`/api/patients/${patientId}/imaging`, 'POST', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/imaging`] });
      toast({ title: "Success", description: "Imaging study added successfully" });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add imaging study", variant: "destructive" });
    },
  });

  // Update imaging study mutation
  const updateImagingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ImagingFormData }) => {
      const response = await apiRequest(`/api/patients/${patientId}/imaging/${id}`, 'PATCH', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/imaging`] });
      toast({ title: "Success", description: "Imaging study updated successfully" });
      setEditingStudy(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update imaging study", variant: "destructive" });
    },
  });

  // Delete imaging study mutation
  const deleteImagingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/patients/${patientId}/imaging/${id}`, 'DELETE');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/imaging`] });
      toast({ title: "Success", description: "Imaging study removed successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove imaging study", variant: "destructive" });
    },
  });

  const onSubmit = (data: ImagingFormData) => {
    if (editingStudy) {
      updateImagingMutation.mutate({ id: editingStudy.id, data });
    } else {
      addImagingMutation.mutate(data);
    }
  };

  const handleEdit = (study: any) => {
    setEditingStudy(study);
    form.reset({
      studyType: study.studyType,
      studyDate: study.studyDate,
      bodyPart: study.bodyPart,
      indication: study.indication,
      findings: study.findings || '',
      impression: study.impression || '',
      radiologist: study.radiologist || '',
      referringPhysician: study.referringPhysician || '',
      modality: study.modality || '',
      priority: study.priority,
      status: study.status,
    });
    setIsAddDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'ordered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat':
        return 'bg-red-500 text-white';
      case 'urgent':
        return 'bg-orange-500 text-white';
      case 'routine':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Medical Imaging & Radiology</h3>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingStudy(null); form.reset(); }} title="Add Imaging Study">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStudy ? 'Edit Imaging Study' : 'Add New Imaging Study'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select study type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="X-Ray">X-Ray</SelectItem>
                            <SelectItem value="CT">CT Scan</SelectItem>
                            <SelectItem value="MRI">MRI</SelectItem>
                            <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                            <SelectItem value="Mammography">Mammography</SelectItem>
                            <SelectItem value="PET">PET Scan</SelectItem>
                            <SelectItem value="Fluoroscopy">Fluoroscopy</SelectItem>
                            <SelectItem value="Nuclear Medicine">Nuclear Medicine</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studyDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bodyPart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Part *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Chest, Abdomen, Brain" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modality</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., With contrast, Without contrast" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="stat">STAT</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ordered">Ordered</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="indication"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Clinical Indication *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Reason for the imaging study"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="radiologist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Radiologist</FormLabel>
                        <FormControl>
                          <Input placeholder="Reading radiologist name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referringPhysician"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referring Physician</FormLabel>
                        <FormControl>
                          <Input placeholder="Ordering physician name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="findings"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Findings</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed radiological findings"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impression"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Impression/Conclusion</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Radiologist's impression and conclusion"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addImagingMutation.isPending || updateImagingMutation.isPending}>
                    {editingStudy ? 'Update' : 'Add'} Study
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-slate-500">Loading imaging studies...</div>
        </div>
      ) : !imagingStudies || imagingStudies.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-sm">No imaging studies found</p>
              <p className="text-xs text-gray-400 mt-2">Click "Add Imaging Study" to record radiology exams</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {imagingStudies.map((study: any) => (
            <Card key={study.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-lg">{study.studyType} - {study.bodyPart}</h4>
                      <Badge className={getStatusColor(study.status)}>
                        {study.status}
                      </Badge>
                      <Badge className={getPriorityColor(study.priority)}>
                        {study.priority}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                      <div>
                        <span className="font-medium">Study Date:</span>{' '}
                        <span className="text-gray-700">{new Date(study.studyDate).toLocaleDateString()}</span>
                      </div>
                      
                      {study.modality && (
                        <div>
                          <span className="font-medium">Modality:</span>{' '}
                          <span className="text-gray-700">{study.modality}</span>
                        </div>
                      )}
                      
                      {study.referringPhysician && (
                        <div>
                          <span className="font-medium">Ordered By:</span>{' '}
                          <span className="text-gray-700">{study.referringPhysician}</span>
                        </div>
                      )}
                      
                      {study.radiologist && (
                        <div>
                          <span className="font-medium">Radiologist:</span>{' '}
                          <span className="text-gray-700">{study.radiologist}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Indication:</span>{' '}
                        <span className="text-gray-700">{study.indication}</span>
                      </div>
                      
                      {study.findings && (
                        <div>
                          <span className="font-medium">Findings:</span>{' '}
                          <p className="text-gray-700 mt-1">{study.findings}</p>
                        </div>
                      )}
                      
                      {study.impression && (
                        <div className="bg-blue-50 p-3 rounded-md mt-2">
                          <span className="font-medium text-blue-900">Impression:</span>{' '}
                          <p className="text-blue-800 mt-1">{study.impression}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {study.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingStudy(study)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(study)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to remove this imaging study?')) {
                          deleteImagingMutation.mutate(study.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Study Details Dialog */}
      <Dialog open={!!viewingStudy} onOpenChange={() => setViewingStudy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewingStudy?.studyType} - {viewingStudy?.bodyPart}
            </DialogTitle>
          </DialogHeader>
          {viewingStudy && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Study Date:</span>{' '}
                  {new Date(viewingStudy.studyDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{' '}
                  <Badge className={getStatusColor(viewingStudy.status)}>{viewingStudy.status}</Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Clinical Indication</h4>
                <p className="text-gray-700">{viewingStudy.indication}</p>
              </div>
              {viewingStudy.findings && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Findings</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{viewingStudy.findings}</p>
                </div>
              )}
              {viewingStudy.impression && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Impression</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{viewingStudy.impression}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

