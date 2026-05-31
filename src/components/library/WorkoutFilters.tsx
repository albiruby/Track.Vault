/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkoutFiltersState } from "../../lib/workouts";
import { Filter, RotateCcw, HelpCircle } from "lucide-react";
import { getWorkoutIndex } from "../../lib/workouts";

interface WorkoutFiltersProps {
  filters: WorkoutFiltersState;
  onChange: (f: Partial<WorkoutFiltersState>) => void;
  onReset: () => void;
  availableDistances: string[];
  availableLevels: string[];
  availablePhases: string[];
  availableSurfaces: string[];
  availableRisks: string[];
  availableWorkoutTypes: string[];
}

export function WorkoutFilters({
  filters,
  onChange,
  onReset,
  availableDistances,
  availableLevels,
  availablePhases,
  availableSurfaces,
  availableRisks,
  availableWorkoutTypes = [],
}: WorkoutFiltersProps) {
  const indexManifest = getWorkoutIndex();

  // Baseline standard values in case lists are empty
  const defaultDistances = availableDistances.length > 0 ? availableDistances : ["100m", "400m", "800m", "Mile", "3K", "5K", "10K", "Half Marathon", "Marathon"];
  const defaultLevels = availableLevels.length > 0 ? availableLevels : ["beginner", "intermediate", "advanced", "elite"];
  const defaultPhases = availablePhases.length > 0 ? availablePhases : ["Base", "Build", "Peak", "Taper", "Race"];
  const defaultSurfaces = availableSurfaces.length > 0 ? availableSurfaces : ["Track", "Road", "Trail", "Treadmill", "Any"];
  const defaultRisks = availableRisks.length > 0 ? availableRisks : ["low", "medium", "high", "very-high"];

  const handleSelectChange = (key: keyof WorkoutFiltersState, value: string) => {
    onChange({ [key]: value });
  };

  return (
    <div className="bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-slate-200 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF4E00]" /> Filter Criteria
        </span>
        <button
          onClick={onReset}
          className="text-[10px] font-mono text-[#6B7280] dark:text-slate-400 hover:text-[#FF4E00] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Library Module</label>
          <select
            value={filters.category}
            onChange={(e) => handleSelectChange("category", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Library Modules ({indexManifest.categories.length})</option>
            {indexManifest.categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Workout / Training Type Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Workout Type</label>
          <select
            value={filters.workoutType}
            onChange={(e) => handleSelectChange("workoutType", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Workout Types</option>
            {availableWorkoutTypes.filter(Boolean).map((t) => {
              const label = t.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
              return (
                <option key={t} value={t}>{label}</option>
              );
            })}
          </select>
        </div>

        {/* Target Distance Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Target Distance / Context</label>
          <select
            value={filters.targetDistance}
            onChange={(e) => handleSelectChange("targetDistance", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Distances</option>
            {defaultDistances.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Athlete Goal level */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Athlete Level</label>
          <select
            value={filters.level}
            onChange={(e) => handleSelectChange("level", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Levels</option>
            {defaultLevels.map((l) => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Training Phase */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Training Phase</label>
          <select
            value={filters.phase}
            onChange={(e) => handleSelectChange("phase", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Phases</option>
            {defaultPhases.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Run Surface */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Running Surface</label>
          <select
            value={filters.surface}
            onChange={(e) => handleSelectChange("surface", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Surfaces</option>
            {defaultSurfaces.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Point difficulty Category */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Difficulty Category</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleSelectChange("difficulty", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Hardness</option>
            <option value="1">Easy / Beginner (Pts 1-3)</option>
            <option value="2">Steady / Moderate (Pts 4-7)</option>
            <option value="3">Intense / Extreme (Pts 8-10)</option>
          </select>
        </div>

        {/* Safety risk profile */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Musculoskeletal Risk</label>
          <select
            value={filters.risk}
            onChange={(e) => handleSelectChange("risk", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Risk Profiles</option>
            {defaultRisks.map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Estimated Duration */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">Duration Zone</label>
          <select
            value={filters.duration}
            onChange={(e) => handleSelectChange("duration", e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm text-xs font-medium text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-[#FF4E00]"
          >
            <option value="All">All Durations</option>
            <option value="under-30">Quick (Under 30 min)</option>
            <option value="30-60">Medium (30 - 60 min)</option>
            <option value="over-60">Endurance (Over 60 min)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
