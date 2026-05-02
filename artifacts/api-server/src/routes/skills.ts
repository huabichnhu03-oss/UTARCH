import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc } from "drizzle-orm";
import { db, skillsTable } from "@workspace/db";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: () => void) {
  const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
  if (!isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/skills", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Error listing skills");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/skills", requireAdmin, async (req: Request, res: Response) => {
  const body = req.body as { name: string; sortOrder?: number };
  try {
    const inserted = await db.insert(skillsTable).values({
      name: body.name,
      sortOrder: body.sortOrder ?? 0,
    }).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Error creating skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/skills/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as Partial<{ name: string; sortOrder: number }>;
  try {
    const updated = await db.update(skillsTable).set(body).where(eq(skillsTable.id, id)).returning();
    if (!updated[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Error updating skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/skills/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(skillsTable).where(eq(skillsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
