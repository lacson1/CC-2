import { AlertCircle, X, RotateCcw, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AutoSaveRestoreBannerProps {
  show: boolean;
  timestamp: Date | null;
  onRestore: () => void;
  onDismiss: () => void;
}

export function AutoSaveRestoreBanner({
  show,
  timestamp,
  onRestore,
  onDismiss
}: AutoSaveRestoreBannerProps) {
  if (!show) return null;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleString();
  };

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top-2 duration-300">
      <Alert className="bg-amber-50 border-amber-300 shadow-lg">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900 font-semibold flex items-center gap-2">
          Unsaved Work Detected
          {timestamp && (
            <Badge variant="outline" className="text-xs">
              {formatTime(timestamp)}
            </Badge>
          )}
        </AlertTitle>
        <AlertDescription className="text-amber-800">
          We found work you were working on. Would you like to restore it?
        </AlertDescription>
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            onClick={onRestore}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            Restore Work
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDismiss}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <Trash2 className="mr-2 h-3 w-3" />
            Discard
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="ml-auto text-amber-700 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}
