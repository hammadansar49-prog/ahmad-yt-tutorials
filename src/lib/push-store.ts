import { adminDb } from "@/lib/firebase-admin";

export type PushSubscriptionRecord = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

const collection = () => adminDb.collection("push_subscriptions");

// Firestore document IDs can't contain "/" — the endpoint URL is used as
// the id (so re-subscribing the same browser overwrites, not duplicates),
// base64url-encoded to keep it a valid id.
function idFor(endpoint: string): string {
  return Buffer.from(endpoint).toString("base64url").slice(0, 500);
}

export async function saveSubscription(sub: PushSubscriptionRecord): Promise<void> {
  await collection().doc(idFor(sub.endpoint)).set(sub);
}

export async function removeSubscription(endpoint: string): Promise<void> {
  await collection().doc(idFor(endpoint)).delete();
}

export async function getAllSubscriptions(): Promise<PushSubscriptionRecord[]> {
  const snap = await collection().get();
  return snap.docs.map((d) => d.data() as PushSubscriptionRecord);
}
