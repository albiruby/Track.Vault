/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Workout, TrackVaultEntry } from "../../types/workout";
import { RiskBadge } from "./RiskBadge";
import { DifficultyBadge } from "./DifficultyBadge";
import { LevelBadge } from "./LevelBadge";
import { formatWorkoutBlock, formatWorkoutForClipboard } from "../../lib/workouts";
import { copyToClipboard } from "../../lib/clipboard";
import { Copy, ClipboardCheck, ExternalLink, RefreshCw, Eye } from "lucide-react";

interface WorkoutCardProps {
 key?: string;
 workout: TrackVaultEntry;
 onViewDetails: (workout: TrackVaultEntry) => void;
 onDuplicateInBuilder: (workout: TrackVaultEntry) => void;
 onExportCard: (workout: TrackVaultEntry) => void;
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
 className="bg-white border border-[#E2E8F0] rounded-3xl p-6 hover:border-blue-600 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer animate-fade-in relative overflow-hidden"
 >
 <div>
 {/* Card Header Top Row */}
 <div className="flex flex-wrap items-center gap-1.5 mb-3">
 <LevelBadge level={workout.level} />
 <DifficultyBadge difficulty={workout.difficulty} />
 <RiskBadge risk={workout.risk as any} />
 {workout.isCustom && (
 <span className="bg-blue-50 text-blue-650 text-[9px] font-mono border border-blue-100 px-1.5 py-0.5 rounded-md uppercase font-black">
 LOCAL
 </span>
 )}
 </div>

 {/* Title */}
  <h3 className="text-base sm:text-md font-bold tracking-tight text-[#0F172A] group-hover:text-blue-600 transition-colors line-clamp-1 font-display">
    {(() => {
      if (!workout.title) {
        console.warn(`Missing title for entry ID: ${workout.id}, slug: ${workout.slug}`);
        return "Untitled Entry";
      }
      return workout.title;
    })()}
  </h3>
 
 {/* Short Summary */}
 <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
 {workout.summary}
 </p>

 {/* Mini Structure Timeline & Effort Strip (Deterministic Highlights) */}
 {workout.entryType === "support-routine" ? (
   <div className="my-3">
     <div className="flex h-1.5 gap-0.5 rounded overflow-hidden bg-slate-100" title="Routine Stations Diagram">
       {Array.from({ length: Math.min(((workout as any).sessionStructure || []).length || 5, 8) }).map((_, i) => (
         <div key={i} className="h-full flex-1 bg-blue-500 rounded bg-opacity-80" />
       ))}
     </div>
     <div className="flex flex-wrap gap-1 mt-1.5">
       {((workout as any).bodyFocus || []).slice(0, 2).map((focus: string, idx: number) => (
         <span key={idx} className="bg-blue-50 text-blue-700 text-[8px] font-bold font-mono px-1 rounded uppercase tracking-wide border border-blue-100">
           {focus}
         </span>
       ))}
       {((workout as any).bodyFocus || []).length > 2 && (
         <span className="text-[8px] font-mono font-bold text-slate-400 leading-none self-center font-semibold">
           +{((workout as any).bodyFocus || []).length - 2} FOCUS
         </span>
       )}
     </div>
   </div>
 ) : (
   <div className="my-3 space-y-1.5">
     <div className="flex h-1.5 gap-0.5 rounded overflow-hidden bg-slate-100" title="Workout Structure Preview">
       {Array.from({ length: Math.max((workout.warmup || []).length, 1) }).map((_, i) => (
         <div key={`wu-${i}`} className="h-full bg-slate-300" style={{ flexGrow: 1 }} />
       ))}
       {Array.from({ length: Math.max((workout.mainSet || []).length, 1) }).map((_, i) => (
         <div key={`ms-${i}`} className="h-full bg-orange-500" style={{ flexGrow: 2 }} />
       ))}
       {Array.from({ length: Math.max((workout.cooldown || []).length, 1) }).map((_, i) => (
         <div key={`cd-${i}`} className="h-full bg-slate-700" style={{ flexGrow: 1 }} />
       ))}
     </div>
     <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 leading-none font-semibold">
       <span className="flex items-center gap-0.5">📈 WU RAMP</span>
       <span className="flex items-center gap-0.5 font-bold text-orange-600">⚡ MS PEAK</span>
       <span className="flex items-center gap-0.5">CD TAPER 🏁</span>
     </div>
   </div>
 )}

