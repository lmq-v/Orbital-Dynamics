import type { Preset } from "@shared/schema";
import { BODY_COLORS } from "@shared/schema";

export const PRESETS: Preset[] = [
  {
    id: "solar-system",
    name: "Solar System",
    description: "Sun with inner planets in stable orbits",
    G: 100,
    dt: 0.1,
    bodies: [
      { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, mass: 1000, radius: 30, color: "#FCD34D" },
      { position: { x: 80, y: 0 }, velocity: { x: 0, y: 35 }, mass: 1, radius: 6, color: "#94A3B8" },
      { position: { x: 130, y: 0 }, velocity: { x: 0, y: 28 }, mass: 3, radius: 8, color: "#F97316" },
      { position: { x: 180, y: 0 }, velocity: { x: 0, y: 24 }, mass: 4, radius: 10, color: "#3B82F6" },
      { position: { x: 240, y: 0 }, velocity: { x: 0, y: 20 }, mass: 2, radius: 7, color: "#EF4444" },
    ],
  },
  {
    id: "binary-stars",
    name: "Binary Stars",
    description: "Two stars orbiting their common center of mass",
    G: 100,
    dt: 0.1,
    bodies: [
      { position: { x: -80, y: 0 }, velocity: { x: 0, y: -15 }, mass: 500, radius: 25, color: "#F59E0B" },
      { position: { x: 80, y: 0 }, velocity: { x: 0, y: 15 }, mass: 500, radius: 25, color: "#EF4444" },
    ],
  },
  {
    id: "figure-8",
    name: "Figure-8 Orbit",
    description: "Famous stable 3-body periodic solution discovered in 1993",
    G: 1,
    dt: 0.01,
    bodies: [
      { position: { x: -97.000436, y: 24.308753 }, velocity: { x: 46.620669, y: 43.236573 }, mass: 100, radius: 12, color: "#3B82F6" },
      { position: { x: 97.000436, y: -24.308753 }, velocity: { x: 46.620669, y: 43.236573 }, mass: 100, radius: 12, color: "#EF4444" },
      { position: { x: 0, y: 0 }, velocity: { x: -93.24134, y: -86.473146 }, mass: 100, radius: 12, color: "#10B981" },
    ],
  },
  {
    id: "galaxy-collision",
    name: "Galaxy Collision",
    description: "Two groups of bodies colliding - chaotic dynamics",
    G: 50,
    dt: 0.1,
    bodies: [
      { position: { x: -200, y: 0 }, velocity: { x: 5, y: 8 }, mass: 800, radius: 20, color: "#8B5CF6" },
      { position: { x: -180, y: 30 }, velocity: { x: 5, y: 5 }, mass: 20, radius: 6, color: "#A78BFA" },
      { position: { x: -180, y: -30 }, velocity: { x: 5, y: 11 }, mass: 20, radius: 6, color: "#C4B5FD" },
      { position: { x: -220, y: 0 }, velocity: { x: 8, y: 8 }, mass: 20, radius: 6, color: "#DDD6FE" },
      { position: { x: 200, y: 0 }, velocity: { x: -5, y: -8 }, mass: 800, radius: 20, color: "#F59E0B" },
      { position: { x: 220, y: 30 }, velocity: { x: -5, y: -5 }, mass: 20, radius: 6, color: "#FBBF24" },
      { position: { x: 220, y: -30 }, velocity: { x: -5, y: -11 }, mass: 20, radius: 6, color: "#FCD34D" },
      { position: { x: 180, y: 0 }, velocity: { x: -8, y: -8 }, mass: 20, radius: 6, color: "#FDE68A" },
    ],
  },
  {
    id: "lagrange",
    name: "Lagrange Points",
    description: "Sun-Earth system with objects at L4 and L5 points",
    G: 100,
    dt: 0.1,
    bodies: [
      { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, mass: 1000, radius: 28, color: "#FCD34D" },
      { position: { x: 200, y: 0 }, velocity: { x: 0, y: 22.36 }, mass: 10, radius: 10, color: "#3B82F6" },
      { position: { x: 100, y: 173.2 }, velocity: { x: -19.36, y: 11.18 }, mass: 0.1, radius: 5, color: "#10B981" },
      { position: { x: 100, y: -173.2 }, velocity: { x: 19.36, y: 11.18 }, mass: 0.1, radius: 5, color: "#EF4444" },
    ],
  },
  {
    id: "random",
    name: "Random System",
    description: "Randomly generated bodies for chaotic exploration",
    G: 80,
    dt: 0.1,
    bodies: Array.from({ length: 8 }, (_, i) => ({
      position: { 
        x: (Math.random() - 0.5) * 400, 
        y: (Math.random() - 0.5) * 400 
      },
      velocity: { 
        x: (Math.random() - 0.5) * 20, 
        y: (Math.random() - 0.5) * 20 
      },
      mass: 50 + Math.random() * 200,
      radius: 8 + Math.random() * 12,
      color: BODY_COLORS[i % BODY_COLORS.length],
    })),
  },
];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
