import admin from 'firebase-admin';

// Initialize Firebase Admin (you'll need to provide your service account key)
let firebaseApp: admin.app.App | null = null;

export function initializeFirebase() {
  if (!firebaseApp && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
}

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
  userRole?: string;
  patientId?: number;
}

export async function sendNotificationToRole(role: string, notification: NotificationData) {
  if (!firebaseApp) {
    console.warn('Firebase not initialized, skipping notification');
    return;
  }

  try {
    // Send to topic based on user role
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      topic: `role_${role}`,
    };

    const response = await admin.messaging().send(message);
    console.log(`Notification sent to ${role}:`, response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

export async function sendUrgentNotification(notification: NotificationData) {
  if (!firebaseApp) {
    console.warn('Firebase not initialized, skipping urgent notification');
    return;
  }

  try {
    // Send to all medical staff for urgent situations
    const roles = ['doctor', 'nurse', 'admin'];
    const promises = roles.map(role => sendNotificationToRole(role, notification));
    await Promise.all(promises);
    console.log('Urgent notification sent to all medical staff');
  } catch (error) {
    console.error('Error sending urgent notification:', error);
  }
}

// Specific notification types for your clinic
export const NotificationTypes = {
  LAB_RESULT_ABNORMAL: (patientName: string, testName: string) => ({
    title: '🚨 Abnormal Lab Result',
    body: `${patientName} has abnormal ${testName} results requiring immediate attention`,
    data: { type: 'lab_abnormal', priority: 'high' }
  }),

  LAB_RESULT_READY: (patientName: string, testName: string) => ({
    title: '📋 Lab Results Ready',
    body: `${testName} results are ready for ${patientName}`,
    data: { type: 'lab_ready', priority: 'normal' }
  }),

  REFERRAL_RECEIVED: (patientName: string, fromRole: string) => ({
    title: '👨‍⚕️ New Patient Referral',
    body: `${patientName} referred by ${fromRole} requires your attention`,
    data: { type: 'referral', priority: 'normal' }
  }),

  MEDICATION_LOW_STOCK: (medicationName: string, quantity: number) => ({
    title: '💊 Low Medication Stock',
    body: `${medicationName} is running low (${quantity} remaining)`,
    data: { type: 'low_stock', priority: 'normal' }
  }),

  MEDICATION_OUT_OF_STOCK: (medicationName: string) => ({
    title: '🚫 Medication Out of Stock',
    body: `${medicationName} is completely out of stock`,
    data: { type: 'out_of_stock', priority: 'high' }
  }),

  PATIENT_EMERGENCY: (patientName: string) => ({
    title: '🚨 Patient Emergency',
    body: `Emergency situation with ${patientName} - immediate assistance required`,
    data: { type: 'emergency', priority: 'critical' }
  })
};