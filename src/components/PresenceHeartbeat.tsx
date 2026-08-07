"use client";

import { useEffect } from "react";

function getSessionId(): string {
  const key = "ayt_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function PresenceHeartbeat() {
  useEffect(() => {
    const sessionId = getSessionId();

    function ping() {
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {});
    }

    ping();
    const interval = setInterval(ping, 15000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
