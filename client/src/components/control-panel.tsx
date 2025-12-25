import { Play, Pause, RotateCcw, SkipForward, Grid, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { PRESETS } from "@/lib/presets";

interface ControlPanelProps {
  isPlaying: boolean;
  G: number;
  dt: number;
  speed: number;
  integrationMethod: "euler" | "verlet" | "rk4";
  showTrails: boolean;
  showGrid: boolean;
  showCenterOfMass: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onLoadPreset: (id: string) => void;
  onSetG: (value: number) => void;
  onSetDt: (value: number) => void;
  onSetSpeed: (value: number) => void;
  onSetIntegrationMethod: (value: "euler" | "verlet" | "rk4") => void;
  onSetShowTrails: (value: boolean) => void;
  onSetShowGrid: (value: boolean) => void;
  onSetShowCenterOfMass: (value: boolean) => void;
}

export function ControlPanel({
  isPlaying,
  G,
  dt,
  speed,
  integrationMethod,
  showTrails,
  showGrid,
  showCenterOfMass,
  onTogglePlay,
  onStep,
  onReset,
  onLoadPreset,
  onSetG,
  onSetDt,
  onSetSpeed,
  onSetIntegrationMethod,
  onSetShowTrails,
  onSetShowGrid,
  onSetShowCenterOfMass,
}: ControlPanelProps) {
  return (
    <div className="w-80 h-full bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Controls</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={onTogglePlay}
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onStep}
            disabled={isPlaying}
            data-testid="button-step"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onReset}
            data-testid="button-reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-sidebar-foreground hover-elevate rounded px-2" data-testid="trigger-presets">
            Presets
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => onLoadPreset(preset.id)}
                  data-testid={`button-preset-${preset.id}`}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-sidebar-foreground hover-elevate rounded px-2" data-testid="trigger-physics">
            Physics Parameters
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Gravitational Constant (G)
                </Label>
                <span className="text-xs font-mono text-sidebar-foreground">{G.toFixed(1)}</span>
              </div>
              <Slider
                value={[G]}
                min={1}
                max={500}
                step={1}
                onValueChange={([value]) => onSetG(value)}
                data-testid="slider-g"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Time Step (dt)</Label>
                <span className="text-xs font-mono text-sidebar-foreground">{dt.toFixed(3)}</span>
              </div>
              <Slider
                value={[dt]}
                min={0.001}
                max={0.5}
                step={0.001}
                onValueChange={([value]) => onSetDt(value)}
                data-testid="slider-dt"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Integration Method</Label>
              <Select
                value={integrationMethod}
                onValueChange={(value) =>
                  onSetIntegrationMethod(value as "euler" | "verlet" | "rk4")
                }
              >
                <SelectTrigger className="w-full" data-testid="select-integration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="euler">Euler (Fast, Less Accurate)</SelectItem>
                  <SelectItem value="verlet">Velocity Verlet (Balanced)</SelectItem>
                  <SelectItem value="rk4">RK4 (Accurate, Slower)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-sidebar-foreground hover-elevate rounded px-2" data-testid="trigger-speed">
            Simulation Speed
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Speed Multiplier</Label>
              <span className="text-xs font-mono text-sidebar-foreground">{speed.toFixed(1)}x</span>
            </div>
            <Slider
              value={[speed]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={([value]) => onSetSpeed(value)}
              data-testid="slider-speed"
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-sidebar-foreground hover-elevate rounded px-2" data-testid="trigger-visual">
            Visual Settings
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-sidebar-foreground flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-current" />
                Orbital Trails
              </Label>
              <Switch
                checked={showTrails}
                onCheckedChange={onSetShowTrails}
                data-testid="switch-trails"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-sidebar-foreground flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Grid Overlay
              </Label>
              <Switch
                checked={showGrid}
                onCheckedChange={onSetShowGrid}
                data-testid="switch-grid"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-sidebar-foreground flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                Center of Mass
              </Label>
              <Switch
                checked={showCenterOfMass}
                onCheckedChange={onSetShowCenterOfMass}
                data-testid="switch-com"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          Double-click canvas to add body
        </p>
      </div>
    </div>
  );
}
