/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Workout } from "../../types/workout";
import { RiskBadge } from "./RiskBadge";
import { DifficultyBadge } from "./DifficultyBadge";
import { LevelBadge } from "./LevelBadge";
import { formatWorkoutBlock, formatWorkoutForClipboard } from "../../lib/workouts";
import { copyToClipboard } from "../../lib/clipboard";
import { Copy, ClipboardCheck, ExternalLink, RefreshCw, Eye } from "lucide-react";

interface WorkoutCardProps {
  key?: string;
  workout: Workout;
  onViewDetails: (workout: Workout) => void;
  onDuplicateInBuilder: (workout: Workout) => void;
  onExportCard: (workout: Workout) => void;
}

export function WorkoutCard({
  workout,
  onViewDetails,
  onDuplicateInBuilder,
  onExportCard,
}: WorkoutCardProps) {
  const [copied, setCopied] = useState(false);

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const txt = formatWorkoutForClipboard(workout, "simple");
    const success = await copyToClipboard(txt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onViewDetails(workout)}
      className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-6 hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer animate-fade-in relative overflow-hidden"
    >
      <div>
        {/* Card Header Top Row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <LevelBadge level={workout.level} />
          <DifficultyBadge difficulty={workout.difficulty} />
          <RiskBadge risk={workout.risk} />
          {workout.isCustom && (
            <span className="bg-sky-50 dark:bg-sky-950/20 text-sky-500 dark:text-sky-450 text-[9px] font-mono border border-sky-100 dark:border-sky-900/30 px-1.5 py-0.5 rounded-md uppercase font-black">
              LOCAL
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-md font-bold tracking-tight text-[#0F172A] dark:text-slate-150 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors line-clamp-1 uppercase font-display">
          {workout.title}
        </h3>
        
        {/* Short Summary */}
        <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
          {workout.summary}
        </p>

        {/* Core Dimensions Info Block */}
        <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 dark:bg-[#0F172A]/70 border border-[#E2E8F0] dark:border-[#334155] rounded-2xl text-center">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-bold">Distance</span>
            <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 font-mono">
              {(workout as any).rawDistance && typeof (workout as any).rawDistance === "object"
                ? `${(workout as any).rawDistance.min}-${(workout as any).rawDistance.max} KM`
                : `~${workout.estimatedDistanceKm} KM`}
            </span>
          </div>
          <div className="border-l border-[#E2E8F0] dark:border-[#334155]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-bold">Duration</span>
            <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 font-mono">
              {(workout as any).rawDuration && typeof (workout as any).rawDuration === "object"
                ? `${(workout as any).rawDuration.min}-${(workout as any).rawDuration.max} MIN`
                : `~${workout.estimatedDurationMin} MIN`}
            </span>
          </div>
        </div>

        {/* Main Set Rep Block Previews */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#334155] dark:text-slate-400 block font-black">
            Primary Prescription
          </span>
          <div className="space-y-1 text-xs text-[#0F172A] dark:text-slate-200 font-mono">
            {workout.mainSet.slice(0, 2).map((block, i) => (
              <div key={block.id || i} className="flex gap-1.5 items-center truncate leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
                <span className="font-semibold">{formatWorkoutBlock(block)}</span>
              </div>
            ))}
            {workout.mainSet.length > 2 && (
              <span className="text-[10px] font-mono italic text-slate-400 font-medium">
                + {workout.mainSet.length - 2} more prescription steps
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Row */}
      <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#334155] flex justify-between gap-1 items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(workout);
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 flex items-center gap-1 cursor-pointer font-mono"
        >
          <Eye className="w-3.5 h-3.5 text-sky-500" />
          <span>INSPECT</span>
        </button>

        <div className="flex gap-1.5">
          <button
            onClick={handleQuickCopy}
            title="Copy simple text description to clipboard"
            className="p-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] hover:bg-sky-500/10 hover:border-sky-500 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer transition-all"
          >
            {copied ? (
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExportCard(workout);
            }}
            title="Export workout to image share studio"
            className="p-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] hover:bg-sky-500/10 hover:border-sky-500 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateInBuilder(workout);
            }}
            title="Duplicate and load inside details editor"
            className="p-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] hover:bg-sky-500/10 hover:border-sky-500 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
