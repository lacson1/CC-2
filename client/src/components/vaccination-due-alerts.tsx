import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Bell, Search, AlertTriangle, Clock, Calendar, Phone, Mail, 
  MessageSquare, CheckCircle2, Filter, Download, Send,
  ChevronRight, User, Baby, RefreshCw, Syringe
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
  email?: string;
}

interface Vaccination {
  id: number;
  patientId: number;
  vaccineName: string;
  dateAdministered: string;
  doseNumber?: string;
  nextDueDate?: string;
}

interface VaccinationDueAlertsProps {
  patients: Patient[];
}

interface DueAlert {
  patient: Patient;
  vaccinations: Vaccination[];
  age: { months: number; years: number; display: string };
  overdueVaccines: string[];
  dueSoonVaccines: string[];
  recommendedVaccines: string[];
  priority: 'high' | 'medium' | 'low';
  daysOverdue: number;
}

export function VaccinationDueAlerts({ patients }: VaccinationDueAlertsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('all');
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(new Set());

  // Fetch all vaccinations
  const { data: allVaccinations = [], isLoading } = useQuery<Vaccination[]>({
    queryKey: ['/api/vaccinations/all'],
  });

  // Calculate due alerts for each patient
  const dueAlerts = useMemo(() => {
    const today = new Date();
    const alerts: DueAlert[] = [];

    patients.forEach(patient => {
      if (!patient.dateOfBirth) return;

      const age = calculatePatientAge(patient.dateOfBirth);
      const patientVaccinations = allVaccinations.filter(v => v.patientId === patient.id);
      
      const overdueVaccines: string[] = [];
      const dueSoonVaccines: string[] = [];
      let maxDaysOverdue = 0;

      // Check for overdue vaccines based on nextDueDate
      patientVaccinations.forEach(v => {
        if (v.nextDueDate) {
          const dueDate = new Date(v.nextDueDate);
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilDue < 0) {
            overdueVaccines.push(v.vaccineName);
            maxDaysOverdue = Math.max(maxDaysOverdue, Math.abs(daysUntilDue));
          } else if (daysUntilDue <= 30) {
            dueSoonVaccines.push(v.vaccineName);
          }
        }
      });

      // Get recommended vaccines based on age
      const previousVaccinations = patientVaccinations.map(v => ({
        vaccineName: v.vaccineName,
        doseNumber: v.doseNumber ? parseInt(v.doseNumber) : undefined
      }));
      const recommended = getRecommendedVaccines(age.months, previousVaccinations);
      const recommendedVaccines = recommended.map(v => v.shortName);

      // Only include patients with alerts
      if (overdueVaccines.length > 0 || dueSoonVaccines.length > 0 || recommendedVaccines.length > 0) {
        let priority: 'high' | 'medium' | 'low' = 'low';
        if (overdueVaccines.length > 0) {
          priority = maxDaysOverdue > 60 ? 'high' : 'medium';
        } else if (dueSoonVaccines.length > 0) {
          priority = 'medium';
        }

        alerts.push({
          patient,
          vaccinations: patientVaccinations,
          age,
          overdueVaccines,
          dueSoonVaccines,
          recommendedVaccines,
          priority,
          daysOverdue: maxDaysOverdue,
        });
      }
    });

    // Sort by priority and days overdue
    return alerts.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.daysOverdue - a.daysOverdue;
    });
  }, [patients, allVaccinations]);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return dueAlerts.filter(alert => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = formatPatientName(alert.patient).toLowerCase().includes(query);
        const vaccineMatch = [...alert.overdueVaccines, ...alert.dueSoonVaccines]
          .some(v => v.toLowerCase().includes(query));
        if (!nameMatch && !vaccineMatch) return false;
      }

      // Priority filter
      if (filterPriority !== 'all' && alert.priority !== filterPriority) return false;

      // Age group filter
      if (filterAgeGroup !== 'all') {
        const ageMonths = alert.age.months;
        switch (filterAgeGroup) {
          case 'infant':
            if (ageMonths > 12) return false;
            break;
          case 'child':
            if (ageMonths <= 12 || ageMonths > 72) return false;
            break;
          case 'adolescent':
            if (ageMonths <= 72 || ageMonths > 216) return false;
            break;
          case 'adult':
            if (ageMonths <= 216) return false;
            break;
        }
      }

      return true;
    });
  }, [dueAlerts, searchQuery, filterPriority, filterAgeGroup]);

  // Statistics
  const stats = useMemo(() => ({
    total: dueAlerts.length,
    high: dueAlerts.filter(a => a.priority === 'high').length,
    medium: dueAlerts.filter(a => a.priority === 'medium').length,
    low: dueAlerts.filter(a => a.priority === 'low').length,
  }), [dueAlerts]);

  const togglePatientSelection = (patientId: number) => {
    const newSelection = new Set(selectedPatients);
    if (newSelection.has(patientId)) {
      newSelection.delete(patientId);
    } else {
      newSelection.add(patientId);
    }
    setSelectedPatients(newSelection);
  };

  const selectAll = () => {
    if (selectedPatients.size === filteredAlerts.length) {
      setSelectedPatients(new Set());
    } else {
      setSelectedPatients(new Set(filteredAlerts.map(a => a.patient.id)));
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600"><AlertTriangle className="w-3 h-3 mr-1" /> High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="w-3 h-3 mr-1" /> Medium</Badge>;
      default:
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Calendar className="w-3 h-3 mr-1" /> Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Alerts</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">High Priority</p>
                <p className="text-2xl font-bold text-red-700">{stats.high}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Medium Priority</p>
                <p className="text-2xl font-bold text-amber-700">{stats.medium}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Low Priority</p>
                <p className="text-2xl font-bold text-blue-700">{stats.low}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Vaccination Due Alerts
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search patients or vaccines..." 
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="infant">Infants (0-12mo)</SelectItem>
                  <SelectItem value="child">Children (1-6yr)</SelectItem>
                  <SelectItem value="adolescent">Adolescents (7-18yr)</SelectItem>
                  <SelectItem value="adult">Adults (19+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          {selectedPatients.size > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedPatients.size} patient(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS Notification
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>
          )}

          {/* Alerts Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-400 mb-3" />
              <p className="text-slate-600 font-medium">No vaccination alerts</p>
              <p className="text-sm text-slate-500">All patients are up to date with their vaccinations</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedPatients.size === filteredAlerts.length && filteredAlerts.length > 0}
                        onCheckedChange={selectAll}
                      />
                    </TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Overdue Vaccines</TableHead>
                    <TableHead>Due Soon</TableHead>
                    <TableHead>Recommended</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map(alert => (
                    <TableRow key={alert.patient.id} className="hover:bg-slate-50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedPatients.has(alert.patient.id)}
                          onCheckedChange={() => togglePatientSelection(alert.patient.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${
                            alert.age.months <= 12 ? 'bg-pink-100' : 
                            alert.age.months <= 72 ? 'bg-blue-100' : 
                            alert.age.months <= 216 ? 'bg-purple-100' : 'bg-emerald-100'
                          }`}>
                            {alert.age.months <= 12 ? (
                              <Baby className="h-4 w-4 text-pink-600" />
                            ) : (
                              <User className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{formatPatientName(alert.patient)}</p>
                            <p className="text-xs text-slate-500">ID: {alert.patient.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{alert.age.display}</span>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(alert.priority)}
                        {alert.daysOverdue > 0 && (
                          <p className="text-xs text-red-500 mt-1">
                            {alert.daysOverdue} days overdue
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {alert.overdueVaccines.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {alert.overdueVaccines.slice(0, 2).map((v, i) => (
                              <Badge key={i} variant="destructive" className="text-xs">
                                {v}
                              </Badge>
                            ))}
                            {alert.overdueVaccines.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{alert.overdueVaccines.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {alert.dueSoonVaccines.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {alert.dueSoonVaccines.slice(0, 2).map((v, i) => (
                              <Badge key={i} className="bg-amber-100 text-amber-700 text-xs">
                                {v}
                              </Badge>
                            ))}
                            {alert.dueSoonVaccines.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{alert.dueSoonVaccines.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {alert.recommendedVaccines.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {alert.recommendedVaccines.slice(0, 2).map((v, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {v}
                              </Badge>
                            ))}
                            {alert.recommendedVaccines.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{alert.recommendedVaccines.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {alert.patient.phone && (
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Phone className="h-4 w-4 text-slate-500" />
                            </Button>
                          )}
                          {alert.patient.email && (
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Mail className="h-4 w-4 text-slate-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/patients/${alert.patient.id}`}>
                          <Button size="sm" variant="ghost">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

