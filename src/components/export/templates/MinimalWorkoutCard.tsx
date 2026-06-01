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

export function MinimalWorkoutCard({ workout, theme, size }: TemplateProps) {
 const getThemeClasses = () => {
 switch (theme) {
 case "dark":
 return "bg-slate-950 text-slate-100 border-slate-800";
 case "orange":
 return "bg-orange-600 text-white border-orange-700";
 case "mono":
 return "bg-white text-black border-black border-2";
 case "light":
 default:
 return "bg-white text-slate-900 border-slate-100 shadow-sm";
 }
 };

 const getSubtextClasses = () => {
 switch (theme) {
 case "dark":
 return "text-slate-400";
 case "orange":
 return "text-orange-100";
 case "mono":
 return "text-black/70 font-mono";
 case "light":
 default:
 return "text-slate-500";
 }
 };

 const getAccentBorder = () => {
 switch (theme) {
 case "dark":
 return "border-orange-500/30";
 case "orange":
 return "border-white/30";
 case "mono":
 return "border-black";
 case "light":
 default:
 return "border-orange-500/20";
 }
 };

 const getSizeClasses = () => {
 switch (size) {
 case "story":
 return "aspect-[9/16] p-10 h-[720px] max-w-[405px]";
 case "compact":
 return "aspect-[16/9] p-6 h-[360px] max-w-[640px]";
 case "square":
 default:
 return "aspect-square p-8 h-[480px] max-w-[480px]";
 }
 };

 return (
 <div
 id="export-card-node"
 className={`relative w-full rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300 font-sans ${getThemeClasses()} ${getSizeClasses()}`}
 >
 {/* Background Graphic Grid */}
 <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />

 {/* Card Header */}
 <div>
 <div className="flex justify-between items-start mb-4">
 <div className="flex flex-col">
 <span className={`text-[10px] font-mono tracking-widest uppercase ${getSubtextClasses()}`}>
 {workout.primaryDistance} Workout // Track.Vault
 </span>
 <h2 className="text-2xl font-bold font-display tracking-tight leading-none mt-1">
 {workout.title}
 </h2>
 </div>
 <span className={`px-2 py-1 text-[9px] font-mono border rounded uppercase leading-none ${theme === "orange" ? "border-white text-white" : "border-current opacity-80"}`}>
 Level: {workout.level}
 </span>
 </div>

 <p className={`text-xs line-clamp-2 italic mb-4 pb-3 border-b ${getAccentBorder()} ${getSubtextClasses()}`}>
 "{workout.summary}"
 </p>

 {/* Workout Prescription Block */}
 <div className="space-y-3 overflow-hidden flex-1">
 {workout.warmup.length > 0 && (
 <div>
 <span className="text-[9px] font-mono uppercase tracking-widest block opacity-70">WU</span>
 <p className="text-xs font-mono leading-tight truncate">
 {workout.warmup.map(formatWorkoutBlock).join(" → ")}
 </p>
 </div>
 )}

 <div>
 <span className="text-[9px] font-mono uppercase tracking-widest block font-semibold text-orange-500">Main Prescription</span>
 <div className={`p-3 rounded-lg border ${getAccentBorder()} ${theme === "orange" ? "bg-orange-700/50" : theme === "dark" ? "bg-slate-900/50" : "bg-slate-50"} mt-0.5`}>
 <ul className="space-y-1">
 {(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || [])).slice(0, size === "compact" ? 2 : 4).map((b, i) => (
 <li key={b.id || i} className="text-xs font-mono font-medium flex items-center gap-1.5 leading-snug">
 <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
 {(workout.entryType === "support-routine" ? String(b) : formatWorkoutBlock(b as any))}
 </li>
 ))}
 {(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || [])).length > (size === "compact" ? 2 : 4) && (
 <li className={`text-[10px] italic ${getSubtextClasses()}`}>
 + {(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || [])).length - (size === "compact" ? 2 : 4)} more prescription blocks.
 </li>
 )}
 </ul>
 </div>
 </div>

 {workout.cooldown.length > 0 && size !== "compact" && (
 <div>
 <span className="text-[9px] font-mono uppercase tracking-widest block opacity-70">Cooldown</span>
 <p className="text-xs font-mono leading-tight truncate">
 {workout.cooldown.map(formatWorkoutBlock).join(" → ")}
 </p>
 </div>
 )}
 </div>
 </div>

 {/* Card Footer */}
 <div className={`mt-4 pt-3 border-t flex justify-between items-end ${getAccentBorder()} ${getSubtextClasses()}`}>
 <div className="flex flex-col">
 <span className="text-[9px] font-mono leading-none">Est Distance & Duration</span>
 <span className="text-xs font-bold leading-none mt-1">
 {(workout.estimatedDistanceKm || 0)} KM / {workout.estimatedDurationMin} MIN
 </span>
 </div>
 <div className="text-right">
 <span className="text-[9px] font-mono block leading-none">Category</span>
 <span className="text-[10px] font-semibold tracking-wide uppercase mt-1 block">
 {workout.category.replace("-", " ")}
 </span>
 </div>
 </div>
 </div>
 );
}
