/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { formatWorkoutBlock, formatExerciseBlock } from "../../../lib/workouts";
import { 
  Sparkles, Clock, Dumbbell, Activity, Compass, Sliders, ShieldAlert, Scale, 
  FileText, Check, Layers, Layout, ChevronRight, Info, HelpCircle, Heart, Tag, AlertTriangle
} from "lucide-react";

// Get standard theme styling classes
export function getThemeClasses(theme: "light" | "dark" | "orange" | "mono") {
  switch (theme) {
    case "dark":
      return {
        card: "bg-slate-950 text-slate-100 border-slate-900",
        pill: "bg-slate-900 text-slate-350 border-slate-800",
        accentText: "text-sky-400",
        divider: "border-slate-800/85",
        innerBg: "bg-slate-900 border-slate-800/80",
        footerText: "text-slate-500",
        accentLabel: "text-sky-400",
        glow: "shadow-sky-950/10"
      };
    case "orange":
      return {
        card: "bg-orange-600 text-white border-orange-700",
        pill: "bg-orange-700/60 text-orange-100 border-orange-850",
        accentText: "text-yellow-300",
        divider: "border-orange-500/30",
        innerBg: "bg-orange-800/40 border-orange-800/80",
        footerText: "text-orange-150/80",
        accentLabel: "text-yellow-300",
        glow: "shadow-orange-950/20"
      };
    case "mono":
      return {
        card: "bg-white text-black border-4 border-double border-black font-mono",
        pill: "bg-black text-white border-black font-mono uppercase text-[9px]",
        accentText: "text-black underline font-bold",
        divider: "border-black border-t-2",
        innerBg: "bg-neutral-50 border-2 border-black",
        footerText: "text-black/80 font-mono",
        accentLabel: "text-black font-black uppercase",
        glow: "shadow-none"
      };
    case "light":
    default:
      return {
        card: "bg-white text-slate-900 border-slate-200/80 shadow-sm",
        pill: "bg-slate-50 text-slate-600 border-[#E2E8F0]",
        accentText: "text-blue-600",
        divider: "border-slate-100",
        innerBg: "bg-slate-50 border border-slate-200/50",
        footerText: "text-slate-400 font-mono",
        accentLabel: "text-blue-650 font-bold",
        glow: "shadow-md shadow-slate-100"
      };
  }
}

// Get standard aspect ratio styles
export function getRatioStyle(size: string) {
  switch (size) {
    case "story":
      return {
        width: "400px",
        height: "711px",
        padding: "p-6",
        fontSizeTitle: "text-xl",
        fontSizeBody: "text-xs",
        iconSize: "w-4 h-4",
        maxItems: 5,
        isVertical: true
      };
    case "wide":
      return {
        width: "640px",
        height: "360px",
        padding: "p-5",
        fontSizeTitle: "text-lg",
        fontSizeBody: "text-[11px]",
        iconSize: "w-3.5 h-3.5",
        maxItems: 3,
        isVertical: false
      };
    case "compact-4-5":
      return {
        width: "440px",
        height: "550px",
        padding: "p-6",
        fontSizeTitle: "text-lg",
        fontSizeBody: "text-xs",
        iconSize: "w-4 h-4",
        maxItems: 4,
        isVertical: true
      };
    case "a4-sheet":
      return {
        width: "500px",
        height: "707px",
        padding: "p-8",
        fontSizeTitle: "text-2xl",
        fontSizeBody: "text-xs",
        iconSize: "w-4 h-4",
        maxItems: 7,
        isVertical: true
      };
    case "square":
    default:
      return {
        width: "500px",
        height: "500px",
        padding: "p-6",
        fontSizeTitle: "text-xl",
        fontSizeBody: "text-xs",
        iconSize: "w-4 h-4",
        maxItems: 4,
        isVertical: true
      };
  }
}

