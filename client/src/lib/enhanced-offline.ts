import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  patients: {
    key: number;
    value: {
      id: number;
      data: any;
      lastUpdated: string;
      downloadedForOffline: boolean;
    };
  };
  visits: {
    key: number;
    value: {
      id: number;
      patientId: number;
      data: any;
      lastUpdated: string;
    };
  };
  pendingActions: {
    key: number;
    value: {
      id: number;
      type: 'create' | 'update' | 'delete';
      entity: string;
      data: any;
      timestamp: string;
      synced: boolean;
    };
    indexes: { 'by-synced': boolean };
  };
  medications: {
    key: number;
    value: {
      id: number;
      name: string;
      data: any;
      lastUpdated: string;
    };
  };
  labResults: {
    key: number;
    value: {
      id: number;
      patientId: number;
      data: any;
      lastUpdated: string;
    };
  };
  syncStatus: {
    key: string;
    value: {
      entityType: string;
      lastSync: string;
      status: 'success' | 'error' | 'pending';
    };
  };
}

class EnhancedOfflineService {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  async init() {
    this.db = await openDB<OfflineDB>('clinicconnect-offline', 1, {
      upgrade(db) {
        // Patients store
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id' });
        }

        // Visits store
        if (!db.objectStoreNames.contains('visits')) {
          const visitStore = db.createObjectStore('visits', { keyPath: 'id' });
          visitStore.createIndex('by-patient', 'patientId');
        }

        // Pending actions store
        if (!db.objectStoreNames.contains('pendingActions')) {
          const actionStore = db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
          actionStore.createIndex('by-synced', 'synced');
        }

        // Medications store
        if (!db.objectStoreNames.contains('medications')) {
          db.createObjectStore('medications', { keyPath: 'id' });
        }

        // Lab results store
        if (!db.objectStoreNames.contains('labResults')) {
          const labStore = db.createObjectStore('labResults', { keyPath: 'id' });
          labStore.createIndex('by-patient', 'patientId');
        }

        // Sync status store
        if (!db.objectStoreNames.contains('syncStatus')) {
          db.createObjectStore('syncStatus', { keyPath: 'entityType' });
        }
      },
    });

