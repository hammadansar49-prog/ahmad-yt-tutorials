import fs from "fs/promises";
import path from "path";

export type Comment = {
  id: string;
  videoSlug: string;
  name: string;
  text: string;
  createdAt: string;
  approved: boolean;
};

const filePath = path.join(process.cwd(), "src/data/comments.json");

export async function getComments(): Promise<Comment[]> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Comment[];
}

export async function saveComments(comments: Comment[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(comments, null, 2), "utf-8");
}

export async function getApprovedCommentsForVideo(
  slug: string
): Promise<Comment[]> {
  const comments = await getComments();
  return comments
    .filter((c) => c.videoSlug === slug && c.approved)
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
  const comments = await getComments();
  const comment: Comment = {
    id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    videoSlug: input.videoSlug,
    name: input.name,
    text: input.text,
    createdAt: new Date().toISOString(),
    approved: false,
  };
  await saveComments([comment, ...comments]);
  return comment;
}

export async function approveComment(id: string): Promise<void> {
  const comments = await getComments();
  await saveComments(
    comments.map((c) => (c.id === id ? { ...c, approved: true } : c))
  );
}

export async function deleteComment(id: string): Promise<void> {
  const comments = await getComments();
  await saveComments(comments.filter((c) => c.id !== id));
}
