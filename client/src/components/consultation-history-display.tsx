import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Calendar, 
  User, 
  Activity, 
  FileText, 
  ChevronDown, 
  Search, 
  Filter,
  Clock,
  UserCheck,
  Stethoscope,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ConsultationHistoryDisplayProps {
  patientId: number;
  patient?: any;
}

export default function ConsultationHistoryDisplay({ patientId, patient }: ConsultationHistoryDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  
  // Enhanced filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedFormType, setSelectedFormType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Custom date range state
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Fetch actual consultation records
  const { data: consultationRecords = [], isLoading: historyLoading } = useQuery({
    queryKey: [`/api/patients/${patientId}/consultation-records`],
  });

  // Fetch visits to include in consultation history
  const { data: visits = [], isLoading: visitsLoading } = useQuery({
    queryKey: [`/api/patients/${patientId}/visits`],
  });

  // Combine consultation records and visits into unified timeline
  const combinedRecords = React.useMemo(() => {
    const records = [
      // Transform consultation records - include all records
      ...(consultationRecords as any[])
        .map((record: any) => ({
          ...record,
          type: 'consultation',
          date: record.createdAt,
          title: record.formName || 'Consultation',
          conductedBy: record.conductedByFullName || 'Healthcare Staff',
          role: record.conductedByRole || 'staff',
          uniqueKey: `consultation-${record.id}-${record.createdAt}`
        })),
      // Transform visits - include all visits
      ...(visits as any[])
        .map((visit: any) => ({
          ...visit,
          id: `visit-${visit.id}`,
          type: 'visit',
          date: visit.visitDate || visit.createdAt,
          title: `${visit.visitType?.charAt(0).toUpperCase() + visit.visitType?.slice(1) || 'Medical Visit'}`,
          conductedBy: visit.doctorName || 'Healthcare Staff',
          role: 'doctor',
          formName: visit.visitType,
          complaint: visit.complaint,
          diagnosis: visit.diagnosis,
          treatment: visit.treatment,
          uniqueKey: `visit-${visit.id}-${visit.visitDate || visit.createdAt}`
        }))
    ];
    
    // Sort by date descending (newest first) - show all records
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [consultationRecords, visits]);

  // Apply filters to combined records
  const filteredRecords = combinedRecords.filter((record: any) => {
    // Filter by search term
    if (searchTerm && !record.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !record.conductedBy.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by role
    if (selectedRole !== "all" && record.role !== selectedRole) {
      return false;
    }
    
    // Filter by form type
    if (selectedFormType !== "all" && !record.title.toLowerCase().includes(selectedFormType.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (dateRange !== "all") {
      const recordDate = new Date(record.date);
      const now = new Date();
      
      switch (dateRange) {
        case "today":
          if (recordDate.toDateString() !== now.toDateString()) return false;
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (recordDate < weekAgo) return false;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (recordDate < monthAgo) return false;
          break;
        case "custom":
          if (customDateFrom && recordDate < customDateFrom) return false;
          if (customDateTo && recordDate > customDateTo) return false;
          break;
      }
    }
    
    return true;
  });

  const isLoading = historyLoading || visitsLoading;
  
  // Get unique roles and form types for filters
  const uniqueRoles = [...new Set(combinedRecords.map(r => r.role))];
  const uniqueFormTypes = [...new Set(combinedRecords.map(r => r.title))];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Consultation History</h3>
                  <p className="text-sm text-gray-600">
                    {combinedRecords.length} records ({consultationRecords.length} consultations, {visits.length} visits)
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                View Timeline
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Consultation History Timeline - {patient?.firstName} {patient?.lastName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Enhanced Search and Filter Controls */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search consultations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
            
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <Select value={selectedFormType} onValueChange={setSelectedFormType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueFormTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-medium">
                {filteredRecords.length} of {combinedRecords.length} records found
              </span>
            </div>
            {filteredRecords.length !== combinedRecords.length && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("all");
                  setSelectedFormType("all");
                  setDateRange("all");
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Timeline Display */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading consultation history...</div>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No consultation records found.</p>
                {combinedRecords.length > 0 && <p className="text-sm">Try adjusting your filters.</p>}
              </div>
            ) : (
              <div className="relative">
                {/* Enhanced Vertical Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-gray-300 rounded-full shadow-sm"></div>
                
                {filteredRecords.map((record: any, index: number) => (
                  <div key={record.uniqueKey || record.id} className="relative flex items-start mb-4 last:mb-2">
                    {/* Enhanced Timeline dot with type indication */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
                      record.type === 'consultation' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-green-500 to-teal-600'
                    }`}>
                      {record.type === 'consultation' ? (
                        <FileText className="w-5 h-5 text-white" />
                      ) : (
                        <Activity className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    {/* Enhanced Consultation content */}
                    <div className="ml-4 flex-1">
                      <Card className={`border-l-4 shadow-md hover:shadow-lg transition-all duration-200 ${
                        record.type === 'consultation' ? 'border-l-blue-500' : 'border-l-green-500'
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-bold text-lg text-gray-900 flex items-center">
                                  {record.type === 'consultation' ? '🩺' : '📋'} {record.title}
                                </h4>
                                <Badge variant="outline" className={`${
                                  record.type === 'consultation' 
                                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                    : 'bg-green-50 text-green-700 border-green-200'
                                }`}>
                                  {new Date(record.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </Badge>
                                <Badge variant={record.type === 'consultation' ? 'default' : 'secondary'} className="text-xs">
                                  {record.type === 'consultation' ? 'Consultation' : 'Visit'}
                                </Badge>
                              </div>
                              
                              {/* Enhanced metadata */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                  <div>
                                    <span className="font-medium text-gray-700">📅 {new Date(record.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}</span>
                                    <div className="text-xs text-gray-500">
                                      🕐 {new Date(record.date).toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-green-500" />
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      👤 {record.conductedByFullName || record.conductedBy || 'Healthcare Staff'}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {record.roleDisplayName || record.conductedByRole || record.role || 'Staff'}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Activity className="h-4 w-4 text-purple-500" />
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      🏥 {record.specialistRole || record.roleDisplayName || 'General'}
                                    </span>
                                    <div className="text-xs text-gray-500">Specialty</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {/* Preview of key data - different display for consultations vs visits */}
                            {record.type === 'consultation' && record.formData ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(record.formData).slice(0, 4).map(([key, value]) => {
                                  if (!value || (typeof value === 'object' && !Object.values(value).some(v => v))) return null;
                                  
                                  return (
                                    <div key={key} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                      <span className="font-medium text-blue-800 capitalize text-sm block mb-1">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                      </span>
                                      <div className="text-blue-700 text-sm">
                                        {typeof value === 'object' ? (
                                          <div className="space-y-1">
                                            {Object.entries(value).slice(0, 2).map(([subKey, subValue]) => 
                                              subValue ? (
                                                <div key={subKey} className="text-xs">
                                                  <span className="font-medium">{subKey}:</span> {String(subValue).substring(0, 50)}
                                                  {String(subValue).length > 50 && '...'}
                                                </div>
                                              ) : null
                                            )}
                                          </div>
                                        ) : (
                                          <span>
                                            {String(value).substring(0, 100)}
                                            {String(value).length > 100 && '...'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : record.type === 'visit' ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Visit-specific data display */}
                                {record.complaint && (
                                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                    <span className="font-medium text-red-800 text-sm block mb-1">Chief Complaint:</span>
                                    <div className="text-red-700 text-sm">{record.complaint}</div>
                                  </div>
                                )}
                                {record.diagnosis && (
                                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <span className="font-medium text-blue-800 text-sm block mb-1">Diagnosis:</span>
                                    <div className="text-blue-700 text-sm">{record.diagnosis}</div>
                                  </div>
                                )}
                                {record.treatment && (
                                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <span className="font-medium text-green-800 text-sm block mb-1">Treatment:</span>
                                    <div className="text-green-700 text-sm">{record.treatment}</div>
                                  </div>
                                )}
                                {/* Vital signs if available */}
                                {(record.bloodPressure || record.heartRate || record.temperature || record.weight) && (
                                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                    <span className="font-medium text-purple-800 text-sm block mb-1">Vital Signs:</span>
                                    <div className="text-purple-700 text-xs space-y-1">
                                      {record.bloodPressure && <div>BP: {record.bloodPressure}</div>}
                                      {record.heartRate && <div>HR: {record.heartRate} bpm</div>}
                                      {record.temperature && <div>Temp: {record.temperature}°C</div>}
                                      {record.weight && <div>Weight: {record.weight} kg</div>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <span className="text-gray-600 text-sm italic">No additional data available for this record.</span>
                              </div>
                            )}
                            
                            {/* View Full Note expandable section */}
                            {record.type === 'consultation' && record.formData && (
                              <Collapsible>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                                      👁️ View Full Note
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-3">
                                  <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="space-y-3">
                                      {Object.entries(record.formData || {}).map(([key, value]) => {
                                        if (!value || (typeof value === 'object' && !Object.values(value).some(v => v))) return null;
                                        
                                        return (
                                          <div key={key} className="bg-white p-3 rounded border">
                                            <span className="font-medium text-gray-700 capitalize block mb-2">
                                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                            </span>
                                            <div className="text-gray-600">
                                              {typeof value === 'object' ? (
                                                <div className="space-y-2">
                                                  {Object.entries(value).map(([subKey, subValue]) => 
                                                    subValue ? (
                                                      <div key={subKey} className="flex justify-between p-2 bg-gray-50 rounded">
                                                        <span className="font-medium text-sm">{subKey}:</span>
                                                        <span className="text-sm">{String(subValue)}</span>
                                                      </div>
                                                    ) : null
                                                  )}
                                                </div>
                                              ) : (
                                                <div className="whitespace-pre-wrap">{String(value)}</div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* End of timeline indicator */}
            <div className="relative flex items-center mt-4">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center ml-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <span className="ml-4 text-gray-500 text-sm">End of consultation history</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}