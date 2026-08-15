import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Lazy on purpose: some hosts (e.g. Hostinger) don't expose environment
// variables during `next build`, only once the app is actually running.
// Reading them eagerly at module-import time (which happens during the
// build's page-data-collection step for any route that imports this file)
// would throw and fail the build even though the vars are perfectly fine
// at runtime. Nothing here actually touches Firebase until a request
// handler calls into adminDb/adminBucket/getAdminApp.
let cachedApp: App | null = null;

export function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin SDK environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)."
    );
  }

  cachedApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
      `${projectId}.appspot.com`,
  });
  return cachedApp;
}

let cachedDb: Firestore | null = null;
function realDb(): Firestore {
  if (!cachedDb) cachedDb = getFirestore(getAdminApp());
  return cachedDb;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const db = realDb();
    const value = Reflect.get(db as object, prop, db);
    return typeof value === "function" ? value.bind(db) : value;
  },
}) as Firestore;

let cachedBucket: ReturnType<ReturnType<typeof getStorage>["bucket"]> | null = null;
function realBucket() {
  if (!cachedBucket) cachedBucket = getStorage(getAdminApp()).bucket();
  return cachedBucket;
}

export const adminBucket = new Proxy(
  {} as ReturnType<ReturnType<typeof getStorage>["bucket"]>,
  {
    get(_target, prop) {
      const bucket = realBucket();
      const value = Reflect.get(bucket as object, prop, bucket);
      return typeof value === "function" ? value.bind(bucket) : value;
    },
  }
);
