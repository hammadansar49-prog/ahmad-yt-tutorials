import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

type SiteStats = {
  totalVisits: number;
  countries: Record<string, number>;
};

const statsDocRef = () => adminDb.collection("config").doc("site-stats");

async function readStats(): Promise<SiteStats> {
  const snap = await statsDocRef().get();
  const stats = snap.data() as Partial<SiteStats> | undefined;
  return {
    totalVisits: stats?.totalVisits ?? 0,
    countries: stats?.countries ?? {},
  };
}

export async function getTotalVisits(): Promise<number> {
  const stats = await readStats();
  return stats.totalVisits;
}

export async function getCountryStats(): Promise<
  { country: string; count: number }[]
> {
  const stats = await readStats();
  return Object.entries(stats.countries)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}

export async function recordVisit(country?: string | null): Promise<void> {
  const label = country && country.trim() ? country.trim() : "Unknown";
  await statsDocRef().set(
    {
      totalVisits: FieldValue.increment(1),
      [`countries.${label}`]: FieldValue.increment(1),
    },
    { merge: true }
  );
}
