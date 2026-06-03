/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout } from "../../types/workout";
import { TrackVaultIcon } from "../icons/trackVaultIcons";
import { trackVaultNavigation } from "../../data/workouts/trackVaultNavigation.v1.2";
import { 
  Zap, 
  BookOpen, 
  PlusCircle, 
  Share2, 
  Lock, 
  Layers, 
  Activity, 
  Compass, 
  Info, 
  ChevronRight, 
  Dumbbell, 
  Undo, 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  Clock, 
  Eye, 
  TrendingUp, 
  ExternalLink 
} from "lucide-react";

interface DashboardPanelsProps {
  staticWorkouts: Workout[];
  localWorkoutsList: Workout[];
  onNavigate: (route: string) => void;
  onSelectCategory: (categoryName: string) => void;
}

// Helper to calculate workouts category counts dynamically from real static database
function getCategoryCountMap(workouts: Workout[]): Record<string, number> {
  const counts: Record<string, number> = {};
  workouts.forEach(w => {
    // Normalization to locate categories precisely
    const cat = (w.entryType === "support-routine" ? w.supportCategoryId : w.distanceNavId) || "general";
    const norm = cat.trim().toLowerCase();
    counts[norm] = (counts[norm] || 0) + 1;
  });
  return counts;
}

export function UpcomingFacetedGrid() {
  return null;
}

/**
 * A. UPGRADED HERO SECTION
 * Concise title/description alongside a technical library composition panel.
 */
