/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout, TrackVaultEntry } from "../../../types/workout";
import { formatWorkoutBlock, formatExerciseBlock } from "../../../lib/workouts";

interface TemplateProps {
 workout: any/*Workout|SupportRoutine*/;
 theme: "light" | "dark" | "orange" | "mono";
 size: "square" | "story" | "compact";
}

export function LongRunCard({ workout, theme, size }: TemplateProps) {
 const isDark = theme === "dark";
 const isOrange = theme === "orange";
 const isMono = theme === "mono";

 const getThemeClasses = () => {
 if (isDark) return "bg-zinc-950 text-emerald-400 border-zinc-800";
 if (isOrange) return "bg-orange-600 text-white border-orange-700";
 if (isMono) return "bg-gray-100 text-black border-4 border-solid border-black";
 return "bg-emerald-50/20 text-slate-900 border-emerald-100 shadow-sm";
 };

 const getSubtextClasses = () => {
 if (isDark) return "text-zinc-500";
 if (isOrange) return "text-orange-200";
 if (isMono) return "text-black/60 font-mono";
 return "text-emerald-800/70";
 };

 const getDividerClasses = () => {
 if (isDark) return "border-emerald-500/10";
 if (isOrange) return "border-white/10";
 if (isMono) return "border-black";
 return "border-emerald-800/10";
 };

 const getCardClassesBySize = () => {
 if (size === "story") return "aspect-[9/16] p-8 h-[720px] max-w-[405px] flex flex-col justify-between";
 if (size === "compact") return "aspect-[16/9] p-6 h-[360px] max-w-[640px] flex flex-col justify-between";
 return "aspect-square p-8 h-[480px] max-w-[480px] flex flex-col justify-between";
 };

 return (
 <div
 id="export-card-node"
 className={`relative w-full rounded-2xl border transition-all duration-300 font-sans ${getThemeClasses()} ${getCardClassesBySize()}`}
 >
 <div>
 {/* Aerobic/Long Run Header */}
 <div className={`border-b pb-2 mb-3 ${getDividerClasses()}`}>
 <div className="flex justify-between items-center text-[9px] font-mono tracking-widest uppercase text-emerald-600 font-bold">
 <span>AEROBIC ENDURANCE // LONG RUN</span>
 <span>{workout.primaryDistance} BASE</span>
 </div>
 <h2 className="text-xl font-extrabold tracking-tight font-display mt-1">
 {workout.title}
 </h2>
 </div>

 {/* Content */}
 <div className="space-y-4">
 <p className="text-xs italic leading-snug">{workout.summary}</p>

 <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-900 border-zinc-800" : isOrange ? "bg-orange-700/50 border-orange-800" : isMono ? "bg-white border-black" : "bg-emerald-50 border-emerald-100"}`}>
 <span className="text-[10px] font-mono tracking-wide uppercase block text-emerald-500 font-bold mb-1.5">
 🚀 ENDURANCE RUN PLAN
 </span>
 <ul className="space-y-1.5 text-xs font-mono">
 {(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || [])).slice(0, size === "compact" ? 2 : 4).map((block, i) => (
 <li key={block.id || i} className="flex gap-2 items-start leading-snug font-medium">
 <span>◽</span>
 <span>{(workout.entryType === "support-routine" ? formatExerciseBlock(block) : formatWorkoutBlock(block as any))}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className={`border-t pt-3 flex justify-between items-end ${getDividerClasses()} ${getSubtextClasses()}`}>
 <div className="flex flex-col">
 <span className="text-[8px] font-mono uppercase tracking-wider">Estimated Volume</span>
 <span className="text-xs font-bold leading-none mt-1">
 {workout.rawDistance && typeof workout.rawDistance === "object"
   ? `${workout.rawDistance.min}-${workout.rawDistance.max} KM`
   : `${workout.estimatedDistanceKm || 0} KM`} / {workout.rawDuration && typeof workout.rawDuration === "object"
   ? `${workout.rawDuration.min}-${workout.rawDuration.max} MIN`
   : `${workout.estimatedDurationMin || 0} MIN`}
 </span>
 </div>
 <div className="text-right">
 <span className="text-[8px] font-mono uppercase tracking-wider">Aerobic Load</span>
 <span className="text-[10px] font-bold uppercase tracking-wide block mt-1">
 LEVEL: {workout.level.toUpperCase()}
 </span>
 </div>
 </div>
 </div>
 );
}
