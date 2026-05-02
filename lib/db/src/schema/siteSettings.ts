import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  ownerName: text("owner_name").notNull().default("Uyen Ton"),
  title: text("title").notNull().default("Architectural Technologist"),
  subtitle: text("subtitle").notNull().default("Sheridan College High Honours graduate specializing in technical drawing, 3D modeling, and strict Ontario Building Code compliance."),
  heroImage: text("hero_image"),
  aboutHeading: text("about_heading").notNull().default("Translating complex architectural concepts into highly precise construction documents."),
  aboutBody: text("about_body").notNull().default("My process prioritizes seamless workflows—from initial site measurements to detailed CAD drafting—ensuring full compliance with zoning by-laws and sustainable LEED standards."),
  infoItems: jsonb("info_items").notNull().$type<string[]>().default(["BASED IN TORONTO, ON", "AVAILABLE FOR HIRE", "OBC & LEED COMPLIANT"]),
  location: text("location").notNull().default("Toronto, Ontario"),
  email: text("email").notNull().default("uyenton285@gmail.com"),
  phone: text("phone").notNull().default("647-713-4229"),
  linkedin: text("linkedin").notNull().default("https://www.linkedin.com/in/uyentonarch/"),
  archiveDateRange: text("archive_date_range").notNull().default("2019 — Present"),
  adminPasswordHash: text("admin_password_hash"),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
