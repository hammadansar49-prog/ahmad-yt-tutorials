"use server";

import webpush from "web-push";
import {
  saveSubscription,
  removeSubscription,
  getAllSubscriptions,
  type PushSubscriptionRecord,
} from "@/lib/push-store";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  configured = true;
}

export async function subscribeToPush(sub: PushSubscriptionRecord): Promise<void> {
  await saveSubscription(sub);
}

export async function unsubscribeFromPush(endpoint: string): Promise<void> {
  await removeSubscription(endpoint);
}

/**
 * Sends a push notification to every subscribed browser. Called
 * server-side (e.g. after a new tutorial is published). Dead
 * subscriptions (expired/unsubscribed) are pruned as they're found.
 */
export async function sendPushToAll(payload: {
  title: string;
  body: string;
  url?: string;
}): Promise<void> {
  ensureConfigured();
  const subs = await getAllSubscriptions();
  if (subs.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          body
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await removeSubscription(sub.endpoint).catch(() => {});
        }
      }
    })
  );
}
