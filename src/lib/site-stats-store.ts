import fs from "fs/promises";
import path from "path";

type SiteStats = {
  totalVisits: number;
};

const filePath = path.join(process.cwd(), "src/data/site-stats.json");

export async function getTotalVisits(): Promise<number> {
  const raw = await fs.readFile(filePath, "utf-8");
  const stats = JSON.parse(raw) as SiteStats;
  return stats.totalVisits ?? 0;
}

export async function recordVisit(): Promise<void> {
  const raw = await fs.readFile(filePath, "utf-8");
  const stats = JSON.parse(raw) as SiteStats;
  stats.totalVisits = (stats.totalVisits ?? 0) + 1;
  await fs.writeFile(filePath, JSON.stringify(stats, null, 2), "utf-8");
}
