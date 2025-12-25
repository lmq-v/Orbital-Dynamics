import { useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { ControlPanel } from "@/components/control-panel";
import { SimulationCanvas } from "@/components/simulation-canvas";
import { DataPanel } from "@/components/data-panel";
import { useSimulation } from "@/hooks/use-simulation";

export default function Simulator() {
  const {
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
    step,
    togglePlay,
  } = useSimulation();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "r":
          reset();
          break;
        case "s":
          if (!isPlaying) step();
          break;
        case "t":
          setShowTrails(!showTrails);
          break;
      }
    },
    [togglePlay, reset, step, isPlaying, setShowTrails, showTrails]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header bodies={bodies} G={G} dt={dt} time={time} />

      <div className="flex flex-1 overflow-hidden">
        <ControlPanel
          isPlaying={isPlaying}
          G={G}
          dt={dt}
          speed={speed}
          integrationMethod={integrationMethod}
          showTrails={showTrails}
          showGrid={showGrid}
          showCenterOfMass={showCenterOfMass}
          onTogglePlay={togglePlay}
          onStep={step}
          onReset={reset}
          onLoadPreset={loadPreset}
          onSetG={setG}
          onSetDt={setDt}
          onSetSpeed={setSpeed}
          onSetIntegrationMethod={setIntegrationMethod}
          onSetShowTrails={setShowTrails}
          onSetShowGrid={setShowGrid}
          onSetShowCenterOfMass={setShowCenterOfMass}
        />

        <div className="flex-1 overflow-hidden">
          <SimulationCanvas
            bodies={bodies}
            showTrails={showTrails}
            showGrid={showGrid}
            showCenterOfMass={showCenterOfMass}
            selectedBodyId={selectedBodyId}
            onSelectBody={setSelectedBodyId}
            onAddBody={addBody}
          />
        </div>

        <DataPanel
          bodies={bodies}
          metrics={metrics}
          energyHistory={energyHistory}
          time={time}
          iteration={iteration}
          fps={fps}
          selectedBodyId={selectedBodyId}
          onSelectBody={setSelectedBodyId}
          onRemoveBody={removeBody}
        />
      </div>

      <footer className="h-8 bg-card border-t border-card-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Time: {time.toFixed(2)}s</span>
          <span>Iterations: {iteration.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{bodies.length} bodies</span>
          <span>Method: {integrationMethod.toUpperCase()}</span>
        </div>
      </footer>
    </div>
  );
}
