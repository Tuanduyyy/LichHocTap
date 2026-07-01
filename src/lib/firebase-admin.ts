import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let authInstance: any = null;

export const getAdminAuth = () => {
  if (authInstance) return authInstance;

  const apps = getApps();
  if (!apps.length) {
    try {
      initializeApp({
        projectId: firebaseConfig.projectId,
      });
    } catch (err: any) {
      console.warn('⚠️ Warning: Firebase Admin failed to initialize:', err.message);
    }
  }

  try {
    authInstance = getAuth();
    return authInstance;
  } catch (err: any) {
    console.warn('⚠️ Warning: Could not get Firebase Auth service in this environment:', err.message);
    // Return a dummy object with verifyIdToken to prevent crashing, throwing a clear error when verification is actually requested
    return {
      verifyIdToken: async () => {
        throw new Error('Firebase Admin Auth is not configured. To use sync, you need Google Application Credentials.');
      }
    };
  }
};

// Export adminAuth as a Proxy to maintain compatibility without crashing at startup
export const adminAuth = new Proxy({} as any, {
  get(target, prop) {
    const auth = getAdminAuth();
    const value = auth[prop];
    if (typeof value === 'function') {
      return value.bind(auth);
    }
    return value;
  }
});


