import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Heart,
  Thermometer,
  Droplets
} from "lucide-react";
import { format, subDays, isAfter } from "date-fns";

interface PatientStatsDashboardProps {
  patient: any;
  visits: any[];
  labResults: any[];
  prescriptions: any[];
  vitalSigns: any[];
  appointments: any[];
  isDarkMode?: boolean;
}

interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

export default function PatientStatsDashboard({
  patient,
  visits,
  labResults,
  prescriptions,
  vitalSigns,
  appointments,
  isDarkMode = false
}: PatientStatsDashboardProps) {
  // Calculate health metrics
  const latestVitals = vitalSigns[0];
  
  const healthMetrics: HealthMetric[] = [
    {
      name: "Blood Pressure",
      value: latestVitals ? `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}` : "N/A",
      unit: "mmHg",
      status: getBloodPressureStatus(latestVitals?.bloodPressureSystolic),
      trend: getVitalTrend(vitalSigns, 'bloodPressureSystolic'),
      icon: Heart,
      color: "text-red-500"
    },
    {
      name: "Heart Rate",
      value: latestVitals?.heartRate || "N/A",
      unit: "bpm",
      status: getHeartRateStatus(latestVitals?.heartRate),
      trend: getVitalTrend(vitalSigns, 'heartRate'),
      icon: Activity,
      color: "text-blue-500"
    },
    {
      name: "Temperature",
      value: latestVitals?.temperature || "N/A",
      unit: "°C",
      status: getTemperatureStatus(latestVitals?.temperature),
      trend: getVitalTrend(vitalSigns, 'temperature'),
      icon: Thermometer,
      color: "text-orange-500"
    },
    {
      name: "O2 Saturation",
      value: latestVitals?.oxygenSaturation || "N/A",
      unit: "%",
      status: getOxygenStatus(latestVitals?.oxygenSaturation),
      trend: getVitalTrend(vitalSigns, 'oxygenSaturation'),
      icon: Droplets,
      color: "text-blue-600"
    }
  ];

  // Calculate care quality score
  const careQualityScore = calculateCareQualityScore(visits, labResults, prescriptions, vitalSigns);

  // Get recent trends
  const recentTrends = {
    visitFrequency: getVisitFrequency(visits),
    labCompliance: getLabCompliance(labResults),
    medicationAdherence: getMedicationAdherence(prescriptions),
    vitalStability: getVitalStability(vitalSigns)
  };

  return (
    <div className="space-y-6">
      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Clock;
          
          return (
            <Card key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`w-6 h-6 ${metric.color}`} />
                  <Badge variant={
                    metric.status === 'critical' ? 'destructive' : 
                    metric.status === 'warning' ? 'secondary' : 
                    'default'
                  }>
                    {metric.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {metric.name} {metric.unit && `(${metric.unit})`}
                  </p>
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`w-3 h-3 ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 
                      'text-gray-400'
                    }`} />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {metric.trend === 'stable' ? 'Stable' : `Trending ${metric.trend}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Care Quality Score */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Care Quality Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {careQualityScore.overall}%
            </span>
            <Badge variant={careQualityScore.overall >= 85 ? 'default' : careQualityScore.overall >= 70 ? 'secondary' : 'destructive'}>
              {careQualityScore.overall >= 85 ? 'Excellent' : careQualityScore.overall >= 70 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          <Progress value={careQualityScore.overall} className="w-full" />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Visit Consistency</p>
              <div className="flex items-center justify-between">
                <Progress value={careQualityScore.visitConsistency} className="flex-1 mr-2" />
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{careQualityScore.visitConsistency}%</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Lab Compliance</p>
              <div className="flex items-center justify-between">
                <Progress value={careQualityScore.labCompliance} className="flex-1 mr-2" />
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{careQualityScore.labCompliance}%</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Medication Adherence</p>
              <div className="flex items-center justify-between">
                <Progress value={careQualityScore.medicationAdherence} className="flex-1 mr-2" />
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{careQualityScore.medicationAdherence}%</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Vital Monitoring</p>
              <div className="flex items-center justify-between">
                <Progress value={careQualityScore.vitalMonitoring} className="flex-1 mr-2" />
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{careQualityScore.vitalMonitoring}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts */}
      {getHealthAlerts(patient, labResults, vitalSigns, prescriptions).length > 0 && (
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span>Health Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getHealthAlerts(patient, labResults, vitalSigns, prescriptions).map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        alert.severity === 'critical' ? 'text-red-800' :
                        alert.severity === 'warning' ? 'text-yellow-800' :
                        'text-blue-800'
                      }`}>
                        {alert.title}
                      </p>
                      <p className={`text-sm ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {alert.description}
                      </p>
                    </div>
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getBloodPressureStatus(systolic: number): 'normal' | 'warning' | 'critical' {
  if (!systolic) return 'normal';
  if (systolic < 90 || systolic > 180) return 'critical';
  if (systolic > 140) return 'warning';
  return 'normal';
}

function getHeartRateStatus(heartRate: number): 'normal' | 'warning' | 'critical' {
  if (!heartRate) return 'normal';
  if (heartRate < 50 || heartRate > 120) return 'critical';
  if (heartRate < 60 || heartRate > 100) return 'warning';
  return 'normal';
}

function getTemperatureStatus(temperature: number): 'normal' | 'warning' | 'critical' {
  if (!temperature) return 'normal';
  if (temperature < 35 || temperature > 39) return 'critical';
  if (temperature < 36.1 || temperature > 37.5) return 'warning';
  return 'normal';
}

function getOxygenStatus(oxygen: number): 'normal' | 'warning' | 'critical' {
  if (!oxygen) return 'normal';
  if (oxygen < 90) return 'critical';
  if (oxygen < 95) return 'warning';
  return 'normal';
}

function getVitalTrend(vitalSigns: any[], field: string): 'up' | 'down' | 'stable' {
  if (vitalSigns.length < 2) return 'stable';
  const latest = vitalSigns[0]?.[field];
  const previous = vitalSigns[1]?.[field];
  if (!latest || !previous) return 'stable';
  
  const difference = latest - previous;
  const threshold = latest * 0.1; // 10% change threshold
  
  if (Math.abs(difference) < threshold) return 'stable';
  return difference > 0 ? 'up' : 'down';
}

function calculateCareQualityScore(visits: any[], labResults: any[], prescriptions: any[], vitalSigns: any[]) {
  const visitConsistency = getVisitFrequency(visits);
  const labCompliance = getLabCompliance(labResults);
  const medicationAdherence = getMedicationAdherence(prescriptions);
  const vitalMonitoring = getVitalStability(vitalSigns);
  
  const overall = Math.round((visitConsistency + labCompliance + medicationAdherence + vitalMonitoring) / 4);
  
  return {
    overall,
    visitConsistency,
    labCompliance,
    medicationAdherence,
    vitalMonitoring
  };
}

function getVisitFrequency(visits: any[]): number {
  if (visits.length === 0) return 0;
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentVisits = visits.filter(visit => isAfter(new Date(visit.visitDate), thirtyDaysAgo));
  return Math.min(100, (recentVisits.length / 2) * 100); // Assume 2 visits per month is ideal
}

function getLabCompliance(labResults: any[]): number {
  if (labResults.length === 0) return 100;
  const completedLabs = labResults.filter(lab => lab.status === 'completed').length;
  return Math.round((completedLabs / labResults.length) * 100);
}

function getMedicationAdherence(prescriptions: any[]): number {
  if (prescriptions.length === 0) return 100;
  const activePrescriptions = prescriptions.filter(rx => rx.status === 'active').length;
  return Math.min(100, (activePrescriptions / prescriptions.length) * 100);
}

function getVitalStability(vitalSigns: any[]): number {
  if (vitalSigns.length === 0) return 0;
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentVitals = vitalSigns.filter(vital => isAfter(new Date(vital.recordedAt), thirtyDaysAgo));
  return Math.min(100, (recentVitals.length / 4) * 100); // Assume weekly vitals is ideal
}

function getHealthAlerts(patient: any, labResults: any[], vitalSigns: any[], prescriptions: any[]) {
  const alerts = [];
  
  // Critical lab results
  const criticalLabs = labResults.filter(lab => lab.status === 'critical');
  if (criticalLabs.length > 0) {
    alerts.push({
      title: 'Critical Lab Results',
      description: `${criticalLabs.length} lab result(s) require immediate attention`,
      severity: 'critical'
    });
  }
  
  // Overdue prescriptions
  const overduePrescriptions = prescriptions.filter(rx => 
    rx.status === 'pending' && isAfter(new Date(), new Date(rx.createdAt))
  );
  if (overduePrescriptions.length > 0) {
    alerts.push({
      title: 'Overdue Prescriptions',
      description: `${overduePrescriptions.length} prescription(s) need attention`,
      severity: 'warning'
    });
  }
  
  // Missing vital signs
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentVitals = vitalSigns.filter(vital => isAfter(new Date(vital.recordedAt), thirtyDaysAgo));
  if (recentVitals.length === 0) {
    alerts.push({
      title: 'Missing Vital Signs',
      description: 'No vital signs recorded in the last 30 days',
      severity: 'warning'
    });
  }
  
  return alerts;
}