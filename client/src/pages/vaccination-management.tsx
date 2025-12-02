import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Syringe, Search, Calendar, AlertTriangle, CheckCircle2, Clock, 
  Users, TrendingUp, Download, Filter, Plus, FileText, Printer,
  Bell, Shield, Activity, ChevronRight, RefreshCw, ClipboardList,
  Building2, ArrowUpRight, Info, AlertCircle, UserCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatPatientName } from '@/lib/patient-utils';
import { 
  STANDARD_VACCINE_SCHEDULES, 
  getVaccinesByCategory, 
  calculatePatientAge,
  calculateVaccineCompliance,
  type ComplianceStatus 
} from '@/lib/vaccine-schedules';
import { VaccinationScheduleViewer } from '@/components/vaccination-schedule-viewer';
import { VaccinationDueAlerts } from '@/components/vaccination-due-alerts';
import { BatchVaccinationRecorder } from '@/components/batch-vaccination-recorder';
import { VaccinationCertificate } from '@/components/vaccination-certificate';
import { VaccineInventoryTracker } from '@/components/vaccine-inventory-tracker';
import { PatientVaccinationCard } from '@/components/patient-vaccination-card';
import { useAuth } from '@/contexts/AuthContext';

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
  patientId: number;
  vaccineName: string;
  dateAdministered: string;
  doseNumber?: string;
  administeredBy?: string;
  lotNumber?: string;
  manufacturer?: string;
  site?: string;
  route?: string;
  nextDueDate?: string;
  notes?: string;
}