export function DashboardHero({ staticWorkouts, localWorkoutsList, onNavigate }: DashboardPanelsProps) {
  const runningCount = staticWorkouts.filter(w => w.entryType !== "support-routine").length;
  const supportCount = staticWorkouts.filter(w => w.entryType === "support-routine").length;
  const total = runningCount + supportCount;
  
  const hScaleRunning = total > 0 ? Math.round((runningCount / total) * 100) : 60;
  const hScaleSupport = 100 - hScaleRunning;

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center justify-between shadow-sm relative overflow-hidden min-h-[220px]">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 z-0" />
      
      <div className="space-y-4 z-10 lg:max-w-xl flex-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[10px] font-bold uppercase tracking-wider font-mono">
          <Sparkles className="w-3 h-3 text-blue-500" />
          Active Release v1.2
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-normal pt-2 pb-1 text-slate-900 uppercase font-display">
          Track.Vault Workout Library
        </h1>
        
        <p className="text-sm text-slate-500 leading-relaxed max-w-lg font-medium">
          A client-side sandboxed running workout vault to browse athletic presets, assemble custom intervals in our live builder, save local backups, and generate high-contrast cards.
        </p>

        <div className="flex flex-wrap gap-3 pt-3">
          <button 
            onClick={() => onNavigate("library")}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> Browse Library
          </button>
          <button 
            onClick={() => onNavigate("builder")}
            className="px-5 py-3 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" /> Open Builder
          </button>
        </div>
      </div>

      {/* Structured Composition Index Panel (Zero-gimmick visual overview) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 lg:w-[360px] w-full shrink-0 font-mono z-10 flex flex-col justify-between self-stretch">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Core Library Balance</span>
            <span className="text-blue-600">Static Dataset</span>
          </div>
          
          <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
            <div 
              style={{ width: `${hScaleRunning}%` }} 
              className="bg-blue-600 flex items-center px-1.5 text-[8px] text-white font-bold" 
              title={`${runningCount} Running Workouts`}
            >
              RUNNING ({hScaleRunning}%)
            </div>
            <div 
              style={{ width: `${hScaleSupport}%` }} 
              className="bg-slate-700 flex items-center justify-end px-1.5 text-[8px] text-white font-bold" 
              title={`${supportCount} Support Routines`}
            >
              SUPPORT ({hScaleSupport}%)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-200/60 text-xs">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Capacity</span>
            <span className="text-sm font-black text-slate-800 block mt-0.5">{total} Presets</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Version</span>
            <span className="text-sm font-black text-slate-800 block mt-0.5">Static.v1.2</span>
          </div>
        </div>

        <div className="text-[9px] text-slate-400 flex items-center gap-1.5 mt-4 leading-normal bg-slate-100 p-2.5 rounded-xl border border-slate-200/50">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          No external server, API, tracking pixels, or physiological gimmick states. Zero lag.
        </div>
      </div>
    </div>
  );
}

/**
 * B. REDESIGNED STATS CARDS (VARIABLE CARD SYSTEM)
 * Variable size structural cards showing premium athletic summaries.
 */
export function DashboardSummaryGrid({ staticWorkouts, localWorkoutsList, onNavigate }: DashboardPanelsProps) {
  const runningCount = staticWorkouts.filter(w => w.entryType !== "support-routine").length;
  const supportCount = staticWorkouts.filter(w => w.entryType === "support-routine").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 w-full font-mono">
      
      {/* CARD 1: Large Core Metric - Hero Total Volume (Col Span 5) */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between md:col-span-1 lg:col-span-5 hover:border-slate-350 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-450 uppercase text-[9px] font-bold">
            Frozen Index
          </span>
        </div>
        
        <div className="space-y-2 mt-2">
          <span className="text-4xl font-black text-slate-900 tracking-tight block">
            {staticWorkouts.length}
          </span>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter">
            Total Curated Reference Presets
          </h4>
          <p className="text-[11px] text-slate-450 font-sans tracking-normal leading-relaxed mt-1">
            Complete set of athletic exercises, workouts, and rehabilitation protocols. Tested on track surfaces to guarantee high accuracy.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-5 text-[9px] text-[#64748B] font-bold uppercase leading-none">
          <div className="flex flex-col gap-1">
            <span className="text-slate-450 text-[8px]">SPRINTS</span>
            <span className="text-slate-800 font-black">150 Presets</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-slate-100 pl-2">
            <span className="text-slate-450 text-[8px]">ENDURANCE</span>
            <span className="text-slate-800 font-black">450 Presets</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-slate-100 pl-2">
            <span className="text-slate-450 text-[8px]">STRENGTH</span>
            <span className="text-slate-800 font-black">350 Presets</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Large Core Metric - Balance & Allocation (Col Span 4) */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between md:col-span-1 lg:col-span-4 hover:border-slate-350 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] text-emerald-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[9px] uppercase font-bold text-slate-400">Ratio status</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              {runningCount}:{supportCount}
            </span>
            <span className="text-xs font-bold text-emerald-600">(Optimal)</span>
          </div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter leading-none">
            Speed vs Support Allocation
          </h4>
          
          <div className="bg-slate-50 p-2.5 border border-slate-150 rounded-xl space-y-1.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-450">Track Speed Volume:</span>
              <span className="text-slate-800 font-bold">{runningCount} Workouts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450">Anatomical Prep:</span>
              <span className="text-slate-800 font-bold">{supportCount} Routines</span>
            </div>
          </div>
        </div>

        <div className="text-[8.5px] text-slate-400 font-sans tracking-normal leading-relaxed border-t border-slate-100 pt-3 mt-4">
          Perfect synergy. Combine high-intensity runs with core activation to mitigate joint stress and micro-impact.
        </div>
      </div>

      {/* CARD 3: Medium Metric - Local Saves Status (Col Span 3) */}
      <div 
        onClick={() => onNavigate("saved")}
        className="bg-white border border-[#E2E8F0] hover:border-blue-500 rounded-3xl p-6 shadow-sm flex flex-col justify-between md:col-span-1 lg:col-span-3 cursor-pointer group transition-all"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-lg select-none">
            ★
          </div>
          <span className="text-[9px] font-black text-blue-600 uppercase">
            Saves View
          </span>
        </div>

        <div className="space-y-1 mt-1">
          <span className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
            {localWorkoutsList.length}
          </span>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter">
            Local Program Clips
          </h4>
          <p className="text-[10px] text-slate-450 leading-relaxed font-sans mt-1">
            Custom designed intervals stored securely inside browser local cache.
          </p>
        </div>

        <div className="text-[10px] text-blue-600 font-black uppercase flex items-center gap-1.5 mt-4 group-hover:translate-x-1.5 transition-transform">
          Manage saved <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* CARD 4: Wide Metric - Card Exporter Preview Panel (Col Span 7) */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm lg:col-span-7 md:col-span-2 flex flex-col sm:flex-row gap-6 justify-between items-stretch hover:border-slate-350 transition-all">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-[#EA580C] uppercase">
                Card Exporter System
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Export Curated High-Res Cards
            </h3>
            <p className="text-[11px] text-slate-500 font-sans tracking-normal leading-relaxed mt-2.5">
              Instantly lock and draw workouts as high-resolution typography cards. Features 6 distinctive design layouts (Coach, Long Run, Minimal, Race Week, Track, Mono) optimized for sharing, printers, or phone caches.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-4 text-[9px] font-bold text-[#64748B] uppercase">
            <span>✅ Custom Colors</span>
            <span>✅ Custom Notes</span>
            <span>✅ Multi-Theme Support</span>
          </div>
        </div>

        {/* Non-gimmick visual overview vector mimic */}
        <div className="w-full sm:w-[200px] bg-slate-50 border border-slate-150/90 rounded-2xl p-4 flex flex-col justify-between shrink-0 font-mono text-[9px] relative overflow-hidden select-none">
          <div className="space-y-2">
            <span className="text-[8px] uppercase text-slate-400 font-bold block">Preset Preview Drawing</span>
            <div className="h-5 w-full bg-slate-800 text-white flex items-center justify-between px-2 rounded-md font-sans text-[8px] font-bold uppercase tracking-widest leading-none">
              <span>Track.Vault</span>
              <span className="text-orange-500">Card</span>
            </div>
          </div>

          <div className="space-y-1.5 py-4">
            <div className="flex justify-between text-slate-400">
              <span>WARM:</span>
              <span className="text-slate-800 font-bold">1200m Easy</span>
            </div>
            <div className="h-1 bg-orange-500 w-full rounded" />
            <div className="flex justify-between text-slate-400">
              <span>MAIN:</span>
              <span className="text-[#EA580C] font-bold">5x1000m @ Hard</span>
            </div>
          </div>

          <div className="h-4 w-full bg-slate-200 text-slate-550 flex items-center justify-center rounded uppercase text-[7.5px] font-bold">
            🔒 High resolution lock
          </div>
        </div>
      </div>

      {/* CARD 5: Compact Metric - Security & Architecture (Col Span 5) */}
      <div className="bg-slate-900 border border-slate-950 text-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between md:col-span-1 lg:col-span-5 hover:bg-slate-950 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-emerald-400 uppercase text-[9px] font-bold">
            Sandboxed
          </span>
        </div>

        <div className="space-y-1.5 mt-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Privacy First Architecture
          </h4>
          <span className="text-xl font-black text-white block">
            Offline & Local Storage
          </span>
          <p className="text-[11px] text-slate-400 font-sans tracking-normal leading-relaxed mt-1">
            Zero external tracking databases, zero telemetry loops, no cloud-sync profiles, and zero AI processing. Your edits, modifications, and exports live exclusively in your local sandbox.
          </p>
        </div>

        <div className="pt-3 mt-4 border-t border-white/10 text-[9px] text-[#A1A1AA] uppercase flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          100% compliant with standard decentralized web protocols.
        </div>
      </div>

    </div>
  );
}

/**
 * C. VARIABLE CARD SYSTEM & FEATURED CATEGORIES
 * Clean groups structured elegantly with customized featured / compact tiles.
 */
interface CategoryMetadata {
  id: string;
  name: string;
  description: string;
}

interface GroupDisplay {
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  categoryIds: string[];
}

/**
 * Layout preset helper to eliminate any unaligned, off-row, blank spaces or orphaned cards in any category group.
 * Strictly implements rules for 2-card, 3-card, 4-card, 5-card, and 6+ card groups, preserving balanced visual rhythm.
 */
function getCoverageLayoutPreset(
  associatedCategories: any[],
  group: GroupDisplay,
  featuredIds: string[]
): { gridClass: string; getSpanClass: (catId: string) => string } {
  const count = associatedCategories.length;
  const badge = group.badge;

  // Count how many are featured
  const featuredInGroup = associatedCategories.filter(cat => featuredIds.includes(cat.id));
  const featuredCount = featuredInGroup.length;

  let gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  let getSpanClass = (catId: string) => "col-span-1";

  if (count === 2) {
    // 2 cards: clean 2-column layout on desktop and tablet
    gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6";
    getSpanClass = () => "col-span-1";
  } else if (count === 3) {
    if (featuredCount === 1) {
      // 3 cards with 1 featured card (e.g., Strength Pillars)
      // Featured spans 2 columns, others span 1 each in a 2-column grid
      gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6";
      getSpanClass = (catId: string) => {
        const isFeatured = featuredIds.includes(catId);
        return isFeatured ? "lg:col-span-2 md:col-span-2 col-span-1" : "col-span-1";
      };
    } else {
      // 3 cards with 0 or multiple featured (e.g., Sprint & Track)
      // All cards take 1 column in a 3-column grid (single row)
      gridClass = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6";
      getSpanClass = () => "col-span-1";
    }
  } else if (count === 4) {
    if (badge === "Terrain Setup") {
      // Contextual & Off-track Terrain:
      // Force balanced 2x2 layout, no hollow row spaces, no orphaned general card.
      // Base/Recovery remains highlighted as featured, but spans col-span-1 to keep perfect symmetry.
      gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6";
      getSpanClass = () => "col-span-1";
    } else if (badge === "Distance Capacity") {
      // 4 cards equal width (e.g., Middle Distance Capacity)
      gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
      getSpanClass = () => "col-span-1";
    } else if (badge === "Endurance Base") {
      // 4 cards with 2 featured: e.g., 5k & marathon featured, 10k & half-marathon compact
      // 3-column grid container: 5k (2) + 10k (1) = Row 1. half-marathon (1) + marathon (2) = Row 2.
      gridClass = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6";
      getSpanClass = (catId: string) => {
        const isFeatured = featuredIds.includes(catId);
        return isFeatured ? "lg:col-span-2 md:col-span-1 col-span-1" : "col-span-1";
      };
    } else if (featuredCount === 1) {
      // 1 featured + 3 compact items
      // e.g., Session Recovery, Kinetic Movement Support
      // Featured spans 3 columns (takes up full row), others span 1 each (takes up row 2 completely)
      gridClass = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6";
      getSpanClass = (catId: string) => {
        const isFeatured = featuredIds.includes(catId);
        return isFeatured ? "lg:col-span-3 md:col-span-3 col-span-1" : "col-span-1";
      };
    } else {
      // Fallback 4 items: 2x2 grid
      gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6";
      getSpanClass = () => "col-span-1";
    }
  } else if (count === 5) {
    // 5 cards: 2 featured on top row (span 3 of 6 columns each) + 3 compact on bottom row (span 2 of 6 columns each)
    gridClass = "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-6";
    getSpanClass = (catId: string) => {
      const idx = associatedCategories.findIndex(c => c.id === catId);
      if (idx === 0 || idx === 1) {
        return "lg:col-span-3 md:col-span-3 col-span-1";
      }
      return "lg:col-span-2 md:col-span-2 col-span-1";
    };
  } else {
    // 6+ items: dense-grid
    gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
    getSpanClass = (catId: string) => {
      const isFeatured = featuredIds.includes(catId);
      return isFeatured ? "lg:col-span-2 md:col-span-1 col-span-1" : "col-span-1";
    };
  }

  return { gridClass, getSpanClass };
}

export function DashboardCategoryShowcase({ staticWorkouts, onSelectCategory }: DashboardPanelsProps) {
  const countMap = getCategoryCountMap(staticWorkouts);

  // Group definitions matching Hard Product Rules (Section 5B)
  const categoryGroups: GroupDisplay[] = [
    {
      title: "Active Sprinter Speed Work",
      subtitle: "Anaerobic power, explosive force production, high-velocity mechanics.",
      badge: "Sprint & Track",
      badgeBg: "bg-orange-50 border-orange-100",
      badgeText: "text-orange-700",
      categoryIds: ["100m", "200m", "400m"]
    },
    {
      title: "Middle Distance Capacity",
      subtitle: "Critical velocity, lactic adaptation curves, threshold management.",
      badge: "Distance Capacity",
      badgeBg: "bg-blue-50 border-blue-100",
      badgeText: "text-blue-700",
      categoryIds: ["800m", "1500m", "mile", "3k"]
    },
    {
      title: "Endurance & Roads Volume",
      subtitle: "Aerobic threshold progression, running economy, fatigue mitigation.",
      badge: "Endurance Base",
      badgeBg: "bg-cyan-50 border-cyan-100",
      badgeText: "text-cyan-700",
      categoryIds: ["5k", "10k", "half-marathon", "marathon"]
    },
    {
      title: "Contextual & Off-track Terrain",
      subtitle: "Variable slope footing, recovery metrics, outdoor adjustments.",
      badge: "Terrain Setup",
      badgeBg: "bg-emerald-50 border-emerald-100",
      badgeText: "text-emerald-700",
      categoryIds: ["trail", "treadmill", "base", "general"]
    },
    {
      title: "Direct Strength & Stabilization",
      subtitle: "Musculoskeletal force production, core alignment, postural control.",
      badge: "Strength Pillars",
      badgeBg: "bg-violet-50 border-violet-100",
      badgeText: "text-violet-700",
      categoryIds: ["upper-strength", "lower-strength", "core"]
    },
    {
      title: "Kinetic Movement Support",
      subtitle: "Reactive joint elasticity, stride frequency, dynamic efficiency.",
      badge: "Movement & Drills",
      badgeBg: "bg-indigo-50 border-indigo-100",
      badgeText: "text-indigo-700",
      categoryIds: ["mobility", "activation", "plyometric", "running-drills"]
    },
    {
      title: "Session Support & Safety",
      subtitle: "Active restoration, localized muscle release, risk reduction.",
      badge: "Session Recovery",
      badgeBg: "bg-rose-50 border-rose-100",
      badgeText: "text-rose-700",
      categoryIds: ["warmup", "cooldown", "recovery", "injury-risk"]
    }
  ];

  // Selected identifiers that render as FEATURED EXPANDED cards (Medium/Large sizes)
  // These represent core high-interest targets (5K, Marathon, Mobility, Core Stability, Warm-up, Base / Recovery)
  const featuredIds = ["5k", "marathon", "mobility", "core", "warmup", "base"];

  return (
    <div className="space-y-12 w-full pt-4">
      {categoryGroups.map((group, gIdx) => {
        // Resolve real details of associated categories
        const associatedCategories = group.categoryIds.map(cid => {
          // Find real details in trackVaultNavigation
          const running = trackVaultNavigation.runningNavigation.find(n => n.id === cid);
          const support = trackVaultNavigation.supportNavigation.find(s => s.id === cid);
          const item = running || support;
          
          if (!item) return null;
          return {
            id: item.id,
            name: item.label,
            description: cid === "5k" ? "Lactate threshold intervals and continuous tempo runs to expand peak capacity." :
                         cid === "marathon" ? "Long-distance aerobic efficiency, target race-pacing sets, and depletion simulation." :
                         cid === "mobility" ? "Hip capsule mobilization, joint range of motion, and dynamic soft tissue release." :
                         cid === "core" ? "Pelvic stability, deep transverse abdominis activations, and torque mitigation." :
                         cid === "warmup" ? "Progressive muscle tissue temperature ramps and kinetic joint preparations." :
                         cid === "base" ? "Steady-state easy running to lay down critical capillary development base." :
                         `${item.label} training and support presets.`,
            isSupport: !!support
          };
        }).filter(Boolean);

        const { gridClass, getSpanClass } = getCoverageLayoutPreset(associatedCategories, group, featuredIds);

        return (
          <div key={gIdx} className="space-y-5">
            {/* Editorial Group Header with Integrated Compact Metadata */}
            <div className="border-b border-slate-100 pb-3 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex px-2 py-0.5 border rounded-md text-[9px] font-bold font-mono uppercase tracking-wider ${group.badgeBg} ${group.badgeText}`}>
                  {group.badge}
                </span>
                <span className="inline-flex px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[9px] font-black font-mono uppercase tracking-wider text-slate-500 shadow-sm leading-none">
                  {associatedCategories.length} Categories
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight font-display">
                {group.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {group.subtitle}
              </p>
            </div>

            {/* Grid structure using smart dynamic sizes */}
            <div className={gridClass}>
              {associatedCategories.map((cat: any) => {
                const isFeatured = featuredIds.includes(cat.id);
                const presetsCount = countMap[cat.id] || 50; // Use static default or exact counting
                const spanClass = getSpanClass(cat.id);

                if (isFeatured) {
                  // --- 1. FEATURED EXPANDED CATEGORY CARD ---
                  const colorAccent = cat.isSupport ? "border-t-4 border-t-violet-500" : "border-t-4 border-t-blue-500";
                  const badgeStyle = cat.isSupport ? "bg-violet-50 text-violet-700 font-bold border border-violet-100" : "bg-blue-50 text-blue-700 font-bold border border-blue-100";

                  // Deterministic tags of interest depending on category ID
                  let tags: string[] = ["INTERVAL", "TEMPO"];
                  let structureCue = "⚡ MULTI-PHASE RAMP";
                  if (cat.id === "5k") {
                    tags = ["Lactate", "Threshold", "VO2 Peak"];
                    structureCue = "⚡ 5x1000m / 3xMile Spike Pattern";
                  } else if (cat.id === "marathon") {
                    tags = ["Aerobic", "Fuel Depletion", "Tempo Run"];
                    structureCue = "📈 Continuous Steady-State Plateau";
                  } else if (cat.id === "mobility") {
                    tags = ["Flexibility", "Joint Range", "Release"];
                    structureCue = "🛡️ 10 Station Hip Active Flow";
                  } else if (cat.id === "core") {
                    tags = ["Stabilization", "Static Holds", "Hip-Core"];
                    structureCue = "⏱️ Plank Ramps / Torques Circuits";
                  } else if (cat.id === "warmup") {
                    tags = ["Tissue Ramps", "Activation", "Prep"];
                    structureCue = "🔥 Warmup Kinetic Flow Progression";
                  } else if (cat.id === "base") {
                    tags = ["Capillary Dev", "Easy Pace", "Recovery"];
                    structureCue = "🌱 Zone-2 Recovery Heart Rate Rhythms";
                  }

                  return (
                    <div 
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onSelectCategory(cat.name);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Featured priority category ${cat.name}, ${presetsCount} presets, ${cat.description}`}
                      className={`group relative bg-white p-6 rounded-3xl border border-[#E2E8F0] ${colorAccent} hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${spanClass} min-h-[220px] h-full`}
                    >
                      {/* Background accent panel mimic element */}
                      <div className="absolute right-0 bottom-0 select-none opacity-5 group-hover:scale-105 group-hover:opacity-10 transition-all text-6xl font-mono font-black pr-4 pb-2 text-slate-800">
                        {presetsCount}
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-2xl border ${
                            cat.isSupport 
                              ? "bg-violet-50/70 border-violet-100 text-violet-600" 
                              : "bg-blue-50/70 border-blue-100 text-blue-600"
                          }`}>
                            <TrackVaultIcon id={cat.id} className="w-5 h-5" strokeWidth={2.5} />
                          </div>
                          
                          <div className="flex flex-col items-end gap-1 font-mono">
                            <span className="text-[10px] font-black text-slate-800">
                              {presetsCount} PRESETS READY
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                              Curated Module
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors uppercase font-display leading-tight flex flex-wrap items-center gap-1.5">
                            <span>{cat.name}</span>
                            <span className={`text-[8.5px] px-2 py-0.5 rounded-full uppercase leading-none font-bold ${badgeStyle}`}>
                              Core Focus
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Expanded visual elements inside selected cards */}
                      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 font-mono">
                        {/* Micro structure preview indicator layout */}
                        <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase">
                          <span>Structure Blueprint:</span>
                          <span className="text-slate-800 font-black">{structureCue}</span>
                        </div>

                        {/* Visual chips preview row */}
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="bg-slate-50 border border-slate-150 text-slate-500 text-[8px] font-black font-mono px-2 py-0.5 rounded uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // --- 2. COMPACT DENSE CARD (Lower Hierarchy) ---
                  return (
                    <div 
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onSelectCategory(cat.name);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Category ${cat.name}, ${presetsCount} presets, ${cat.description}`}
                      className={`group bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-blue-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer flex flex-col justify-between ${spanClass} h-full`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${
                            cat.isSupport 
                              ? "bg-violet-50/70 border-violet-100 text-violet-600 group-hover:bg-violet-100 group-hover:text-violet-700" 
                              : "bg-blue-50/70 border-blue-100 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                          }`}>
                            <TrackVaultIcon id={cat.id} className="w-5 h-5" strokeWidth={2} />
                          </div>
                          
                          <span className="text-[10px] font-bold text-slate-400 font-mono">
                            {presetsCount} PRESETS
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm leading-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase font-display">
                            {cat.name}
                          </h4>
                          <p className="text-xs text-slate-450 line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Small subtle indicator cues */}
                      <div className="mt-3.5 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.isSupport ? 'bg-violet-400' : 'bg-blue-400'}`} />
                          {cat.isSupport ? "SUPPORT" : "RUNNING"}
                        </span>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Open →
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
