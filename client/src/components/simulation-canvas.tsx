import { useRef, useEffect, useCallback, useState } from "react";
import type { Body, Vector2D } from "@shared/schema";
import { computeCenterOfMass } from "@/lib/physics";

interface SimulationCanvasProps {
  bodies: Body[];
  showTrails: boolean;
  showGrid: boolean;
  showCenterOfMass: boolean;
  selectedBodyId: string | null;
  onSelectBody: (id: string | null) => void;
  onAddBody: (position: Vector2D) => void;
}

export function SimulationCanvas({
  bodies,
  showTrails,
  showGrid,
  showCenterOfMass,
  selectedBodyId,
  onSelectBody,
  onAddBody,
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Vector2D>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Vector2D>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<Vector2D>({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const screenToWorld = useCallback(
    (screenX: number, screenY: number): Vector2D => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      return {
        x: (screenX - centerX - pan.x) / zoom,
        y: (screenY - centerY - pan.y) / zoom,
      };
    },
    [dimensions, zoom, pan]
  );

  const worldToScreen = useCallback(
    (worldX: number, worldY: number): Vector2D => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      return {
        x: worldX * zoom + centerX + pan.x,
        y: worldY * zoom + centerY + pan.y,
      };
    },
    [dimensions, zoom, pan]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    if (showGrid) {
      const gridSpacing = 50 * zoom;
      const offsetX = (pan.x % gridSpacing + gridSpacing) % gridSpacing;
      const offsetY = (pan.y % gridSpacing + gridSpacing) % gridSpacing;

      ctx.strokeStyle = "rgba(100, 100, 120, 0.15)";
      ctx.lineWidth = 1;

      for (let x = offsetX; x < dimensions.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }

      for (let y = offsetY; y < dimensions.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      const center = worldToScreen(0, 0);
      ctx.strokeStyle = "rgba(100, 100, 120, 0.4)";
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(center.x, 0);
      ctx.lineTo(center.x, dimensions.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, center.y);
      ctx.lineTo(dimensions.width, center.y);
      ctx.stroke();
    }

    if (showTrails) {
      for (const body of bodies) {
        if (body.trail && body.trail.length > 1) {
          ctx.beginPath();
          const startScreen = worldToScreen(body.trail[0].x, body.trail[0].y);
          ctx.moveTo(startScreen.x, startScreen.y);

          for (let i = 1; i < body.trail.length; i++) {
            const screen = worldToScreen(body.trail[i].x, body.trail[i].y);
            ctx.lineTo(screen.x, screen.y);
          }

          const gradient = ctx.createLinearGradient(
            startScreen.x,
            startScreen.y,
            worldToScreen(body.position.x, body.position.y).x,
            worldToScreen(body.position.x, body.position.y).y
          );
          gradient.addColorStop(0, "transparent");
          gradient.addColorStop(1, body.color + "80");

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

    for (const body of bodies) {
      const screen = worldToScreen(body.position.x, body.position.y);
      const radius = Math.max(body.radius * zoom * 0.15, 3);

      const isSelected = body.id === selectedBodyId;

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const gradient = ctx.createRadialGradient(
        screen.x - radius * 0.3,
        screen.y - radius * 0.3,
        0,
        screen.x,
        screen.y,
        radius
      );
      gradient.addColorStop(0, body.color);
      gradient.addColorStop(0.7, body.color);
      gradient.addColorStop(1, adjustColor(body.color, -40));

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowColor = body.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = body.color + "40";
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (showCenterOfMass && bodies.length > 0) {
      const com = computeCenterOfMass(bodies);
      const comScreen = worldToScreen(com.x, com.y);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      const size = 8;

      ctx.beginPath();
      ctx.moveTo(comScreen.x - size, comScreen.y);
      ctx.lineTo(comScreen.x + size, comScreen.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(comScreen.x, comScreen.y - size);
      ctx.lineTo(comScreen.x, comScreen.y + size);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(comScreen.x, comScreen.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
  }, [bodies, dimensions, zoom, pan, showTrails, showGrid, showCenterOfMass, selectedBodyId, worldToScreen]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(10, prev * delta)));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const worldPos = screenToWorld(x, y);
      let clickedBody: Body | null = null;

      for (const body of bodies) {
        const dx = body.position.x - worldPos.x;
        const dy = body.position.y - worldPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < body.radius * 0.3 + 10 / zoom) {
          clickedBody = body;
          break;
        }
      }

      if (clickedBody) {
        onSelectBody(clickedBody.id);
      } else {
        onSelectBody(null);
        setIsDragging(true);
        setDragStart({ x, y });
        setPanStart(pan);
      }
    },
    [bodies, pan, screenToWorld, zoom, onSelectBody]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPan({
        x: panStart.x + (x - dragStart.x),
        y: panStart.y + (y - dragStart.y),
      });
    },
    [isDragging, dragStart, panStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const worldPos = screenToWorld(x, y);

      onAddBody(worldPos);
    },
    [screenToWorld, onAddBody]
  );

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0a0f] overflow-hidden">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-crosshair"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        data-testid="canvas-simulation"
      />

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((prev) => Math.min(10, prev * 1.2))}
          className="w-9 h-9 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-card-border rounded-md text-foreground hover-elevate active-elevate-2"
          data-testid="button-zoom-in"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(0.1, prev / 1.2))}
          className="w-9 h-9 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-card-border rounded-md text-foreground hover-elevate active-elevate-2"
          data-testid="button-zoom-out"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          onClick={handleResetView}
          className="w-9 h-9 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-card-border rounded-md text-foreground hover-elevate active-elevate-2"
          data-testid="button-reset-view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground bg-card/60 backdrop-blur-sm px-2 py-1 rounded">
        Zoom: {zoom.toFixed(2)}x
      </div>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
