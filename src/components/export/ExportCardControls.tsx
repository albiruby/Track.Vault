/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import * as htmlToImage from "html-to-image";
import { Workout } from "../../types/workout";
import { formatWorkoutForClipboard } from "../../lib/workouts";
import { copyToClipboard } from "../../lib/clipboard";
import { 
  Download, Layers, Layout, Palette, Check, AlertCircle, Copy, 
  ToggleLeft, ToggleRight, FileText, Smartphone, Square, Presentation, Eye
} from "lucide-react";

interface ExportCardControlsProps {
  workout: Workout;
  template: string;
  setTemplate: (t: string) => void;
  theme: "light" | "dark" | "orange" | "mono";
  setTheme: (t: "light" | "dark" | "orange" | "mono") => void;
  size: "square" | "story" | "compact" | "wide" | "compact-4-5" | "a4-sheet";
  setSize: (s: "square" | "story" | "compact" | "wide" | "compact-4-5" | "a4-sheet") => void;
  showBrandFooter: boolean;
  setShowBrandFooter: (show: boolean) => void;
}

export function ExportCardControls({
  workout,
  template,
  setTemplate,
  theme,
  setTheme,
  size,
  setSize,
  showBrandFooter,
  setShowBrandFooter,
}: ExportCardControlsProps) {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // State for tracking copy status of each format
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const isSupportEntry = workout?.entryType === "support-routine" || (workout as any).supportCategoryId !== undefined || !!(workout as any).sessionStructure;

  const handleExport = async () => {
    const node = document.getElementById("export-card-node");
    if (!node) {
      setErrorMsg("Could not find the card canvas node in DOM. Please try again.");
      return;
    }

    setExporting(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      // Small pause for rendering engine stabilization
      await new Promise((resolve) => setTimeout(resolve, 350));
      
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `TrackVault_${workout.title?.replace(/\s+/g, "_") || "session"}_card.png`;
      link.href = dataUrl;
      link.click();
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Card Image generation failed:", error);
      setErrorMsg("PNG export failed. Note that some isolated preview iframe browsers block Canvas operations. Standard clipboard copy presets below remain fully operational!");
    } finally {
      setExporting(false);
    }
  };

  const handleCopyPreset = async (formatKey: "compact" | "coach-notes" | "structured-markdown" | "whatsapp-telegram" | "training-log") => {
    const text = formatWorkoutForClipboard(workout, formatKey);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedFormat(formatKey);
      setTimeout(() => setCopiedFormat(null), 2500);
    } else {
      setErrorMsg("Failed to copy clipboard data. Please copy manually.");
    }
  };

  // 15 Mapped Templates Category
  const runningTemplates = [
    { id: "minimal", name: "Minimalist Session" },
    { id: "interval", name: "Interval Repeats" },
    { id: "longrun", name: "Endurance Base" },
    { id: "raceweek", name: "Race Week Taper" },
    { id: "coach", name: "Coaches Sheet" },
  ];

  const supportTemplates = [
    { id: "support", name: "Support Anatomical" },
    { id: "warmup", name: "Pre-Run Activation" },
    { id: "cooldown", name: "Cooldown Reset" },
    { id: "strength", name: "Resilience Strength" },
    { id: "mobility", name: "Active Mobility" },
  ];

  const universalTemplates = [
    { id: "compact-summary", name: "Compact Bento Summary" },
    { id: "training-sheet", name: "Detailed Training Sheet" },
    { id: "story-share", name: "IG Story Share" },
    { id: "square-share", name: "Feed Post Square" },
    { id: "wide-coach", name: "Coach Wide Landscape" },
  ];

  // Aspect Ratios List
  const sizesList = [
    { id: "square", name: "Square 1:1", desc: "Equal aspect posts (500x500)" },
    { id: "story", name: "Story 9:16", desc: "Full Mobile layout (400x711)" },
    { id: "wide", name: "Wide 16:9", desc: "Landscape Banner (640x360)" },
    { id: "compact-4-5", name: "Compact 4:5", desc: "Medium feed ratio (440x550)" },
    { id: "a4-sheet", name: "Coach Sheet A4", desc: "Extended document ratio (500x707)" },
  ] as const;

  // Theme palettes List
  const themesList = [
    { id: "light", name: "Slate Light", bg: "bg-white border-slate-250" },
    { id: "dark", name: "Carbon Dark", bg: "bg-slate-900 border-slate-800 text-white" },
    { id: "orange", name: "Track Orange", bg: "bg-orange-600 border-orange-700 text-white" },
    { id: "mono", name: "Swiss Mono", bg: "bg-neutral-50 border-double border-4 border-black text-black font-mono text-[9px]" },
  ] as const;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 space-y-6">
      
      {/* 1. Template Layout categories */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layout className="w-4 h-4 text-blue-650" /> Choose Card Layout
        </label>

        {/* Running Templates */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold font-mono tracking-wide text-slate-400 block ml-0.5">
            RUNNING WORKOUT LAYOUTS {isSupportEntry && "🔒 (RUN ONLY)"}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {runningTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                disabled={isSupportEntry}
                className={`px-3 py-2 rounded-xl text-left text-xs font-semibold cursor-pointer border flex justify-between items-center transition-all ${
                  isSupportEntry 
                    ? "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed opacity-50"
                    : template === t.id
                      ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                      : "bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{t.name}</span>
                {template === t.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Support Templates */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold font-mono tracking-wide text-slate-400 block ml-0.5">
            SUPPORT ROUTINE LAYOUTS {!isSupportEntry && "🔒 (SUPPORT ONLY)"}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {supportTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                disabled={!isSupportEntry}
                className={`px-3 py-2 rounded-xl text-left text-xs font-semibold cursor-pointer border flex justify-between items-center transition-all ${
                  !isSupportEntry 
                    ? "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed opacity-50"
                    : template === t.id
                      ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                      : "bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{t.name}</span>
                {template === t.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Universal Templates */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold font-mono tracking-wide text-slate-400 block ml-0.5">
            UNIVERSAL LAYOUTS (ANY ENTRY TYPE)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {universalTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-2 rounded-xl text-left text-xs font-semibold cursor-pointer border flex justify-between items-center transition-all ${
                  template === t.id
                    ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                    : "bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{t.name}</span>
                {template === t.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Color Palettes */}
      <div className="space-y-3 pt-1">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-650" /> Display Aesthetics
        </label>
        <div className="grid grid-cols-2 gap-2">
          {themesList.map((th) => (
            <button
              key={th.id}
              onClick={() => setTheme(th.id as any)}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                theme === th.id
                  ? "ring-2 ring-blue-550 ring-offset-1 border-transparent shadow"
                  : "border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full ${th.bg} shrink-0`} />
              <span>{th.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Aspect Ratios */}
      <div className="space-y-3 pt-1">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-650" /> Card Shape & Ratio
        </label>
        <div className="space-y-1.5">
          {sizesList.map((sz) => (
            <button
              key={sz.id}
              onClick={() => setSize(sz.id as any)}
              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                size === sz.id
                  ? "bg-slate-900 border-slate-900 text-white font-bold"
                  : "bg-slate-50 border-transparent hover:bg-slate-100 text-slate-800"
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold">{sz.name}</span>
                <span className="text-[9px] opacity-75">{sz.desc}</span>
              </div>
              {size === sz.id && <Check className="w-4 h-4 text-[#0EA5E9]" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Brand Stamp Toggle */}
      <div className="pt-2 flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-sky-550" /> Trust Stamp Footer
          </span>
          <span className="text-[9px] text-[#64748B] font-medium leading-none">
            Include immutable source label
          </span>
        </div>
        <button
          onClick={() => setShowBrandFooter(!showBrandFooter)}
          className="text-slate-500 hover:text-blue-600 transition-colors shrink-0 cursor-pointer"
        >
          {showBrandFooter ? (
            <ToggleRight className="w-9 h-9 text-blue-600" />
          ) : (
            <ToggleLeft className="w-9 h-9 text-slate-300" />
          )}
        </button>
      </div>

      {/* 5. Downloads Actions */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all transform active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Rendering Card PNG...</span>
            </>
          ) : success ? (
            <>
              <Check className="w-4 h-4" />
              <span>Downloaded Card File!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PNG Card</span>
            </>
          )}
        </button>

        {errorMsg && (
          <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-semibold text-amber-800 leading-relaxed">
              {errorMsg}
            </p>
          </div>
        )}
      </div>

      {/* 6. Copy clipboard format presets */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Copy className="w-4 h-4 text-blue-650" /> Copy Text Format Presets
        </label>
        
        <div className="space-y-1.5 pb-1">
          <button
            onClick={() => handleCopyPreset("compact")}
            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2"><Smartphone className="w-3.5 h-3.5 text-slate-400" /> Compact Log Txt</span>
            <span className="text-[10px] text-slate-400">{copiedFormat === "compact" ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={() => handleCopyPreset("coach-notes")}
            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-slate-400" /> Coach Formal Notes</span>
            <span className="text-[10px] text-slate-400">{copiedFormat === "coach-notes" ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={() => handleCopyPreset("structured-markdown")}
            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2"><Layout className="w-3.5 h-3.5 text-slate-400" /> Structured MD Text</span>
            <span className="text-[10px] text-slate-400">{copiedFormat === "structured-markdown" ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={() => handleCopyPreset("whatsapp-telegram")}
            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2"><Smartphone className="w-3.5 h-3.5 text-[#25D366]" /> Messenger Emoji Text</span>
            <span className="text-[10px] text-slate-400">{copiedFormat === "whatsapp-telegram" ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={() => handleCopyPreset("training-log")}
            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2"><Presentation className="w-3.5 h-3.5 text-slate-400" /> Training Log Entry</span>
            <span className="text-[10px] text-slate-400">{copiedFormat === "training-log" ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
