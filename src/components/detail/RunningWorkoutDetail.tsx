/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { normalizeRunningWorkout } from "../../lib/workoutVisualAdapters";
import { SessionTimeline } from "../visuals/SessionTimeline";
import { EffortStrip } from "../visuals/EffortStrip";
import { RepetitionMap } from "../visuals/RepetitionMap";
import { VolumeBreakdownBar } from "../visuals/VolumeBreakdownBar";
import { LevelBadge } from "../library/LevelBadge";
import { DifficultyBadge } from "../library/DifficultyBadge";
import { RiskBadge } from "../library/RiskBadge";
import { 
  Clock, 
  Route, 
  Award, 
  Flame, 
  Zap, 
  RefreshCw, 
  Copy, 
  Share2, 
  Sliders, 
  Heart, 
  BookOpen, 
  AlertTriangle, 
  Activity,
  Compass,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";

interface RunningWorkoutDetailProps {
  workout: any;
  onBack: () => void;
  onCopySimple: () => void;
  onCopyMarkdown: () => void;
  onExport: () => void;
  onClone: () => void;
}

export function RunningWorkoutDetail({
  workout,
  onBack,
  onCopySimple,
  onCopyMarkdown,
  onExport,
  onClone,
}: RunningWorkoutDetailProps) {
  const norm = normalizeRunningWorkout(workout);

  // Helper to format workout structured blocks in mono style
  const formatMetersOrSeconds = (block: any) => {
    if (!block) return "";
    let str = "";
    if (block.repetitions && block.repetitions > 1) {
      str += `${block.repetitions}x `;
    }
    str += block.name || "Step";
    const work = block.work || {};
    if (work.targetType === "distance" && work.distanceMeters) {
      str += ` (${work.distanceMeters}m @ ${work.intensity || "effort"})`;
    } else if (work.targetType === "duration" && work.durationSeconds) {
      str += ` (${work.durationSeconds}s @ ${work.intensity || "effort"})`;
    } else if (work.intensity) {
      str += ` (@ ${work.intensity})`;
    }
    return str;
  };

  return (
    <div id="running-workout-sheet" className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative space-y-8 p-6 lg:p-8 animate-fade-in text-slate-800">
      
      {/* 1. Header Block */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <LevelBadge level={norm.level} />
          <DifficultyBadge difficulty={norm.difficulty} />
          <RiskBadge risk={norm.risk as any} />
          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-mono border border-slate-200 uppercase font-black tracking-wider shadow-xs">
            {norm.surface}
          </span>
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-mono border border-blue-100 uppercase font-black tracking-wider shadow-xs">
            {norm.phase} Phase
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black font-display text-slate-900 tracking-tight leading-none mb-2">
              {norm.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest font-black leading-none">
              Category: <span className="text-slate-700">{norm.category}</span> // Workout Type: <span className="text-slate-700">{norm.workoutType}</span>
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <button
              onClick={onCopySimple}
              title="Copy details text to clipboard"
              className="px-3 py-1.5 font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" /> Copy Simple
            </button>
            <button
              onClick={onCopyMarkdown}
              title="Copy Markdown structured sheet"
              className="px-3 py-1.5 font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" /> Copy Markdown
            </button>
            <button
              onClick={onExport}
              title="Open full interactive sharecard dashboard"
              className="px-3.5 py-1.5 font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1 shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Export Card
            </button>
            <button
              onClick={onClone}
              title="Clone this workout to your Builder editor workspace"
              className="px-3 py-1.5 font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-slate-250"
            >
              <Sliders className="w-3.5 h-3.5" /> Clone
            </button>
          </div>
        </div>
      </div>

      {/* 2. Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-100">
        <div className="md:col-span-8 space-y-3.5">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#64748B] font-bold block leading-none">
            Performance Agenda & Coaching Summary
          </h2>
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 leading-relaxed text-sm text-slate-600 font-medium italic">
            "{norm.summary}"
          </div>
          {workout && (workout as any).trainingGoals && (workout as any).trainingGoals.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono uppercase font-black text-slate-400 mr-1.5">Go-to Goals:</span>
              {(workout as any).trainingGoals.map((goal: string, idx: number) => (
                <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-mono text-[9px] px-2 py-0.5 font-black uppercase tracking-wider">
                  🎯 {goal}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Big Stats Panels */}
        <div className="md:col-span-4 grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
            <Clock className="w-5 h-5 text-sky-500 mb-1 shrink-0" />
            <span className="text-[9px] font-mono text-slate-400 uppercase font-black">Estimated Duration</span>
            <span className="text-xs font-bold text-slate-800 font-mono mt-1 leading-none">
              {norm.estimatedDurationStr}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
            <Route className="w-5 h-5 text-sky-500 mb-1 shrink-0" />
            <span className="text-[9px] font-mono text-slate-400 uppercase font-black">Total Distance</span>
            <span className="text-xs font-bold text-slate-800 font-mono mt-1 leading-none font-semibold">
              {norm.estimatedDistanceStr}
            </span>
          </div>

          {norm.qualityDistanceKm > 0 && (
            <div className="col-span-2 p-3 bg-blue-50/40 border border-blue-100 rounded-xl text-center flex items-center justify-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Quality Intensive Miles: <span className="text-blue-800">{norm.qualityDistanceKm} km</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Visual Training Sheet Panels */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-l-4 border-sky-500 pl-2.5 uppercase tracking-wide font-display">
            Visual Session Analysis
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 pl-3.5">
            Deterministic sports science graphs constructed directly from raw prescription telemetry.
          </p>
        </div>

        {/* Main timeline strip at full width */}
        <SessionTimeline workout={workout} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            {/* Intensity Curve */}
            <EffortStrip workout={workout} />

            {/* Repetition breakdown */}
            <RepetitionMap workout={workout} />
          </div>

          <div className="space-y-6">
            {/* Volume Breakdown chart */}
            <VolumeBreakdownBar workout={workout} />

            {/* Prescription target guidelines panel */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-500 shrink-0" />
                Prescription Guide Panel
              </span>

              <div className="grid grid-cols-2 gap-3 pb-1">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-black">Current Block Phase</span>
                  <span className="text-xs font-bold text-slate-800 capitalize block mt-0.5">{norm.phase} Phase</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-black">Recommended Surface</span>
                  <span className="text-xs font-bold text-slate-800 capitalize block mt-0.5">{norm.surface} Track</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3.5 text-xs">
                {norm.intensityGuide.primaryTarget && (
                  <div>
                    <span className="text-[9px] uppercase text-sky-600 font-black block">Primary Session Target</span>
                    <p className="text-slate-700 font-medium leading-relaxed mt-0.5">{norm.intensityGuide.primaryTarget}</p>
                  </div>
                )}
                {norm.intensityGuide.paceGuide && (
                  <div>
                    <span className="text-[9px] uppercase text-sky-500 font-black block">Pace Prescription rules</span>
                    <p className="text-slate-650 font-semibold leading-relaxed mt-0.5">{norm.intensityGuide.paceGuide}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3.5 pt-1 border-t border-slate-100/60">
                  {norm.intensityGuide.hrGuide && (
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-black block">Cardiovascular HR Zone</span>
                      <p className="text-slate-600 font-semibold mt-0.5 leading-snug">{norm.intensityGuide.hrGuide}</p>
                    </div>
                  )}
                  {norm.intensityGuide.rpeGuide && (
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-black block">RPE Exertion bounds</span>
                      <p className="text-slate-600 font-semibold mt-0.5 leading-snug">{norm.intensityGuide.rpeGuide}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Structured Playbook Blocks */}
      <div className="border-t border-slate-100 pt-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-l-4 border-slate-755 pl-2.5 uppercase tracking-wide font-display">
            Session Prescription Playbook
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 pl-3.5">
            Prescription details with precise set repetitions, target intervals, and recovery timings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Warm-Up Block card */}
          <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-slate-500" />
                1. Warm-Up Blocks
              </span>
              <div className="space-y-2 text-xs">
                {norm.warmup && norm.warmup.length > 0 ? (
                  norm.warmup.map((block: any, idx: number) => (
                    <div key={block.id || idx} className="p-2.5 bg-white border border-slate-150 rounded-xl space-y-1">
                      <div className="font-bold text-slate-700 leading-tight">
                        {formatMetersOrSeconds(block)}
                      </div>
                      {block.description && (
                        <p className="text-[10px] text-slate-400 leading-normal font-medium pr-1">{block.description}</p>
                      )}
                      {block.notes && (
                        <div className="text-[9px] font-medium text-slate-400">
                          ↳ <span className="italic">{block.notes}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No structured warmup blocks provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Set Block card */}
          <div className="p-4.5 bg-sky-50/15 border border-sky-100 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-sky-600 block border-b border-sky-100 pb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-505" />
                2. Main Set Blocks
              </span>
              <div className="space-y-2 text-xs">
                {norm.mainSet && norm.mainSet.length > 0 ? (
                  norm.mainSet.map((block: any, idx: number) => (
                    <div key={block.id || idx} className="p-3 bg-white border border-sky-200/60 rounded-xl space-y-1 shadow-xs">
                      <div className="font-bold text-sky-950 leading-tight">
                        {formatMetersOrSeconds(block)}
                      </div>
                      {block.description && (
                        <p className="text-[10px] text-slate-450 leading-normal font-medium">{block.description}</p>
                      )}
                      
                      {block.recovery && block.recovery.type !== "none" && (
                        <div className="text-[9px] text-[#2563EB] font-bold py-1 px-1.5 bg-blue-50/50 border border-blue-105/50 rounded-md inline-block leading-none">
                          🔄 Rest: {block.recovery.durationSeconds ? `${block.recovery.durationSeconds}s` : block.recovery.distanceMeters ? `${block.recovery.distanceMeters}m` : ""} {block.recovery.type} rest
                        </div>
                      )}

                      {block.notes && (
                        <div className="text-[9px] font-medium text-[#4B5563] border-l border-sky-200 pl-1.5 leading-tight mt-1">
                          ↳ <span className="italic">{block.notes}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-rose-500 font-semibold">⚠ Main target set is empty.</p>
                )}
              </div>
            </div>
          </div>

          {/* Cooldown Block card */}
          <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                3. Cooldown Blocks
              </span>
              <div className="space-y-2 text-xs">
                {norm.cooldown && norm.cooldown.length > 0 ? (
                  norm.cooldown.map((block: any, idx: number) => (
                    <div key={block.id || idx} className="p-2.5 bg-white border border-slate-150 rounded-xl space-y-1">
                      <div className="font-bold text-slate-700 leading-tight">
                        {formatMetersOrSeconds(block)}
                      </div>
                      {block.description && (
                        <p className="text-[10px] text-slate-400 leading-normal font-medium pr-1">{block.description}</p>
                      )}
                      {block.notes && (
                        <div className="text-[9px] font-medium text-slate-400">
                          ↳ <span className="italic">{block.notes}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No cooldown segments configured.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Scalability Variants Row */}
      {norm.variants && (norm.variants.easier || norm.variants.harder) && (
        <div className="border-t border-slate-100 pt-6 space-y-3.5">
          <div className="flex items-center gap-1.5">
            <ArrowLeftRight className="w-4.5 h-4.5 text-sky-505" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Training Load Scalability Adjustments
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {norm.variants.easier && (
              <div className="p-4 bg-emerald-50/[0.12] border border-emerald-500/10 rounded-2xl space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 font-bold block leading-none">
                  🟢 Down-Scaling Variant (Easier)
                </span>
                <p className="text-xs text-slate-650 leading-relaxed font-mono">
                  {norm.variants.easier.description}
                </p>
                {norm.variants.easier.mainSet && (
                  <div className="text-[10px] text-slate-400 font-mono italic">
                    Modifies intervals schema.
                  </div>
                )}
              </div>
            )}

            {norm.variants.harder && (
              <div className="p-4 bg-rose-50/[0.12] border border-rose-500/10 rounded-2xl space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-rose-600 font-bold block leading-none">
                  🔴 Up-Scaling Variant (Harder)
                </span>
                <p className="text-xs text-slate-650 leading-relaxed font-mono">
                  {norm.variants.harder.description}
                </p>
                {norm.variants.harder.mainSet && (
                  <div className="text-[10px] text-slate-400 font-mono italic">
                    Modifies sets progression.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Professional Guidance Panels (coaching notes, mistakes, safety notes) */}
      <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coaching Notes */}
        <div className="p-4.5 bg-emerald-50/[0.15] border border-emerald-500/10 rounded-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-black block border-b border-emerald-500/15 pb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            🧠 Coaching Playbook Cues
          </span>
          {norm.coachingNotes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {norm.coachingNotes.map((note, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No structured coaching notes loaded.</p>
          )}
        </div>

        {/* Common Mistakes */}
        <div className="p-4.5 bg-amber-50/[0.15] border border-amber-500/10 rounded-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-black block border-b border-amber-500/15 pb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            ⚠️ Execution Pitfalls
          </span>
          {norm.commonMistakes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {norm.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No commonly recorded mistakes logged.</p>
          )}
        </div>

        {/* Safety Notes */}
        <div className="p-4.5 bg-rose-50/[0.15] border border-rose-500/10 rounded-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#991B1B] font-black block border-b border-rose-500/15 pb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            🛡 Core Athlete Safety
          </span>
          {norm.safetyNotes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600 font-medium pb-1.5">
              {norm.safetyNotes.map((safety, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <span className="text-rose-500 shrink-0 select-none">⚠</span>
                  <span className="text-[#991B1B] font-semibold">{safety}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No mandatory safety guidelines registered.</p>
          )}
        </div>
      </div>

    </div>
  );
}
