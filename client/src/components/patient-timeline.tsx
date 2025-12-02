import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Stethoscope,
  Pill,
  TestTube,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Heart,
  Thermometer,
  Weight,
  Droplet
} from "lucide-react";
import { format, parseISO, isToday, isThisWeek, isThisMonth } from "date-fns";

interface TimelineEvent {
  id: string;
  type: 'visit' | 'prescription' | 'lab_result' | 'diagnosis' | 'vaccination' | 'vital' | 'lab' | 'consultation';
  date: string;
  title: string;
  description: string;
  details: any;
  metadata?: {
    status?: string;
    severity?: 'normal' | 'abnormal' | 'critical';
    provider?: string;
  };
}

interface VitalTrend {
  date: string;
  value: number;
  unit: string;
  type: 'blood_pressure' | 'temperature' | 'weight' | 'heart_rate';
}

interface PatientTimelineData {
  events: TimelineEvent[];
  vitalTrends: {
    bloodPressure: VitalTrend[];
    temperature: VitalTrend[];
    weight: VitalTrend[];
    heartRate: VitalTrend[];
  };
  chronicConditions: Array<{
    name: string;
    diagnosedDate: string;
    status: 'active' | 'managed' | 'resolved';
  }>;
  medicationHistory: Array<{
    name: string;
    startDate: string;
    endDate?: string;
    adherence?: number;
  }>;
}

interface PatientTimelineProps {
  patientId?: number;
  events?: any[];
}

