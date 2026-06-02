/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Flame, Zap, RefreshCw, Layers } from "lucide-react";

interface SessionTimelineProps {
  workout: {
    entryType?: string;
    warmup?: any[];
    mainSet?: any[];
    cooldown?: any[];
    sessionStructure?: any[];
  };
}

export function SessionTimeline({ workout }: SessionTimelineProps) {
  const isSupport = workout.entryType === "support-routine";

  if (isSupport) {
    const structArr = Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [];
    const exerciseCount = structArr.length;

    if (exerciseCount === 0) return null;

    return (
      <div className="space-y-2.5 w-full font-mono">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
          Support Sequence Stations ({exerciseCount})
        </span>
        <div className="w-full flex items-center gap-1.5 h-11 border border-slate-200/80 bg-slate-50 p-1.5 rounded-2xl shadow-sm overflow-hidden select-none">
          <div className="bg-blue-600 text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider px-3 h-full flex items-center justify-center shrink-0">
            STATIONS
          </div>
          <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar items-center py-1">
            {structArr.map((ex: any, idx) => (
              <div 
                key={idx} 
                className="px-2.5 h-7 rounded-lg border border-slate-200 bg-white font-mono text-[9px] font-bold uppercase flex items-center justify-center shrink-0 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
              >
                {idx + 1}. {ex.name ? ex.name.slice(0, 16) : "Station"}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const wuSteps = workout.warmup?.length || 0;
  const msSteps = workout.mainSet?.length || 0;
  const cdSteps = workout.cooldown?.length || 0;
  const totalSteps = wuSteps + msSteps + cdSteps;

  if (totalSteps === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 italic">
        Structure timeline is not configured for this custom session.
      </div>
    );
  }

  const wuWeight = wuSteps > 0 ? Math.max((wuSteps / totalSteps) * 100, 20) : 0;
  const msWeight = msSteps > 0 ? Math.max((msSteps / totalSteps) * 100, 40) : 0;
  const cdWeight = cdSteps > 0 ? Math.max((cdSteps / totalSteps) * 100, 20) : 0;
  const sumWeights = wuWeight + msWeight + cdWeight;

  const wuPct = (wuWeight / sumWeights) * 100;
  const msPct = (msWeight / sumWeights) * 100;
  const cdPct = (cdWeight / sumWeights) * 100;

  return (
    <div className="space-y-2.5 w-full">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] font-bold block">
        Workout Phase Timeline
      </span>
      <div className="h-11 w-full rounded-2xl overflow-hidden flex border border-slate-200 shadow-sm">
        {wuSteps > 0 && (
          <div 
            style={{ width: `${wuPct}%` }}
            className="bg-slate-100 hover:bg-slate-150 transition-colors flex items-center justify-center border-r border-[#E2E8F0] relative group px-2.5"
          >
            <div className="flex items-center gap-1.5 text-slate-700">
              <Flame className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate sm:inline hidden">WU</span>
              <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded-md leading-none">{wuSteps}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[9px] font-mono rounded px-2.5 py-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
              Prep/Warmup Phase: {wuSteps} Block{wuSteps > 1 ? "s" : ""}
            </div>
          </div>
        )}
        {msSteps > 0 && (
          <div 
            style={{ width: `${msPct}%` }}
            className="bg-sky-500 hover:bg-sky-600 transition-colors flex items-center justify-center border-r border-sky-400 relative group px-2.5"
          >
            <div className="flex items-center gap-1.5 text-white">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate sm:inline hidden">MAIN SET</span>
              <span className="text-[10px] font-mono font-bold bg-white/25 text-white px-1.5 py-0.5 rounded-md leading-none">{msSteps}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[9px] font-mono rounded px-2.5 py-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
              Target Effort Set: {msSteps} Block{msSteps > 1 ? "s" : ""}
            </div>
          </div>
        )}
        {cdSteps > 0 && (
          <div 
            style={{ width: `${cdPct}%` }}
            className="bg-slate-705 hover:bg-slate-800 transition-colors flex items-center justify-center relative group px-2.5"
          >
            <div className="flex items-center gap-1.5 text-slate-100">
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate sm:inline hidden">CD</span>
              <span className="text-[10px] font-mono font-bold bg-white/10 text-white px-1.5 py-0.5 rounded-md leading-none">{cdSteps}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[9px] font-mono rounded px-2.5 py-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
              Cooldown/Taper Phase: {cdSteps} Block{cdSteps > 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
