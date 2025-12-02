import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, Minus, FlaskRound } from "lucide-react";
import { format } from "date-fns";

interface PatientLabHistoryProps {
  patientId: number;
}

export function PatientLabHistory({ patientId }: PatientLabHistoryProps) {
  // Fetch all lab results for this patient
  const { data: labResults, isLoading } = useQuery({
    queryKey: [`/api/patients/${patientId}/labs`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-500">Loading lab history...</div>
      </div>
    );
  }

  if (!labResults || labResults.length === 0) {
    return (
      <div className="text-center py-8">
        <FlaskRound className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-sm font-medium text-slate-900">No Lab History</h3>
        <p className="mt-2 text-sm text-slate-500">
          Historical lab results will appear here once tests are completed.
        </p>
      </div>
    );
  }

  // Group results by test name for trend analysis
  const groupedResults = labResults.reduce((acc: any, result: any) => {
    const testName = result.testName || 'Unknown Test';
    if (!acc[testName]) {
      acc[testName] = [];
    }
    acc[testName].push(result);
    return acc;
  }, {});

  // Sort each group by date (newest first)
  Object.keys(groupedResults).forEach(testName => {
    groupedResults[testName].sort((a: any, b: any) => 
      new Date(b.testDate || b.createdAt).getTime() - new Date(a.testDate || b.createdAt).getTime()
    );
  });

  const getTrendIcon = (results: any[]) => {
    if (results.length < 2) return <Minus className="h-4 w-4 text-gray-400" />;
    
    const latest = parseFloat(results[0].result);
    const previous = parseFloat(results[1].result);
    
    if (isNaN(latest) || isNaN(previous)) return <Minus className="h-4 w-4 text-gray-400" />;
    
    if (latest > previous) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (latest < previous) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      'normal': { variant: 'default', label: 'Normal' },
      'abnormal': { variant: 'destructive', label: 'Abnormal' },
      'critical': { variant: 'destructive', label: 'Critical' },
      'pending': { variant: 'outline', label: 'Pending' },
      'completed': { variant: 'default', label: 'Completed' },
    };

    const config = statusMap[status?.toLowerCase()] || { variant: 'outline', label: status || 'Unknown' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Complete Lab History</h3>
          <p className="text-sm text-slate-500">
            All historical test results with trend analysis
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {Object.keys(groupedResults).length} Different Tests
        </Badge>
      </div>

      {Object.entries(groupedResults).map(([testName, results]: [string, any]) => (
        <Card key={testName} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskRound className="h-4 w-4" />
                {testName}
                {getTrendIcon(results)}
              </CardTitle>
              <Badge variant="secondary">{results.length} tests</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.slice(0, 5).map((result: any, idx: number) => (
                <div
                  key={result.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    idx === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {result.testDate
                            ? format(new Date(result.testDate), 'MMM dd, yyyy')
                            : result.createdAt
                            ? format(new Date(result.createdAt), 'MMM dd, yyyy')
                            : 'Unknown date'}
                        </span>
                        {idx === 0 && (
                          <Badge variant="outline" className="text-xs">Latest</Badge>
                        )}
                      </div>
                      {result.notes && (
                        <p className="text-xs text-slate-500 mt-1">{result.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        {result.result || 'N/A'}
                      </div>
                      {result.normalRange && (
                        <div className="text-xs text-slate-500">
                          Normal: {result.normalRange}
                        </div>
                      )}
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                </div>
              ))}

              {results.length > 5 && (
                <div className="text-center py-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all {results.length} results →
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center text-xs text-slate-500 mt-6">
        Showing historical data for {labResults.length} total lab results
      </div>
    </div>
  );
}

