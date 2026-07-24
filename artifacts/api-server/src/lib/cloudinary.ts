import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

export type UploadResult = {
  url: string;
  publicId: string;
  resourceType: string;
};

function configureFromEnv(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return true;
}

/** True when Cloudinary credentials are present. */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

/**
 * Upload a buffer to Cloudinary.
 * Images go as `image`; PDFs as `raw` so they stay downloadable.
 */
export function uploadBuffer(
  buffer: Buffer,
  opts: { mimetype: string; folder?: string },
): Promise<UploadResult> {
  if (!configureFromEnv()) {
    return Promise.reject(new Error("Cloudinary is not configured"));
  }

  const isPdf = opts.mimetype === "application/pdf";
  const resourceType = isPdf ? "raw" : "image";
  const folder = opts.folder || process.env.CLOUDINARY_FOLDER?.trim() || "utarch";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Let Cloudinary pick a unique public_id
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
      },
    );

    Readable.from(buffer).pipe(stream);
  });
}