export function PatientTimeline({ patientId, events: externalEvents }: PatientTimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Only fetch data if patientId is provided and no external events
  const { data, isLoading } = useQuery<PatientTimelineData>({
    queryKey: [`/api/patients/${patientId}/timeline`],
    staleTime: 2 * 60 * 1000,
    enabled: !!patientId && !externalEvents,
  });

  const toggleEvent = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const filterEvents = (events: TimelineEvent[]) => {
    if (timeFilter === 'all') return events;

    return events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        switch (timeFilter) {
          case 'today':
            return isToday(eventDate);
          case 'week':
            return isThisWeek(eventDate);
          case 'month':
            return isThisMonth(eventDate);
          default:
            return true;
        }
      } catch {
        return true;
      }
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return Stethoscope;
      case 'prescription':
        return Pill;
      case 'lab_result':
      case 'lab':
        return TestTube;
      case 'diagnosis':
        return AlertCircle;
      case 'vaccination':
        return Heart;
      case 'vital':
        return Activity;
      case 'consultation':
        return FileText;
      default:
        return FileText;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'visit':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'prescription':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'lab_result':
      case 'lab':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'diagnosis':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'vaccination':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'vital':
        return 'bg-teal-100 text-teal-600 border-teal-200';
      case 'consultation':
        return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Use external events if provided, otherwise use fetched data
  const timelineEvents = externalEvents || data?.events || [];

  // Show loading only when fetching data (not when using external events)
  if (isLoading && !externalEvents) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Transform external events to match TimelineEvent format if needed
  const normalizedEvents: TimelineEvent[] = timelineEvents.map((event: any, index: number) => ({
    id: event.id?.toString() || `event-${index}`,
    type: event.type || 'visit',
    date: event.date || event.createdAt || new Date().toISOString(),
    title: event.title || event.description || 'Activity',
    description: event.description || event.notes || '',
    details: event.details || {},
    metadata: event.metadata || {}
  }));

  const filteredEvents = filterEvents(normalizedEvents);
  const hasFullData = data && !externalEvents;

  // Timeline events rendering
  const renderTimelineEvents = () => (
    <>
      {/* Time Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={timeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('all')}
        >
          All Time
        </Button>
        <Button
          variant={timeFilter === 'today' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('today')}
        >
          Today
        </Button>
        <Button
          variant={timeFilter === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('week')}
        >
          This Week
        </Button>
        <Button
          variant={timeFilter === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeFilter('month')}
        >
          This Month
        </Button>
      </div>

      {/* Timeline Events */}
      <div className="relative">
        {filteredEvents.length > 0 && (
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-gray-200"></div>
        )}

        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const Icon = getEventIcon(event.type);
            const isExpanded = expandedEvents.has(event.id);

            return (
              <div key={event.id} className="relative pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-0 w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center ${getEventColor(event.type)}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Event card */}
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-blue-400">
                  <CardHeader className="pb-2 pt-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <CardTitle className="text-sm font-semibold">{event.title}</CardTitle>
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.type.replace('_', ' ')}
                          </Badge>
                          {event.metadata?.status && (
                            <Badge
                              variant="secondary"
                              className={
                                event.metadata.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : event.metadata.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {event.metadata.status}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {(() => {
                              try {
                                return format(parseISO(event.date), 'PPp');
                              } catch {
                                return event.date;
                              }
                            })()}
                          </div>
                          {event.metadata?.provider && (
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {event.metadata.provider}
                            </div>
                          )}
                        </div>
                      </div>
                      {event.details && Object.keys(event.details).length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEvent(event.id)}
                          className="h-7 w-7 p-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}

                    {isExpanded && event.details && Object.keys(event.details).length > 0 && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1.5">
                        {Object.entries(event.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="font-medium text-slate-600 dark:text-slate-400 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-slate-900 dark:text-slate-100">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">No Activity Found</h3>
            <p className="text-sm text-slate-500">
              {timeFilter === 'all'
                ? 'No events recorded for this patient yet'
                : `No events found for ${timeFilter === 'today' ? 'today' : timeFilter === 'week' ? 'this week' : 'this month'}`
              }
            </p>
            {timeFilter !== 'all' && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setTimeFilter('all')}>
                View All Time
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );

  // If using external events (simple mode), render without tabs
  if (!hasFullData) {
    return (
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <p className="text-sm text-slate-500">{filteredEvents.length} events</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {renderTimelineEvents()}
        </CardContent>
      </Card>
    );
  }

  // Full mode with tabs
  return (
    <Tabs defaultValue="timeline" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="vitals">Vital Trends</TabsTrigger>
        <TabsTrigger value="conditions">Conditions</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="space-y-4">
        {renderTimelineEvents()}
      </TabsContent>

      <TabsContent value="vitals" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.vitalTrends.bloodPressure.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplet className="h-5 w-5 text-red-600" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalTrendChart data={data.vitalTrends.bloodPressure} color="red" />
              </CardContent>
            </Card>
          )}

          {data.vitalTrends.temperature.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Thermometer className="h-5 w-5 text-orange-600" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalTrendChart data={data.vitalTrends.temperature} color="orange" />
              </CardContent>
            </Card>
          )}

          {data.vitalTrends.weight.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Weight className="h-5 w-5 text-blue-600" />
                  Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalTrendChart data={data.vitalTrends.weight} color="blue" />
              </CardContent>
            </Card>
          )}

          {data.vitalTrends.heartRate.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalTrendChart data={data.vitalTrends.heartRate} color="pink" />
              </CardContent>
            </Card>
          )}

          {data.vitalTrends.bloodPressure.length === 0 &&
            data.vitalTrends.temperature.length === 0 &&
            data.vitalTrends.weight.length === 0 &&
            data.vitalTrends.heartRate.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No vital trend data available</p>
              </div>
            )}
        </div>
      </TabsContent>

      <TabsContent value="conditions" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chronic Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.chronicConditions.map((condition, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{condition.name}</span>
                      <Badge
                        variant="secondary"
                        className={
                          condition.status === 'active'
                            ? 'bg-red-100 text-red-800'
                            : condition.status === 'managed'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }
                      >
                        {condition.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Diagnosed: {format(parseISO(condition.diagnosedDate), 'PP')}
                    </p>
                  </div>
                ))}
                {data.chronicConditions.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No chronic conditions recorded</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Medication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.medicationHistory.map((med, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{med.name}</span>
                      {med.adherence !== undefined && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {med.adherence}% adherence
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Started: {format(parseISO(med.startDate), 'PP')}
                      {med.endDate && ` • Ended: ${format(parseISO(med.endDate), 'PP')}`}
                    </p>
                  </div>
                ))}
                {data.medicationHistory.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No medication history</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Vital Trend Chart Component
function VitalTrendChart({ data, color }: { data: VitalTrend[]; color: string }) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const trend = previous ? latest.value - previous.value : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{latest.value}</div>
          <div className="text-xs text-gray-500">{latest.unit}</div>
        </div>
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-red-500" />
          ) : trend < 0 ? (
            <TrendingDown className="h-4 w-4 text-green-500" />
          ) : (
            <Activity className="h-4 w-4 text-gray-400" />
          )}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-red-500' : trend < 0 ? 'text-green-500' : 'text-gray-400'}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((point.value - min) / range) * 80 - 10;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            className={`stroke-${color}-500`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{format(parseISO(data[0].date), 'MMM d')}</span>
        <span>{format(parseISO(latest.date), 'MMM d')}</span>
      </div>
    </div>
  );
}
