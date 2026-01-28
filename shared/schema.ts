import { pgTable, text, serial, doublePrecision, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // For URL friendly identifying
  category: varchar("category", { length: 50 }).notNull(), // faculty, dorm, dining, sports, other
  description: text("description").notNull(), // Brief summary for Erasmus students
  address: text("address").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  websiteUrl: text("website_url"),
  imageUrl: text("image_url"),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type LocationCategory = 'faculty' | 'dorm' | 'dining' | 'sports' | 'other';

export const CATEGORIES: LocationCategory[] = ['faculty', 'dorm', 'dining', 'sports', 'other'];
