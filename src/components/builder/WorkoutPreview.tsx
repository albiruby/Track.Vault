/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout } from "../../types/workout";
import { LevelBadge } from "../library/LevelBadge";
import { DifficultyBadge } from "../library/DifficultyBadge";
import { RiskBadge } from "../library/RiskBadge";
import { formatWorkoutBlock, formatExerciseBlock } from "../../lib/workouts";
import { Clock, Route, ShieldAlert, Award, Calendar, Tag, Layers } from "lucide-react";
import { WorkoutVisualPreview } from "../visuals/WorkoutVisuals";

interface WorkoutPreviewProps {
  workout: Partial<Workout>;
}

export function WorkoutPreview({ workout }: WorkoutPreviewProps) {
  // Check if it's a support routine
  const isSupport = (workout as any).entryType === "support-routine";

  // Safe defaults if empty
  const title = workout.title || "Untitled Active Session";
  const category = (isSupport ? ((workout as any).supportCategoryLabel || "Support") : (workout.category || "general")).replace("-", " ");
  const level = workout.level || "intermediate";
  const difficulty = workout.difficulty || 5;
  const risk = workout.risk || "medium";
  const duration = isSupport ? ((workout as any).durationMin || 0) : (workout.estimatedDurationMin || 0);
  const distance = workout.estimatedDistanceKm || 0;
  const summary = workout.summary || "No description configured yet.";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <LevelBadge level={level} />
          <DifficultyBadge difficulty={difficulty} />
          <RiskBadge risk={risk as any} />
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-200 uppercase font-semibold">
            {isSupport ? "Support Routine" : (workout.surface || "Road")}
          </span>
        </div>

        <h2 className="text-xl lg:text-2xl font-black font-display text-slate-800 tracking-tight">
          {title}
        </h2>
        <span className="text-xs text-slate-400 font-mono block mt-1 uppercase tracking-widest font-bold">
          {isSupport ? `Support Goal: ${category}` : `Category: ${category} // phase: ${workout.phase || "Build"}`}
        </span>

        <p className="text-sm text-slate-500 mt-4 leading-relaxed italic pr-4">
          "{summary}"
        </p>
      </div>

      {/* Visual Interpretation Dashboard */}
      <div className="border-b border-slate-100 pb-2">
        <WorkoutVisualPreview workout={workout} />
      </div>

      {isSupport ? (
        /* ==================== SUPPORT ROUTINE LAYOUT ==================== */
        <div className="space-y-6">
          {/* Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Duration</span>
              <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                {duration} min
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center justify-center">
              <Layers className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Routine Structure</span>
              <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 capitalize">
                {typeof (workout as any).sessionStructure === "string" ? (workout as any).sessionStructure : "Circuit"}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center justify-center">
              <Award className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Routine Type</span>
              <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 capitalize">
                {(workout as any).routineType || "Stability"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-black tracking-wider block">Target Body Focus</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(Array.isArray((workout as any).bodyFocus) ? (workout as any).bodyFocus : [((workout as any).bodyFocus || "general")]).map((f: string, i: number) => (
                  <span key={i} className="bg-blue-50 text-blue-700 font-mono text-[10px] px-2 py-0.5 border border-blue-100 rounded-md uppercase font-bold">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-black tracking-wider block">Movement Goals</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(Array.isArray((workout as any).movementGoals) ? (workout as any).movementGoals : [((workout as any).movementGoals || "stability")]).map((g: string, i: number) => (
                  <span key={i} className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 border border-slate-200 rounded-md uppercase font-bold">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Routine Steps & Structure */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5 mb-2.5 flex items-center gap-1.5">
              <span>Support Routine Specifications</span>
            </h4>
            <div className="p-4 bg-blue-50/20 rounded-2xl border border-blue-100/50 space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Execution Flow</span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Execute this routine as a <span className="font-bold">{typeof (workout as any).sessionStructure === "string" ? (workout as any).sessionStructure : "Circuit"}</span> training protocol. Focus heavily on complete structural stabilization and postural control, moving slowly through full range-of-motion limits.
                </p>
              </div>

              {Array.isArray((workout as any).sessionStructure) && (
                <div className="border-t border-blue-100/50 pt-3 mt-3">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">Routine Exercises</span>
                  <div className="space-y-1.5 font-mono text-xs text-slate-700">
                    {((workout as any).sessionStructure as any[]).map((ex, i) => (
                      <div key={i} className="p-2.5 bg-white border border-blue-150/40 rounded-xl flex flex-col gap-1">
                        <div className="font-semibold text-blue-700">
                          {i + 1}. {formatExerciseBlock(ex)}
                        </div>
                        {ex.notes && (
                          <div className="text-[10px] text-slate-400 italic pl-3 leading-relaxed">
                            ↳ {Array.isArray(ex.notes) ? ex.notes.join(". ") : ex.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== RUNNING WORKOUT LAYOUT ==================== */
        <div className="space-y-6">
          {/* Grid Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center">
              <Clock className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Duration</span>
              <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                {(workout as any).rawDuration && typeof (workout as any).rawDuration === "object"
                  ? `${(workout as any).rawDuration.min}-${(workout as any).rawDuration.max} min`
                  : `${duration} min`}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center">
              <Route className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Total Mileage</span>
              <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                {(workout as any).rawDistance && typeof (workout as any).rawDistance === "object"
                  ? `${(workout as any).rawDistance.min}-${(workout as any).rawDistance.max} km`
                  : `${distance} km`}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center">
              <Layers className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Main Set Steps</span>
              <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                {workout.mainSet?.length || 0} Blocks
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center">
              <ShieldAlert className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Work Pacing rules</span>
              <span className="text-[11px] font-bold text-slate-800 truncate mt-0.5 max-w-full">
                {workout.intensityGuide?.mainSet || "Varies"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Warmup Section */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 mb-2.5">
                1. Warm-Up Blocks
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                {workout.warmup && workout.warmup.length > 0 ? (
                  workout.warmup.map((block, i) => (
                    <div key={block.id || i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between gap-2.5 items-center">
                      <span>{formatWorkoutBlock(block)}</span>
                      {block.notes && <span className="text-[10px] italic text-slate-400">({block.notes})</span>}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-450 italic">Convert base warmup jog rules as needed.</p>
                )}
              </div>
            </div>

            {/* Main Set Section */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500 border-b border-orange-100 pb-1.5 mb-2.5">
                2. Main Set Blocks
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                {workout.mainSet && workout.mainSet.length > 0 ? (
                  workout.mainSet.map((block, i) => (
                    <div key={block.id || i} className="p-3 bg-orange-500/[0.03] border border-orange-500/10 rounded-xl flex flex-col gap-1">
                      <div className="flex justify-between items-center gap-2 font-semibold">
                        <span className="text-orange-600 ">
                          {block.repetitions && block.repetitions > 1 ? `${block.repetitions}x ` : ""}
                          {block.name || "Interval Step"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {block.work.targetType === "duration" ? `${block.work.durationSeconds}s` : block.work.targetType === "distance" ? `${block.work.distanceMeters}m` : "Open"} @ {block.work.intensity || "Zone"}
                        </span>
                      </div>

                      {block.recovery && block.recovery.type !== "none" && (
                        <div className="text-[10px] text-slate-400 pl-2 leading-relaxed border-l border-orange-500/20">
                          🔄 Rest: {block.recovery.durationSeconds ? `${block.recovery.durationSeconds}s` : block.recovery.distanceMeters ? `${block.recovery.distanceMeters}m` : ""} {block.recovery.type} recovery {block.recovery.intensity ? `(${block.recovery.intensity})` : ""}
                        </div>
                      )}

                      {block.notes && (
                        <p className="text-[10px] italic text-slate-400 pl-2">
                          ↳ Cue: {block.notes}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-rose-500 font-semibold uppercase font-mono animate-bounce mt-2">
                    ⚠ Main set is empty. Add at least one repetition block in editor above!
                  </p>
                )}
              </div>
            </div>

            {/* Cooldown Section */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 mb-2.5">
                3. Cooldown Blocks
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                {workout.cooldown && workout.cooldown.length > 0 ? (
                  workout.cooldown.map((block, i) => (
                    <div key={block.id || i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between gap-2.5 items-center">
                      <span>{formatWorkoutBlock(block)}</span>
                      {block.notes && <span className="text-[10px] italic text-slate-400">({block.notes})</span>}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-450 italic">Optional active recovery cooldown steps.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advisory checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
        {workout.coachingNotes && workout.coachingNotes.length > 0 && (
          <div className="p-4 bg-emerald-50/[0.15] border border-emerald-500/10 rounded-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-2">
              🧠 Coaching Execution advice
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600 ">
              {workout.coachingNotes.map((n, i) => (
                <li key={i} className="flex gap-1.5 leading-relaxed">
                  <span>✔</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {workout.safetyNotes && workout.safetyNotes.length > 0 && (
          <div className="p-4 bg-rose-50/[0.15] border border-rose-500/10 rounded-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-600 font-bold block mb-2">
              🛡 Safety Warnings
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600 ">
              {workout.safetyNotes.map((s, i) => (
                <li key={i} className="flex gap-1.5 leading-relaxed text-rose-750 ">
                  <span>⚠</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Disclaimer block */}
      <div className="text-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-400">
        "These workouts are general training references and are not personalized medical or coaching advice."
      </div>
    </div>
  );
}
