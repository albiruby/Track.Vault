/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { normalizeSupportRoutine } from "../../lib/workoutVisualAdapters";
import { RoutineFlowDiagram } from "../visuals/RoutineFlowDiagram";
import { BodyFocusChips } from "../visuals/BodyFocusChips";
import { MovementProfileChips } from "../visuals/MovementProfileChips";
import { SetRepHoldSummary } from "../visuals/SetRepHoldSummary";
import { LevelBadge } from "../library/LevelBadge";
import { DifficultyBadge } from "../library/DifficultyBadge";
import { RiskBadge } from "../library/RiskBadge";
import { RelatedSections } from "./RelatedSections";
import { 
  Clock, 
  Dumbbell, 
  Activity, 
  Copy, 
  Share2, 
  Sliders, 
  RefreshCw,
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  Wrench,
  Layers,
  Heart,
  GitCompare
} from "lucide-react";

interface SupportRoutineDetailProps {
  workout: any;
  onBack: () => void;
  onCopySimple: () => void;
  onCopyMarkdown: () => void;
  onExport: () => void;
  onClone: () => void;
  isInCompare?: boolean;
  onToggleCompare?: () => void;
}

export function SupportRoutineDetail({
  workout,
  onBack,
  onCopySimple,
  onCopyMarkdown,
  onExport,
  onClone,
  isInCompare = false,
  onToggleCompare,
}: SupportRoutineDetailProps) {
  const norm = normalizeSupportRoutine(workout);

  const formatExerciseSpec = (ex: any) => {
    if (!ex) return "Exercise Station";
    let spec = ex.name || "Station";
    const mainSpec = ex.sets 
      ? (ex.reps ? ` (${ex.sets}x${ex.reps})` : ex.durationSeconds ? ` (${ex.sets} sets • ${ex.durationSeconds}s)` : ` (${ex.sets} sets)`) 
      : (ex.reps ? ` (${ex.reps} reps)` : (ex.durationSeconds ? ` (${ex.durationSeconds}s hold)` : ""));
    return `${spec}${mainSpec}`;
  };

  return (
    <div id="support-routine-sheet" className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative space-y-8 p-6 lg:p-8 animate-fade-in text-slate-800">
      
      {/* 1. Header Block */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <LevelBadge level={norm.level} />
          <DifficultyBadge difficulty={norm.difficulty} />
          <RiskBadge risk={norm.risk as any} />
          <span className="bg-slate-105 text-slate-650 px-2.5 py-1 rounded-md text-[10px] font-mono border border-slate-200 uppercase font-black tracking-wider shadow-xs">
            {norm.routineType}
          </span>
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-mono border border-blue-100 uppercase font-black tracking-wider shadow-xs">
            {norm.supportCategoryLabel}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black font-display text-slate-900 tracking-tight leading-none mb-2">
              {norm.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest font-black leading-none">
              Support Class: <span className="text-slate-700">{norm.supportCategoryLabel}</span> // Routine Type: <span className="text-slate-700">{norm.routineType}</span>
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
              title="Open this curated template inside the Workout Builder lab to begin editing"
              className="px-3 py-1.5 font-bold text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-blue-200"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-500" /> Open in Builder
            </button>
            <button
              onClick={onClone}
              title="Duplicate this routine as a cloned local copy to your Builder"
              className="px-3 py-1.5 font-bold text-xs bg-slate-105 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-slate-250"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Duplicate to Builder
            </button>
            <button
              onClick={onToggleCompare}
              title={isInCompare ? "Remove from comparison tray" : "Add to comparison tray"}
              className={`px-3 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border ${
                isInCompare
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isInCompare ? "Comparing" : "Compare"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-100">
        <div className="md:col-span-8 space-y-3.5 col-span-1">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#64748B] font-bold block leading-none">
            Structural Routine Focus & Purpose
          </h2>
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 leading-relaxed text-sm text-slate-650 italic font-medium font-sans">
            "{norm.summary}"
          </div>
          {norm.equipment.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center pt-1.5 font-mono">
              <span className="text-[10px] font-mono uppercase font-black text-slate-400 mr-2 flex items-center gap-1.5 leading-none">
                <Wrench className="w-3.5 h-3.5" /> REQUIRED EQUIPMENT:
              </span>
              {norm.equipment.map((eq: string, idx: number) => (
                <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[9px] px-2 py-0.5 font-black uppercase tracking-wider">
                  🔧 {eq}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Big Stats Panels */}
        <div className="md:col-span-4 col-span-1 grid grid-cols-1 gap-3 shrink-0 font-mono">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
            <Clock className="w-5.5 h-5.5 text-blue-600 mb-1.5 shrink-0" />
            <span className="text-[9px] text-[#64748B] uppercase font-black">Estimated Duration</span>
            <span className="text-sm font-bold text-slate-800 mt-1 leading-none">
              {norm.durationMin} minutes
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
            <Layers className="w-5 h-5 text-blue-600 mb-1 shrink-0" />
            <span className="text-[9px] text-[#64748B] uppercase font-black">Execution Protocol</span>
            <span className="text-xs font-bold text-slate-800 capitalize mt-1 leading-none">
              {typeof norm.sessionStructure === "string" ? norm.sessionStructure : "Station Circuit"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Visual Routine Sheet Panels */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-l-4 border-blue-605 border-blue-500 pl-2.5 uppercase tracking-wide font-display">
            Neuromuscular & Visual Routine Profile
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 pl-3.5 animate-fade-in">
            Detailed bio-mechanical metrics parsed explicitly from actual target exercises.
          </p>
        </div>

        <div className="space-y-6">
          {/* Numerical Sets, Reps and hold summary blocks */}
          <SetRepHoldSummary routine={workout} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              {/* Routine stations flow list detail */}
              <RoutineFlowDiagram routine={workout} />
            </div>

            <div className="space-y-6">
              {/* Target muscular focus chips */}
              <BodyFocusChips bodyFocus={norm.bodyFocus} />

              {/* Movement goal percentage bars */}
              <MovementProfileChips 
                movementGoals={norm.movementGoals} 
                difficulty={norm.difficulty} 
                routineType={norm.routineType} 
              />

              {/* Routine Complexity Panel */}
              <div id="routine-complexity-panel" className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 w-full font-mono">
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${norm.risk === "low" ? "text-emerald-500" : norm.risk === "medium" ? "text-blue-500" : "text-amber-500"}`} />
                <div className="min-w-0 text-xs">
                  <span className="text-[9px] uppercase text-[#64748B] font-black block">Safety & Impact Context</span>
                  <span className="font-bold text-slate-800 leading-tight block mt-1">
                    {norm.risk === "high" || norm.risk === "very-high" 
                      ? "Requires High Precision & Tissue Prep" 
                      : norm.difficulty >= 7 
                      ? "Moderate Neuromuscular Loading Profile" 
                      : "Light Joint Coordination Protocol"}
                  </span>
                  <p className="text-[#64748B] text-[10.5px] leading-relaxed mt-1 font-sans">
                    Focus on postural control, loose shoulders, and high-cadence contractions. If experiencing localized joint distress or sharp pulling, drop active set loads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Playbook Structured Blocks */}
      <div className="border-t border-slate-100 pt-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-l-4 border-blue-500 pl-2.5 uppercase tracking-wide font-display">
            Routine Exercise Specifications
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 pl-3.5">
            Step-by-step guidance, body positioning advice, and hold times for each movement.
          </p>
        </div>

        <div className="p-1 px-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono">
          <div className="divide-y divide-slate-150 text-xs">
            {Array.isArray(norm.sessionStructure) && norm.sessionStructure.length > 0 ? (
              norm.sessionStructure.map((ex: any, idx: number) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 last:border-b-0">
                  <div className="space-y-1 sm:max-w-xl">
                    <span className="text-[10px] font-semibold text-blue-650 text-blue-700 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 inline-block leading-none mr-2">
                       Station {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-850 text-sm leading-snug">
                      {ex.name || "Unknown exercise"}
                    </span>
                    {ex.notes && (
                      <p className="text-slate-500 text-xs pl-3.5 border-l border-slate-300 mt-1 italic leading-relaxed">
                        ↳ {Array.isArray(ex.notes) ? ex.notes.join(". ") : ex.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end text-[10px] font-bold uppercase shrink-0">
                    {ex.sets && <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">{ex.sets} sets</span>}
                    {ex.reps && <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">{ex.reps} reps</span>}
                    {ex.durationSeconds && <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">{ex.durationSeconds}s hold</span>}
                    {ex.side && ex.side !== "none" && ex.side !== "both" && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-800 border border-blue-105 rounded">{ex.side} side</span>
                    )}
                    {ex.restSeconds && <span className="px-2 py-1 bg-slate-200/60 rounded text-slate-600">⏱ rest {ex.restSeconds}s</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                {typeof norm.sessionStructure === "string" ? norm.sessionStructure : "No routine steps loaded."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Scalability Variants Row */}
      {(norm.easierVariant || norm.harderVariant) && (
        <div className="border-t border-slate-100 pt-6 space-y-3.5">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Training Load Scalability Adjustments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {norm.easierVariant && (
              <div className="p-4 bg-emerald-50/[0.12] border border-emerald-500/10 rounded-2xl space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 font-bold block leading-none">
                  🟢 Down-Scaling Option (Easier)
                </span>
                <p className="text-xs text-slate-650 leading-relaxed font-mono">
                  {typeof norm.easierVariant === "string" 
                    ? norm.easierVariant 
                    : (norm.easierVariant.description || norm.easierVariant.adjustments?.join(". "))}
                </p>
              </div>
            )}

            {norm.harderVariant && (
              <div className="p-4 bg-rose-50/[0.12] border border-rose-500/10 rounded-2xl space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-rose-600 font-bold block leading-none">
                  🔴 Up-Scaling Option (Harder)
                </span>
                <p className="text-xs text-slate-650 leading-relaxed font-mono">
                  {typeof norm.harderVariant === "string" 
                    ? norm.harderVariant 
                    : (norm.harderVariant.description || norm.harderVariant.adjustments?.join(". "))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Professional Guidance Panels (coaching notes, mistakes, safety notes) */}
      <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coaching Notes */}
        <div className="p-4.5 bg-emerald-50/[0.15] border border-emerald-500/10 rounded-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#065F46] font-black block border-b border-emerald-500/15 pb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            🧠 Coaching Cues
          </span>
          {norm.coachingNotes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600 font-medium font-sans">
              {norm.coachingNotes.map((note, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No coaching cues defined yet.</p>
          )}
        </div>

        {/* Common Mistakes */}
        <div className="p-4.5 bg-amber-50/[0.15] border border-amber-500/10 rounded-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-black block border-b border-amber-500/15 pb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            ⚠️ Common Mistakes
          </span>
          {norm.commonMistakes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600 font-medium font-sans">
              {norm.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No execution mistakes recorded.</p>
          )}
        </div>

        {/* Safety Notes */}
        <div className="p-4.5 bg-rose-50/[0.15] border border-rose-500/10 rounded-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#991B1B] font-black block border-b border-rose-500/15 pb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            🛡 Mandatory Safety Instructions
          </span>
          {norm.safetyNotes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600 font-medium pb-1.5 font-sans">
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

      {/* 7. Related Navigation Sections */}
      <RelatedSections currentEntry={workout} />

    </div>
  );
}
