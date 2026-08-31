import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Lazy on purpose: some hosts (e.g. Hostinger) don't expose environment
// variables during `next build`, only once the app is actually running.
// Reading them eagerly at module-import time (which happens during the
// build's page-data-collection step for any route that imports this file)
// would throw and fail the build even though the vars are perfectly fine
// at runtime. Nothing here actually touches Firebase until a request
// handler calls into adminDb/getAdminApp.
let cachedApp: App | null = null;

export function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  // Preferred: one base64-encoded blob of the whole service account JSON.
  // Some hosts' environment-variable UIs mangle a long multi-part PEM key
  // (stray line breaks, silent truncation, whitespace changes) — a single
  // base64 token has no special characters for that kind of storage to
  // corrupt, so it survives copy/paste and web-UI text fields reliably.
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  let projectId: string | undefined;
  let clientEmail: string | undefined;
  let privateKey: string | undefined;

  if (b64) {
    try {
      const decoded = JSON.parse(
        Buffer.from(b64, "base64").toString("utf-8")
      ) as { project_id: string; client_email: string; private_key: string };
      projectId = decoded.project_id;
      clientEmail = decoded.client_email;
      privateKey = decoded.private_key;
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not valid base64-encoded JSON.");
    }
  } else {
    projectId = process.env.FIREBASE_PROJECT_ID;
    clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin SDK credentials: set either FIREBASE_SERVICE_ACCOUNT_BASE64, or all three of FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
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
