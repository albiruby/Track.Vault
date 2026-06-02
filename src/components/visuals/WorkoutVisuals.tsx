/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout, WorkoutBlock, SupportRoutine } from "../../types/workout";
import { formatWorkoutBlock, formatExerciseBlock } from "../../lib/workouts";
import { 
  Flame, 
  Activity, 
  TrendingUp, 
  RefreshCw, 
  Layers, 
  Zap, 
  Heart, 
  Shield, 
  Info, 
  Dumbbell, 
  Axis3d, 
  Target, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

// ==========================================
// 1. RUNNING WORKOUT VISUALS
// ==========================================

export interface WorkoutVisualsProps {
  workout: Partial<Workout>;
}

/**
 * Session Structure Timeline
 * Segmented horizontal visual bar showing Warmup, Main Set, and Cooldown phases with step counts.
 */
export function SessionTimeline({ workout }: WorkoutVisualsProps) {
  const isSupport = (workout as any).entryType === "support-routine";
  
  if (isSupport) {
    return <SupportStructureTimeline workout={workout} />;
  }

  const wuSteps = workout.warmup?.length || 0;
  const msSteps = workout.mainSet?.length || 0;
  const cdSteps = workout.cooldown?.length || 0;
  const totalSteps = wuSteps + msSteps + cdSteps;

  if (totalSteps === 0) {
    return (
      <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic">
        Structure timeline unavailable for this custom session.
      </div>
    );
  }

  // Calculate proportional widths (minimum 10% for empty sets to keep text visible)
  const wuWeight = wuSteps > 0 ? Math.max((wuSteps / totalSteps) * 100, 20) : 0;
  const msWeight = msSteps > 0 ? Math.max((msSteps / totalSteps) * 100, 40) : 0;
  const cdWeight = cdSteps > 0 ? Math.max((cdSteps / totalSteps) * 100, 20) : 0;
  const sumWeights = wuWeight + msWeight + cdWeight;
  
  const wuPct = (wuWeight / sumWeights) * 100;
  const msPct = (msWeight / sumWeights) * 100;
  const cdPct = (cdWeight / sumWeights) * 100;

  return (
    <div className="space-y-2 w-full">
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
        Workout Phase Timeline
      </span>
      <div className="h-10 w-full rounded-2xl overflow-hidden flex border border-[#E2E8F0] shadow-sm">
        {wuSteps > 0 && (
          <div 
            style={{ width: `${wuPct}%` }}
            className="bg-slate-105 hover:bg-slate-100 transition-colors flex items-center justify-center border-r border-[#E2E8F0] relative group px-2"
          >
            <div className="flex items-center gap-1.5 text-slate-600">
              <Flame className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate sm:inline hidden">WU</span>
              <span className="text-[10px] font-mono font-bold bg-slate-205 text-slate-600 px-1.5 py-0.5 rounded-md leading-none">{wuSteps}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-800 text-white text-[9px] font-mono rounded px-2 py-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
              Warm-up Phase: {wuSteps} Block{wuSteps > 1 ? "s" : ""}
            </div>
          </div>
        )}
        {msSteps > 0 && (
          <div 
            style={{ width: `${msPct}%` }}
            className="bg-orange-500 flex items-center justify-center relative group px-2"
          >
            <div className="flex items-center gap-1.5 text-white">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate sm:inline hidden">MAIN SET</span>
              <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-1.5 py-0.5 rounded-md leading-none">{msSteps}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-800 text-white text-[9px] font-mono rounded px-2 py-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
              Main Set Work: {msSteps} Block{msSteps > 1 ? "s" : ""}
            </div>
          </div>
        )}
        {cdSteps > 0 && (
          <div 
            style={{ width: `${cdPct}%` }}
            className="bg-slate-700 flex items-center justify-center relative group px-2"
          >
            <div className="flex items-center gap-1.5 text-slate-100">
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate sm:inline hidden">CD</span>
              <span className="text-[10px] font-mono font-bold bg-white/10 text-white px-1.5 py-0.5 rounded-md leading-none">{cdSteps}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-800 text-white text-[9px] font-mono rounded px-2 py-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
              Cooldown Taper: {cdSteps} Block{cdSteps > 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Effort Strip Chart
 * A custom SVG timeline displaying effort spikes and plateau patterns.
 */
export function EffortStrip({ workout }: WorkoutVisualsProps) {
  const isSupport = (workout as any).entryType === "support-routine";
  if (isSupport) return null;

  const wuBlocks = workout.warmup || [];
  const msBlocks = workout.mainSet || [];
  const cdBlocks = workout.cooldown || [];

  // Compose sequence of data points representing workout effort levels
  // Pacing is scaled 0 to 100
  const points: { label: string; xPct: number; yEffort: number; isWork: boolean }[] = [];

  // Hardcode warmup ramp config
  points.push({ label: "Start", xPct: 0, yEffort: 10, isWork: false });
  points.push({ label: "WU Easy", xPct: 15, yEffort: 30, isWork: false });

  // Main set details
  if (msBlocks.length > 0) {
    const msStartPct = 25;
    const msEndPct = 85;
    const msSpan = msEndPct - msStartPct;

    msBlocks.forEach((block: any, idx: number) => {
      const startX = msStartPct + (idx / msBlocks.length) * msSpan;
      const endX = msStartPct + ((idx + 1) / msBlocks.length) * msSpan;

      const intens = (block.work?.intensity || "").toLowerCase();
      let effort = 65; // Moderate pace
      if (intens.includes("sprint") || intens.includes("max") || intens.includes("100%")) {
        effort = 100;
      } else if (intens.includes("hard") || intens.includes("5k") || intens.includes("3k") || intens.includes("mile")) {
        effort = 85;
      } else if (intens.includes("threshold") || intens.includes("tempo") || intens.includes("10k")) {
        effort = 75;
      } else if (intens.includes("easy") || intens.includes("recovery")) {
        effort = 35;
      }

      // Add actual interval Work Spike
      points.push({ label: block.name || "Work", xPct: startX + 1, yEffort: effort, isWork: true });
      points.push({ label: block.name || "Work", xPct: startX + (block.recovery ? 4 : 5), yEffort: effort, isWork: true });

      // Add Interval Recovery Valley if recovery block is registered
      if (block.recovery && block.recovery.type !== "none") {
        let recEffort = 25; // Passive/Walk
        if (block.recovery.type.includes("jog") || block.recovery.type.includes("active")) {
          recEffort = 40;
        }
        points.push({ label: "Recovery", xPct: startX + (block.recovery ? 4.5 : 5.5), yEffort: recEffort, isWork: false });
        points.push({ label: "Recovery", xPct: endX - 0.5, yEffort: recEffort, isWork: false });
      }
    });
  } else {
    // Standard flat middle block if no mainset steps
    points.push({ label: "Steady", xPct: 50, yEffort: 40, isWork: true });
  }

  // Cooldown taper
  points.push({ label: "CD Jog", xPct: 90, yEffort: 20, isWork: false });
  points.push({ label: "Finish", xPct: 100, yEffort: 10, isWork: false });

  // Map points to SVG coordinates (Width 500, Height 80, invert Y coordinate for graphics)
  // Height = 80 max, margins = top 10, bottom 10.
  const svgH = 80;
  const mapY = (effortVal: number) => {
    const usableH = svgH - 20; // 60px
    return svgH - 10 - (effortVal / 100) * usableH;
  };

  const linePath = points.map(p => `${(p.xPct / 100) * 500},${mapY(p.yEffort)}`).join(" ");
  // Area path enclosing back to bottom
  const areaPath = `${linePath} 500,${svgH - 5} 0,${svgH - 5} Z`;

  return (
    <div className="space-y-2 w-full p-4 bg-slate-50 border border-slate-205 rounded-2xl font-mono">
      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
        <span className="text-[10px] tracking-widest text-[#475569] font-black uppercase flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
          Workout Intensity Curve
        </span>
        <span className="text-[9px] text-slate-400 font-bold uppercase">
          Scaled Pace Progression
        </span>
      </div>
      
      <div className="relative w-full overflow-hidden pt-1">
        <svg viewBox="0 0 500 80" className="w-full h-auto drop-shadow-sm overflow-visible">
          <defs>
            <linearGradient id="effortGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB923C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FB923C" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#EA580C" />
              <stop offset="85%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          <line x1="0" y1={mapY(100)} x2="500" y2={mapY(100)} stroke="#E2E8F0" strokeDasharray="3,3" />
          <line x1="0" y1={mapY(50)} x2="500" y2={mapY(50)} stroke="#F1F5F9" strokeDasharray="2,2" />
          <line x1="0" y1={mapY(10)} x2="500" y2={mapY(10)} stroke="#E2E8F0" />

          {/* Legend bounds text */}
          <text x="5" y={mapY(100) - 3} className="text-[8px] fill-slate-400 font-bold">100% INTENT</text>
          <text x="5" y={mapY(50) - 3} className="text-[8px] fill-slate-350 font-semibold">50% MID</text>
          <text x="5" y={mapY(10) + 10} className="text-[8px] fill-slate-400 font-bold">EASY JOG</text>

          {/* Area under the curve */}
          <polygon points={areaPath} fill="url(#effortGrad)" />

          {/* Flow path line */}
          <polyline 
            fill="none" 
            stroke="url(#lineGrad)" 
            strokeWidth="2.5" 
            points={linePath} 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes markers for key work blocks */}
          {points.filter(p => p.isWork).slice(0, 8).map((p, i) => (
            <circle 
              key={i} 
              cx={(p.xPct / 100) * 500} 
              cy={mapY(p.yEffort)} 
              r="3.5" 
              fill="#EA580C" 
              stroke="#FFF" 
              strokeWidth="1.5" 
            />
          ))}
        </svg>
      </div>

      <div className="flex justify-between items-center text-[9px] text-[#64748B] pt-1">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />Warm-up Prep</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />Main Target Set</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />Cooldown Taper</span>
      </div>
    </div>
  );
}

/**
 * Repetition Map
 * Parses workout main sets and draws a grid of tiles (e.g. 5x1000m) with distance labels.
 */
export function RepetitionMap({ workout }: WorkoutVisualsProps) {
  const isSupport = (workout as any).entryType === "support-routine";
  if (isSupport) return null;

  const mainSets = workout.mainSet || [];
  if (mainSets.length === 0) return null;

  return (
    <div className="space-y-3 w-full font-mono">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block">
        Main Set Repetition Map
      </span>

      <div className="space-y-3 bg-slate-50/50 p-4 border border-[#E2E8F0] rounded-2xl">
        {mainSets.map((block: WorkoutBlock, bIdx) => {
          const reps = Math.min(block.repetitions || 1, 16); // cap visual items to prevent card explode
          const isInterval = reps > 1;
          const targetText = block.work.distanceMeters 
            ? `${block.work.distanceMeters}m`
            : block.work.durationSeconds 
            ? `${block.work.durationSeconds}s`
            : "Work";

          const recText = block.recovery?.durationSeconds 
            ? `${block.recovery.durationSeconds}s`
            : block.recovery?.distanceMeters 
            ? `${block.recovery.distanceMeters}m`
            : "";

          return (
            <div key={block.id || bIdx} className="space-y-1.5 border-b border-slate-100 last:border-none pb-2.5 last:pb-0">
              <div className="flex justify-between text-xs text-[#1E293B] font-semibold items-center">
                <span>
                  {block.name || `Interval Series ${bIdx + 1}`}
                </span>
                <span className="text-[10px] text-slate-450">
                  {block.repetitions || 1} iterations • {targetText} {block.work.intensity ? `@ ${block.work.intensity}` : ""}
                </span>
              </div>

              {isInterval ? (
                /* Grouped intervals tiles flow */
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {Array.from({ length: block.repetitions || 1 }).map((_, repIdx) => (
                    <React.Fragment key={repIdx}>
                      <div className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 border border-orange-600 rounded-lg text-white font-bold text-[10px] text-center shadow-sm select-none shrink-0 cursor-default transition-colors">
                        {targetText}
                      </div>
                      {recText && repIdx < (block.repetitions || 1) - 1 && (
                        <div 
                          className="text-[9px] text-[#A1A1AA] italic shrink-0 font-medium px-0.5 border-b border-dashed border-[#D4D4D8] leading-none"
                          title="Recovery time gap"
                        >
                          {recText}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                /* Single structural tempo box block */
                <div className="pt-0.5">
                  <div className="w-full bg-orange-100/90 border border-orange-200 text-orange-850 py-3.5 px-4 rounded-xl text-center font-bold text-xs shadow-sm cursor-default">
                    Steady State Block ➡️ {targetText} {block.work.intensity ? `[Target: ${block.work.intensity}]` : ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Volume Breakdown Bar
 * Triple-divided horizontal strip with percentage gauges (Warm-up, Target Work, Recovery rest gaps/CD)
 */
export function VolumeBreakdownBar({ workout }: WorkoutVisualsProps) {
  const isSupport = (workout as any).entryType === "support-routine";
  if (isSupport) return null;

  // Derive logical proportions based on step metrics
  const wuBlocks = workout.warmup?.length || 0;
  const msBlocks = workout.mainSet?.length || 0;
  const cdBlocks = workout.cooldown?.length || 0;

  let totalReps = 0;
  let workReps = 0;

  // Warmup blocks count as light work reps
  totalReps += wuBlocks;

  // Sum main set iterations
  workout.mainSet?.forEach((b: WorkoutBlock) => {
    const reps = b.repetitions || 1;
    workReps += reps;
    totalReps += reps; // each interval step counts
  });

  totalReps += cdBlocks;

  if (totalReps === 0) return null;

  const wuShare = Math.round((wuBlocks / totalReps) * 100);
  const workShare = Math.round((workReps / totalReps) * 100);
  const cdShare = Math.max(0, 100 - wuShare - workShare);

  return (
    <div className="space-y-1.5 w-full font-mono">
      <div className="flex justify-between items-baseline text-[10px] uppercase font-bold tracking-widest text-[#475569]">
        <span>Volume Breakdown</span>
        <span className="text-[#94A3B8]">Steps & Effort Share</span>
      </div>

      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
        {wuShare > 0 && (
          <div style={{ width: `${wuShare}%` }} className="bg-slate-300" title={`Warmup: ${wuShare}%`} />
        )}
        {workShare > 0 && (
          <div style={{ width: `${workShare}%` }} className="bg-orange-500" title={`Main Work: ${workShare}%`} />
        )}
        {cdShare > 0 && (
          <div style={{ width: `${cdShare}%` }} className="bg-slate-750" title={`Cooldown/Taper: ${cdShare}%`} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-[9px] text-slate-500 font-bold uppercase mt-1 leading-none">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-slate-300 rounded" />
          <span>Warm: {wuShare}%</span>
        </div>
        <div className="flex items-center gap-1 justify-center">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded" />
          <span>Work: {workShare}%</span>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <span className="w-1.5 h-1.5 bg-slate-750 rounded" />
          <span>CD: {cdShare}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Pacing / Prescription Guide Panel
 * Displays descriptive training targets pulled from workout schema fields.
 */
export function PacingGuidePanel({ workout }: WorkoutVisualsProps) {
  const isSupport = (workout as any).entryType === "support-routine";
  if (isSupport) return null;

  const guide = workout.intensityGuide || {};
  const surface = workout.surface;
  const phase = workout.phase;

  const hasGuide = guide.warmup || guide.mainSet || guide.cooldown || guide.general;

  return (
    <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl space-y-3 font-mono">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 pb-1">
        Pacing Target Guide
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
        <div>
          <span className="text-[9px] uppercase text-slate-400 block font-bold">Training Phase Focus</span>
          <span className="text-xs font-bold text-slate-800 capitalize block mt-0.5">{phase || "Build Phase"}</span>
        </div>
        <div>
          <span className="text-[9px] uppercase text-slate-400 block font-bold">Athletic Surface</span>
          <span className="text-xs font-bold text-slate-800 capitalize block mt-0.5">{surface || "Target track"}</span>
        </div>
      </div>

      {hasGuide ? (
        <div className="pt-2 border-t border-slate-100/60 space-y-2 text-xs">
          {guide.general && (
            <div>
              <span className="text-[9px] uppercase text-orange-500 font-bold block">Session pacing rules</span>
              <p className="text-slate-650 font-medium leading-relaxed mt-0.5">{guide.general}</p>
            </div>
          )}
          {guide.warmup && (
            <div>
              <span className="text-[9px] uppercase text-slate-400 font-bold block">Warmup target</span>
              <p className="text-slate-650 leading-relaxed mt-0.5">{guide.warmup}</p>
            </div>
          )}
          {guide.mainSet && (
            <div>
              <span className="text-[9px] uppercase text-orange-600 font-bold block">Main Target Effort</span>
              <p className="text-slate-650 font-semibold leading-relaxed mt-0.5">{guide.mainSet}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-2.5 bg-slate-50 border border-slate-100 text-slate-450 italic text-[11px] rounded-xl flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          No manual pacing bounds registered. Adhere to individual tempo charts.
        </div>
      )}
    </div>
  );
}


// ==========================================
// 2. SUPPORT ROUTINE VISUALS
// ==========================================

export interface SupportVisualsProps {
  routine: Partial<SupportRoutine>;
}

/**
 * Routine Structure Flow
 * Sequential graphic showing exercise flow with counts.
 */
export function RoutineFlowDiagram({ routine }: { routine: Partial<Workout> }) {
  const structure = routine.sessionStructure;
  const structArr = Array.isArray(structure) ? structure : [];

  if (structArr.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-dashed border-slate-205 text-center text-xs text-slate-400 italic rounded-2xl font-mono">
        Exercise routine specs rendered in structural notes layout.
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full font-mono">
      <div className="flex justify-between items-baseline border-b border-slate-100 pb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
          Sequence Flow Diagram
        </span>
        <span className="text-[9px] text-[#2563EB] font-bold uppercase">
          {structArr.length} Stations Circuit
        </span>
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {structArr.map((ex: any, idx: number) => {
          const mainSpec = ex.sets ? (ex.reps ? `${ex.sets}x${ex.reps}` : ex.durationSeconds ? `${ex.sets}s hold` : `${ex.sets} sets`) : (ex.reps ? `${ex.reps} reps` : "");
          const sideText = ex.side && ex.side !== "none" && ex.side !== "both" ? `${ex.side} side` : "";
          const restText = ex.restSeconds ? `Rest ${ex.restSeconds}s` : "";

          return (
            <div 
              key={idx} 
              className="group p-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-blue-500 rounded-xl flex gap-3 items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-5 h-5 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center font-bold text-[10px] transition-colors shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 block truncate group-hover:text-blue-700 transition-colors">
                    {ex.name || "Station"}
                  </span>
                  {ex.notes && (
                    <span className="text-[9px] text-slate-400 italic block truncate mt-0.5 leading-none">
                      ↳ {Array.isArray(ex.notes) ? ex.notes[0] : ex.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Specs Badge chips */}
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase shrink-0">
                {mainSpec && (
                  <span className="px-2 py-0.5 bg-blue-50/75 text-blue-700 border border-blue-100 rounded">
                    {mainSpec}
                  </span>
                )}
                {sideText && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {sideText}
                  </span>
                )}
                {restText && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-center shrink-0">
                    ⏱ {restText}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Body Focus Region Emphasis
 * Renders target body focus cards dynamically mapped.
 */
export function BodyFocusMap({ routine }: { routine: Partial<Workout> }) {
  const rawFocus = routine.bodyFocus;
  const focusPills = Array.isArray(rawFocus) ? rawFocus : [rawFocus || "Lower-Body"];

  const musclesList = [
    { name: "hips / glutes", key: "hip", label: "Hip & Glute Base", icon: "🍑" },
    { name: "core / trunk", key: "core", label: "Pelvic Core Pillar", icon: "🛡" },
    { name: "calves", key: "calf", label: "Calf & Achilles", icon: "👟" },
    { name: "hamstrings", key: "hamstring", label: "Hamstring Loop", icon: "💪" },
    { name: "ankles / feet", key: "ankle", label: "Foot/Ankle Stability", icon: "🦶" },
    { name: "shoulders", key: "shoulder", label: "Shoulder & Trunk", icon: "👕" },
    { name: "quads", key: "quad", label: "Quadriceps Group", icon: "🍗" },
  ];

  // Match which muscle groups are targeted
  const activeMuscles = musclesList.map(muscle => {
    const isMatched = focusPills.some((fp: string) => {
      const norm = fp.toLowerCase();
      return norm.includes(muscle.key) || norm.includes(muscle.name) || muscle.name.includes(norm);
    });
    return { ...muscle, active: isMatched };
  });

  return (
    <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl space-y-3 font-mono">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block border-b border-slate-100 pb-1">
        Routine Body Focus Regions
      </span>

      <div className="grid grid-cols-2 gap-2 pt-0.5">
        {activeMuscles.map((muscle, idx) => (
          <div 
            key={idx}
            className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
              muscle.active 
                ? "bg-blue-50/75 text-blue-800 border-blue-200 font-bold shadow-sm"
                : "bg-slate-50/40 text-slate-400 border-slate-100 opacity-60"
            }`}
          >
            <span className="text-sm shrink-0 leading-none">{muscle.icon}</span>
            <div className="min-w-0 pr-1">
              <span className="text-[10px] uppercase truncate block leading-tight">{muscle.name}</span>
              <span className="text-[8px] text-slate-400 block mt-0.5 leading-none font-medium">
                {muscle.active ? "PRIMARY BOUND" : "NON-TARGETED"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Movement Profile Summary
 * Highlights routines characteristics (activation, stability, strength, drills, etc.)
 */
export function MovementProfileSummary({ routine }: { routine: Partial<Workout> }) {
  const tags = routine.tags || [];
  const category = (routine as any).supportCategoryLabel || (routine as any).routineType || "Stability";

  // Score attributes dynamically based on categories & tags
  const isStrength = category.toLowerCase().includes("strength") || tags.some(t => t.toLowerCase().includes("strength") || t.toLowerCase().includes("load"));
  const isMobility = category.toLowerCase().includes("mobility") || tags.some(t => t.toLowerCase().includes("mobility") || t.toLowerCase().includes("movement"));
  const isWarmup = category.toLowerCase().includes("warm") || tags.some(t => t.toLowerCase().includes("activation") || t.toLowerCase().includes("warm"));
  const isPlyo = category.toLowerCase().includes("plyo") || tags.some(t => t.toLowerCase().includes("impact") || t.toLowerCase().includes("drill"));

  const traits = [
    { name: "Muscle Activation", val: isWarmup ? 100 : (isStrength ? 80 : 50) },
    { name: "Joint Mobility", val: isMobility ? 100 : (isStrength ? 45 : 70) },
    { name: "Core & Stability", val: isStrength ? 85 : 100 },
    { name: "Plyometric / Plyo", val: isPlyo ? 100 : 20 }
  ];

  return (
    <div className="p-4 bg-slate-50 border border-slate-205 rounded-2xl space-y-3 font-mono">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block border-b border-slate-100 pb-1">
        Support Routine Profile
      </span>

      <div className="space-y-2.5 pt-0.5">
        {traits.map((trait, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase leading-none">
              <span>{trait.name}</span>
              <span className={`${trait.val >= 80 ? "text-blue-600" : "text-slate-400"}`}>
                {trait.val === 100 ? "FULL TARGET" : trait.val >= 70 ? "HIGH EMPHASIS" : "CONTROLLED"}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden">
              <div 
                style={{ width: `${trait.val}%` }} 
                className={`h-full rounded-full transition-all duration-500 ${
                  trait.val === 100 ? "bg-blue-600" : trait.val >= 70 ? "bg-blue-500" : "bg-slate-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Routine Complexity & Safety Context
 * Deterministic label markers for routine musculoskeletal loads.
 */
export function RoutineComplexityContext({ routine }: { routine: Partial<Workout> }) {
  const risk = routine.risk || "low";
  const diff = routine.difficulty || 5;

  let impactLabel = "Low Impact / Coordination Level";
  let targetDemand = "Postural and stability holding control";
  if (risk === "high" || risk === "very-high") {
    impactLabel = "Requires Focused Concentrated Effort";
    targetDemand = "High localized muscle tissue workload";
  } else if (diff >= 7) {
    impactLabel = "Moderate High Neuromuscular Loading";
    targetDemand = "Advanced stabilization structures required";
  }

  return (
    <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-start gap-3 font-mono">
      <Shield className={`w-5 h-5 shrink-0 mt-0.5 ${risk === "low" ? "text-emerald-500" : risk === "medium" ? "text-blue-500" : "text-orange-500"}`} />
      <div className="min-w-0 text-xs">
        <span className="text-[9px] uppercase text-slate-400 font-bold block">Routine Load Context</span>
        <span className="font-bold text-slate-800 leading-tight block mt-0.5">{impactLabel}</span>
        <p className="text-slate-500 text-[11px] leading-relaxed mt-1">{targetDemand}. Inspect safety notes before executing first sets.</p>
      </div>
    </div>
  );
}


// ==========================================
// 3. UTILITY FALLBACKS & CONTROLLERS
// ==========================================

export function SupportStructureTimeline({ workout }: WorkoutVisualsProps) {
  const structArr = Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [];
  const exerciseCount = structArr.length;

  if (exerciseCount === 0) return null;

  return (
    <div className="space-y-2 w-full">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#475569] font-bold block">
        Support Sequence Stations
      </span>
      <div className="w-full flex items-center gap-1.5 h-10 border border-[#E2E8F0] bg-slate-50 p-1.5 rounded-2xl shadow-sm overflow-hidden select-none">
        <div className="bg-blue-600 text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 h-full flex items-center justify-center shrink-0">
          STATIONS
        </div>
        <div className="flex-1 flex gap-1.5 overflow-hidden items-center">
          {structArr.slice(0, 8).map((ex: any, idx) => (
            <div 
              key={idx} 
              className="px-2.5 h-7 rounded-lg border border-slate-200/60 bg-white font-mono text-[9px] font-bold uppercase flex items-center justify-center shrink-0 text-slate-500"
            >
              {idx + 1}. {ex.name ? ex.name.slice(0, 10) : "Station"}
            </div>
          ))}
          {exerciseCount > 8 && (
            <div className="text-[9px] italic text-[#A1A1AA] select-none font-bold shrink-0">
              + {exerciseCount - 8} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * WorkoutVisualPreview
 * Composite unified widget that displays relevant diagrams depending on the layout type.
 */
export function WorkoutVisualPreview({ workout }: WorkoutVisualsProps) {
  const isSupport = (workout as any).entryType === "support-routine";

  return (
    <div className="space-y-6 w-full mt-4">
      {/* 1. Main structure strip */}
      <SessionTimeline workout={workout} />

      {/* 2. Interactive visual grids */}
      {isSupport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <RoutineFlowDiagram routine={workout} />
            <RoutineComplexityContext routine={workout} />
          </div>
          <div className="space-y-4">
            <BodyFocusMap routine={workout} />
            <MovementProfileSummary routine={workout} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <EffortStrip workout={workout} />
            <RepetitionMap workout={workout} />
          </div>
          <div className="space-y-4">
            <VolumeBreakdownBar workout={workout} />
            <PacingGuidePanel workout={workout} />
          </div>
        </div>
      )}
    </div>
  );
}
