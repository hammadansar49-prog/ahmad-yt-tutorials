import { adminDb } from "@/lib/firebase-admin";

export type Comment = {
  id: string;
  videoSlug: string;
  name: string;
  text: string;
  createdAt: string;
  approved: boolean;
};

const commentsCollection = () => adminDb.collection("comments");

export async function getComments(): Promise<Comment[]> {
  const snap = await commentsCollection().get();
  return snap.docs.map((d) => d.data() as Comment);
}

export async function getApprovedCommentsForVideo(
  slug: string
): Promise<Comment[]> {
  const snap = await commentsCollection()
    .where("videoSlug", "==", slug)
    .where("approved", "==", true)
    .get();
  return snap.docs
    .map((d) => d.data() as Comment)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getCommentCounts(): Promise<Record<string, number>> {
  const comments = await getComments();
  const counts: Record<string, number> = {};
  for (const c of comments) {
    if (!c.approved) continue;
    counts[c.videoSlug] = (counts[c.videoSlug] ?? 0) + 1;
  }
  return counts;
}

export async function getPendingCommentCounts(): Promise<
  Record<string, number>
> {
  const comments = await getComments();
  const counts: Record<string, number> = {};
  for (const c of comments) {
    if (c.approved) continue;
    counts[c.videoSlug] = (counts[c.videoSlug] ?? 0) + 1;
  }
  return counts;
}

export async function addComment(input: {
  videoSlug: string;
  name: string;
  text: string;
}): Promise<Comment> {
  const comment: Comment = {
    id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    videoSlug: input.videoSlug,
    name: input.name,
    text: input.text,
    createdAt: new Date().toISOString(),
    approved: false,
  };
  await commentsCollection().doc(comment.id).set(comment);
  return comment;
}

export async function approveComment(id: string): Promise<void> {
  await commentsCollection().doc(id).update({ approved: true });
}

export async function deleteComment(id: string): Promise<void> {
  await commentsCollection().doc(id).delete();
}
