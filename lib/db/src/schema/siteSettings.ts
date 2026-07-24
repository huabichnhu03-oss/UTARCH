import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  ownerName: text("owner_name").notNull().default("Portfolio Owner"),
  title: text("title").notNull().default("Architectural Technologist"),
  subtitle: text("subtitle").notNull().default(""),
  heroImage: text("hero_image"),
  aboutHeading: text("about_heading").notNull().default(""),
  aboutBody: text("about_body").notNull().default(""),
  infoItems: jsonb("info_items").notNull().$type<string[]>().default([]),
  location: text("location").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  archiveDateRange: text("archive_date_range").notNull().default(""),
  primaryColor: text("primary_color").notNull().default("#C0392B"),
  accentColor: text("accent_color").notNull().default("#2D2D2D"),
  adminPasswordHash: text("admin_password_hash"),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
