import { z } from "zod";

export const vector2DSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Vector2D = z.infer<typeof vector2DSchema>;

export const bodySchema = z.object({
  id: z.string(),
  position: vector2DSchema,
  velocity: vector2DSchema,
  mass: z.number().positive(),
  radius: z.number().positive(),
  color: z.string(),
  trail: z.array(vector2DSchema).optional(),
});

export type Body = z.infer<typeof bodySchema>;

export const simulationStateSchema = z.object({
  bodies: z.array(bodySchema),
  time: z.number(),
  iteration: z.number(),
  G: z.number(),
  dt: z.number(),
  integrationMethod: z.enum(["euler", "verlet", "rk4"]),
});

export type SimulationState = z.infer<typeof simulationStateSchema>;

export const presetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  bodies: z.array(bodySchema.omit({ id: true, trail: true })),
  G: z.number().optional(),
  dt: z.number().optional(),
});

export type Preset = z.infer<typeof presetSchema>;

export const insertPresetSchema = presetSchema.omit({ id: true });
export type InsertPreset = z.infer<typeof insertPresetSchema>;

export interface SystemMetrics {
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  momentum: Vector2D;
  angularMomentum: number;
  centerOfMass: Vector2D;
}

export interface EnergyDataPoint {
  time: number;
  kinetic: number;
  potential: number;
  total: number;
}

export const BODY_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];