export default function VaccinationManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);

  // Fetch patients
  const { data: patients = [], isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  // Fetch all vaccinations (for dashboard stats)
  const { data: allVaccinations = [], isLoading: vaccinationsLoading } = useQuery<Vaccination[]>({
    queryKey: ['/api/vaccinations/all'],
    enabled: user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse',
  });

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const recentVaccinations = allVaccinations.filter(v => 
      new Date(v.dateAdministered) >= thirtyDaysAgo
    );

    const upcomingDue = allVaccinations.filter(v => 
      v.nextDueDate && 
      new Date(v.nextDueDate) <= thirtyDaysFromNow &&
      new Date(v.nextDueDate) >= today
    );

    const overdue = allVaccinations.filter(v => 
      v.nextDueDate && new Date(v.nextDueDate) < today
    );

    // Calculate compliance rate
    const patientsWithRecords = new Set(allVaccinations.map(v => v.patientId)).size;
    const totalPatients = patients.length;
    const complianceRate = totalPatients > 0 ? Math.round((patientsWithRecords / totalPatients) * 100) : 0;

    // Vaccine distribution
    const vaccineDistribution = allVaccinations.reduce((acc, v) => {
      const name = v.vaccineName.split(' ')[0]; // Simplify name
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topVaccines = Object.entries(vaccineDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalVaccinations: allVaccinations.length,
      recentVaccinations: recentVaccinations.length,
      upcomingDue: upcomingDue.length,
      overdue: overdue.length,
      complianceRate,
      topVaccines,
      patientsWithRecords,
    };
  }, [allVaccinations, patients]);

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients.slice(0, 20);
    const query = searchQuery.toLowerCase();
    return patients.filter(p => 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
      p.phone?.includes(query)
    ).slice(0, 50);
  }, [patients, searchQuery]);

  // Get compliance status badge
  const getComplianceBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'up-to-date':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Up to Date</Badge>;
      case 'due-soon':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="w-3 h-3 mr-1" /> Due Soon</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600"><AlertTriangle className="w-3 h-3 mr-1" /> Overdue</Badge>;
      case 'incomplete':
        return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertCircle className="w-3 h-3 mr-1" /> Incomplete</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50/30">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Syringe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Vaccination Management
                </h1>
                <p className="text-sm text-slate-500">
                  Immunization tracking, compliance monitoring & certificate generation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowBatchDialog(true)}>
                <Users className="h-4 w-4 mr-2" />
                Batch Vaccination
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                onClick={() => setActiveTab('record')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Record Vaccination
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-4xl grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Patients</span>
            </TabsTrigger>
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedules</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Total Vaccinations</p>
                      <p className="text-3xl font-bold mt-1">{dashboardStats.totalVaccinations}</p>
                      <p className="text-emerald-100 text-xs mt-1">All time records</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Syringe className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">This Month</p>
                      <p className="text-3xl font-bold mt-1">{dashboardStats.recentVaccinations}</p>
                      <p className="text-blue-100 text-xs mt-1">Last 30 days</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <TrendingUp className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">Due Soon</p>
                      <p className="text-3xl font-bold mt-1">{dashboardStats.upcomingDue}</p>
                      <p className="text-amber-100 text-xs mt-1">Next 30 days</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Clock className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Overdue</p>
                      <p className="text-3xl font-bold mt-1">{dashboardStats.overdue}</p>
                      <p className="text-red-100 text-xs mt-1">Requires attention</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Compliance Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Compliance Overview
                  </CardTitle>
                  <CardDescription>Patient vaccination compliance rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-4xl font-bold text-emerald-600">{dashboardStats.complianceRate}%</p>
                        <p className="text-sm text-slate-500">Overall compliance rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{dashboardStats.patientsWithRecords}</p>
                        <p className="text-sm text-slate-500">Patients with records</p>
                      </div>
                    </div>
                    <Progress value={dashboardStats.complianceRate} className="h-3" />
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Most Administered Vaccines</h4>
                      <div className="space-y-2">
                        {dashboardStats.topVaccines.map(([name, count], idx) => (
                          <div key={name} className="flex items-center gap-3">
                            <span className="text-sm text-slate-500 w-6">{idx + 1}.</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{name}</span>
                                <span className="text-sm text-slate-500">{count}</span>
                              </div>
                              <Progress 
                                value={(count / dashboardStats.totalVaccinations) * 100} 
                                className="h-1.5" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-teal-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-3"
                    onClick={() => setActiveTab('alerts')}
                  >
                    <Bell className="h-4 w-4 mr-3 text-amber-500" />
                    <div className="text-left">
                      <p className="font-medium">View Due Alerts</p>
                      <p className="text-xs text-slate-500">{dashboardStats.upcomingDue + dashboardStats.overdue} patients need attention</p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-3"
                    onClick={() => setShowBatchDialog(true)}
                  >
                    <Users className="h-4 w-4 mr-3 text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium">Batch Vaccination</p>
                      <p className="text-xs text-slate-500">Record multiple vaccinations</p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-3"
                    onClick={() => setActiveTab('schedules')}
                  >
                    <Calendar className="h-4 w-4 mr-3 text-emerald-500" />
                    <div className="text-left">
                      <p className="font-medium">Vaccine Schedules</p>
                      <p className="text-xs text-slate-500">CDC & WHO recommendations</p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-3"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <Building2 className="h-4 w-4 mr-3 text-purple-500" />
                    <div className="text-left">
                      <p className="font-medium">Vaccine Inventory</p>
                      <p className="text-xs text-slate-500">Stock levels & expiry tracking</p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>

                  <Separator className="my-4" />

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-3"
                    onClick={() => setActiveTab('reports')}
                  >
                    <Download className="h-4 w-4 mr-3 text-slate-500" />
                    <div className="text-left">
                      <p className="font-medium">Generate Reports</p>
                      <p className="text-xs text-slate-500">Export vaccination data</p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Recent Vaccinations
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('patients')}>
                    View All <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {vaccinationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : allVaccinations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Syringe className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No vaccination records found</p>
                    <p className="text-sm">Start recording vaccinations to see them here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Vaccine</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Administered By</TableHead>
                          <TableHead>Next Due</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allVaccinations.slice(0, 10).map(vaccination => {
                          const patient = patients.find(p => p.id === vaccination.patientId);
                          return (
                            <TableRow key={vaccination.id}>
                              <TableCell className="font-medium">
                                {patient ? formatPatientName(patient) : `Patient #${vaccination.patientId}`}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Syringe className="h-4 w-4 text-emerald-500" />
                                  {vaccination.vaccineName}
                                  {vaccination.doseNumber && (
                                    <Badge variant="secondary" className="text-xs">
                                      Dose {vaccination.doseNumber}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{new Date(vaccination.dateAdministered).toLocaleDateString()}</TableCell>
                              <TableCell>{vaccination.administeredBy || '-'}</TableCell>
                              <TableCell>
                                {vaccination.nextDueDate ? (
                                  <span className={
                                    new Date(vaccination.nextDueDate) < new Date() 
                                      ? 'text-red-600 font-medium'
                                      : 'text-slate-600'
                                  }>
                                    {new Date(vaccination.nextDueDate).toLocaleDateString()}
                                  </span>
                                ) : '-'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Patient Vaccination Records
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search patients..." 
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Patients</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="due-soon">Due Soon</SelectItem>
                        <SelectItem value="up-to-date">Up to Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {patientsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No patients found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPatients.map(patient => (
                      <PatientVaccinationCard
                        key={patient.id}
                        patient={patient}
                        onViewDetails={() => setSelectedPatient(patient)}
                        onGenerateCertificate={() => {
                          setSelectedPatient(patient);
                          setShowCertificateDialog(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules">
            <VaccinationScheduleViewer />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <VaccinationDueAlerts patients={patients} />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <VaccineInventoryTracker />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Vaccination Reports
                </CardTitle>
                <CardDescription>Generate and export vaccination reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-2 border-dashed hover:border-emerald-300 cursor-pointer transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto mb-3">
                        <Users className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h4 className="font-medium">Coverage Report</h4>
                      <p className="text-sm text-slate-500 mt-1">Vaccination coverage by age group</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed hover:border-blue-300 cursor-pointer transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium">Monthly Summary</h4>
                      <p className="text-sm text-slate-500 mt-1">Vaccinations administered this month</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed hover:border-amber-300 cursor-pointer transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-amber-100 rounded-full w-fit mx-auto mb-3">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                      </div>
                      <h4 className="font-medium">Overdue Report</h4>
                      <p className="text-sm text-slate-500 mt-1">Patients with overdue vaccinations</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed hover:border-purple-300 cursor-pointer transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium">Inventory Report</h4>
                      <p className="text-sm text-slate-500 mt-1">Vaccine stock levels and usage</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed hover:border-teal-300 cursor-pointer transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-teal-100 rounded-full w-fit mx-auto mb-3">
                        <Shield className="h-6 w-6 text-teal-600" />
                      </div>
                      <h4 className="font-medium">Compliance Report</h4>
                      <p className="text-sm text-slate-500 mt-1">Patient compliance statistics</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed hover:border-red-300 cursor-pointer transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-3">
                        <Clock className="h-6 w-6 text-red-600" />
                      </div>
                      <h4 className="font-medium">Expiry Report</h4>
                      <p className="text-sm text-slate-500 mt-1">Vaccines nearing expiration</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Batch Vaccination Dialog */}
      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Batch Vaccination Recording
            </DialogTitle>
          </DialogHeader>
          <BatchVaccinationRecorder 
            patients={patients}
            onComplete={() => {
              setShowBatchDialog(false);
              queryClient.invalidateQueries({ queryKey: ['/api/vaccinations/all'] });
              toast({ title: 'Success', description: 'Batch vaccinations recorded successfully' });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Vaccination Certificate
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <VaccinationCertificate 
              patient={selectedPatient}
              onClose={() => setShowCertificateDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

