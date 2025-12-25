import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Body, SystemMetrics, EnergyDataPoint } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DataPanelProps {
  bodies: Body[];
  metrics: SystemMetrics;
  energyHistory: EnergyDataPoint[];
  time: number;
  iteration: number;
  fps: number;
  selectedBodyId: string | null;
  onSelectBody: (id: string | null) => void;
  onRemoveBody: (id: string) => void;
}

export function DataPanel({
  bodies,
  metrics,
  energyHistory,
  time,
  iteration,
  fps,
  selectedBodyId,
  onSelectBody,
  onRemoveBody,
}: DataPanelProps) {
  const formatNumber = (n: number, decimals = 2) => {
    if (Math.abs(n) < 0.01 && n !== 0) {
      return n.toExponential(decimals);
    }
    return n.toFixed(decimals);
  };

  const chartData = energyHistory.slice(-100).map((d) => ({
    time: d.time.toFixed(1),
    Kinetic: d.kinetic,
    Potential: d.potential,
    Total: d.total,
  }));

  return (
    <div className="w-72 h-full bg-sidebar border-l border-sidebar-border flex flex-col overflow-hidden">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Data</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Simulation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Time</span>
                <span className="font-mono">{formatNumber(time, 1)} s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Iterations</span>
                <span className="font-mono">{iteration.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Bodies</span>
                <span className="font-mono">{bodies.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">FPS</span>
                <span className="font-mono">{fps}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">System Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Kinetic Energy</span>
                <span className="font-mono text-chart-1">{formatNumber(metrics.kineticEnergy)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Potential Energy</span>
                <span className="font-mono text-chart-2">{formatNumber(metrics.potentialEnergy)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Energy</span>
                <span className="font-mono text-chart-4">{formatNumber(metrics.totalEnergy)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Momentum X</span>
                <span className="font-mono">{formatNumber(metrics.momentum.x)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Momentum Y</span>
                <span className="font-mono">{formatNumber(metrics.momentum.y)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Angular Momentum</span>
                <span className="font-mono">{formatNumber(metrics.angularMomentum)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Energy Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 2 ? (
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => v.toExponential(0)}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--popover-border))",
                          borderRadius: "6px",
                          fontSize: "11px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Kinetic"
                        stroke="hsl(var(--chart-1))"
                        dot={false}
                        strokeWidth={1.5}
                      />
                      <Line
                        type="monotone"
                        dataKey="Potential"
                        stroke="hsl(var(--chart-2))"
                        dot={false}
                        strokeWidth={1.5}
                      />
                      <Line
                        type="monotone"
                        dataKey="Total"
                        stroke="hsl(var(--chart-4))"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-xs text-muted-foreground">
                  Run simulation to see energy graph
                </div>
              )}
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-chart-1" />
                  <span className="text-[10px] text-muted-foreground">KE</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-chart-2" />
                  <span className="text-[10px] text-muted-foreground">PE</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-chart-4" />
                  <span className="text-[10px] text-muted-foreground">Total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Bodies ({bodies.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {bodies.length === 0 ? (
                <div className="p-4 text-xs text-muted-foreground text-center">
                  No bodies in simulation
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {bodies.map((body, index) => (
                    <div
                      key={body.id}
                      className={`p-3 cursor-pointer hover-elevate ${
                        selectedBodyId === body.id ? "bg-sidebar-accent" : ""
                      }`}
                      onClick={() => onSelectBody(body.id)}
                      data-testid={`body-row-${index}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: body.color }}
                          />
                          <span className="text-xs font-medium">Body {index + 1}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBody(body.id);
                          }}
                          data-testid={`button-remove-body-${index}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mass</span>
                          <span className="font-mono">{formatNumber(body.mass, 1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Radius</span>
                          <span className="font-mono">{formatNumber(body.radius, 1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pos X</span>
                          <span className="font-mono">{formatNumber(body.position.x, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pos Y</span>
                          <span className="font-mono">{formatNumber(body.position.y, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vel X</span>
                          <span className="font-mono">{formatNumber(body.velocity.x, 1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vel Y</span>
                          <span className="font-mono">{formatNumber(body.velocity.y, 1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
