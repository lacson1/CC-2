import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Phone } from 'lucide-react';
import { checkCriticalValue, getCriticalLabActions } from '@/lib/critical-lab-values';

interface CriticalLabAlertProps {
  testName: string;
  value: number;
  patientName?: string;
  onAcknowledge?: () => void;
  acknowledged?: boolean;
}

export function CriticalLabAlert({
  testName,
  value,
  patientName,
  onAcknowledge,
  acknowledged = false
}: CriticalLabAlertProps) {
  const check = checkCriticalValue(testName, value);
  
  if (!check.isCritical && !check.isAbnormal) {
    return null;
  }

  const actions = check.isCritical ? getCriticalLabActions(testName, value) : [];

  if (!check.isCritical) {
    // Abnormal but not critical - just show badge
    return (
      <Badge variant="outline" className="border-yellow-500 text-yellow-700">
        {check.severity === 'abnormal' && 'Abnormal'}
      </Badge>
    );
  }

  return (
    <Alert className="bg-red-50 border-red-600 border-2">
      <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
      <AlertTitle className="text-red-900 font-bold text-lg">
        🚨 CRITICAL LAB VALUE - IMMEDIATE ACTION REQUIRED
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-3 mt-2">
          {patientName && (
            <p className="font-semibold">Patient: {patientName}</p>
          )}
          
          <div className="bg-white p-3 rounded border border-red-300">
            <p className="font-bold text-red-900">{check.message}</p>
          </div>

          {actions.length > 0 && (
            <Card className="bg-white">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Immediate Actions Required:
                </h4>
                <ul className="list-decimal list-inside space-y-1 text-sm">
                  {actions.map((action, idx) => (
                    <li key={idx} className="text-red-900">{action}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {onAcknowledge && !acknowledged && (
            <Button
              onClick={onAcknowledge}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Acknowledge Critical Value
            </Button>
          )}

          {acknowledged && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Acknowledged by physician</span>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Component for inline display in lab results table
export function LabValueIndicator({ 
  testName, 
  value 
}: { 
  testName: string; 
  value: number;
}) {
  const check = checkCriticalValue(testName, value);

  if (!check.isCritical && !check.isAbnormal) {
    return <span>{value}</span>;
  }

  const getBgColor = () => {
    if (check.isCritical) return 'bg-red-100 text-red-900 font-bold';
    return 'bg-yellow-100 text-yellow-900';
  };

  return (
    <span className={`px-2 py-1 rounded ${getBgColor()}`}>
      {value}
      {check.isCritical && (
        <AlertTriangle className="inline h-3 w-3 ml-1 animate-pulse" />
      )}
    </span>
  );
}
