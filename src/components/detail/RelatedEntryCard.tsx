/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TrackVaultEntry } from "../../types/workout";
import { LevelBadge } from "../library/LevelBadge";
import { DifficultyBadge } from "../library/DifficultyBadge";
import { RiskBadge } from "../library/RiskBadge";
import { getRelatedReasonLabels, getDurationComparable } from "../../lib/relatedWorkouts";
import { sanitizeWorkoutTitle } from "../../lib/displayTitle";
import { Clock, Compass, ArrowRight } from "lucide-react";

interface RelatedEntryCardProps {
  key?: string;
  currentEntry: TrackVaultEntry;
  candidate: TrackVaultEntry;
  onClick: (slug: string) => void;
}

export function RelatedEntryCard({ currentEntry, candidate, onClick }: RelatedEntryCardProps) {
  const title = sanitizeWorkoutTitle(candidate.title || "Untitled Entry");
  const isRunning = candidate.entryType === "running-workout";
  
  let categoryTag = "";
  if (isRunning) {
    categoryTag = (candidate as any).primaryDistance || "Running";
  } else {
    categoryTag = (candidate as any).supportCategoryLabel || "Support";
  }

  const reasonChips = getRelatedReasonLabels(currentEntry, candidate);
  const duration = getDurationComparable(candidate);

  return (
    <div
      onClick={() => onClick(candidate.slug || "")}
      className="bg-white border border-[#E2E8F0] hover:border-blue-600 hover:shadow-md rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group h-full relative"
    >
      <div className="space-y-2.5">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <LevelBadge level={candidate.level} />
          <RiskBadge risk={candidate.risk as any} />
          {candidate.difficulty !== undefined && (
            <DifficultyBadge difficulty={candidate.difficulty} />
          )}
        </div>

        {/* Title */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-black block mb-0.5">
            {isRunning ? "Running Workout" : "Support Routine"}
          </h4>
          <h3 className="text-sm font-black font-display text-[#0F172A] group-hover:text-blue-600 transition-colors line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Minimal metrics */}
        <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-500 py-1 border-t border-b border-slate-50">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            {duration > 0 ? `${duration}m` : "Open"}
          </span>
          {isRunning && (candidate as any).estimatedDistanceKm !== undefined && (candidate as any).estimatedDistanceKm > 0 && (
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-orange-500" />
              {(candidate as any).estimatedDistanceKm} km
            </span>
          )}
          <span className="bg-slate-100 px-2 py-0.5 rounded text-[8px] uppercase font-black text-slate-600 tracking-wider">
            {categoryTag}
          </span>
        </div>

        {/* Summary */}
        {candidate.summary && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {candidate.summary}
          </p>
        )}
      </div>

      {/* Reason Chips & Action footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
        <div className="flex flex-wrap gap-1">
          {reasonChips.map((chip, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-blue-700 text-[8px] font-bold font-mono border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider scale-95 origin-left"
            >
              {chip}
            </span>
          ))}
        </div>
        <span className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}

export default RelatedEntryCard;
