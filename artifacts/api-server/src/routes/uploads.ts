import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { objectStorageClient } from "../lib/objectStorage";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

function requireAdmin(req: Request, res: Response, next: () => void) {
  const isAdmin = (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
  if (!isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function getPublicStoragePath(): { bucketName: string; prefix: string } {
  const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
  const firstPath = pathsStr.split(",")[0]?.trim();
  if (!firstPath) throw new Error("PUBLIC_OBJECT_SEARCH_PATHS not configured");

  const parts = firstPath.startsWith("/") ? firstPath.slice(1).split("/") : firstPath.split("/");
  const bucketName = parts[0];
  const prefix = parts.slice(1).join("/");
  return { bucketName, prefix };
}

router.post("/uploads", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  try {
    const { originalname, mimetype, buffer } = req.file;
    const ext = originalname.split(".").pop() ?? "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { bucketName, prefix } = getPublicStoragePath();
    const objectName = prefix ? `${prefix}/${filename}` : filename;

    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);

    await file.save(buffer, {
      metadata: { contentType: mimetype },
    });

    const url = `/api/storage/public-objects/${filename}`;
    res.json({ url, key: objectName });
  } catch (err) {
    req.log.error({ err }, "Error uploading file");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
