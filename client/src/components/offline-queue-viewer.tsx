import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CloudOff, CloudUpload, RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import { offlineDB } from '@/lib/offline-db';
import { offlineSyncManager } from '@/lib/offline-sync';

export function OfflineQueueViewer() {
  const [queue, setQueue] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  const loadQueue = async () => {
    const items = await offlineDB.getSyncQueue();
    setQueue(items);
  };

  useEffect(() => {
    loadQueue();

    // Refresh queue when sync completes
    const handleSyncComplete = () => {
      loadQueue();
      setSyncing(false);
    };

    window.addEventListener('sync-complete', handleSyncComplete);
    return () => window.removeEventListener('sync-complete', handleSyncComplete);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await offlineSyncManager.syncNow();
  };

  const handleClearQueue = async () => {
    if (confirm('Are you sure you want to clear all pending changes? This cannot be undone.')) {
      await offlineDB.clearSyncQueue();
      await loadQueue();
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CloudOff className="h-5 w-5" />
            Pending Sync Queue
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSync}
              disabled={syncing || !navigator.onLine || queue.length === 0}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
            {queue.length > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleClearQueue}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mb-2 opacity-20 text-green-600" />
            <p className="text-sm">All changes synced</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(item.type)}>
                        {item.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{item.entity}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <CloudUpload className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {!navigator.onLine && queue.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            You're offline. Changes will sync automatically when you're back online.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
