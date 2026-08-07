import fs from "fs/promises";
import path from "path";

type SiteStats = {
  totalVisits: number;
  countries: Record<string, number>;
};

const filePath = path.join(process.cwd(), "src/data/site-stats.json");

async function readStats(): Promise<SiteStats> {
  const raw = await fs.readFile(filePath, "utf-8");
  const stats = JSON.parse(raw) as Partial<SiteStats>;
  return {
    totalVisits: stats.totalVisits ?? 0,
    countries: stats.countries ?? {},
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
  const stats = await readStats();
  stats.totalVisits += 1;

  const label = country && country.trim() ? country.trim() : "Unknown";
  stats.countries[label] = (stats.countries[label] ?? 0) + 1;

  await fs.writeFile(filePath, JSON.stringify(stats, null, 2), "utf-8");
}
