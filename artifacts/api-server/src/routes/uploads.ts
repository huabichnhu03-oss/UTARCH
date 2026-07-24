import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { requireAdmin } from "../middlewares/requireAdmin";
import { isCloudinaryConfigured, uploadBuffer } from "../lib/cloudinary";

const router: IRouter = Router();

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, GIF, and PDF files are allowed"));
    }
  },
});

router.post("/uploads", requireAdmin, (req: Request, res: Response) => {
  if (!isCloudinaryConfigured()) {
    res.status(503).json({
      error:
        "File uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    });
    return;
  }

  upload.single("file")(req, res, async (err: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      res.status(400).json({ error: message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    try {
      const { mimetype, buffer } = req.file;
      const result = await uploadBuffer(buffer, { mimetype });
      res.json({ url: result.url, key: result.publicId });
    } catch (uploadErr) {
      req.log.error({ err: uploadErr }, "Error uploading file");
      res.status(500).json({ error: "Upload failed" });
    }
  });
});

export default router;
