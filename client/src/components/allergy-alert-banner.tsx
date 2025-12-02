import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AllergyAlertBannerProps {
  allergies: string[];
  severity?: 'critical' | 'warning';
  className?: string;
}

export function AllergyAlertBanner({ 
  allergies, 
  severity = 'critical',
  className = '' 
}: AllergyAlertBannerProps) {
  if (!allergies || allergies.length === 0) {
    return null;
  }

  const isCritical = severity === 'critical';

  return (
    <Alert 
      className={`${isCritical ? 'bg-red-50 border-red-600' : 'bg-yellow-50 border-yellow-600'} border-2 shadow-lg ${className}`}
    >
      <AlertTriangle className={`h-6 w-6 ${isCritical ? 'text-red-700' : 'text-yellow-700'}`} />
      <AlertTitle className={`${isCritical ? 'text-red-900' : 'text-yellow-900'} font-bold text-lg flex items-center gap-2`}>
        {isCritical && <span className="animate-pulse">⚠️</span>}
        ALLERGY ALERT
        {isCritical && <span className="animate-pulse">⚠️</span>}
      </AlertTitle>
      <AlertDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          {allergies.map((allergy, idx) => (
            <Badge 
              key={idx} 
              variant="destructive"
              className="text-base px-3 py-1 font-semibold"
            >
              {allergy}
            </Badge>
          ))}
        </div>
        <p className={`mt-3 ${isCritical ? 'text-red-800' : 'text-yellow-800'} font-medium`}>
          ⚠️ Check all medications and treatments before administration
        </p>
      </AlertDescription>
    </Alert>
  );
}

export function AllergyBadge({ allergy }: { allergy: string }) {
  return (
    <Badge 
      variant="destructive" 
      className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1"
    >
      <AlertCircle className="h-3 w-3" />
      Allergic: {allergy}
    </Badge>
  );
}
