import { db } from "./db";
import { locations, type InsertLocation, type Location } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLocations(category?: string): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
}

export class DatabaseStorage implements IStorage {
  async getLocations(category?: string): Promise<Location[]> {
    if (category) {
      return await db.select().from(locations).where(eq(locations.category, category));
    }
    return await db.select().from(locations);
  }

  async getLocation(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }
}

export const storage = new DatabaseStorage();
