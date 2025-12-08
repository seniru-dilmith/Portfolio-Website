import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

// Parse the service account key from the environment variable
let serviceAccount: ServiceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
} catch (error) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
  serviceAccount = {} as ServiceAccount;
}

// Initialize the app if it's not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
}

const bucket = getStorage().bucket();
const db = getFirestore();

/**
 * Deletes an entire folder from Firebase Storage.
 * @param {string} folderPath The path to the folder (e.g., 'projects/projectId123').
 */
export const deleteFolder = async (folderPath: string) => {
  try {
    await bucket.deleteFiles({ prefix: folderPath });
    console.log(`Successfully deleted folder: ${folderPath}`);
  } catch (error) {
    console.error(`Failed to delete folder ${folderPath}:`, error);
    // Don't throw error, just log it, as the primary DB operation might have succeeded.
  }
};

export { bucket, db };