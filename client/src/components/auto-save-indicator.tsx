import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AutoSaveIndicatorProps {
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  isSaving?: boolean;
  className?: string;
}

export function AutoSaveIndicator({
  lastSaved,
  hasUnsavedChanges,
  isSaving = false,
  className = ''
}: AutoSaveIndicatorProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);

    if (diffSecs < 10) return 'just now';
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return date.toLocaleTimeString();
  };

  if (isSaving) {
    return (
      <Badge variant="outline" className={`gap-1 ${className}`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </Badge>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <Badge variant="outline" className={`gap-1 text-amber-600 border-amber-300 ${className}`}>
        <CloudOff className="h-3 w-3" />
        Unsaved changes
      </Badge>
    );
  }

  if (lastSaved) {
    return (
      <Badge variant="outline" className={`gap-1 text-green-600 border-green-300 ${className}`}>
        <Check className="h-3 w-3" />
        Saved {formatTime(lastSaved)}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`gap-1 ${className}`}>
      <Cloud className="h-3 w-3" />
      Auto-save enabled
    </Badge>
  );
}
