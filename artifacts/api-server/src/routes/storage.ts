import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

/**
 * Legacy Replit object-storage URLs. New uploads go to Cloudinary CDN.
 * Keep these routes so old bookmarks return a clear error instead of 404.
 */
router.get("/storage/public-objects/*filePath", (_req: Request, res: Response) => {
  res.status(410).json({
    error:
      "Legacy Replit object storage is no longer available. Re-upload the file in Admin → Uploads (Cloudinary).",
  });
});

router.get("/storage/objects/*path", (_req: Request, res: Response) => {
  res.status(410).json({
    error:
      "Legacy Replit object storage is no longer available. Re-upload the file in Admin → Uploads (Cloudinary).",
  });
});

export default router;