 {/* Core Dimensions Info Block */}
 <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 border border-[#E2E8F0] rounded-2xl text-center">
 <div>
 {workout.entryType === "support-routine" ? <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Focus</span> : <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Distance</span>}
   <span className="text-xs font-bold text-[#0F172A] font-mono">
  {workout.entryType === "support-routine"
    ? ((workout as any).supportCategoryLabel || (workout as any).routineType || "Routine")
    : ((workout as any).rawDistance && typeof (workout as any).rawDistance === "object"
      ? `${(workout as any).rawDistance.min}-${(workout as any).rawDistance.max} KM`
      : `~${(workout as any).estimatedDistanceKm} KM`)}
  </span>
 </div>
 <div className="border-l border-[#E2E8F0]">
 <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Duration</span>
 <span className="text-xs font-bold text-[#0F172A] font-mono">
 {(workout as any).rawDuration && typeof (workout as any).rawDuration === "object"
 ? `${(workout as any).rawDuration.min}-${(workout as any).rawDuration.max} MIN`
 : `~${(workout as any).estimatedDurationMin} MIN`}
 </span>
 </div>
 </div>

 {/* Main Set Rep Block Previews */}
 <div className="space-y-1.5">
 <span className="text-[9px] font-mono uppercase tracking-widest text-[#334155] block font-black">
 Primary Prescription
 </span>
  <div className="space-y-1 text-xs text-[#0F172A] font-mono">
  {workout.entryType === "support-routine" ? (
    <>
      <div className="flex gap-1.5 items-center truncate leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 " />
        <span>Protocol: <span className="font-semibold capitalize">{typeof (workout as any).sessionStructure === "string" ? (workout as any).sessionStructure : "Circuit"}</span></span>
      </div>
      <div className="flex gap-1.5 items-center truncate leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 " />
        <span>Focus: <span className="font-semibold capitalize">{Array.isArray((workout as any).bodyFocus) ? (workout as any).bodyFocus.join(", ") : ((workout as any).bodyFocus || "General")}</span></span>
      </div>
    </>
  ) : (
    <>
      {(workout.mainSet || []).slice(0, 2).map((block, i) => (
        <div key={block.id || i} className="flex gap-1.5 items-center truncate leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 " />
          <span className="font-semibold">{formatWorkoutBlock(block as any)}</span>
        </div>
      ))}
      {(workout.mainSet || []).length > 2 && (
        <span className="text-[10px] font-mono italic text-slate-400 font-medium">
          + {(workout.mainSet || []).length - 2} more steps
        </span>
      )}
    </>
  )}
  </div>
  </div>
  </div>
 {/* Card Action Row */}
 <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex justify-between gap-1 items-center">
 <button
 onClick={(e) => {
 e.stopPropagation();
 onViewDetails(workout);
 }}
 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer font-mono"
 >
 <Eye className="w-3.5 h-3.5 text-blue-600" />
 <span>INSPECT</span>
 </button>

 <div className="flex gap-1.5">
 <button
 onClick={handleQuickCopy}
 title="Copy simple text description to clipboard"
 className="p-2 rounded-xl border border-[#E2E8F0] bg-slate-50 hover:bg-blue-600/10 hover:border-blue-600 text-slate-600 hover:text-blue-600 cursor-pointer transition-all"
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
 className="p-2 rounded-xl border border-[#E2E8F0] bg-slate-50 hover:bg-blue-600/10 hover:border-blue-600 text-slate-600 hover:text-blue-600 cursor-pointer transition-all"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </button>

 <button
 onClick={(e) => {
 e.stopPropagation();
 onDuplicateInBuilder(workout);
 }}
 title="Duplicate and load inside details editor"
 className="p-2 rounded-xl border border-[#E2E8F0] bg-slate-50 hover:bg-blue-600/10 hover:border-blue-600 text-slate-600 hover:text-blue-600 cursor-pointer transition-all"
 >
 <RefreshCw className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 );
}
