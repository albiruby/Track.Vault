/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { validateRunningWorkoutDraft, validateSupportRoutineDraft, ValidationItem, ValidationResult } from "../../lib/builderValidation";
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Scale, Sparkles, BookOpen, HeartPulse } from "lucide-react";

interface BuilderQualityChecklistProps {
  workout: any;
  intensityGuide?: any;
  entryType: "running-workout" | "support-routine" | string;
}

export default function BuilderQualityChecklist({ workout, intensityGuide, entryType }: BuilderQualityChecklistProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Compute live validation result
  const validation: ValidationResult = React.useMemo(() => {
    if (entryType === "support-routine" || workout.entryType === "support-routine") {
      return validateSupportRoutineDraft(workout);
    } else {
      return validateRunningWorkoutDraft(workout, intensityGuide);
    }
  }, [workout, intensityGuide, entryType]);

  const { isValid, status, items } = validation;

  // Render status badge helper
  const renderStatusBadge = (item: ValidationItem) => {
    switch (item.status) {
      case "pass":
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-0.5 font-mono text-[9px] font-black uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Passed</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-0.5 font-mono text-[9px] font-black uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Coach Tip</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-2 py-0.5 font-mono text-[9px] font-black uppercase">
            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Blocker</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Draft status details configuration
  const getStatusMessage = () => {
    switch (status) {
      case "Ready to Export":
        return {
          title: "Ready to Export",
          desc: "Meets standard design criteria. Safe, fully structured and properly aligned.",
          color: "text-emerald-700 bg-emerald-50/50 border-emerald-100",
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
        };
      case "Needs Attention":
        return {
          title: "Needs Attention",
          desc: "Core parameters configured, but coaching pacing or warmup segment is optional or blank.",
          color: "text-blue-700 bg-blue-50/30 border-blue-100",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200"
        };
      case "Safety Notes Recommended":
        return {
          title: "Safety Notes Recommended",
          desc: "Intense pace thresholds program detected but lacks muscle-activation guidance in notes.",
          color: "text-amber-700 bg-amber-50/50 border-amber-100",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-200"
        };
      case "Missing Core Structure":
        return {
          title: "Missing Core Structure",
          desc: "Blockers present. Complete main sets with valid programming durations or counts.",
          color: "text-rose-700 bg-rose-50/50 border-rose-100",
          badgeBg: "bg-rose-50 text-rose-700 border-rose-150"
        };
      case "Draft In Progress":
      default:
        return {
          title: "Draft In Progress",
          desc: "Initial sandbox state. Type in name and set guidelines to run automated checks.",
          color: "text-slate-600 bg-slate-50 border-slate-200",
          badgeBg: "bg-slate-50 text-slate-600 border-slate-200"
        };
    }
  };

  const statusMsg = getStatusMessage();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs select-none">
      {/* Header section toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              Workout Integrity Audits
            </h3>
            <p className="text-[9px] text-slate-400 font-mono tracking-normal leading-none mt-0.5">
              Live deterministic coaching and safety checks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick status badge */}
          <div className={`px-2.5 py-1 text-[10px] font-black uppercase font-mono tracking-wider rounded-lg border ${statusMsg.badgeBg}`}>
            {status}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in text-slate-800">
          {/* Integrity status description banner */}
          <div className={`p-3.5 rounded-xl border ${statusMsg.color} space-y-1.5`}>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold leading-none tracking-tight flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  status === "Ready to Export" ? "bg-emerald-500" :
                  status === "Needs Attention" ? "bg-blue-500" :
                  status === "Safety Notes Recommended" ? "bg-amber-500" :
                  status === "Missing Core Structure" ? "bg-rose-500" : "bg-slate-400"
                }`} />
                Draft Status: {statusMsg.title}
              </h4>
            </div>
            <p className="text-[10.5px] opacity-85 leading-relaxed font-medium">{statusMsg.desc}</p>
            <div className="pt-1 border-t border-current/10 text-[9px] opacity-60 font-mono flex items-center justify-between">
              <span>Rule-based checklist from your draft fields.</span>
              <span>Not a score • No AI analysis</span>
            </div>
          </div>

          {/* Guidelines checklist */}
          <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-start gap-3 first:pt-0 last:pb-0">
                <div className="shrink-0 pt-0.5">
                  {item.status === "pass" ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  ) : item.status === "warning" ? (
                    <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-50" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-900 tracking-tight">
                      {item.label}
                    </span>
                    {renderStatusBadge(item)}
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed select-text">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Validation guard warning */}
          {!isValid && (
            <div className="p-3 bg-rose-50/50 border border-rose-150 rounded-xl flex gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-rose-700 font-semibold leading-normal">
                CRITICAL WARNING: This workout contains error blockers (e.g. empty training sets) which prevent export card creation or permanent storage. Please fill in active workouts focus blocks.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
