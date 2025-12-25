import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const bodySchema = z.object({
  position: z.object({ x: z.number(), y: z.number() }),
  velocity: z.object({ x: z.number(), y: z.number() }),
  mass: z.number().positive(),
  radius: z.number().positive(),
  color: z.string(),
});

const insertPresetSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  bodies: z.array(bodySchema),
  G: z.number().optional(),
  dt: z.number().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/presets", async (req, res) => {
    try {
      const presets = await storage.getPresets();
      res.json(presets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presets" });
    }
  });

  app.get("/api/presets/:id", async (req, res) => {
    try {
      const preset = await storage.getPreset(req.params.id);
      if (!preset) {
        return res.status(404).json({ error: "Preset not found" });
      }
      res.json(preset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preset" });
    }
  });

  app.post("/api/presets", async (req, res) => {
    try {
      const parsed = insertPresetSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const preset = await storage.createPreset(parsed.data);
      res.status(201).json(preset);
    } catch (error) {
      res.status(500).json({ error: "Failed to create preset" });
    }
  });

  app.delete("/api/presets/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePreset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Preset not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete preset" });
    }
  });

  return httpServer;
}
