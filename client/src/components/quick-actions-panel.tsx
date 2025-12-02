import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Calendar,
  Stethoscope,
  Pill,
  TestTube,
  FileText,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PatientRegistrationModal from "@/components/patient-registration-modal";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  action: () => void;
  count?: number;
  urgent?: boolean;
  roles?: string[];
}

interface TodayOverview {
  scheduledAppointments: number;
  completedVisits: number;
  pendingLabs: number;
  pendingPrescriptions: number;
  criticalAlerts: number;
  lowStockItems: number;
  upcomingAppointments: Array<{
    id: number;
    patientName: string;
    time: string;
    type: string;
  }>;
  urgentTasks: Array<{
    id: string;
    title: string;
    type: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export function QuickActionsPanel({ userRole }: { userRole: string }) {
  const [, setLocation] = useLocation();
  const [showPatientModal, setShowPatientModal] = useState(false);

  const { data: todayOverview, isLoading } = useQuery<TodayOverview>({
    queryKey: ['/api/dashboard/today-overview'],
    staleTime: 60 * 1000, // Cache for 1 minute
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
  });

  const quickActions: QuickAction[] = [
    {
      id: 'new-patient',
      title: 'Register Patient',
      description: 'Add new patient to system',
      icon: UserPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => setShowPatientModal(true),
      roles: ['admin', 'receptionist', 'doctor', 'nurse'],
    },
    {
      id: 'schedule-appointment',
      title: 'Book Appointment',
      description: 'Schedule patient visit',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: () => setLocation('/appointments?action=new'),
      count: todayOverview?.scheduledAppointments,
      roles: ['admin', 'receptionist', 'doctor', 'nurse'],
    },
    {
      id: 'record-vitals',
      title: 'Record Visit',
      description: 'Document patient consultation',
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => setLocation('/patients'),
      roles: ['doctor', 'nurse'],
    },
    {
      id: 'new-prescription',
      title: 'New Prescription',
      description: 'Create medication order',
      icon: Pill,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: () => setLocation('/prescriptions'),
      count: todayOverview?.pendingPrescriptions,
      roles: ['doctor'],
    },
    {
      id: 'lab-order',
      title: 'Order Lab Test',
      description: 'Request laboratory tests',
      icon: TestTube,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: () => setLocation('/lab-orders'),
      count: todayOverview?.pendingLabs,
      urgent: (todayOverview?.pendingLabs || 0) > 10,
      roles: ['doctor', 'nurse', 'lab_technician'],
    },
    {
      id: 'view-results',
      title: 'Lab Results',
      description: 'Review test results',
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      action: () => setLocation('/lab-results'),
      roles: ['doctor', 'nurse', 'lab_technician'],
    },
    {
      id: 'clinical-activity',
      title: 'Clinical Dashboard',
      description: 'View patient activity',
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      action: () => setLocation('/clinical-activity'),
      roles: ['doctor', 'nurse'],
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      description: 'Manage medications',
      icon: Pill,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      action: () => setLocation('/pharmacy'),
      count: todayOverview?.lowStockItems,
      urgent: (todayOverview?.lowStockItems || 0) > 0,
      roles: ['pharmacist', 'admin'],
    },
  ];

  const filteredActions = quickActions.filter(
    action => !action.roles || action.roles.includes(userRole)
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Overview Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Clock className="h-5 w-5" />
            Today's Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-900">
                {todayOverview?.scheduledAppointments || 0}
              </div>
              <p className="text-sm text-blue-700">Appointments</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-900">
                {todayOverview?.completedVisits || 0}
              </div>
              <p className="text-sm text-green-700">Completed</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-900">
                {todayOverview?.pendingLabs || 0}
              </div>
              <p className="text-sm text-orange-700">Pending Labs</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-900">
                {todayOverview?.pendingPrescriptions || 0}
              </div>
              <p className="text-sm text-purple-700">Prescriptions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`${action.bgColor} border border-transparent hover:border-gray-200 rounded-lg p-4 text-left transition-all duration-200 hover:shadow-md hover:scale-105 relative`}
            >
              {action.urgent && (
                <div className="absolute top-2 right-2">
                  <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
                </div>
              )}
              {action.count !== undefined && !action.urgent && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {action.count}
                  </Badge>
                </div>
              )}
              <div className={`${action.color} mb-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Urgent Tasks */}
      {todayOverview?.urgentTasks && todayOverview.urgentTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayOverview.urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-600 capitalize">{task.type}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      {todayOverview?.upcomingAppointments && todayOverview.upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayOverview.upcomingAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setLocation(`/appointments`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{appointment.patientName}</p>
                      <p className="text-xs text-gray-600">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Registration Modal */}
      {showPatientModal && (
        <PatientRegistrationModal
          open={showPatientModal}
          onOpenChange={setShowPatientModal}
        />
      )}
    </div>
  );
}


