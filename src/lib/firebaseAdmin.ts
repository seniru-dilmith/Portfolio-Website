import * as admin from 'firebase-admin';

// Parse the service account key from the environment variable
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

// Initialize the app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

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

export { admin, bucket };