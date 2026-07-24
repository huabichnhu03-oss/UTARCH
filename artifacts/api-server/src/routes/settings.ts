import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

function mapSettings(row: typeof siteSettingsTable.$inferSelect) {
  return {
    id: row.id,
    ownerName: row.ownerName,
    title: row.title,
    subtitle: row.subtitle,
    heroImage: row.heroImage ?? null,
    aboutHeading: row.aboutHeading,
    aboutBody: row.aboutBody,
    infoItems: (row.infoItems as string[]) ?? [],
    location: row.location,
    email: row.email,
    phone: row.phone,
    linkedin: row.linkedin,
    archiveDateRange: row.archiveDateRange,
    primaryColor: row.primaryColor ?? "#C0392B",
    accentColor: row.accentColor ?? "#2D2D2D",
    // Never expose the stored hash over the API
    adminPasswordHash: null as null,
  };
}

router.get("/settings", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (!rows[0]) {
      const inserted = await db.insert(siteSettingsTable).values({}).returning();
      res.json(mapSettings(inserted[0]!));
      return;
    }
    res.json(mapSettings(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Error getting settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", requireAdmin, async (req: Request, res: Response) => {
  const body = req.body as Partial<{
    ownerName: string;
    title: string;
    subtitle: string;
    heroImage: string | null;
    aboutHeading: string;
    aboutBody: string;
    infoItems: string[];
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    archiveDateRange: string;
    primaryColor: string;
    accentColor: string;
    adminPassword: string | null;
  }>;

  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);

    const updateData: Partial<typeof siteSettingsTable.$inferInsert> = {};
    if (body.ownerName !== undefined) updateData.ownerName = body.ownerName;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.heroImage !== undefined) updateData.heroImage = body.heroImage;
    if (body.aboutHeading !== undefined) updateData.aboutHeading = body.aboutHeading;
    if (body.aboutBody !== undefined) updateData.aboutBody = body.aboutBody;
    if (body.infoItems !== undefined) updateData.infoItems = body.infoItems;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin;
    if (body.archiveDateRange !== undefined) updateData.archiveDateRange = body.archiveDateRange;
    if (body.primaryColor !== undefined) updateData.primaryColor = body.primaryColor;
    if (body.accentColor !== undefined) updateData.accentColor = body.accentColor;

    if (body.adminPassword) {
      if (body.adminPassword.length < 12) {
        res.status(400).json({ error: "Admin password must be at least 12 characters" });
        return;
      }
      updateData.adminPasswordHash = await bcrypt.hash(body.adminPassword, 10);
    }

    let result;
    if (!rows[0]) {
      result = await db.insert(siteSettingsTable).values(updateData).returning();
    } else {
      result = await db.update(siteSettingsTable).set(updateData).returning();
    }
    res.json(mapSettings(result[0]!));
  } catch (err) {
    req.log.error({ err }, "Error updating settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
