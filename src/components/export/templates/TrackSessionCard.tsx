/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout, TrackVaultEntry } from "../../../types/workout";
import { formatWorkoutBlock } from "../../../lib/workouts";

interface TemplateProps {
 workout: any/*Workout|SupportRoutine*/;
 theme: "light" | "dark" | "orange" | "mono";
 size: "square" | "story" | "compact";
}

export function TrackSessionCard({ workout, theme, size }: TemplateProps) {
 const isDark = theme === "dark";
 const isOrange = theme === "orange";
 const isMono = theme === "mono";

 const getThemeClasses = () => {
 if (isDark) return "bg-gray-950 text-orange-400 border-gray-900";
 if (isOrange) return "bg-orange-600 text-neutral-100 border-orange-700";
 if (isMono) return "bg-white text-black border-4 border-double border-black";
 return "bg-neutral-50 text-neutral-900 border-neutral-200 shadow-sm";
 };

 const getHeaderClasses = () => {
 if (isDark) return "text-orange-500 border-orange-500/20";
 if (isOrange) return "text-yellow-300 border-white/20";
 if (isMono) return "text-black border-black";
 return "text-red-600 border-red-600/10";
 };

 const getInnerBlock = () => {
 if (isDark) return "bg-gray-900/80 border-gray-800 text-gray-300";
 if (isOrange) return "bg-red-700/40 border-red-800 text-white";
 if (isMono) return "bg-white border text-black border-black";
 return "bg-neutral-200/50 border-neutral-300 text-neutral-800";
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
 {/* Dynamic graphic: track lanes in the border */}
 <div className="absolute top-0 right-0 w-32 h-full opacity-[0.05] flex gap-1 transform rotate-12 select-none pointer-events-none">
 <div className="w-1.5 bg-current h-full" />
 <div className="w-1.5 bg-current h-full" />
 <div className="w-1.5 bg-current h-full" />
 <div className="w-1.5 bg-current h-full" />
 </div>

 <div>
 {/* Track Card Header */}
 <div className={`border-b-2 pb-2 mb-3 ${getHeaderClasses()}`}>
 <div className="flex justify-between items-center text-[10px] font-mono tracking-widest font-semibold uppercase">
 <span>TRACK SESSION</span>
 <span>{typeof workout.surface === "string" ? workout.surface.toUpperCase() : Array.isArray(workout.surface) ? workout.surface[0]?.toUpperCase() : "ROAD"} SPECIALIST</span>
 </div>
 <h2 className="text-2xl font-bold font-display tracking-tight leading-none mt-1">
 {workout.title}
 </h2>
 </div>

 {/* Prescription items */}
 <div className="space-y-3">
 <p className="text-xs line-clamp-2 opacity-90 leading-relaxed font-medium">
 🚩 Summary: {workout.summary}
 </p>

 <div className={`p-4 rounded-xl border ${getInnerBlock()}`}>
 <span className="text-[9px] font-mono tracking-wider uppercase block text-amber-500 font-bold mb-1.5">
 INTERVAL REPEATS
 </span>
 <ul className="space-y-1.5">
 {(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || [])).slice(0, size === "compact" ? 2 : 4).map((block, i) => (
 <li key={block.id || i} className="text-xs font-mono font-semibold flex gap-2 items-center">
 <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500 text-white">R{i + 1}</span>
 {(workout.entryType === "support-routine" ? String(block) : formatWorkoutBlock(block as any))}
 </li>
 ))}
 {(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || [])).length > (size === "compact" ? 2 : 4) && (
 <li className="text-[10px] italic opacity-60">
 + {(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || [])).length - (size === "compact" ? 2 : 4)} more rep sets.
 </li>
 )}
 </ul>
 </div>
 </div>
 </div>

 {/* Footer track stamp */}
 <div className="flex justify-between items-center text-[10px] font-mono border-t pt-3 border-current/10">
 <div>
 <span>EST_DISTANCE: {(workout.estimatedDistanceKm || 0)} KM</span>
 </div>
 <div className="text-right">
 <span>{workout.primaryDistance} TRACK_PACER v1.0</span>
 </div>
 </div>
 </div>
 );
}
