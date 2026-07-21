import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: () => void) {
  const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
  if (!isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function mapProject(p: typeof projectsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    client: p.client,
    subtitle: p.subtitle,
    category: p.category ?? "",
    role: p.role,
    focus: p.focus,
    tools: p.tools,
    coverImage: p.coverImage ?? null,
    heroImage: p.heroImage ?? null,
    description: p.description ?? null,
    outcomes: p.outcomes ?? null,
    highlightStats: (p.highlightStats as { label: string; value: string }[]) ?? [],
    methodologySteps: (p.methodologySteps as { title: string; description: string }[]) ?? [],
    galleryImages: (p.galleryImages as string[]) ?? [],
    plans: (p.plans as { title: string; url: string }[]) ?? [],
    sortOrder: p.sortOrder,
    published: p.published,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/projects", async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.published, true))
      .orderBy(asc(projectsTable.sortOrder));
    res.json(rows.map(mapProject));
  } catch (err) {
    req.log.error({ err }, "Error listing projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/all", requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder));
    res.json(rows.map(mapProject));
  } catch (err) {
    req.log.error({ err }, "Error listing all projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
    const project = rows[0];
    if (!project) { res.status(404).json({ error: "Not found" }); return; }

    // Hide unpublished drafts from the public; admins can still fetch them
    const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
    if (!project.published && !isAdmin) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json(mapProject(project));
  } catch (err) {
    req.log.error({ err }, "Error getting project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/projects", requireAdmin, async (req: Request, res: Response) => {
  const body = req.body as {
    title: string; client: string; subtitle: string; category?: string; role: string; focus: string; tools: string;
    coverImage?: string | null; heroImage?: string | null; description?: string | null;
    outcomes?: string | null;
    highlightStats?: { label: string; value: string }[];
    methodologySteps?: { title: string; description: string }[];
    galleryImages?: string[];
    plans?: { title: string; url: string }[];
    sortOrder?: number; published?: boolean;
  };
  try {
    const inserted = await db.insert(projectsTable).values({
      title: body.title,
      client: body.client,
      subtitle: body.subtitle,
      category: body.category ?? "",
      role: body.role,
      focus: body.focus,
      tools: body.tools,
      coverImage: body.coverImage ?? null,
      heroImage: body.heroImage ?? null,
      description: body.description ?? null,
      outcomes: body.outcomes ?? null,
      highlightStats: body.highlightStats ?? [],
      methodologySteps: body.methodologySteps ?? [],
      galleryImages: body.galleryImages ?? [],
      plans: body.plans ?? [],
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? false,
    }).returning();
    res.status(201).json(mapProject(inserted[0]!));
  } catch (err) {
    req.log.error({ err }, "Error creating project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/projects/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as Partial<{
    title: string; client: string; subtitle: string; category: string; role: string; focus: string; tools: string;
    coverImage: string | null; heroImage: string | null; description: string | null;
    outcomes: string | null;
    highlightStats: { label: string; value: string }[];
    methodologySteps: { title: string; description: string }[];
    galleryImages: string[];
    plans: { title: string; url: string }[];
    sortOrder: number; published: boolean;
  }>;
  try {
    const updated = await db.update(projectsTable).set(body).where(eq(projectsTable.id, id)).returning();
    if (!updated[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(mapProject(updated[0]));
  } catch (err) {
    req.log.error({ err }, "Error updating project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/projects/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting project");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
