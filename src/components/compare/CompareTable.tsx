/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CompareTrayItem } from "../../lib/compareEntries";
import { formatWorkoutBlock, formatExerciseBlock } from "../../lib/workouts";
import { Copy, Check, FileText, X, AlertTriangle, Info, ShieldAlert } from "lucide-react";

interface CompareTableProps {
  items: CompareTrayItem[];
  onRemove: (localCompareId: string) => void;
  onInspect: (slug: string) => void;
  onUseDraft: (workout: any) => void;
}

export default function CompareTable({ items, onRemove, onInspect, onUseDraft }: CompareTableProps) {
  const [copied, setCopied] = React.useState(false);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-6">
        <p className="text-sm font-semibold text-slate-500">No entries in the comparison tray.</p>
      </div>
    );
  }

  // Detect types in play
  const hasRunning = items.some(
    (it) => it.entryType === "running-workout" || it.entryType === "custom-running-workout"
  );
  const hasSupport = items.some(
    (it) => it.entryType === "support-routine" || it.entryType === "custom-support-routine"
  );
  const isMixed = hasRunning && hasSupport;

  // Generate deterministic summary chips
  const renderSummaryChips = () => {
    const chips: string[] = [];

    // Chip: Type composition
    if (isMixed) {
      chips.push("Mixed Setup (Running + Support)");
    } else if (hasRunning) {
      chips.push("Pure Running Comparison");
    } else {
      chips.push("Pure Support Comparison");
    }

    // Chip: Levels Check
    const levels = items.map((it) => (it.data.level || "").toLowerCase().trim()).filter(Boolean);
    if (levels.length > 1 && levels.every((l) => l === levels[0])) {
      chips.push(`Unified level: ${items[0].data.level}`);
    }

    // Chip: Risk Match
    const risks = items.map((it) => (it.data.risk || "").toLowerCase().trim()).filter(Boolean);
    if (risks.length > 1 && risks.every((r) => r === risks[0])) {
      chips.push(`Shared Risk profile: ${items[0].data.risk.toUpperCase()}`);
    }

    // Chip: Category Check
    const categories = items
      .map((it) => (it.data.category || it.data.supportCategoryLabel || "").toLowerCase().trim())
      .filter(Boolean);
    if (categories.length > 1 && categories.every((c) => c === categories[0])) {
      chips.push(`Same Sub-discipline: ${items[0].data.category || items[0].data.supportCategoryLabel}`);
    }

    // Chip: Surface
    if (hasRunning && !hasSupport) {
      const surfaces = items.map((it) => String(it.data.surface || "").toLowerCase()).filter(Boolean);
      if (surfaces.length > 1 && surfaces.every((s) => s === surfaces[0])) {
        chips.push(`Shared Terrain: ${items[0].data.surface}`);
      }
    }

    // Chip: Equipment check
    const hasEquipment = items.some((it) => it.data.equipment && it.data.equipment.length > 0);
    if (!hasEquipment) {
      chips.push("Zero Equipment Required");
    }

    return (
      <div className="flex flex-wrap gap-1.5 pt-1">
        {chips.map((chip, idx) => (
          <span
            key={idx}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold tracking-wide px-2 py-0.5 rounded-md flex items-center gap-1"
          >
            ✦ {chip}
          </span>
        ))}
      </div>
    );
  };

  // Generate Markdown summary for clipboard copy
  const handleCopyMarkdown = () => {
    let md = `# Track.Vault Comparison Report\n\n`;
    md += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    // Headers
    md += `| Attribute | ` + items.map((it) => `**${it.title}**`).join(" | ") + ` |\n`;
    md += `| --- | ` + items.map(() => `---`).join(" | ") + ` |\n`;

    // Shared row helper
    const addRow = (label: string, getter: (it: CompareTrayItem) => string) => {
      md += `| ${label} | ` + items.map((it) => getter(it).replace(/\|/g, "\\|")).join(" | ") + ` |\n`;
    };

    addRow("Entry Type", (it) => it.entryType);
    addRow("Level", (it) => it.data.level || "—");
    addRow("Difficulty", (it) => String(it.data.rawDifficulty || it.data.difficulty || "—"));
    addRow("Risk Profile", (it) => String(it.data.risk || "—") + (it.data.riskReason ? ` (${it.data.riskReason})` : ""));
    addRow("Estimated Duration", (it) =>
      it.data.estimatedDurationMin ? `${it.data.estimatedDurationMin}m` : it.data.durationMin ? `${it.data.durationMin}m` : "—"
    );
    addRow("Main Summary", (it) => it.data.summary || "—");

    if (hasRunning) {
      md += `\n### Running Specific Specs\n\n`;
      md += `| Running Specs | ` + items.map((it) => `**${it.title}**`).join(" | ") + ` |\n`;
      md += `| --- | ` + items.map(() => `---`).join(" | ") + ` |\n`;
      addRow("Category / Target", (it) => it.data.category || it.data.primaryDistance || "—");
      addRow("Workout Tech", (it) => it.data.workoutType || "—");
      addRow("Surface / Track", (it) => it.data.surface || "—");
      addRow("Distance Vol", (it) => (it.data.estimatedDistanceKm ? `~${it.data.estimatedDistanceKm}k` : "—"));
      addRow("Interval Block List", (it) => {
        const blocks = it.data.mainSet || [];
        return blocks.length > 0 ? blocks.map((b: any) => formatWorkoutBlock(b)).join(" ➔ ") : "Steady pace";
      });
    }

    if (hasSupport) {
      md += `\n### Support Specific Specs\n\n`;
      md += `| Support Specs | ` + items.map((it) => `**${it.title}**`).join(" | ") + ` |\n`;
      md += `| --- | ` + items.map(() => `---`).join(" | ") + ` |\n`;
      addRow("Category Group", (it) => it.data.supportCategoryLabel || "—");
      addRow("Focus Muscle/Joint", (it) => (Array.isArray(it.data.bodyFocus) ? it.data.bodyFocus.join(", ") : "—"));
      addRow("Movement Goals", (it) => (Array.isArray(it.data.movementGoals) ? it.data.movementGoals.join(", ") : "—"));
      addRow("Core Structure", (it) => it.data.sessionStructure || "—");
    }

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg uppercase tracking-wide">
              Compare Mode
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {items.length} of 3 entries side-by-side
            </span>
          </div>
          {renderSummaryChips()}
        </div>

        <button
          onClick={handleCopyMarkdown}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-700 cursor-pointer shadow-xs font-mono tracking-wide"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" /> COPIED!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" /> COPY MD REPORT
            </>
          )}
        </button>
      </div>

      {/* Main Side-by-Side Responsive Compare Grid */}
      <div className="w-full overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-xs min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-4 font-bold font-mono tracking-wider text-[10px] text-slate-400 uppercase w-[160px] shrink-0 border-r border-slate-100">
                Specification
              </th>
              {items.map((item) => (
                <th key={item.localCompareId} className="p-4 w-[280px] border-r border-slate-100 last:border-r-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-1">
                      <span className="bg-slate-100 text-slate-600 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md border border-slate-150">
                        {item.entryType}
                      </span>
                      <button
                        onClick={() => onRemove(item.localCompareId)}
                        title="Remove from comparison tray"
                        className="p-1 rounded bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <h4 className="text-sm font-black font-display tracking-tight text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    {/* Quick Core Details */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => onInspect(item.slug || `local-${item.localId || item.entryId}`)}
                        className="p-1 px-2.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors flex-1 text-center"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => {
                          const completeWorkout = {
                            ...item.data,
                            id: item.localId || item.entryId,
                            slug: item.slug || `local-${item.localId || item.entryId}`,
                            isCustom: true,
                          };
                          onUseDraft(completeWorkout);
                        }}
                        className="p-1 px-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all flex-1 text-center"
                      >
                        Use Draft
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* ====== SHARED ROWS SECTION ====== */}
            <tr>
              <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                Coach Summary
              </td>
              {items.map((item) => (
                <td key={item.localCompareId} className="p-3 text-slate-700 leading-relaxed font-semibold italic border-r border-slate-100 last:border-r-0">
                  {item.data.summary || "No description loaded."}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                Difficulty Level
              </td>
              {items.map((item) => (
                <td key={item.localCompareId} className="p-3 border-r border-slate-100 last:border-r-0">
                  <span className="font-bold text-slate-800 font-mono">
                    {item.data.rawDifficulty || item.data.difficulty || "Untiered"}
                  </span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                Target User
              </td>
              {items.map((item) => (
                <td key={item.localCompareId} className="p-3 text-slate-700 font-bold border-r border-slate-100 last:border-r-0">
                  {item.data.level || "All running classes"}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                Physical Risk Tier
              </td>
              {items.map((item) => {
                const risk = String(item.data.risk || "unknown").toLowerCase();
                const riskColor =
                  risk === "low"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                    : risk === "medium"
                    ? "text-amber-700 bg-amber-50 border-amber-100"
                    : "text-rose-700 bg-rose-50 border-rose-100";

                return (
                  <td key={item.localCompareId} className="p-3 border-r border-slate-100 last:border-r-0">
                    <div className="space-y-1">
                      <span className={`inline-block font-mono font-bold text-[9px] uppercase px-1.5 py-0.5 rounded border ${riskColor}`}>
                        {risk.toUpperCase()}
                      </span>
                      {item.data.riskReason && (
                        <p className="text-[10px] text-slate-500 font-medium leading-normal">
                          {item.data.riskReason}
                        </p>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                Active Duration
              </td>
              {items.map((item) => {
                const min = item.data.estimatedDurationMin || item.data.durationMin || item.data.duration;
                return (
                  <td key={item.localCompareId} className="p-3 font-black text-slate-800 font-mono border-r border-slate-100 last:border-r-0">
                    {min ? `${min} Minutes` : "Unspecified"}
                  </td>
                );
              })}
            </tr>

            {/* ====== RUNNING SPECIFIC ROWS ====== */}
            {hasRunning && (
              <>
                <tr className="bg-violet-50/30">
                  <td
                    colSpan={items.length + 1}
                    className="p-2.5 font-bold text-[10px] text-violet-700 tracking-wider uppercase font-mono border-y border-violet-100"
                  >
                    🏃 Running Workout Specifications
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Workout Class
                  </td>
                  {items.map((item) => {
                    const isRun =
                      item.entryType === "running-workout" || item.entryType === "custom-running-workout";
                    return (
                      <td
                        key={item.localCompareId}
                        className={`p-3 border-r border-slate-100 last:border-r-0 ${
                          !isRun ? "text-slate-350 bg-slate-50/30 italic" : "text-slate-800 font-bold"
                        }`}
                      >
                        {isRun ? item.data.workoutType || "Regular Intervals" : "—"}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Primary Distance
                  </td>
                  {items.map((item) => {
                    const isRun =
                      item.entryType === "running-workout" || item.entryType === "custom-running-workout";
                    return (
                      <td
                        key={item.localCompareId}
                        className={`p-3 border-r border-slate-100 last:border-r-0 ${
                          !isRun ? "text-slate-350 bg-slate-50/30 italic" : "text-slate-800 font-bold font-mono"
                        }`}
                      >
                        {isRun ? item.data.category || item.data.primaryDistance || "Track Set" : "—"}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Terrain Surface
                  </td>
                  {items.map((item) => {
                    const isRun =
                      item.entryType === "running-workout" || item.entryType === "custom-running-workout";
                    return (
                      <td
                        key={item.localCompareId}
                        className={`p-3 border-r border-slate-100 last:border-r-0 ${
                          !isRun ? "text-slate-350 bg-slate-50/30 italic" : "text-slate-800 font-semibold"
                        }`}
                      >
                        {isRun ? item.data.surface || "All surfaces" : "—"}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Est. Mileage Vol
                  </td>
                  {items.map((item) => {
                    const isRun =
                      item.entryType === "running-workout" || item.entryType === "custom-running-workout";
                    return (
                      <td
                        key={item.localCompareId}
                        className={`p-3 border-r border-slate-100 last:border-r-0 ${
                          !isRun ? "text-slate-350 bg-slate-50/30 italic" : "text-slate-800 font-bold font-mono"
                        }`}
                      >
                        {isRun
                          ? item.data.estimatedDistanceKm
                            ? `${item.data.estimatedDistanceKm} Km`
                            : "Untimed set"
                          : "—"}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase font-bold">
                    MAIN INTERVAL SET
                  </td>
                  {items.map((item) => {
                    const isRun =
                      item.entryType === "running-workout" || item.entryType === "custom-running-workout";
                    if (!isRun) {
                      return (
                        <td
                          key={item.localCompareId}
                          className="p-3 text-slate-350 bg-slate-50/30 italic border-r border-slate-100 last:border-r-0"
                        >
                          —
                        </td>
                      );
                    }
                    const blocks = item.data.mainSet || [];
                    return (
                      <td key={item.localCompareId} className="p-3 border-r border-slate-100 last:border-r-0">
                        {blocks.length === 0 ? (
                          <span className="text-slate-400 font-medium">Standard steady run pace</span>
                        ) : (
                          <ul className="space-y-1.5">
                            {blocks.map((b: any, bIdx: number) => (
                              <li key={bIdx} className="text-[11px] text-slate-700 leading-normal">
                                <span className="inline-block text-blue-600 font-mono font-bold w-4">
                                  {bIdx + 1}.
                                </span>
                                {formatWorkoutBlock(b)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Warmup Routine
                  </td>
                  {items.map((item) => {
                    const isRun =
                      item.entryType === "running-workout" || item.entryType === "custom-running-workout";
                    if (!isRun) {
                      return (
                        <td
                          key={item.localCompareId}
                          className="p-3 text-slate-350 bg-slate-50/30 italic border-r border-slate-100 last:border-r-0"
                        >
                          —
                        </td>
                      );
                    }
                    const warmupBlocks = item.data.warmup || [];
                    return (
                      <td key={item.localCompareId} className="p-3 text-slate-600 border-r border-slate-100 last:border-r-0 leading-normal">
                        {warmupBlocks.length === 0
                          ? "Standard easy light jog"
                          : warmupBlocks.map((b: any) => formatWorkoutBlock(b)).join(" → ")}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase font-bold">
                    Intensity Guidance
                  </td>
                  {items.map((item) => {
                    const isRun =
                      item.entryType === "running-workout" || item.entryType === "custom-running-workout";
                    if (!isRun) {
                      return (
                        <td
                          key={item.localCompareId}
                          className="p-3 text-slate-350 bg-slate-50/30 italic border-r border-slate-100 last:border-r-0"
                        >
                          —
                        </td>
                      );
                    }
                    const guide = item.data.intensityGuide || {};
                    return (
                      <td key={item.localCompareId} className="p-3 border-r border-slate-100 last:border-r-0 leading-relaxed text-[11px] font-semibold text-slate-700">
                        {guide.mainSet || guide.general || "Subject to personal pacing targets."}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}

            {/* ====== SUPPORT SPECIFIC ROWS ====== */}
            {hasSupport && (
              <>
                <tr className="bg-teal-50/30">
                  <td
                    colSpan={items.length + 1}
                    className="p-2.5 font-bold text-[10px] text-teal-700 tracking-wider uppercase font-mono border-y border-teal-100"
                  >
                    🏋️ Support Routine Specifications
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Support Group Type
                  </td>
                  {items.map((item) => {
                    const isSup =
                      item.entryType === "support-routine" || item.entryType === "custom-support-routine";
                    return (
                      <td
                        key={item.localCompareId}
                        className={`p-3 border-r border-slate-100 last:border-r-0 ${
                          !isSup ? "text-slate-350 bg-slate-50/30 italic" : "text-slate-800 font-bold"
                        }`}
                      >
                        {isSup ? item.data.supportCategoryLabel || "Routine" : "—"}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Movement Goals
                  </td>
                  {items.map((item) => {
                    const isSup =
                      item.entryType === "support-routine" || item.entryType === "custom-support-routine";
                    if (!isSup) {
                      return (
                        <td
                          key={item.localCompareId}
                          className="p-3 text-slate-350 bg-slate-50/30 italic border-r border-slate-100 last:border-r-0"
                        >
                          —
                        </td>
                      );
                    }
                    const goals = item.data.movementGoals || [];
                    return (
                      <td key={item.localCompareId} className="p-3 text-slate-700 font-semibold border-r border-slate-100 last:border-r-0">
                        {goals.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {goals.map((g: string, i: number) => (
                              <span
                                key={i}
                                className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200"
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "Functional Adaptation"
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Anatomical Body Focus
                  </td>
                  {items.map((item) => {
                    const isSup =
                      item.entryType === "support-routine" || item.entryType === "custom-support-routine";
                    if (!isSup) {
                      return (
                        <td
                          key={item.localCompareId}
                          className="p-3 text-slate-350 bg-slate-50/30 italic border-r border-slate-100 last:border-r-0"
                        >
                          —
                        </td>
                      );
                    }
                    const focus = item.data.bodyFocus || [];
                    return (
                      <td key={item.localCompareId} className="p-3 text-teal-700 font-bold border-r border-slate-100 last:border-r-0 uppercase text-[9px] font-mono">
                        {focus.join(", ") || "General Body Conditioning"}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase font-bold">
                    Exercises Structure
                  </td>
                  {items.map((item) => {
                    const isSup =
                      item.entryType === "support-routine" || item.entryType === "custom-support-routine";
                    if (!isSup) {
                      return (
                        <td
                          key={item.localCompareId}
                          className="p-3 text-slate-350 bg-slate-50/30 italic border-r border-slate-100 last:border-r-0"
                        >
                          —
                        </td>
                      );
                    }
                    const exercises = item.data.exercises || [];
                    const structure = item.data.sessionStructure;
                    return (
                      <td key={item.localCompareId} className="p-3 border-r border-slate-100 last:border-r-0 text-[11px] leading-relaxed text-slate-750 font-medium">
                        {exercises.length > 0 ? (
                          <ol className="space-y-1">
                            {exercises.map((e: any, eIdx: number) => (
                              <li key={eIdx}>
                                <span className="text-teal-600 font-bold mr-1">{eIdx + 1}.</span>
                                {typeof e === "string" ? e : formatExerciseBlock ? formatExerciseBlock(e) : e.name || "Exercise"}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <div className="whitespace-pre-line">{structure || "Standard routine structure."}</div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                    Variant Modifications
                  </td>
                  {items.map((item) => {
                    const isSup =
                      item.entryType === "support-routine" || item.entryType === "custom-support-routine";
                    if (!isSup) {
                      return (
                        <td
                          key={item.localCompareId}
                          className="p-3 text-slate-350 bg-slate-50/30 italic border-r border-slate-100 last:border-r-0"
                        >
                          —
                        </td>
                      );
                    }

                    const easier = item.data.easierVariant;
                    const harder = item.data.harderVariant;

                    return (
                      <td key={item.localCompareId} className="p-3 text-[10.5px] border-r border-slate-100 last:border-r-0 space-y-2 font-medium">
                        {easier && (
                          <div>
                            <span className="font-mono text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded">
                              ✓ EASIER ADJUST
                            </span>
                            <p className="text-slate-600 mt-0.5">
                              {typeof easier === "string" ? easier : easier.description || "Reduced loads."}
                            </p>
                          </div>
                        )}
                        {harder && (
                          <div>
                            <span className="font-mono text-[8px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded">
                              🗲 HARDER ADJUST
                            </span>
                            <p className="text-slate-600 mt-0.5">
                              {typeof harder === "string" ? harder : harder.description || "Increased scale."}
                            </p>
                          </div>
                        )}
                        {!easier && !harder && <span className="text-slate-400 font-semibold italic">Standard loading parameters</span>}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}

            {/* ====== HARDWARE EQUIPMENT REQUIRED ====== */}
            <tr>
              <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                Hardware Required
              </td>
              {items.map((item) => {
                const eq = item.data.equipment || [];
                return (
                  <td key={item.localCompareId} className="p-3 border-r border-slate-100 last:border-r-0">
                    {eq.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {eq.map((e: string, i: number) => (
                          <span
                            key={i}
                            className="bg-slate-50 text-slate-700 text-[9px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded border border-slate-150"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-semibold italic">None (Bodyweight only)</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* ====== SAFETY RULES ====== */}
            <tr>
              <td className="p-3 font-semibold text-slate-500 border-r border-slate-100 bg-slate-50/20 font-mono text-[10px] uppercase">
                Safety Notes
              </td>
              {items.map((item) => {
                const notes = item.data.safetyNotes || [];
                return (
                  <td key={item.localCompareId} className="p-3 text-[11px] text-slate-600 leading-normal border-r border-slate-100 last:border-r-0">
                    {notes.length > 0 ? (
                      <ul className="list-disc pl-3.5 space-y-1 font-semibold">
                        {notes.map((n: string, i: number) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic">No special precautions listed.</span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
