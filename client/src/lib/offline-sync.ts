import { offlineDB } from './offline-db';
import { apiRequest } from './queryClient';

class OfflineSyncManager {
  private syncInProgress = false;
  private syncInterval: NodeJS.Timeout | null = null;

  async initialize() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Start periodic sync if online
    if (navigator.onLine) {
      this.startPeriodicSync();
    }
  }

  private handleOnline() {
    console.log('🟢 Back online - starting sync');
    this.startPeriodicSync();
    this.syncNow();
  }

  private handleOffline() {
    console.log('🔴 Gone offline - stopping sync');
    this.stopPeriodicSync();
  }

  private startPeriodicSync() {
    if (this.syncInterval) return;
    
    // Sync every 2 minutes when online
    this.syncInterval = setInterval(() => {
      this.syncNow();
    }, 2 * 60 * 1000);
  }

  private stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncNow() {
    if (!navigator.onLine || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    console.log('🔄 Starting sync...');

    try {
      const queue = await offlineDB.getSyncQueue();
      console.log(`📤 Syncing ${queue.length} pending items`);

      for (const item of queue) {
        try {
          await this.processSyncItem(item);
          await offlineDB.removeSyncItem(item.id);
          console.log(`✅ Synced: ${item.entity} ${item.type}`);
        } catch (error) {
          console.error(`❌ Failed to sync item ${item.id}:`, error);
          
          // If item is too old (>7 days), remove it
          const age = Date.now() - item.timestamp;
          if (age > 7 * 24 * 60 * 60 * 1000) {
            await offlineDB.removeSyncItem(item.id);
            console.log(`🗑️ Removed stale sync item ${item.id}`);
          }
        }
      }

      // Download fresh data from server
      await this.downloadFreshData();
      
      console.log('✅ Sync complete');
      
      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent('sync-complete'));
    } catch (error) {
      console.error('❌ Sync failed:', error);
      window.dispatchEvent(new CustomEvent('sync-error', { detail: error }));
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processSyncItem(item: any) {
    const { type, entity, data } = item;
    const endpoint = this.getEndpoint(entity);

    switch (type) {
      case 'create':
        return await apiRequest(endpoint, 'POST', data);
      
      case 'update':
        return await apiRequest(`${endpoint}/${data.id}`, 'PUT', data);
      
      case 'delete':
        return await apiRequest(`${endpoint}/${data.id}`, 'DELETE');
      
      default:
        throw new Error(`Unknown sync type: ${type}`);
    }
  }

  private getEndpoint(entity: string): string {
    const endpoints: Record<string, string> = {
      'patient': '/api/patients',
      'visit': '/api/visits',
      'prescription': '/api/prescriptions',
      'labResult': '/api/lab-results',
    };
    return endpoints[entity] || `/api/${entity}s`;
  }

  private async downloadFreshData() {
    try {
      // Download patients (limit to recently updated)
      const lastSync = localStorage.getItem('last-sync-timestamp');
      const timestamp = lastSync || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const patients = await apiRequest(`/api/patients?updated_since=${timestamp}`, 'GET');
      if (Array.isArray(patients) && patients.length > 0) {
        await offlineDB.bulkPutPatients(patients);
        console.log(`📥 Downloaded ${patients.length} patients`);
      }

      // Store last sync time
      localStorage.setItem('last-sync-timestamp', new Date().toISOString());
    } catch (error) {
      console.error('Failed to download fresh data:', error);
    }
  }

  // Queue operations for offline sync
  async queueCreate(entity: string, data: any) {
    return await offlineDB.addToSyncQueue({
      type: 'create',
      entity,
      data,
    });
  }

  async queueUpdate(entity: string, data: any) {
    return await offlineDB.addToSyncQueue({
      type: 'update',
      entity,
      data,
    });
  }

  async queueDelete(entity: string, id: number) {
    return await offlineDB.addToSyncQueue({
      type: 'delete',
      entity,
      data: { id },
    });
  }

  getSyncStatus() {
    return {
      inProgress: this.syncInProgress,
      online: navigator.onLine,
    };
  }
}

export const offlineSyncManager = new OfflineSyncManager();
