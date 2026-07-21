import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: () => void) {
  const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
  if (!isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function mapPost(p: typeof postsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? null,
    content: p.content,
    coverImage: p.coverImage ?? null,
    published: p.published,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/posts", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(postsTable).where(eq(postsTable.published, true)).orderBy(desc(postsTable.createdAt));
    res.json(rows.map(mapPost));
  } catch (err) {
    req.log.error({ err }, "Error listing posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/posts/all", requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
    res.json(rows.map(mapPost));
  } catch (err) {
    req.log.error({ err }, "Error listing all posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/posts/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const rows = await db.select().from(postsTable).where(eq(postsTable.id, id)).limit(1);
    const post = rows[0];
    if (!post) { res.status(404).json({ error: "Not found" }); return; }

    // Hide unpublished drafts from the public; admins can still fetch them
    const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
    if (!post.published && !isAdmin) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json(mapPost(post));
  } catch (err) {
    req.log.error({ err }, "Error getting post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts", requireAdmin, async (req: Request, res: Response) => {
  const body = req.body as {
    title: string; slug: string; excerpt?: string | null; content: string;
    coverImage?: string | null; published?: boolean;
  };
  try {
    const inserted = await db.insert(postsTable).values({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? null,
      content: body.content,
      coverImage: body.coverImage ?? null,
      published: body.published ?? false,
    }).returning();
    res.status(201).json(mapPost(inserted[0]!));
  } catch (err) {
    req.log.error({ err }, "Error creating post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/posts/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as Partial<{
    title: string; slug: string; excerpt: string | null; content: string;
    coverImage: string | null; published: boolean;
  }>;
  try {
    const updated = await db.update(postsTable)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!updated[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(mapPost(updated[0]));
  } catch (err) {
    req.log.error({ err }, "Error updating post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/posts/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(postsTable).where(eq(postsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
