/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout } from "../../../types/workout";
import { formatWorkoutBlock } from "../../../lib/workouts";

interface TemplateProps {
 workout: Workout;
 theme: "light" | "dark" | "orange" | "mono";
 size: "square" | "story" | "compact";
}

export function CoachWorkoutCard({ workout, theme, size }: TemplateProps) {
 const isDark = theme === "dark";
 const isOrange = theme === "orange";
 const isMono = theme === "mono";

 const getThemeClasses = () => {
 if (isDark) return "bg-slate-900 text-slate-100 border-slate-800";
 if (isOrange) return "bg-orange-700 text-white border-orange-800";
 if (isMono) return "bg-stone-50 text-black border-2 border-black";
 return "bg-amber-50/50 text-slate-900 border-amber-100 shadow-sm";
 };

 const getSubtextClasses = () => {
 if (isDark) return "text-amber-400/80";
 if (isOrange) return "text-orange-200";
 if (isMono) return "text-stone-700 font-mono";
 return "text-amber-800/80 font-medium";
 };

 const getCardClassesBySize = () => {
 if (size === "story") return "aspect-[9/16] p-8 h-[720px] max-w-[405px]";
 if (size === "compact") return "aspect-[16/9] p-6 h-[360px] max-w-[640px]";
 return "aspect-square p-8 h-[480px] max-w-[480px]";
 };

 return (
 <div
 id="export-card-node"
 className={`relative w-full rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300 font-sans ${getThemeClasses()} ${getCardClassesBySize()}`}
 >
 <div>
 {/* Header */}
 <div className="border-b border-dashed border-current/20 pb-3 mb-3">
 <div className="flex justify-between items-center">
 <span className={`text-[9px] font-mono tracking-widest uppercase ${getSubtextClasses()}`}>
 [ COACHES SHEET ]
 </span>
 <span className="text-[10px] font-mono uppercase bg-current/10 px-2 py-0.5 rounded">
 Diff: {workout.difficulty}/10
 </span>
 </div>
 <h2 className="text-xl font-bold font-display tracking-tight mt-1">{workout.title}</h2>
 <p className="text-xs line-clamp-1 opacity-80 italic mt-0.5">{workout.summary}</p>
 </div>

 {/* Content Details */}
 <div className="grid grid-cols-1 gap-3">
 {/* Main program list */}
 <div>
 <h4 className="text-[10px] font-mono tracking-wider uppercase text-orange-500 font-semibold mb-1">
 Prescription Steps
 </h4>
 <div className="bg-current/5 border border-current/10 p-2.5 rounded-lg">
 <ul className="space-y-1 text-xs font-mono">
 {workout.mainSet.slice(0, size === "compact" ? 2 : 3).map((block, i) => (
 <li key={block.id || i} className="truncate">
 {i + 1}. {formatWorkoutBlock(block)}
 </li>
 ))}
 </ul>
 </div>
 </div>

 {/* Coach's Remarks section */}
 {size !== "compact" && (
 <div className="space-y-2">
 <div>
 <h4 className="text-[10px] font-mono tracking-wider uppercase text-emerald-500 font-semibold">
 Execution Cues
 </h4>
 <p className="text-xs font-serif italic line-clamp-2 leading-relaxed opacity-90 mt-0.5">
 "{workout.coachingNotes?.[0] || "Maintain target pace, focusing on a relaxed shoulder stride and quick cadence."}"
 </p>
 </div>

 {workout.commonMistakes && workout.commonMistakes.length > 0 && (
 <div>
 <h4 className="text-[10px] font-mono tracking-wider uppercase text-rose-500 font-semibold">
 Common Pitfall
 </h4>
 <p className="text-xs text-rose-600 font-medium line-clamp-1 mt-0.5 flex items-center gap-1">
 ⚠️ {workout.commonMistakes[0]}
 </p>
 </div>
 )}
 </div>
 )}
 </div>
 </div>

 {/* Footer Banner */}
 <div className="border-t border-dashed border-current/10 pt-3 mt-3 flex justify-between items-center text-[10px]">
 <div className="font-mono">
 <span>COACH: TRACK.VAULT APPROVED</span>
 </div>
 <div className="text-right">
 <span className="font-bold">{workout.estimatedDistanceKm}K TOTAL</span>
 </div>
 </div>
 </div>
 );
}
