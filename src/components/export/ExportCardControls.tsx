/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import * as htmlToImage from "html-to-image";
import { Workout } from "../../types/workout";
import { Download, Layers, Layout, Palette, Check, AlertCircle } from "lucide-react";

interface ExportCardControlsProps {
  workout: Workout;
  template: string;
  setTemplate: (t: string) => void;
  theme: "light" | "dark" | "orange" | "mono";
  setTheme: (t: "light" | "dark" | "orange" | "mono") => void;
  size: "square" | "story" | "compact";
  setSize: (s: "square" | "story" | "compact") => void;
}

export function ExportCardControls({
  workout,
  template,
  setTemplate,
  theme,
  setTheme,
  size,
  setSize,
}: ExportCardControlsProps) {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleExport = async () => {
    const node = document.getElementById("export-card-node");
    if (!node) {
      setErrorMsg("Could not find card container. Please try again.");
      return;
    }

    setExporting(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      // In custom environments we wait a tiny bit for render settling
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `TrackVault_${workout.slug || "workout"}_card.png`;
      link.href = dataUrl;
      link.click();
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("PNG card export failed:", error);
      setErrorMsg("Failed to export card image. Note that strict iframe security in some previews may block automatic image generation. Use standard clipboard export as a secure fallback!");
    } finally {
      setExporting(false);
    }
  };

  const templatesList = [
    { id: "minimal", name: "Minimalist Grid" },
    { id: "coach", name: "Coaches Sheet" },
    { id: "track", name: "Track Specialist" },
    { id: "longrun", name: "Endurance Base" },
    { id: "raceweek", name: "Race Week Taper" },
  ];

  const sizesList = [
    { id: "square", name: "Square 1:1", desc: "Feed Posts (1080x1080)" },
    { id: "story", name: "Story 9:16", desc: "Mobile Screen (1080x1920)" },
    { id: "compact", name: "Compact 16:9", desc: "Shared Banner (1200x675)" },
  ];

  const themesList = [
    { id: "light", name: "Slate Light", bg: "bg-white border-slate-200" },
    { id: "dark", name: "Carbon Dark", bg: "bg-slate-950 border-slate-800 text-white" },
    { id: "orange", name: "Track Orange", bg: "bg-amber-500 border-amber-600 text-white" },
    { id: "mono", name: "Swiss Mono", bg: "bg-neutral-100 border-black border text-black font-mono text-xs" },
  ];

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-6 space-y-6">
      {/* Template Selector */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layout className="w-4 h-4 text-sky-500" /> Choose Card Layout
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {templatesList.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all border flex items-center justify-between cursor-pointer ${
                template === t.id
                  ? "bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/20 dark:border-sky-500/30 dark:text-sky-405"
                  : "bg-slate-50 border-transparent dark:bg-slate-800/40 text-slate-755 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{t.name}</span>
              {template === t.id && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Select Color Style */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Palette className="w-4 h-4 text-sky-500" /> Color Aesthetics
        </label>
        <div className="grid grid-cols-2 gap-2">
          {themesList.map((th) => (
            <button
              key={th.id}
              onClick={() => setTheme(th.id as any)}
              className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                theme === th.id
                  ? "ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900 border-transparent shadow-sm"
                  : "border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${th.bg} flex-shrink-0`} />
              <span>{th.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio Sizers */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-500" /> Card Shape & Ratio
        </label>
        <div className="space-y-2">
          {sizesList.map((sz) => (
            <button
              key={sz.id}
              onClick={() => setSize(sz.id as any)}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                size === sz.id
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-805 dark:border-slate-700 font-bold"
                  : "bg-slate-50 border-transparent dark:bg-slate-800/40 text-slate-705 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold">{sz.name}</span>
                <span className="text-[10px] opacity-75">{sz.desc}</span>
              </div>
              {size === sz.id && <Check className="w-4 h-4 text-sky-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Action Trigger */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-sky-500/10 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white transition-all transform active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Card...</span>
            </>
          ) : success ? (
            <>
              <Check className="w-4 h-4" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PNG Card</span>
            </>
          )}
        </button>

        {errorMsg && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium leading-relaxed text-amber-800 dark:text-amber-300">
              {errorMsg}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
