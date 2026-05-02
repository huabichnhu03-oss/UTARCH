import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { db, siteSettingsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/admin/login", async (req: Request, res: Response) => {
  const { password } = req.body as { password: string };
  if (!password) {
    res.status(400).json({ error: "Password required" });
    return;
  }

  try {
    const settings = await db.select().from(siteSettingsTable).limit(1);
    const row = settings[0];

    if (!row?.adminPasswordHash) {
      res.status(401).json({ error: "Admin not configured" });
      return;
    }

    const match = await bcrypt.compare(password, row.adminPasswordHash);
    if (!match) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    (req.session as unknown as Record<string, unknown>)["isAdmin"] = true;
    res.json({ authenticated: true });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ authenticated: false });
  });
});

router.get("/admin/me", (req: Request, res: Response) => {
  const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
  res.json({ authenticated: isAdmin });
});

export default router;
