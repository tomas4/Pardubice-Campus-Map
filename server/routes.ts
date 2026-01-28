import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertLocationSchema } from "@shared/schema";
import { z } from "zod";

const SEED_LOCATIONS = [
  {
    name: "Rectorate - University of Pardubice",
    category: "other",
    description: "The main administrative center of the university, housing the Rector's office and central administration.",
    address: "Studentská 95, 532 10 Pardubice",
    latitude: 50.0369,
    longitude: 15.7691,
    websiteUrl: "https://www.upce.cz/en/university/representation.html",
    slug: "rectorate"
  },
  {
    name: "Faculty of Chemical Technology",
    category: "faculty",
    description: "The largest faculty, known for high-quality chemistry education and research. Located at the heart of the campus.",
    address: "Studentská 573, 530 09 Pardubice",
    latitude: 50.0494,
    longitude: 15.7663,
    websiteUrl: "https://fcht.upce.cz/en",
    slug: "fcht"
  },
  {
    name: "Faculty of Economics and Administration",
    category: "faculty",
    description: "Focuses on economics, management, and public administration. Modern building near the library.",
    address: "Studentská 95, 532 10 Pardubice",
    latitude: 50.0485,
    longitude: 15.7670,
    websiteUrl: "https://fes.upce.cz/en",
    slug: "fes"
  },
  {
    name: "Jan Perner Transport Faculty",
    category: "faculty",
    description: "Specialized in transport engineering, logistics, and technology. Has a dedicated railway test track.",
    address: "Studentská 95, 532 10 Pardubice",
    latitude: 50.0500,
    longitude: 15.7650,
    websiteUrl: "https://dfjp.upce.cz/en",
    slug: "dfjp"
  },
  {
    name: "Faculty of Arts and Philosophy",
    category: "faculty",
    description: "Offers humanities, languages, and social sciences programs. A hub for cultural studies.",
    address: "Studentská 84, 532 10 Pardubice",
    latitude: 50.0480,
    longitude: 15.7680,
    websiteUrl: "https://ff.upce.cz/en",
    slug: "ff"
  },
  {
    name: "Faculty of Health Studies",
    category: "faculty",
    description: "Educates future nurses, midwives, and health specialists. Located slightly off the main campus quad.",
    address: "Průmyslová 395, 532 10 Pardubice",
    latitude: 50.0465,
    longitude: 15.7950,
    websiteUrl: "https://fzs.upce.cz/en",
    slug: "fzs"
  },
  {
    name: "Faculty of Electrical Engineering and Informatics",
    category: "faculty",
    description: "Focuses on IT, automation, and electronics. Key for tech students.",
    address: "nám. Čs. legií 565, 530 02 Pardubice",
    latitude: 50.0357,
    longitude: 15.7765,
    websiteUrl: "https://fei.upce.cz/en",
    slug: "fei"
  },
  {
    name: "Faculty of Restoration",
    category: "faculty",
    description: "Located in the historic UNESCO town of Litomyšl (approx. 50km away). Specializes in art conservation.",
    address: "Jiráskova 3, 570 01 Litomyšl",
    latitude: 49.8728,
    longitude: 16.3144,
    websiteUrl: "https://fr.upce.cz/en",
    slug: "fr"
  },
  {
    name: "Halls of Residence (Dorms)",
    category: "dorm",
    description: "Main student accommodation complex (Buildings A-E). Close to classes and the dining hall.",
    address: "Studentská 200, 530 09 Pardubice",
    latitude: 50.0475,
    longitude: 15.7695,
    websiteUrl: "https://www.upce.cz/en/accommodation",
    slug: "dorms"
  },
  {
    name: "University Dining Hall (Menza)",
    category: "dining",
    description: "Affordable meals for students. Serves traditional Czech cuisine and international options.",
    address: "Studentská, 530 09 Pardubice",
    latitude: 50.0470,
    longitude: 15.7700,
    websiteUrl: "https://www.upce.cz/en/dining",
    slug: "menza"
  },
  {
    name: "University Sports Centre",
    category: "sports",
    description: "Gyms, courts, and riverside sports grounds for student activities.",
    address: "Kunětická 2, 530 09 Pardubice",
    latitude: 50.0530,
    longitude: 15.7720,
    websiteUrl: "https://us.upce.cz/en",
    slug: "sports"
  }
];

async function seedDatabase() {
  console.log("Seeding database with updated locations...");
  // Clear existing to ensure fresh seed with correct data
  await db.delete(locations);
  for (const loc of SEED_LOCATIONS) {
    await storage.createLocation(loc);
  }
  console.log("Seeding complete.");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.locations.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const locations = await storage.getLocations(category);
    res.json(locations);
  });

  app.get(api.locations.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const location = await storage.getLocation(id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  });

  app.post(api.locations.create.path, async (req, res) => {
    try {
      const input = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(input);
      res.status(201).json(location);
    } catch (err) {
       if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Initialize seed data
  seedDatabase().catch(err => {
    console.error("Failed to seed database:", err);
  });

  return httpServer;
}