    // Start auto-sync when online
    this.startAutoSync();
  }

  // Download patient data for offline access
  async downloadPatientForOffline(patientId: number) {
    if (!this.db) await this.init();

    try {
      // Fetch complete patient data
      const response = await fetch(`/api/patients/${patientId}/complete`);
      const patientData = await response.json();

      // Store patient
      await this.db!.put('patients', {
        id: patientId,
        data: patientData,
        lastUpdated: new Date().toISOString(),
        downloadedForOffline: true,
      });

      // Store visits
      if (patientData.visits) {
        for (const visit of patientData.visits) {
          await this.db!.put('visits', {
            id: visit.id,
            patientId: patientId,
            data: visit,
            lastUpdated: new Date().toISOString(),
          });
        }
      }

      // Store lab results
      if (patientData.labResults) {
        for (const result of patientData.labResults) {
          await this.db!.put('labResults', {
            id: result.id,
            patientId: patientId,
            data: result,
            lastUpdated: new Date().toISOString(),
          });
        }
      }

      return { success: true, message: 'Patient data downloaded for offline use' };
    } catch (error) {
      console.error('Failed to download patient data:', error);
      return { success: false, message: 'Failed to download patient data' };
    }
  }

  // Get offline patients
  async getOfflinePatients() {
    if (!this.db) await this.init();
    const allPatients = await this.db!.getAll('patients');
    return allPatients.filter(p => p.downloadedForOffline);
  }

  // Get patient from offline storage
  async getOfflinePatient(patientId: number) {
    if (!this.db) await this.init();
    return await this.db!.get('patients', patientId);
  }

  // Queue action for sync
  async queueAction(type: 'create' | 'update' | 'delete', entity: string, data: any) {
    if (!this.db) await this.init();

    await this.db!.add('pendingActions', {
      id: Date.now(),
      type,
      entity,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
    });

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncPendingActions();
    }
  }

  // Sync pending actions
  async syncPendingActions() {
    if (!this.db) await this.init();
    if (!navigator.onLine) return { synced: 0, failed: 0 };

    const pendingActions = await this.db!.getAllFromIndex('pendingActions', 'by-synced', false);
    let synced = 0;
    let failed = 0;

    for (const action of pendingActions) {
      try {
        // Determine API endpoint
        let endpoint = `/api/${action.entity}`;
        let method = 'POST';

        if (action.type === 'update') {
          endpoint = `${endpoint}/${action.data.id}`;
          method = 'PUT';
        } else if (action.type === 'delete') {
          endpoint = `${endpoint}/${action.data.id}`;
          method = 'DELETE';
        }

        // Sync to server
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: action.type !== 'delete' ? JSON.stringify(action.data) : undefined,
        });

        if (response.ok) {
          // Mark as synced
          await this.db!.put('pendingActions', {
            ...action,
            synced: true,
          });
          synced++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error('Sync failed for action:', action, error);
        failed++;
      }
    }

    // Clean up synced actions older than 7 days
    await this.cleanupSyncedActions();

    return { synced, failed };
  }

  // Clean up old synced actions
  async cleanupSyncedActions() {
    if (!this.db) await this.init();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const allActions = await this.db!.getAll('pendingActions');
    for (const action of allActions) {
      if (action.synced && new Date(action.timestamp) < sevenDaysAgo) {
        await this.db!.delete('pendingActions', action.id);
      }
    }
  }

  // Get pending actions count
  async getPendingActionsCount() {
    if (!this.db) await this.init();
    const pending = await this.db!.getAllFromIndex('pendingActions', 'by-synced', false);
    return pending.length;
  }

  // Start auto-sync
  startAutoSync() {
    if (this.syncInterval) return;

    // Sync every 5 minutes when online
    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.syncPendingActions();
      }
    }, 5 * 60 * 1000);

    // Also sync when coming back online
    window.addEventListener('online', () => {
      this.syncPendingActions();
    });
  }

  // Stop auto-sync
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Cache medications for offline use
  async cacheMedications(medications: any[]) {
    if (!this.db) await this.init();

    for (const med of medications) {
      await this.db!.put('medications', {
        id: med.id,
        name: med.name,
        data: med,
        lastUpdated: new Date().toISOString(),
      });
    }
  }

  // Search medications offline
  async searchMedicationsOffline(query: string) {
    if (!this.db) await this.init();

    const allMeds = await this.db!.getAll('medications');
    return allMeds
      .filter(med => med.name.toLowerCase().includes(query.toLowerCase()))
      .map(med => med.data);
  }

  // Get sync status
  async getSyncStatus() {
    if (!this.db) await this.init();

    const pendingCount = await this.getPendingActionsCount();
    const offlinePatients = await this.getOfflinePatients();
    const lastSyncStatuses = await this.db!.getAll('syncStatus');

    return {
      pendingActions: pendingCount,
      offlinePatients: offlinePatients.length,
      isOnline: navigator.onLine,
      lastSync: lastSyncStatuses.reduce((latest, status) => {
        if (!latest || new Date(status.lastSync) > new Date(latest)) {
          return status.lastSync;
        }
        return latest;
      }, null as string | null),
    };
  }

  // Update sync status
  async updateSyncStatus(entityType: string, status: 'success' | 'error' | 'pending') {
    if (!this.db) await this.init();

    await this.db!.put('syncStatus', {
      entityType,
      lastSync: new Date().toISOString(),
      status,
    });
  }

  // Clear all offline data
  async clearOfflineData() {
    if (!this.db) await this.init();

    await this.db!.clear('patients');
    await this.db!.clear('visits');
    await this.db!.clear('medications');
    await this.db!.clear('labResults');
    await this.db!.clear('pendingActions');
    await this.db!.clear('syncStatus');
  }
}

export const offlineService = new EnhancedOfflineService();


