// In-memory presence tracking. This only works correctly on a persistent
// Node.js server (e.g. `next start` on Hostinger/local). On serverless
// platforms like Vercel, each request can hit a different instance with its
// own memory, so the "online now" count will be unreliable there.
const ONLINE_WINDOW_MS = 30_000;

const sessions = new Map<string, number>();

export function heartbeat(sessionId: string): void {
  sessions.set(sessionId, Date.now());
}

export function getOnlineCount(): number {
  const now = Date.now();
  let count = 0;
  for (const [id, lastSeen] of sessions) {
    if (now - lastSeen > ONLINE_WINDOW_MS) {
      sessions.delete(id);
    } else {
      count += 1;
    }
  }
  return count;
}
