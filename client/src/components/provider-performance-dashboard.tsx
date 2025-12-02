import { useQuery } from '@tantml:react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  Activity, 
  Clock, 
  TrendingUp, 
  Award, 
  Calendar,
  Stethoscope,
  FileText
} from 'lucide-react';

interface ProviderStats {
  todayPatients: number;
  weekPatients: number;
  monthPatients: number;
  averageConsultationTime: number;
  topDiagnoses: { diagnosis: string; count: number }[];
  prescriptionCount: number;
  followUpRate: number;
  patientSatisfaction: number;
  consultationsByDay: { day: string; count: number }[];
  diagnosisCategories: { category: string; count: number; percentage: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function ProviderPerformanceDashboard({ providerId }: { providerId?: number }) {
  const { data: stats, isLoading } = useQuery<ProviderStats>({
    queryKey: [`/api/providers/${providerId}/stats`],
    // Mock data for demonstration
    queryFn: async () => ({
      todayPatients: 12,
      weekPatients: 58,
      monthPatients: 234,
      averageConsultationTime: 15.5,
      topDiagnoses: [
        { diagnosis: 'Upper Respiratory Infection', count: 45 },
        { diagnosis: 'Hypertension', count: 38 },
        { diagnosis: 'Type 2 Diabetes', count: 32 },
        { diagnosis: 'Gastroenteritis', count: 25 },
        { diagnosis: 'Musculoskeletal Pain', count: 20 }
      ],
      prescriptionCount: 186,
      followUpRate: 78,
      patientSatisfaction: 4.6,
      consultationsByDay: [
        { day: 'Mon', count: 11 },
        { day: 'Tue', count: 13 },
        { day: 'Wed', count: 15 },
        { day: 'Thu', count: 12 },
        { day: 'Fri', count: 7 }
      ],
      diagnosisCategories: [
        { category: 'Infectious Disease', count: 78, percentage: 33 },
        { category: 'Chronic Disease', count: 70, percentage: 30 },
        { category: 'Acute Illness', count: 45, percentage: 19 },
        { category: 'Preventive Care', count: 28, percentage: 12 },
        { category: 'Other', count: 13, percentage: 6 }
      ]
    })
  });

  if (isLoading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayPatients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.weekPatients} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Consultation Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageConsultationTime} min</div>
            <p className="text-xs text-muted-foreground">
              Target: 15-20 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Follow-up Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.followUpRate}%</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">Above target</Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patientSatisfaction}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Based on {stats.monthPatients} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Consultations by Day */}
            <Card>
              <CardHeader>
                <CardTitle>Consultations This Week</CardTitle>
                <CardDescription>Daily patient volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.consultationsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>Performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Total Consultations</span>
                  </div>
                  <span className="font-bold">{stats.monthPatients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Prescriptions Written</span>
                  </div>
                  <span className="font-bold">{stats.prescriptionCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Avg Patients/Day</span>
                  </div>
                  <span className="font-bold">{Math.round(stats.monthPatients / 20)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Active Patients</span>
                  </div>
                  <span className="font-bold">{Math.round(stats.monthPatients * 0.6)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Diagnoses */}
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Diagnoses</CardTitle>
                <CardDescription>Most common conditions this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topDiagnoses.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Badge variant="outline">{idx + 1}</Badge>
                        <span className="text-sm">{item.diagnosis}</span>
                      </div>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Diagnosis Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis Categories</CardTitle>
                <CardDescription>Case mix distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.diagnosisCategories}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({name, percentage}) => `${name} (${percentage}%)`}
                    >
                      {stats.diagnosisCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Indicators</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Follow-up Compliance</span>
                    <span className="text-sm font-medium">{stats.followUpRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${stats.followUpRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Patient Satisfaction</span>
                    <span className="text-sm font-medium">{(stats.patientSatisfaction / 5 * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${stats.patientSatisfaction / 5 * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Documentation Completion</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: '94%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Preventive Care Screening</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: '82%' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peer Comparison</CardTitle>
                <CardDescription>Compared to department average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Patients/Day</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">+12%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consultation Time</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">On target</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Patient Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">+8%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Follow-up Rate</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">+5%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
