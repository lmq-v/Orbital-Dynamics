import { Moon, Sun, HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Body } from "@shared/schema";

interface HeaderProps {
  bodies: Body[];
  G: number;
  dt: number;
  time: number;
}

export function Header({ bodies, G, dt, time }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      parameters: { G, dt },
      simulationTime: time,
      bodies: bodies.map((b) => ({
        position: b.position,
        velocity: b.velocity,
        mass: b.mass,
        radius: b.radius,
        color: b.color,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nbody-simulation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 bg-card border-b border-card-border flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            className="text-primary"
          >
            <circle cx="16" cy="16" r="4" fill="currentColor" />
            <circle
              cx="16"
              cy="16"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle cx="26" cy="16" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="10" cy="8" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="8" cy="22" r="1.5" fill="currentColor" opacity="0.4" />
          </svg>
          <h1 className="text-xl font-semibold text-card-foreground">N-Body Simulator</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExport}
          title="Export simulation data"
          data-testid="button-export"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="button-help">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>N-Body Simulator Help</DialogTitle>
              <DialogDescription>
                A gravitational n-body simulation demonstrating computational physics
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Space</kbd>
                    <span>Play / Pause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">R</kbd>
                    <span>Reset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">S</kbd>
                    <span>Step forward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">T</kbd>
                    <span>Toggle trails</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Canvas Controls</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Scroll to zoom in/out</li>
                  <li>Click and drag to pan</li>
                  <li>Click on a body to select it</li>
                  <li>Double-click to add a new body</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Integration Methods</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Euler:</strong> Simple, fast, but energy drifts over time</li>
                  <li><strong>Velocity Verlet:</strong> Symplectic, good energy conservation</li>
                  <li><strong>RK4:</strong> 4th-order Runge-Kutta, most accurate</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Physics</h3>
                <p className="text-muted-foreground">
                  This simulator solves Newton's law of universal gravitation using numerical
                  integration. The gravitational force between two bodies is F = G·m₁·m₂/r².
                  Total energy (kinetic + potential) should be conserved in a closed system.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
