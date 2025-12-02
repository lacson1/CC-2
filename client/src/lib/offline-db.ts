import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDBSchema extends DBSchema {
  patients: {
    key: number;
    value: any;
    indexes: { 'by-updated': string };
  };
  visits: {
    key: number;
    value: any;
    indexes: { 'by-patient': number; 'by-updated': string };
  };
  prescriptions: {
    key: number;
    value: any;
    indexes: { 'by-patient': number };
  };
  labResults: {
    key: number;
    value: any;
    indexes: { 'by-patient': number };
  };
  pendingSync: {
    key: string;
    value: {
      id: string;
      type: 'create' | 'update' | 'delete';
      entity: string;
      data: any;
      timestamp: number;
    };
    indexes: { 'by-timestamp': number };
  };
}

class OfflineDB {
  private db: IDBPDatabase<OfflineDBSchema> | null = null;
  private dbName = 'clinicconnect-offline';
  private version = 1;

  async init() {
    if (this.db) return this.db;

    this.db = await openDB<OfflineDBSchema>(this.dbName, this.version, {
      upgrade(db) {
        // Patients store
        if (!db.objectStoreNames.contains('patients')) {
          const patientsStore = db.createObjectStore('patients', { keyPath: 'id' });
          patientsStore.createIndex('by-updated', 'updatedAt');
        }

        // Visits store
        if (!db.objectStoreNames.contains('visits')) {
          const visitsStore = db.createObjectStore('visits', { keyPath: 'id' });
          visitsStore.createIndex('by-patient', 'patientId');
          visitsStore.createIndex('by-updated', 'updatedAt');
        }

        // Prescriptions store
        if (!db.objectStoreNames.contains('prescriptions')) {
          const prescriptionsStore = db.createObjectStore('prescriptions', { keyPath: 'id' });
          prescriptionsStore.createIndex('by-patient', 'patientId');
        }

        // Lab Results store
        if (!db.objectStoreNames.contains('labResults')) {
          const labResultsStore = db.createObjectStore('labResults', { keyPath: 'id' });
          labResultsStore.createIndex('by-patient', 'patientId');
        }

        // Pending sync queue
        if (!db.objectStoreNames.contains('pendingSync')) {
          const pendingSyncStore = db.createObjectStore('pendingSync', { keyPath: 'id' });
          pendingSyncStore.createIndex('by-timestamp', 'timestamp');
        }
      },
    });

    return this.db;
  }

  // Generic CRUD operations
  async get(storeName: keyof OfflineDBSchema, id: number) {
    const db = await this.init();
    return db.get(storeName, id);
  }

  async getAll(storeName: keyof OfflineDBSchema) {
    const db = await this.init();
    return db.getAll(storeName);
  }

  async put(storeName: keyof OfflineDBSchema, data: any) {
    const db = await this.init();
    return db.put(storeName, data);
  }

  async delete(storeName: keyof OfflineDBSchema, id: number | string) {
    const db = await this.init();
    return db.delete(storeName, id as any);
  }

  // Patients
  async getPatient(id: number) {
    return this.get('patients', id);
  }

  async getAllPatients() {
    return this.getAll('patients');
  }

  async savePatient(patient: any) {
    return this.put('patients', { ...patient, offlineUpdated: new Date().toISOString() });
  }

  // Visits
  async getVisit(id: number) {
    return this.get('visits', id);
  }

  async getVisitsByPatient(patientId: number) {
    const db = await this.init();
    return db.getAllFromIndex('visits', 'by-patient', patientId);
  }

  async saveVisit(visit: any) {
    return this.put('visits', { ...visit, offlineUpdated: new Date().toISOString() });
  }

  // Sync Queue Management
  async addToSyncQueue(operation: {
    type: 'create' | 'update' | 'delete';
    entity: string;
    data: any;
  }) {
    const id = `${operation.entity}-${operation.type}-${Date.now()}-${Math.random()}`;
    const db = await this.init();
    await db.put('pendingSync', {
      id,
      ...operation,
      timestamp: Date.now(),
    });
    return id;
  }

  async getSyncQueue() {
    const db = await this.init();
    return db.getAllFromIndex('pendingSync', 'by-timestamp');
  }

  async removeSyncItem(id: string) {
    return this.delete('pendingSync', id);
  }

  async clearSyncQueue() {
    const db = await this.init();
    const tx = db.transaction('pendingSync', 'readwrite');
    await tx.store.clear();
    await tx.done;
  }

  // Bulk operations for initial sync
  async bulkPutPatients(patients: any[]) {
    const db = await this.init();
    const tx = db.transaction('patients', 'readwrite');
    await Promise.all(patients.map(patient => tx.store.put(patient)));
    await tx.done;
  }

  async bulkPutVisits(visits: any[]) {
    const db = await this.init();
    const tx = db.transaction('visits', 'readwrite');
    await Promise.all(visits.map(visit => tx.store.put(visit)));
    await tx.done;
  }

  // Clear all data
  async clearAllData() {
    const db = await this.init();
    const stores: (keyof OfflineDBSchema)[] = [
      'patients',
      'visits',
      'prescriptions',
      'labResults',
      'pendingSync'
    ];
    
    await Promise.all(
      stores.map(async (storeName) => {
        const tx = db.transaction(storeName, 'readwrite');
        await tx.store.clear();
        await tx.done;
      })
    );
  }
}

export const offlineDB = new OfflineDB();
