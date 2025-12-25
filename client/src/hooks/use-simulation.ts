import { useState, useCallback, useRef, useEffect } from "react";
import type { Body, SimulationState, EnergyDataPoint, SystemMetrics } from "@shared/schema";
import { BODY_COLORS } from "@shared/schema";
import { stepSimulation, computeSystemMetrics } from "@/lib/physics";
import { PRESETS, getPresetById } from "@/lib/presets";

const MAX_TRAIL_LENGTH = 200;
const MAX_ENERGY_HISTORY = 500;

export function useSimulation() {
  const [bodies, setBodies] = useState<Body[]>([]);
  const [time, setTime] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [G, setG] = useState(100);
  const [dt, setDt] = useState(0.1);
  const [speed, setSpeed] = useState(1);
  const [integrationMethod, setIntegrationMethod] = useState<"euler" | "verlet" | "rk4">("rk4");
  const [showTrails, setShowTrails] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showCenterOfMass, setShowCenterOfMass] = useState(true);
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);
  const [energyHistory, setEnergyHistory] = useState<EnergyDataPoint[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    kineticEnergy: 0,
    potentialEnergy: 0,
    totalEnergy: 0,
    momentum: { x: 0, y: 0 },
    angularMomentum: 0,
    centerOfMass: { x: 0, y: 0 },
  });
  const [fps, setFps] = useState(0);

  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(0);

  const loadPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) return;

    const newBodies: Body[] = preset.bodies.map((b, i) => ({
      ...b,
      id: `body-${Date.now()}-${i}`,
      trail: [],
    }));

    setBodies(newBodies);
    setTime(0);
    setIteration(0);
    setEnergyHistory([]);
    setSelectedBodyId(null);
    if (preset.G !== undefined) setG(preset.G);
    if (preset.dt !== undefined) setDt(preset.dt);
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setBodies([]);
    setTime(0);
    setIteration(0);
    setEnergyHistory([]);
    setSelectedBodyId(null);
    setIsPlaying(false);
  }, []);

  const addBody = useCallback((position: { x: number; y: number }, velocity?: { x: number; y: number }) => {
    const newBody: Body = {
      id: `body-${Date.now()}`,
      position,
      velocity: velocity || { x: 0, y: 0 },
      mass: 100,
      radius: 12,
      color: BODY_COLORS[bodies.length % BODY_COLORS.length],
      trail: [],
    };
    setBodies((prev) => [...prev, newBody]);
  }, [bodies.length]);

  const removeBody = useCallback((id: string) => {
    setBodies((prev) => prev.filter((b) => b.id !== id));
    if (selectedBodyId === id) setSelectedBodyId(null);
  }, [selectedBodyId]);

  const updateBody = useCallback((id: string, updates: Partial<Body>) => {
    setBodies((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const step = useCallback(() => {
    if (bodies.length === 0) return;

    setBodies((prevBodies) => {
      const newBodies = stepSimulation(prevBodies, G, dt, integrationMethod);
      
      return newBodies.map((body, i) => {
        const trail = showTrails
          ? [...(prevBodies[i].trail || []), prevBodies[i].position].slice(-MAX_TRAIL_LENGTH)
          : [];
        return { ...body, trail };
      });
    });

    setTime((prev) => prev + dt);
    setIteration((prev) => prev + 1);
  }, [bodies.length, G, dt, integrationMethod, showTrails]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (bodies.length > 0) {
      const newMetrics = computeSystemMetrics(bodies, G);
      setMetrics(newMetrics);

      setEnergyHistory((prev) => {
        const newPoint: EnergyDataPoint = {
          time,
          kinetic: newMetrics.kineticEnergy,
          potential: newMetrics.potentialEnergy,
          total: newMetrics.totalEnergy,
        };
        return [...prev, newPoint].slice(-MAX_ENERGY_HISTORY);
      });
    }
  }, [bodies, G, time]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      
      const elapsed = timestamp - lastTimeRef.current;
      const targetInterval = 16 / speed;

      if (elapsed >= targetInterval) {
        step();
        lastTimeRef.current = timestamp;
      }

      frameCountRef.current++;
      if (timestamp - fpsTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        fpsTimeRef.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, step]);

  useEffect(() => {
    loadPreset("solar-system");
  }, []);

  return {
    bodies,
    time,
    iteration,
    isPlaying,
    G,
    dt,
    speed,
    integrationMethod,
    showTrails,
    showGrid,
    showCenterOfMass,
    selectedBodyId,
    energyHistory,
    metrics,
    fps,
    setG,
    setDt,
    setSpeed,
    setIntegrationMethod,
    setShowTrails,
    setShowGrid,
    setShowCenterOfMass,
    setSelectedBodyId,
    loadPreset,
    reset,
    addBody,
    removeBody,
    updateBody,
    step,
    togglePlay,
  };
}
