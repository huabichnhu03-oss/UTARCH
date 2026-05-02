import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const objectStorageService = new ObjectStorageService();

function requireAdmin(req: Request, res: Response, next: () => void) {
  const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
  if (!isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/uploads", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  try {
    const { originalname, mimetype, buffer } = req.file;
    const ext = originalname.split(".").pop() ?? "bin";
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
      res.status(500).json({ error: "Object storage not configured" });
      return;
    }

    const { objectStorageClient } = await import("../lib/objectStorage");
    const bucket = objectStorageClient.bucket(bucketId);
    const file = bucket.file(key);

    await file.save(buffer, {
      metadata: { contentType: mimetype },
      public: true,
    });

    const url = `https://storage.googleapis.com/${bucketId}/${key}`;
    res.json({ url, key });
  } catch (err) {
    req.log.error({ err }, "Error uploading file");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
