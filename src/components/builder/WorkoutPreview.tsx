/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout } from "../../types/workout";
import { LevelBadge } from "../library/LevelBadge";
import { DifficultyBadge } from "../library/DifficultyBadge";
import { RiskBadge } from "../library/RiskBadge";
import { formatWorkoutBlock } from "../../lib/workouts";
import { Clock, Route, ShieldAlert, Award, Calendar, Tag, Layers } from "lucide-react";

interface WorkoutPreviewProps {
 workout: Partial<Workout>;
}

export function WorkoutPreview({ workout }: WorkoutPreviewProps) {
 // Safe defaults if empty
 const title = workout.title || "Untitled Active Session";
 const primaryDistance = workout.primaryDistance || "5K";
 const category = (workout.category || "general").replace("-", " ");
 const level = workout.level || "intermediate";
 const difficulty = workout.difficulty || 5;
 const risk = workout.risk || "medium";
 const duration = workout.estimatedDurationMin || 0;
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
 {workout.surface || "Road"}
 </span>
 </div>

 <h2 className="text-xl lg:text-2xl font-black font-display text-slate-800 tracking-tight">
 {title}
 </h2>
 <span className="text-xs text-slate-400 font-mono block mt-1 uppercase tracking-widest font-bold">
 Category: {category} // phase: {workout.phase || "Build"}
 </span>

 <p className="text-sm text-slate-500 mt-4 leading-relaxed italic pr-4">
 "{summary}"
 </p>
 </div>

 {/* Grid Stats */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center">
 <Clock className="w-4 h-4 text-orange-500 mb-1" />
 <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Duration</span>
 <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
 {duration} min
 </span>
 </div>

 <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-center flex flex-col items-center">
 <Route className="w-4 h-4 text-orange-500 mb-1" />
 <span className="text-[10px] font-mono text-slate-400 uppercase">Total Mileage</span>
 <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
 {distance} km
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

 {/* Program details layout */}
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
