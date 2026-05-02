import { z } from "zod";

export const siteSettingsSchema = z.object({
  ownerName: z.string().min(1, "Required"),
  title: z.string().min(1, "Required"),
  subtitle: z.string().min(1, "Required"),
  heroImage: z.string().nullable().optional(),
  aboutHeading: z.string().min(1, "Required"),
  aboutBody: z.string().min(1, "Required"),
  infoItems: z.array(z.string()),
  location: z.string().min(1, "Required"),
  email: z.string().email(),
  phone: z.string().min(1, "Required"),
  linkedin: z.string().url(),
  archiveDateRange: z.string().min(1, "Required"),
  adminPassword: z.string().nullable().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Required"),
  client: z.string().min(1, "Required"),
  subtitle: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  focus: z.string().min(1, "Required"),
  tools: z.string().min(1, "Required"),
  coverImage: z.string().nullable().optional(),
  heroImage: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  methodologySteps: z.array(z.object({
    title: z.string().min(1, "Required"),
    description: z.string().min(1, "Required")
  })).optional(),
  galleryImages: z.array(z.string()).optional(),
  sortOrder: z.coerce.number().optional(),
  published: z.boolean().optional()
});

export const postSchema = z.object({
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1, "Required"),
  coverImage: z.string().nullable().optional(),
  published: z.boolean().optional()
});

export const skillSchema = z.object({
  name: z.string().min(1, "Required"),
  sortOrder: z.coerce.number().optional()
});
