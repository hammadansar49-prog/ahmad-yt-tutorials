/**
 * One-time migration: reads the legacy src/data/*.json files and writes
 * them into Firestore. Safe to re-run (it overwrites the same doc ids).
 *
 * Run with: npx tsx scripts/migrate-to-firestore.ts
 */
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fsSync.existsSync(envPath)) return;
  const raw = fsSync.readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin SDK env vars in .env.local");
  }

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  const db = getFirestore(app);

  const dataDir = path.join(process.cwd(), "src/data");

  async function readJson<T>(file: string): Promise<T> {
    const raw = await fs.readFile(path.join(dataDir, file), "utf-8");
    return JSON.parse(raw) as T;
  }

  // videos
  const videos = await readJson<Array<{ slug: string }>>("videos.json");
  const videosBatch = db.batch();
  for (const video of videos) {
    videosBatch.set(db.collection("videos").doc(video.slug), video);
  }
  await videosBatch.commit();
  console.log(`Migrated ${videos.length} videos.`);

  // categories
  const categories = await readJson<string[]>("categories.json");
  await db.collection("config").doc("categories").set({ list: categories });
  console.log(`Migrated ${categories.length} categories.`);

  // comments
  const comments = await readJson<Array<{ id: string }>>("comments.json");
  const commentsBatch = db.batch();
  for (const comment of comments) {
    commentsBatch.set(db.collection("comments").doc(comment.id), comment);
  }
  await commentsBatch.commit();
  console.log(`Migrated ${comments.length} comments.`);

  // site stats
  const siteStats = await readJson<{
    totalVisits: number;
    countries: Record<string, number>;
  }>("site-stats.json");
  await db.collection("config").doc("site-stats").set(siteStats);
  console.log("Migrated site stats.");

  // site content
  const siteContent = await readJson<Record<string, unknown>>(
    "site-content.json"
  );
  await db.collection("config").doc("site-content").set(siteContent);
  console.log("Migrated site content.");

  // legal content
  const legalContent = await readJson<Record<string, unknown>>(
    "legal-content.json"
  );
  await db.collection("config").doc("legal-content").set(legalContent);
  console.log("Migrated legal content.");

  console.log("Migration complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
