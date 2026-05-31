/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout, IntensityGuide } from "../../types/workout";
import { getWorkoutIndex } from "../../lib/workouts";
import { Activity, ShieldAlert, Award, Grid3X3 } from "lucide-react";

interface WorkoutBasicInfoFormProps {
  workout: Partial<Workout>;
  onChange: (updatedFields: Partial<Workout>) => void;
  intensityGuide: IntensityGuide;
  onIntensityGuideChange: (g: IntensityGuide) => void;
}

export function WorkoutBasicInfoForm({
  workout,
  onChange,
  intensityGuide,
  onIntensityGuideChange,
}: WorkoutBasicInfoFormProps) {
  const indexes = getWorkoutIndex();

  const handleFieldChange = (key: keyof Workout, value: any) => {
    onChange({ [key]: value });
  };

  const handleIntensityFieldChange = (key: keyof IntensityGuide, value: string) => {
    onIntensityGuideChange({
      ...intensityGuide,
      [key]: value,
    });
  };

  const defaultSurfaces = ["Track", "Road", "Trail", "Treadmill", "Any"];
  const defaultPhases = ["Base", "Build", "Peak", "Taper", "Race"];
  const defaultLevels = ["beginner", "intermediate", "advanced", "elite"];

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-mono font-black uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FF4E00]" /> Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Workout Title *</label>
            <input
              type="text"
              required
              value={workout.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="e.g., Lactate Clearance Threshold Ladder"
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Short Card Title *</label>
            <input
              type="text"
              required
              value={workout.shortTitle || ""}
              onChange={(e) => handleFieldChange("shortTitle", e.target.value)}
              placeholder="e.g., Threshold Ladder"
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Session Summary / Purpose *</label>
            <textarea
              required
              rows={2}
              value={workout.summary || ""}
              onChange={(e) => handleFieldChange("summary", e.target.value)}
              placeholder="Explain the physiological focus, target paces, or why this layout builds power..."
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>
        </div>
      </div>

      {/* Target Metric Configurations */}
      <div className="bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-mono font-black uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FF4E00]" /> Profiling & Distances
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Primary Distance *</label>
            <input
              type="text"
              required
              value={workout.primaryDistance || ""}
              onChange={(e) => handleFieldChange("primaryDistance", e.target.value)}
              placeholder="e.g., 5K, 10K, Marathon"
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Target Categories (Comma Separated)</label>
            <input
              type="text"
              value={workout.targetDistances?.join(", ") || ""}
              onChange={(e) => {
                const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                handleFieldChange("targetDistances", arr);
              }}
              placeholder="5K, 10K, Half-Marathon"
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Library Category Module *</label>
            <select
              value={workout.category || ""}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#374151] dark:text-slate-200 focus:outline-none font-sans font-medium"
            >
              <option value="">Select a Category</option>
              {indexes.categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Athlete Target Level *</label>
            <select
              value={workout.level || "intermediate"}
              onChange={(e) => handleFieldChange("level", e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#374151] dark:text-slate-200 focus:outline-none font-sans font-medium"
            >
              {defaultLevels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Training Phase</label>
            <select
              value={workout.phase || "Build"}
              onChange={(e) => handleFieldChange("phase", e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#374151] dark:text-slate-200 focus:outline-none font-sans font-medium"
            >
              {defaultPhases.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Running Surface</label>
            <select
              value={workout.surface || "Road"}
              onChange={(e) => handleFieldChange("surface", e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#374151] dark:text-slate-200 focus:outline-none font-sans font-medium"
            >
              {defaultSurfaces.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Core Difficulty (1-10 Slider) *</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={workout.difficulty || 5}
                onChange={(e) => handleFieldChange("difficulty", parseInt(e.target.value, 10))}
                className="flex-1 accent-[#FF4E00] select-none"
              />
              <span className="w-8 text-right font-mono text-sm font-black text-[#FF4E00]">
                {workout.difficulty || 5}/10
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Est. Total Duration (mins) *</label>
            <input
              type="number"
              min="5"
              required
              value={workout.estimatedDurationMin || ""}
              onChange={(e) => handleFieldChange("estimatedDurationMin", parseInt(e.target.value, 10) || 0)}
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Est. Total Distance (km) *</label>
            <input
              type="number"
              step="0.1"
              required
              value={workout.estimatedDistanceKm || ""}
              onChange={(e) => handleFieldChange("estimatedDistanceKm", parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>
        </div>
      </div>

      {/* Safety details */}
      <div className="bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-mono font-black uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FF4E00]" /> Musculoskeletal Risk Assessment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Injury Risk Tier</label>
            <select
              value={workout.risk || "medium"}
              onChange={(e) => handleFieldChange("risk", e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#374151] dark:text-slate-200 focus:outline-none font-sans font-medium"
            >
              <option value="low">Low Risk (Conversational base pacing)</option>
              <option value="medium">Medium Risk (Basic threshold/fartleks)</option>
              <option value="high">High Risk (VO2 max intervals, hills, high lactic spikes)</option>
              <option value="very-high">Very High Risk (Track sprints, repeated anaerobic capacity)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Why are we flagged at this tier?</label>
            <input
              type="text"
              value={workout.riskReason || ""}
              onChange={(e) => handleFieldChange("riskReason", e.target.value)}
              placeholder="e.g. Extreme anaerobic demand on hamstrings"
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm text-[#111827] dark:text-[#F8FAFC] focus:outline-none font-sans font-medium"
            />
          </div>
        </div>
      </div>

      {/* Intensity Guides */}
      <div className="bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-mono font-black uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-[#FF4E00]" /> Intended Intensity Target Rules
        </h3>
        <p className="text-xs text-[#4B5563] dark:text-slate-400 font-medium leading-normal">
          Guide the runner on how to execute their effort zones. Describe pace targets in detail.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Main Set Target Intensity</label>
            <input
              type="text"
              value={intensityGuide.mainSet || ""}
              onChange={(e) => handleIntensityFieldChange("mainSet", e.target.value)}
              placeholder="e.g. Goal 5K pace or RPE 8/10"
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm focus:outline-none font-sans font-medium text-[#111827] dark:text-[#F8FAFC]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Warm-up / Cooldown Intensity</label>
            <input
              type="text"
              value={intensityGuide.warmup || ""}
              onChange={(e) => handleIntensityFieldChange("warmup", e.target.value)}
              placeholder="e.g. Easy conversational, recovery jogs below 65% HR"
              className="w-full p-2.5 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] text-sm rounded-sm focus:outline-none font-sans font-medium text-[#111827] dark:text-[#F8FAFC]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
