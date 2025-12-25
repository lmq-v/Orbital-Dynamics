import { randomUUID } from "crypto";

export interface StoredPreset {
  id: string;
  name: string;
  description: string;
  bodies: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    mass: number;
    radius: number;
    color: string;
  }[];
  G?: number;
  dt?: number;
}

export interface InsertPreset {
  name: string;
  description: string;
  bodies: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    mass: number;
    radius: number;
    color: string;
  }[];
  G?: number;
  dt?: number;
}

export interface IStorage {
  getPresets(): Promise<StoredPreset[]>;
  getPreset(id: string): Promise<StoredPreset | undefined>;
  createPreset(preset: InsertPreset): Promise<StoredPreset>;
  deletePreset(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private presets: Map<string, StoredPreset>;

  constructor() {
    this.presets = new Map();
  }

  async getPresets(): Promise<StoredPreset[]> {
    return Array.from(this.presets.values());
  }

  async getPreset(id: string): Promise<StoredPreset | undefined> {
    return this.presets.get(id);
  }

  async createPreset(insertPreset: InsertPreset): Promise<StoredPreset> {
    const id = randomUUID();
    const preset: StoredPreset = { ...insertPreset, id };
    this.presets.set(id, preset);
    return preset;
  }

  async deletePreset(id: string): Promise<boolean> {
    return this.presets.delete(id);
  }
}

export const storage = new MemStorage();