// Incompatibility Warning Page
export function IncompatibleTemplateCard({ workout, template, expectedType, size, theme }: any) {
  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  
  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div className="my-auto flex flex-col items-center text-center p-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold font-display uppercase tracking-tight mb-2">
          Layout Misalignment
        </h3>
        <p className="text-xs opacity-80 leading-relaxed max-w-[280px]">
          The selected template <strong className="text-blue-500 font-bold">"{template}"</strong> is designed for {expectedType === "running" ? "Running Workouts" : "Support Routines"}.
        </p>
        <p className="text-[10px] opacity-60 mt-3 max-w-[240px]">
          Please choose a template from the list that matches the current entry.
        </p>
      </div>
      <div className="text-center text-[9px] font-mono opacity-40">
        Track.Vault Cohesion Engine
      </div>
    </div>
  );
}

// Brand Footer Helper Helper
function CardBrandFooter({ workout, colors, styles, showBrandFooter }: { workout: any; colors: any; styles: any; showBrandFooter?: boolean }) {
  if (showBrandFooter === false) return null;
  return (
    <div className={`mt-auto pt-3 border-t flex justify-between items-center ${colors.divider} ${colors.footerText}`}>
      <div className="flex flex-col text-left">
        <span className="text-[8px] font-mono uppercase tracking-wider leading-none">TRACK.VAULT ATHLETICS</span>
        <span className="text-[9px] font-bold font-mono tracking-tight mt-1">
          {workout.isCustom ? "CUSTOM LOCAL TEMPLATE" : "VERIFIED ATHLETE VAULT"}
        </span>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="text-[8px] font-mono uppercase tracking-wider leading-none">STATIC IMMUTABLE SYSTEM</span>
        <span className="text-[9px] font-bold block leading-none font-mono mt-1 text-[#0EA5E9]">
          ZERO AI recommendations
        </span>
      </div>
    </div>
  );
}

const isSupport = (workout: any) => {
  return workout?.entryType === "support-routine" || workout?.entryType === "custom-support-routine" || !!workout?.sessionStructure;
};

// -----------------------------------------------------
// 1. RUNNING WORKOUT TEMPLATES
// -----------------------------------------------------

