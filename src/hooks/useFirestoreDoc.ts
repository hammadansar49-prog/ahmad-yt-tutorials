"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

export function useFirestoreDoc<T extends DocumentData>(
  collectionName: string,
  docId: string,
  initialData: T | undefined
): T | undefined {
  const [data, setData] = useState<T | undefined>(initialData);

  useEffect(() => {
    const ref = doc(db, collectionName, docId);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) setData(snap.data() as T);
      },
      () => {
        // Swallow errors and keep showing last known data.
      }
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, docId]);

  return data;
}
