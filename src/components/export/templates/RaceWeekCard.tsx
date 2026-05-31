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

export function RaceWeekCard({ workout, theme, size }: TemplateProps) {
  const isDark = theme === "dark";
  const isOrange = theme === "orange";
  const isMono = theme === "mono";

  const getThemeClasses = () => {
    if (isDark) return "bg-slate-950 text-blue-400 border-slate-900";
    if (isOrange) return "bg-orange-600 text-neutral-100 border-orange-700";
    if (isMono) return "bg-zinc-50 text-black border-2 border-dashed border-black";
    return "bg-blue-50/30 text-blue-900 border-blue-100 shadow-sm";
  };

  const getSubtextClasses = () => {
    if (isDark) return "text-slate-500";
    if (isOrange) return "text-orange-200";
    if (isMono) return "text-black/60 font-mono";
    return "text-blue-800/70";
  };

  const getInnerBlock = () => {
    if (isDark) return "bg-slate-900/60 border-slate-800 text-slate-300";
    if (isOrange) return "bg-neutral-800/40 border-neutral-700 text-white";
    if (isMono) return "bg-white border text-black border-black";
    return "bg-blue-50 border-blue-100/60 text-blue-900";
  };

  const getDividerClasses = () => {
    if (isDark) return "border-slate-800";
    if (isOrange) return "border-white/10";
    if (isMono) return "border-black";
    return "border-blue-100";
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
        {/* Race Prep Taper Header */}
        <div className={`border-b pb-2 mb-3 ${getDividerClasses()}`}>
          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest uppercase font-bold text-blue-600 dark:text-blue-400">
            <span>🏁 RACE WEEK TAPER ACTIVE</span>
            <span>LEVEL: {workout.level.toUpperCase()}</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight font-display mt-1">
            {workout.title}
          </h2>
        </div>

        {/* Prescription content */}
        <div className="space-y-4">
          <p className="text-xs italic leading-snug">{workout.summary}</p>

          <div className={`p-4 rounded-xl border ${getInnerBlock()}`}>
            <span className="text-[10px] font-mono tracking-wider uppercase block text-blue-500 font-bold mb-1.5">
              ⚡ NERVOUS SYSTEM PRIMER
            </span>
            <ul className="space-y-1.5 text-xs font-mono">
              {workout.mainSet.slice(0, size === "compact" ? 2 : 4).map((block, i) => (
                <li key={block.id || i} className="flex gap-2 items-start leading-snug font-medium">
                  <span>🏁</span>
                  <span>{formatWorkoutBlock(block)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t pt-3 flex justify-between items-end ${getDividerClasses()} ${getSubtextClasses()}`}>
        <div className="flex flex-col">
          <span className="text-[8px] font-mono uppercase tracking-wider">Taper Volume</span>
          <span className="text-xs font-bold leading-none mt-1">
            {workout.estimatedDistanceKm} KM / {workout.estimatedDurationMin} MIN
          </span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-mono uppercase tracking-wider">Target Date</span>
          <span className="text-[10px] font-bold uppercase tracking-wide block mt-1">
            RACE READY
          </span>
        </div>
      </div>
    </div>
  );
}