export function RunningMinimalTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Minimal Workout Card" expectedType="running" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const mainSet = workout.mainSet || [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`text-[9px] font-mono tracking-widest uppercase block ${colors.footerText}`}>
              RUNNING WORKOUT // {workout.category?.replace("-", " ") || workout.primaryDistance || "INTERVALS"}
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mt-0.5">{workout.title}</h2>
          </div>
          <span className={`px-2 py-0.5 text-[8px] font-mono rounded border uppercase ${colors.pill}`}>
            DIFF {workout.difficulty || 5}/10
          </span>
        </div>

        <p className="text-xs italic opacity-95 mb-4 border-b pb-3 leading-relaxed border-current/10">
          "{workout.summary}"
        </p>

        <div className="space-y-3.5">
          {workout.warmup && workout.warmup.length > 0 && (
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase block opacity-60">WARM-UP</span>
              <p className="text-xs font-mono truncate font-medium mt-0.5">
                {workout.warmup.map(formatWorkoutBlock).join(" → ")}
              </p>
            </div>
          )}

          <div>
            <span className={`text-[9px] font-mono tracking-widest uppercase block font-bold ${colors.accentLabel}`}>
              TARGET WORKING INTERVALS
            </span>
            <div className={`p-3 rounded-lg border mt-1 ${colors.innerBg}`}>
              <ul className="space-y-1">
                {mainSet.slice(0, styles.maxItems).map((b: any, i: number) => (
                  <li key={i} className="text-xs font-mono font-medium flex items-center gap-1.5 leading-snug">
                    <span className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full shrink-0" />
                    <span>{formatWorkoutBlock(b)}</span>
                  </li>
                ))}
                {mainSet.length > styles.maxItems && (
                  <li className={`text-[10px] italic ${colors.footerText}`}>
                    + {mainSet.length - styles.maxItems} more blocks
                  </li>
                )}
              </ul>
            </div>
          </div>

          {workout.cooldown && workout.cooldown.length > 0 && styles.isVertical && (
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase block opacity-60">COOLDOWN</span>
              <p className="text-xs font-mono truncate mt-0.5">
                {workout.cooldown.map(formatWorkoutBlock).join(" → ")}
              </p>
            </div>
          )}
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function RunningIntervalTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Interval Session Card" expectedType="running" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const mainSet = workout.mainSet || [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className={`border-b-2 pb-2 mb-3 border-current/10`}>
          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest font-bold">
            <span>INTERVAL WORKOUT SERIES</span>
            <span>LEVEL - {workout.level?.toUpperCase()}</span>
          </div>
          <h2 className="text-xl font-bold font-display mt-1">{workout.title}</h2>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium leading-relaxed opacity-90">
            🚩 Objective: {workout.summary}
          </p>

          <div className={`p-4 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono tracking-wider font-bold text-amber-500 uppercase block mb-1.5">
              🏃 REPETITION PROFILE
            </span>
            <ul className="space-y-1.5">
              {mainSet.slice(0, styles.maxItems).map((b: any, i: number) => (
                <li key={i} className="text-xs font-mono font-semibold flex gap-2 items-center">
                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#0284c7] text-white">SET {i + 1}</span>
                  <span>{formatWorkoutBlock(b)}</span>
                </li>
              ))}
              {mainSet.length > styles.maxItems && (
                <li className={`text-[10px] italic ${colors.footerText}`}>
                  + {mainSet.length - styles.maxItems} more reps
                </li>
              )}
            </ul>
          </div>

          {workout.intensityGuide && styles.isVertical && (
            <div className="text-[11px] leading-snug p-2.5 rounded-lg border border-dotted border-current/20">
              <span className="font-bold block text-sky-505">Pacing / Effort Instructions:</span>
              <span>{workout.intensityGuide.mainSet || workout.intensityGuide.general || "Target anaerobic paces."}</span>
            </div>
          )}
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function RunningLongRunTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Long Run Card" expectedType="running" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const mainSet = workout.mainSet || [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10">
          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-emerald-500 font-bold uppercase">
            <span>AEROBIC ENDURANCE // MILEAGE DEVELOPMENT</span>
            <span>{workout.primaryDistance || "ROAD"} ROAD BASE</span>
          </div>
          <h2 className="text-xl font-extrabold mt-1">{workout.title}</h2>
        </div>

        <div className="space-y-4">
          <p className="text-xs italic opacity-95">{workout.summary}</p>

          <div className={`p-4 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono tracking-wide uppercase block text-emerald-500 font-bold mb-1.5">
              📋 ENDURANCE RUNNING SCHEDULE
            </span>
            <ul className="space-y-1.5 text-xs font-mono">
              {mainSet.slice(0, styles.maxItems).map((b: any, i: number) => (
                <li key={i} className="flex gap-2 items-start leading-snug font-medium">
                  <span>◽</span>
                  <span>{formatWorkoutBlock(b)}</span>
                </li>
              ))}
              {mainSet.length === 0 && (
                <li className="italic opacity-60">Steady state aerobic endurance mileage blocks</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function RunningRaceWeekTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Race Week Card" expectedType="running" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10">
          <span className="text-[9px] font-mono tracking-widest font-black uppercase text-red-500 block">
            RACE PREPARATION & TAPER
          </span>
          <h2 className="text-xl font-bold font-display mt-1 tracking-tight">{workout.title}</h2>
        </div>

        <div className="space-y-4 mt-3">
          <div className="p-3 bg-red-505/10 border-l-4 border-red-500 text-xs italic leading-relaxed">
            "{workout.summary}"
          </div>

          <div className={`p-3.5 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono tracking-wider font-bold block mb-1 uppercase text-red-500">
              ⚡ ACTIVE MAINTENANCE STRUCTURE
            </span>
            <ul className="space-y-1 text-xs font-mono">
              {(workout.mainSet || []).slice(0, styles.maxItems).map((b: any, i: number) => (
                <li key={i} className="flex items-center gap-1.5 leading-tight font-medium">
                  <span className="text-red-500">◆</span>
                  <span>{formatWorkoutBlock(b)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {styles.isVertical && workout.coachingNotes && workout.coachingNotes.length > 0 && (
            <div className="text-[11px] space-y-1">
              <span className="font-bold text-red-500 block font-mono uppercase text-[9px] tracking-wide">TAPER CUES:</span>
              <p className="opacity-90 italic">"{workout.coachingNotes[0]}"</p>
            </div>
          )}
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function RunningCoachSheetTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Coach Sheet Card" expectedType="running" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10 flex justify-between items-end">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-[#475569] font-black uppercase">COACHES DIRECTIVE SHEET</span>
            <h2 className="text-xl font-bold font-display mt-0.5">{workout.title}</h2>
          </div>
          <span className="text-[8px] font-mono text-slate-400">VAULT v1.2</span>
        </div>

        <div className="space-y-3">
          <div className="text-xs leading-snug">
            <span className="font-bold block text-sky-651 uppercase text-[9px] tracking-wider font-mono">PURPOSE</span>
            <p className="opacity-90 italic">"{workout.summary}"</p>
          </div>

          <div className={`p-3.5 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono uppercase tracking-widest font-black text-rose-500 block mb-1">PRESCRIPTION DETAILED</span>
            <ul className="space-y-1 text-xs">
              {(workout.mainSet || []).slice(0, Math.max(2, styles.maxItems - 1)).map((b: any, i: number) => (
                <li key={i} className="font-mono flex gap-2">
                  <span className="text-neutral-400 font-bold">{i + 1}.</span>
                  <span>{formatWorkoutBlock(b)}</span>
                </li>
              ))}
            </ul>
          </div>

          {styles.isVertical && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              {workout.coachingNotes && workout.coachingNotes.length > 0 && (
                <div className="text-[10px] leading-snug">
                  <span className="font-black text-[#475569] uppercase font-mono tracking-wider block text-[8px] mb-0.5">METABOLIC GUIDANCE</span>
                  <p className="opacity-80 line-clamp-3 font-medium">↳ {workout.coachingNotes[0]}</p>
                </div>
              )}
              {workout.commonMistakes && workout.commonMistakes.length > 0 && (
                <div className="text-[10px] leading-snug">
                  <span className="font-black text-rose-500 uppercase font-mono tracking-wider block text-[8px] mb-0.5">COMMON MISTAKES</span>
                  <p className="opacity-80 line-clamp-3 font-medium">↳ {workout.commonMistakes[0]}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

// -----------------------------------------------------
// 2. SUPPORT ROUTINE TEMPLATES
// -----------------------------------------------------

export function SupportRoutineTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (!isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Support Routine Card" expectedType="support" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const listArr = Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`text-[9px] font-mono tracking-widest uppercase block ${colors.footerText}`}>
              SUPPORT ROUTINE // {workout.supportCategoryLabel || "ANATOMICAL QUALITY"}
            </span>
            <h1 className="text-xl font-extrabold tracking-tight mt-0.5 leading-none">{workout.title}</h1>
          </div>
          <span className={`px-2 py-0.5 text-[8px] font-mono rounded border uppercase ${colors.pill}`}>
            DIFF {workout.difficulty || 4}/10
          </span>
        </div>

        <p className="text-xs italic opacity-95 leading-relaxed mb-4 border-b pb-3 border-current/10">
          "{workout.summary}"
        </p>

        <div className="space-y-4">
          <div>
            <span className={`text-[9px] font-mono tracking-widest uppercase block font-bold ${colors.accentLabel}`}>
              STRENGTH & STABILITY STATIONS
            </span>
            <div className={`p-4 rounded-xl border mt-1 ${colors.innerBg}`}>
              <ul className="space-y-1.5">
                {listArr.slice(0, styles.maxItems).map((ex: any, i: number) => (
                  <li key={i} className="text-xs font-mono font-medium flex items-center justify-between">
                    <span className="truncate max-w-[220px]">✓ {ex.name || ex}</span>
                    <span className="text-[10px] opacity-75 shrink-0 ml-1">
                      {ex.sets ? `${ex.sets}x${ex.reps || "held"}` : "Active"}
                    </span>
                  </li>
                ))}
                {listArr.length > styles.maxItems && (
                  <li className={`text-[10px] italic ${colors.footerText}`}>
                    + {listArr.length - styles.maxItems} more stations
                  </li>
                )}
                {listArr.length === 0 && (
                  <li className="italic text-xs font-mono">Active athletic tissue capacity drills.</li>
                )}
              </ul>
            </div>
          </div>

          {workout.equipment && workout.equipment.length > 0 && styles.isVertical && (
            <div className="text-[11px] p-2 rounded-lg border border-dotted border-current/15">
              <span className="font-bold text-sky-505 font-mono text-[9px] block uppercase tracking-wider">Required Gear:</span>
              <p className="opacity-90">{workout.equipment.join(", ")}</p>
            </div>
          )}
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function SupportWarmupTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (!isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Warm-up Flow Card" expectedType="support" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const listArr = Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10">
          <span className="text-[9px] font-mono tracking-widest font-black uppercase text-amber-500 block">
            PRE-RUN NEUROMUSCULAR ACTIVATION
          </span>
          <h2 className="text-xl font-bold font-display mt-0.5">{workout.title}</h2>
        </div>

        <div className="space-y-4">
          <div className="text-xs italic opacity-95">
            🎯 Focus: Prepare joints and activate neuromuscular firing patterns.
          </div>

          <div className={`p-4 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono tracking-wide uppercase block text-amber-500 font-bold mb-1.5">
              🏃 DYNAMIC PREPARATION LOOP
            </span>
            <ul className="space-y-1.5 text-xs font-mono">
              {listArr.slice(0, styles.maxItems).map((ex: any, i: number) => (
                <li key={i} className="flex justify-between items-center bg-white/5 p-1 rounded">
                  <span>◽ {ex.name || ex}</span>
                  <span className="text-[10px] opacity-85">
                    {ex.sets ? `${ex.sets} sets` : "Active"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function SupportCooldownTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (!isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Cooldown Flow Card" expectedType="support" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const listArr = Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10">
          <span className="text-[9px] font-mono tracking-widest font-black uppercase text-blue-500 block">
            POST-RUN COOLDOWN & TISSUE RESET
          </span>
          <h2 className="text-xl font-bold font-display mt-0.5">{workout.title}</h2>
        </div>

        <div className="space-y-4">
          <div className="text-xs italic opacity-95">
            🎯 Focus: Restore passive range of motion, reset tissue alignment.
          </div>

          <div className={`p-4 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono tracking-wide uppercase block text-blue-500 font-bold mb-1.5">
              🧘 PASSSIVE RELEASE STRETCHES
            </span>
            <ul className="space-y-1.5 text-xs font-mono font-medium">
              {listArr.slice(0, styles.maxItems).map((ex: any, i: number) => (
                <li key={i} className="flex justify-between items-center border-b border-current/5 pb-1">
                  <span>◽ {ex.name || ex}</span>
                  <span className="text-[10px] opacity-80 font-normal">
                    {ex.durationSeconds ? `${ex.durationSeconds}s hold` : ex.reps ? `${ex.reps} reps` : "held stretch"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function SupportStrengthTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (!isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Strength Routine Card" expectedType="support" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const listArr = Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10">
          <span className="text-[9px] font-mono tracking-widest font-black uppercase text-[#0EA5E9] block">
            ATHLETIC STRENGTH CAPACITY BUILDER
          </span>
          <h2 className="text-xl font-bold font-display mt-0.5">{workout.title}</h2>
        </div>

        <div className="space-y-3 mt-2">
          <div className="p-3 bg-sky-505/10 rounded-lg text-xs leading-relaxed opacity-95">
            💪 Objective: Build mechanical tissue resilience of primary stabilizers.
          </div>

          <div className={`p-4 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono tracking-wide uppercase block text-sky-505 font-bold mb-1.5">
              🏋 RESISTANCE STATION PLAN
            </span>
            <ul className="space-y-1.5 text-xs font-mono font-semibold">
              {listArr.slice(0, styles.maxItems).map((ex: any, i: number) => (
                <li key={i} className="flex justify-between items-center">
                  <span>⚡ {ex.name || ex}</span>
                  <span className="text-[10px] bg-[#0284c7] text-white px-1.5 py-0.5 rounded font-bold">
                    {ex.sets ? `${ex.sets}x${ex.reps || "10"}` : "Sets to failure"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function SupportMobilityTemplate({ workout, theme, size, showBrandFooter }: any) {
  if (!isSupport(workout)) {
    return <IncompatibleTemplateCard workout={workout} template="Mobility Routine Card" expectedType="support" size={size} theme={theme} />;
  }

  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const listArr = Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [];

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10">
          <span className="text-[9px] font-mono tracking-widest font-black uppercase text-teal-500 block">
            PROGRESSIVE JOINT RANGE OF MOTION
          </span>
          <h2 className="text-xl font-bold font-display mt-0.5">{workout.title}</h2>
        </div>

        <div className="space-y-3">
          <div className="text-xs italic leading-tight">
            🎯 Goal: Develop active articular mobility and connective tissue compliance.
          </div>

          <div className={`p-4 rounded-xl border ${colors.innerBg}`}>
            <span className="text-[9px] font-mono tracking-wide uppercase block text-teal-650 font-bold mb-1.5">
              🧘 CONNECTIVE COMPLIANCE DRILLS
            </span>
            <ul className="space-y-1.5 text-xs font-mono">
              {listArr.slice(0, styles.maxItems).map((ex: any, i: number) => (
                <li key={i} className="flex justify-between items-center border-b border-dashed border-current/10 pb-1">
                  <span>◽ {ex.name || ex}</span>
                  <span className="text-[10px] text-teal-500 font-bold font-mono">
                    {ex.durationSeconds ? `${ex.durationSeconds}s` : ex.sets ? `${ex.sets} sets` : "Target"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

// -----------------------------------------------------
// 3. UNIVERSAL SHARE TEMPLATES (ADAPTIVE DESIGN)
// -----------------------------------------------------

export function UniversalCompactSummaryTemplate({ workout, theme, size, showBrandFooter }: any) {
  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const supportMode = isSupport(workout);
  const itemsList = supportMode 
    ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [])
    : (workout.mainSet || []);

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <span className="text-[8px] font-mono tracking-widest uppercase opacity-60">
              {supportMode ? "ATHLETE SUPPORT ROUTINE" : "TRACK WORKOUT PROFILE"}
            </span>
            <h2 className="text-base font-bold truncate mt-0.5 uppercase tracking-tight">{workout.title}</h2>
          </div>
          <span className="text-[10px] font-mono font-bold shrink-0 text-[#0284c7] border border-[#0284c7]/20 px-1.5 py-0.5 rounded uppercase">
            {supportMode ? "Routine" : "Workout"}
          </span>
        </div>

        <p className="text-xs leading-relaxed italic opacity-95 my-2">"{workout.summary}"</p>

        <div className="p-3 bg-zinc-50 border border-slate-250/20 rounded-xl my-2 text-slate-800 text-[10px] space-y-1.5">
          <span className="font-bold text-[#0284c7] text-[8px] tracking-wider uppercase block font-mono">Quick Overview</span>
          <div className="flex justify-between font-mono">
            <span>Duration:</span>
            <span className="font-bold">{workout.estimatedDurationMin || workout.durationMin || 15} minutes</span>
          </div>
          {!supportMode && (
            <div className="flex justify-between font-mono">
              <span>Primary distance:</span>
              <span className="font-bold">{workout.primaryDistance || "N/A"}</span>
            </div>
          )}
          {supportMode && workout.equipment && workout.equipment.length > 0 && (
            <div className="flex justify-between font-mono">
              <span>Required Gear:</span>
              <span className="font-bold truncate max-w-[170px]">{workout.equipment[0]}</span>
            </div>
          )}
        </div>

        <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
      </div>
    </div>
  );
}

export function UniversalDetailedTrainingSheetTemplate({ workout, theme, size, showBrandFooter }: any) {
  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const supportMode = isSupport(workout);
  const items = supportMode 
    ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [])
    : (workout.mainSet || []);

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div>
        <div className="border-b pb-2 mb-3 border-current/10 flex justify-between items-baseline">
          <div>
            <span className="text-[8px] font-mono tracking-widest text-[#475569] font-black uppercase">ATHLETIC DEVELOPMENT DOSSIER</span>
            <h2 className="text-xl font-bold font-display tracking-tight leading-none mt-1">{workout.title}</h2>
          </div>
          <span className="text-[10px] font-bold text-[#0284c7] font-mono leading-none">TV.V12</span>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] leading-relaxed italic opacity-95">"{workout.summary}"</p>

          <div className={`p-3 rounded-lg border ${colors.innerBg}`}>
            <span className="text-[8px] font-mono font-black text-rose-500 uppercase tracking-widest block mb-1">
              {supportMode ? "REPS STATION CIRCUIT FLOW" : "MAIN WORKING PRESCRIPTION REPS"}
            </span>
            <ul className="space-y-1 text-[11px]">
              {items.slice(0, styles.maxItems).map((b: any, i: number) => (
                <li key={i} className="font-mono flex justify-between">
                  <span className="truncate max-w-[280px]">{i + 1}. {supportMode ? (b.name || b) : formatWorkoutBlock(b)}</span>
                  <span className="text-[9px] opacity-75 shrink-0">
                    {supportMode ? (b.sets ? `${b.sets}x${b.reps || "held"}` : "Active") : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {styles.isVertical && workout.coachingNotes && workout.coachingNotes.length > 0 && (
            <div className="text-[11px] space-y-1">
              <span className="font-bold text-[#475569] uppercase font-mono tracking-wider text-[8px] block">COACHING ADVISORY NOTES</span>
              <p className="opacity-90 leading-tight">↳ {workout.coachingNotes[0]}</p>
            </div>
          )}
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function UniversalStoryShareTemplate({ workout, theme, size, showBrandFooter }: any) {
  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const supportMode = isSupport(workout);

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-3xl border flex flex-col justify-between overflow-hidden shadow-2xl font-sans text-left ${colors.card} p-8`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex gap-2 items-center text-[10px] font-mono tracking-widest text-[#0EA5E9] uppercase font-bold mb-4">
          <Activity className="w-4 h-4" />
          <span>TrackVault Performance Log</span>
        </div>

        <h1 className="text-3xl font-black font-display tracking-tight leading-none mb-4 max-w-[300px]">
          {workout.title}
        </h1>

        <p className="text-sm italic leading-relaxed opacity-95 mb-10 max-w-[320px] font-medium">
          "{workout.summary}"
        </p>

        <div className={`p-5 rounded-2xl border ${colors.innerBg} space-y-4`}>
          <div className="flex justify-between items-center font-mono">
            <span className="text-[10px] text-slate-400">SESSION MODE:</span>
            <span className="text-[11px] font-bold text-[#0EA5E9] uppercase">
              {supportMode ? "Support Routine" : "Interval Running"}
            </span>
          </div>

          <div className="flex justify-between items-center font-mono">
            <span className="text-[10px] text-slate-400">EST DURATION:</span>
            <span className="text-[11px] font-bold">
              {workout.estimatedDurationMin || workout.durationMin || 15} MIN
            </span>
          </div>

          {!supportMode && (
            <div className="flex justify-between items-center font-mono">
              <span className="text-[10px] text-slate-400">TARGET SCALE:</span>
              <span className="text-[11px] font-bold uppercase">{workout.primaryDistance || "SPEED"}</span>
            </div>
          )}
          
          {supportMode && workout.equipment && workout.equipment.length > 0 && (
            <div className="flex justify-between items-start font-mono">
              <span className="text-[10px] text-slate-400">REQUIRED GEAR:</span>
              <span className="text-[11px] font-bold truncate max-w-[150px]">{workout.equipment.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}

export function UniversalSquareShareTemplate({ workout, theme, size, showBrandFooter }: any) {
  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const supportMode = isSupport(workout);

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex gap-2 items-center text-[9px] font-mono text-[#0284c7] uppercase font-bold">
          <span>RUNNING // PREP // RECOVERY // VAULT</span>
        </div>

        <div className="my-auto py-2">
          <h2 className="text-2xl font-extrabold font-display leading-tight tracking-tight uppercase max-w-[360px]">
            {workout.title}
          </h2>
          <p className="text-xs italic leading-relaxed opacity-95 mt-3 max-w-[380px]">
            "{workout.summary}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-b border-current/10 py-3 font-mono">
          <div>
            <span className="text-[8px] text-slate-400 uppercase block">Category / Type</span>
            <span className="text-[11px] font-bold uppercase mt-0.5 block truncate">
              {supportMode ? (workout.supportCategoryLabel || "Stability") : (workout.category || "Running")}
            </span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 uppercase block">Duration Assessment</span>
            <span className="text-[11px] font-bold uppercase mt-0.5 block">
              ~{workout.estimatedDurationMin || workout.durationMin || 15} MINS
            </span>
          </div>
        </div>

        <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
      </div>
    </div>
  );
}

export function UniversalWideCoachTemplate({ workout, theme, size, showBrandFooter }: any) {
  const styles = getRatioStyle(size);
  const colors = getThemeClasses(theme);
  const supportMode = isSupport(workout);
  const items = supportMode 
    ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [])
    : (workout.mainSet || []);

  return (
    <div
      id="export-card-node"
      style={{ width: styles.width, height: styles.height }}
      className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg font-sans ${colors.card} ${styles.padding}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-[8px] font-mono tracking-widest opacity-60 uppercase block">
            {supportMode ? "ATHLETICS COOLDOWN & CONDITIONING" : "METABOLIC STRATEGY & RUN PLAN"}
          </span>
          <h2 className="text-base font-bold truncate leading-tight uppercase font-display select-all">{workout.title}</h2>
          <p className="text-[11px] leading-snug italic opacity-95 my-1.5 line-clamp-2">"{workout.summary}"</p>

          {workout.coachingNotes && workout.coachingNotes.length > 0 && (
            <div className="text-[10px] text-slate-400 italic line-clamp-1 mt-2">
              ↳ Coach Remark: {workout.coachingNotes[0]}
            </div>
          )}
        </div>

        <div className={`w-[240px] shrink-0 p-3 rounded-xl border ${colors.innerBg}`}>
          <span className="text-[8px] font-mono tracking-widest font-black text-rose-500 uppercase block mb-1">
            WORKING SEQUENCE STATIONS
          </span>
          <ul className="space-y-1 text-[10px] font-mono">
            {items.slice(0, 3).map((ex: any, i: number) => (
              <li key={i} className="truncate">
                {i + 1}. {supportMode ? (ex.name || ex) : formatWorkoutBlock(ex)}
              </li>
            ))}
            {items.length > 3 && (
              <li className={`text-[9px] italic ${colors.footerText}`}>
                + {items.length - 3} more block presets
              </li>
            )}
          </ul>
        </div>
      </div>

      <CardBrandFooter workout={workout} colors={colors} styles={styles} showBrandFooter={showBrandFooter} />
    </div>
  );
}
