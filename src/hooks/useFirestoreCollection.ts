"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  type DocumentData,
  type QueryConstraint,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";

export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  initialData: T[],
  constraints: QueryConstraint[] = []
): T[] {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((d) => d.data() as T));
      },
      () => {
        // Swallow errors (e.g. offline) and keep showing last known data.
      }
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return data;
}
