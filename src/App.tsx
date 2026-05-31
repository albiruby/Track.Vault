/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { getWorkoutIndex, getAllWorkouts, getWorkoutBySlug, searchWorkouts, filterWorkouts, sortWorkouts, formatWorkoutForClipboard, WorkoutFiltersState, getWorkoutsByCategory, formatWorkoutBlock, getWorkoutFilters, matchSidebarDistance } from "./lib/workouts";
import { getSavedWorkouts, saveWorkoutLocally, deleteSavedWorkout, duplicateWorkout } from "./lib/localWorkouts";
import { copyToClipboard } from "./lib/clipboard";
import { Workout, WorkoutBlock, WorkoutVariant } from "./types/workout";

// Import modular UI components
import { EmptyLibraryState } from "./components/library/EmptyLibraryState";
import { WorkoutCard } from "./components/library/WorkoutCard";
import { WorkoutSearch } from "./components/library/WorkoutSearch";
import { WorkoutSort } from "./components/library/WorkoutSort";
import { WorkoutFilters } from "./components/library/WorkoutFilters";
import { DistanceMenu } from "./components/library/WorkoutCategorySummary";
import { LevelBadge } from "./components/library/LevelBadge";
import { DifficultyBadge } from "./components/library/DifficultyBadge";
import { RiskBadge } from "./components/library/RiskBadge";

// Import Builder components
import { WorkoutBasicInfoForm } from "./components/builder/WorkoutBasicInfoForm";
import { WorkoutBlockEditor } from "./components/builder/WorkoutBlockEditor";
import { WorkoutNotesEditor } from "./components/builder/WorkoutNotesEditor";
import { WorkoutPreview } from "./components/builder/WorkoutPreview";
import { BuilderActionBar } from "./components/builder/BuilderActionBar";

// Import Export components
import { WorkoutCardPreview } from "./components/export/WorkoutCardPreview";
import { ExportCardControls } from "./components/export/ExportCardControls";

// Icons
import {
  Zap,
  FolderOpen,
  Calendar,
  Layers,
  Award,
  BookOpen,
  PlusCircle,
  FolderHeart,
  Bookmark,
  Share2,
  Info,
  Sun,
  Moon,
  Copy,
  Check,
  FileCode,
  Compass,
  ArrowLeft,
  ChevronRight,
  HardHat,
  AlertTriangle,
  Play,
  RefreshCw
} from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeRoute, setActiveRoute] = useState<string>("home"); // "home" | "library" | "detail" | "builder" | "saved" | "export" | "about"
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  
  // Library State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("title");
  const [selectedDistance, setSelectedDistance] = useState("All Workouts");
  const [filters, setFilters] = useState<WorkoutFiltersState>({
    targetDistance: "All",
    level: "All",
    category: "All",
    phase: "All",
    surface: "All",
    difficulty: "All",
    risk: "All",
    duration: "All",
    workoutType: "All",
  });

  // Builder Form State
  const [builderWorkout, setBuilderWorkout] = useState<Partial<Workout>>({
    id: "",
    title: "",
    shortTitle: "",
    summary: "",
    primaryDistance: "5K",
    targetDistances: ["5K"],
    category: "three-k-five-k",
    level: "intermediate",
    phase: "Build",
    surface: "Track",
    equipment: ["None"],
    estimatedDurationMin: 40,
    estimatedDistanceKm: 6.5,
    difficulty: 5,
    risk: "medium",
    riskReason: "Interval velocities trigger muscular load",
    warmup: [],
    mainSet: [],
    cooldown: [],
    coachingNotes: [],
    safetyNotes: [],
    commonMistakes: [],
  });

  const [builderIntensityGuide, setBuilderIntensityGuide] = useState({
    warmup: "Easy jogging below aerobic threshold",
    mainSet: "Target 5K goal pacing",
    cooldown: "Light active recovery stroll",
  });

  // Export card preferences
  const [exportSelectedWorkout, setExportSelectedWorkout] = useState<Workout | null>(null);
  const [exportTemplate, setExportTemplate] = useState("minimal");
  const [exportTheme, setExportTheme] = useState<"light" | "dark" | "orange" | "mono">("light");
  const [exportSize, setExportSize] = useState<"square" | "story" | "compact">("square");

  // Local storage cache trigger
  const [localWorkoutsList, setLocalWorkoutsList] = useState<Workout[]>([]);
  const [clipboardFeedback, setClipboardFeedback] = useState(false);
  const [clipboardText, setClipboardText] = useState("");
  const [showClipboardOverlay, setShowClipboardOverlay] = useState(false);

  // Initialize Theme and Listen to Hash Changes for state routing
  useEffect(() => {
    // Sync localStorage list
    setLocalWorkoutsList(getSavedWorkouts());

    // Sync theme
    const savedTheme = localStorage.getItem("track_vault_theme");
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }

    // Hash Parser for Dynamic Nav
    const handleHashNav = () => {
      const hash = window.location.hash || "#/";
      if (hash === "#/") {
        setActiveRoute("home");
      } else if (hash.startsWith("#/library/")) {
        const slug = hash.replace("#/library/", "");
        setSelectedSlug(slug);
        setActiveRoute("detail");
      } else if (hash === "#/library") {
        setActiveRoute("library");
      } else if (hash === "#/builder") {
        setActiveRoute("builder");
      } else if (hash === "#/saved") {
        setActiveRoute("saved");
      } else if (hash === "#/export") {
        setActiveRoute("export");
      } else if (hash === "#/about") {
        setActiveRoute("about");
      }
    };

    window.addEventListener("hashchange", handleHashNav);
    handleHashNav(); // Run immediately on mount

    return () => {
      window.removeEventListener("hashchange", handleHashNav);
    };
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("track_vault_theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("track_vault_theme", "light");
    }
  };

  const navigateTo = (route: string) => {
    window.location.hash = `#/${route}`;
    // Scroll window back to top on navigation actions
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Saved local storage actions
  const refreshLocalSaved = () => {
    setLocalWorkoutsList(getSavedWorkouts());
  };

  const handleSaveLocalCustom = () => {
    if (!builderWorkout.title || !builderWorkout.summary) {
      alert("Please fill in basic fields: Title and Summary.");
      return;
    }
    const id = builderWorkout.id || `custom-${Math.random().toString(36).substr(2, 9)}`;
    const slug = builderWorkout.slug || `${builderWorkout.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`;
    
    const completeWorkout: Workout = {
      ...(builderWorkout as Workout),
      id,
      slug,
      isCustom: true,
      intensityGuide: builderIntensityGuide,
      createdAt: builderWorkout.createdAt || new Date().toISOString(),
    };

    saveWorkoutLocally(completeWorkout);
    refreshLocalSaved();
    alert("Workout successfully saved to your browser local vault!");
    navigateTo("saved");
  };

  const handleDuplicateToBuilder = (workout: Workout) => {
    setBuilderWorkout({
      ...workout,
      id: `custom-${Math.random().toString(36).substr(2, 9)}`, // Give fresh ID so it's a clone
      slug: `${workout.slug}-clone`,
      title: `${workout.title} (Clone)`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    });
    if (workout.intensityGuide) {
      setBuilderIntensityGuide(workout.intensityGuide);
    }
    navigateTo("builder");
  };

  const handleSelectForExport = (workout: Workout) => {
    setExportSelectedWorkout(workout);
    navigateTo("export");
  };

  const handleCopyClipboardText = async (workout: Workout, format: any = "simple") => {
    const formatted = formatWorkoutForClipboard(workout, format);
    const success = await copyToClipboard(formatted);
    if (success) {
      setClipboardText(formatted);
      setClipboardFeedback(true);
      setShowClipboardOverlay(true);
      setTimeout(() => setClipboardFeedback(false), 2000);
    } else {
      alert("Local clipboard blocked. Opening alternate text popup box.");
      setClipboardText(formatted);
      setShowClipboardOverlay(true);
    }
  };

  // Combine static and local storage list for the search/filter library page
  const staticWorkouts = getAllWorkouts();
  const allLibraryCombined = [...staticWorkouts, ...localWorkoutsList];

  const distanceFiltered = allLibraryCombined.filter((w) => matchSidebarDistance(w, selectedDistance));

  const filteredCombined = filterWorkouts(
    searchWorkouts(distanceFiltered, searchQuery),
    filters
  );
  const sortedCombined = sortWorkouts(filteredCombined, sortKey);

  const filterMetrics = getAllWorkouts().length > 0 ? getWorkoutIndex() : null;

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Dynamic clipboard overlay fallback */}
      {showClipboardOverlay && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full flex flex-col gap-4 shadow-2xl animate-fade-in text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500">
                Copied / Structured Alternate Output
              </span>
              <button
                onClick={() => setShowClipboardOverlay(false)}
                className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-mono tracking-wide cursor-pointer text-slate-700 dark:text-slate-300"
              >
                Close Output
              </button>
            </div>
            
            <p className="text-xs text-slate-400">
              Your formatted training sheet is populated below. Use Cmd+A/Ctrl+A to select and copy anywhere.
            </p>

            <textarea
              readOnly
              rows={12}
              value={clipboardText}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full font-mono text-[11px] leading-relaxed p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-200 h-96 overflow-y-auto"
            />
            
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  copyToClipboard(clipboardText);
                  alert("Copied text content!");
                }}
                className="px-4 py-2 bg-orange-600 font-bold hover:bg-orange-700 text-white rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Force Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Athletic navigation bar */}
      <header className="sticky top-0 z-45 bg-white/95 dark:bg-[#0E1117]/95 backdrop-blur border-b border-[#D8DEE8] dark:border-[#2A3445] w-full">
        <div className="page-container h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo("")}>
            <div className="w-8 h-8 bg-[#FF4E00] rounded-sm flex items-center justify-center font-bold text-white text-lg">V</div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-black dark:text-white">TRACK.VAULT</span>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold">
            <button
              onClick={() => navigateTo("")}
              className={`pb-1 transition-all cursor-pointer ${
                activeRoute === "home"
                  ? "text-[#FF4E00] border-b-2 border-[#FF4E00]"
                  : "text-[#4B5563] dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("library")}
              className={`pb-1 transition-all cursor-pointer ${
                activeRoute === "library" || activeRoute === "detail"
                  ? "text-[#FF4E00] border-b-2 border-[#FF4E00]"
                  : "text-[#4B5563] dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Library
            </button>
            <button
              onClick={() => navigateTo("builder")}
              className={`pb-1 transition-all cursor-pointer ${
                activeRoute === "builder"
                  ? "text-[#FF4E00] border-b-2 border-[#FF4E00]"
                  : "text-[#4B5563] dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Builder
            </button>
            <button
              onClick={() => navigateTo("saved")}
              className={`pb-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRoute === "saved"
                  ? "text-[#FF4E00] border-b-2 border-[#FF4E00]"
                  : "text-[#4B5563] dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <span>Saved</span>
              {localWorkoutsList.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-[#FF4E00] text-white leading-none">
                  {localWorkoutsList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo("export")}
              className={`pb-1 transition-all cursor-pointer ${
                activeRoute === "export"
                  ? "text-[#FF4E00] border-b-2 border-[#FF4E00]"
                  : "text-[#4B5563] dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Export
            </button>
            <button
              onClick={() => navigateTo("about")}
              className={`pb-1 transition-all cursor-pointer ${
                activeRoute === "about"
                  ? "text-[#FF4E00] border-b-2 border-[#FF4E00]"
                  : "text-[#4B5563] dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              About
            </button>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 border border-[#E5E7EB] dark:border-slate-800 rounded-sm hover:bg-gray-50 dark:hover:bg-slate-900 text-[#4B5563] dark:text-slate-400 cursor-pointer transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full page-container py-8 flex flex-col justify-start">
        
        {/* ====================================
            PAGE 1: HOME PAGE (activeRoute === "home") 
            ==================================== */}
        {activeRoute === "home" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in w-full">
            {/* Left Column: Hero & Principles */}
            <div className="lg:col-span-5 p-8 lg:p-10 border border-[#D8DEE8] dark:border-[#2A3445] bg-white dark:bg-[#151A23] rounded-sm flex flex-col justify-between shadow-sm min-h-[500px]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFF1EA] dark:bg-[rgba(255,78,0,0.12)] text-[#FF4E00] text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E00]" />
                    Athletic Utility Pacer
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.05] text-[#111827] dark:text-white uppercase">
                    Track.Vault
                  </h1>
                  <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed font-sans font-medium">
                    A premium speed development and physical pacing index for dedicated runners. Program custom routines, browse dynamic templates, and export sheets instantly.
                  </p>
                </div>

                {/* Principle Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] text-[#374151] dark:text-slate-200 text-xs font-semibold rounded-sm">
                    ⚡ Static JSON Catalog
                  </span>
                  <span className="px-3 py-1 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] text-[#374151] dark:text-slate-200 text-xs font-semibold rounded-sm">
                    🔒 Zero Databases
                  </span>
                  <span className="px-3 py-1 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] text-[#374151] dark:text-slate-200 text-xs font-semibold rounded-sm">
                    💾 Browser Local Save
                  </span>
                  <span className="px-3 py-1 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] text-[#374151] dark:text-slate-200 text-xs font-semibold rounded-sm">
                    📋 Export Card Render
                  </span>
                </div>

                <div className="flex flex-wrap gap-3.5 pt-4 font-sans">
                  <button 
                    onClick={() => navigateTo("library")}
                    className="px-6 py-3 bg-[#FF4E00] hover:bg-[#E64600] text-white font-bold rounded-sm text-xs uppercase tracking-widest transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 font-sans"
                  >
                    <BookOpen className="w-4 h-4" /> Browse Library
                  </button>
                  <button 
                    onClick={() => navigateTo("builder")}
                    className="px-6 py-3 border border-[#CBD5E1] dark:border-[#2A3445] bg-white dark:bg-[#1B2230] text-[#111827] dark:text-slate-200 font-bold rounded-sm text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-[#202938] transition-colors cursor-pointer flex items-center gap-1.5 font-sans"
                  >
                    <PlusCircle className="w-4 h-4 text-[#FF4E00]" /> Open Builder
                  </button>
                </div>
              </div>

              {/* Lower info block */}
              <div className="pt-8 border-t border-[#E5E7EB] dark:border-slate-800 mt-8">
                <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
                  Track.Vault holds pre-indexed track drills, interval schemes, and lactate clearance structures. Stored as offline static JSON models for unmatched load rates.
                </p>
              </div>
            </div>

            {/* Right Column: Dynamic Category Shells & Saved Workouts */}
            <div className="lg:col-span-7 bg-[#F1F3F6] dark:bg-[#13161F] p-8 lg:p-10 rounded-sm border border-[#D8DEE8] dark:border-[#2A3445] flex flex-col justify-start">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#374151] dark:text-slate-300 font-mono">
                  Training Module Roadmap
                </h3>
                <span className="text-[10px] bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] px-2.5 py-1 font-bold text-[#6B7280] dark:text-slate-400 font-mono tracking-wide rounded-sm uppercase">
                  {getWorkoutIndex().categories.length} Modules Online
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getWorkoutIndex().categories.map((c) => {
                  const workoutsCount = getWorkoutsByCategory(c.id).length;
                  
                  let emoji = "🏃";
                  if (c.id.includes("marathon") || c.id.includes("long")) emoji = "⛰️";
                  else if (c.id.includes("five-k") || c.id.includes("three")) emoji = "⚡";
                  else if (c.id.includes("easy") || c.id.includes("base")) emoji = "🌱";
                  else if (c.id.includes("threshold") || c.id.includes("tempo")) emoji = "⏱️";
                  else if (c.id.includes("track")) emoji = "🏃";
                  else if (c.id.includes("hill")) emoji = "🏔️";

                  return (
                    <div 
                      key={c.id}
                      onClick={() => {
                        setSelectedDistance("All Workouts");
                        setFilters({ ...filters, category: c.id });
                        navigateTo("library");
                      }}
                      className="group bg-white dark:bg-[#151A23] p-5 rounded-sm border border-[#D8DEE8] dark:border-[#2A3445] hover:border-[#FF4E00] dark:hover:border-[#FF5A1F] hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-9 h-9 bg-slate-50 dark:bg-[#1B2230] rounded-sm flex items-center justify-center border border-[#D8DEE8] dark:border-[#2A3445] text-lg">
                            {emoji}
                          </div>
                          <span className="text-[10px] font-bold text-[#6B7280] dark:text-slate-400 font-mono">
                            {workoutsCount} PRESETS
                          </span>
                        </div>
                        <h4 className="font-bold text-sm leading-tight text-[#111827] dark:text-white group-hover:text-[#FF4E00] transition-colors">
                          {c.name}
                        </h4>
                        <p className="text-xs text-[#6B7280] dark:text-slate-450 mt-2 line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Local Storage Saved summary row */}
                {localWorkoutsList.length > 0 && (
                  <div 
                    onClick={() => navigateTo("saved")}
                    className="group bg-white dark:bg-[#151A23] p-4 rounded-sm border-2 border-dashed border-[#FF4E00]/30 hover:border-[#FF4E00] transition-all cursor-pointer shadow-sm sm:col-span-2 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-orange-50 dark:bg-orange-950/20 rounded-sm flex items-center justify-center text-[#FF4E00] text-lg">
                        ⭐
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#111827] dark:text-white group-hover:text-[#FF4E00] transition-colors">
                          Your Custom Browser Vault
                        </h4>
                        <p className="text-[10px] text-[#374151] dark:text-slate-450 mt-0.5">
                          See your custom designed routines offline.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#FF4E00] text-white font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-mono">
                      {localWorkoutsList.length} SAVED
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            PAGE 2: LIBRARY PAGE (activeRoute === "library") 
            ==================================== */}
        {activeRoute === "library" && (
          <div className="space-y-6 animate-fade-in w-full">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                Browse Training Vault
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-350 max-w-2xl leading-relaxed">
                Inspect athletic speed development templates. Use categorical filters to trim the selection based on distance, safety levels, running interfaces, and pacing durations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Filters */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-[90px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto pr-1">
                {(() => {
                  const filterSummary = getWorkoutFilters(allLibraryCombined);
                  return (
                    <WorkoutFilters
                      filters={filters}
                      onChange={(u) => setFilters({ ...filters, ...u })}
                      onReset={() =>
                        setFilters({
                          targetDistance: "All",
                          level: "All",
                          category: "All",
                          phase: "All",
                          surface: "All",
                          difficulty: "All",
                          risk: "All",
                          duration: "All",
                          workoutType: "All",
                        })
                      }
                      availableDistances={filterSummary.targetDistances}
                      availableLevels={filterSummary.levels}
                      availablePhases={filterSummary.phases}
                      availableSurfaces={filterSummary.surfaces}
                      availableRisks={filterSummary.risks}
                      availableWorkoutTypes={filterSummary.workoutTypes}
                    />
                  );
                })()}
                
                <DistanceMenu
                  selectedDistance={selectedDistance}
                  onSelectDistance={setSelectedDistance}
                  workouts={allLibraryCombined}
                />
              </div>

              {/* Right Column: List & Actions */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <WorkoutSearch value={searchQuery} onChange={setSearchQuery} />
                  </div>
                  <div className="md:col-span-1">
                    <WorkoutSort value={sortKey} onChange={setSortKey} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-1 border-b border-slate-100 dark:border-slate-850 pb-3 font-sans">
                  <h3 className="text-xl font-black font-display tracking-tight text-slate-800 dark:text-slate-200">
                    {(() => {
                      if (filters.category && filters.category !== "All" && filterMetrics) {
                        const selectedCat = filterMetrics.categories.find(c => c.id === filters.category);
                        if (selectedCat) return `${selectedCat.name} Workouts`;
                      }
                      return selectedDistance === "All Workouts" ? "All Workouts" : `${selectedDistance} Workouts`;
                    })()}
                  </h3>
                  <p className="text-xs font-mono text-[#374151] dark:text-slate-400 font-bold uppercase tracking-wider">
                    Showing {sortedCombined.length} of {allLibraryCombined.length} workouts
                  </p>
                </div>

                {/* Listing Results */}
                {sortedCombined.length === 0 ? (
                  <EmptyLibraryState onNavigateToBuilder={() => navigateTo("builder")} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {sortedCombined.map((w) => (
                      <WorkoutCard
                        key={w.id}
                        workout={w}
                        onViewDetails={(work) => {
                          setSelectedSlug(work.slug);
                          navigateTo(`library/${work.slug}`);
                        }}
                        onDuplicateInBuilder={handleDuplicateToBuilder}
                        onExportCard={handleSelectForExport}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            PAGE 3: WORKOUT DETAIL PAGE (activeRoute === "detail") 
            ==================================== */}
        {activeRoute === "detail" && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            {/* Quick Actions Bar */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => navigateTo("library")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Library
              </button>
              
              <span className="text-[10px] font-mono text-slate-400">
                INSPECTOR CORE // #{selectedSlug}
              </span>
            </div>

            {/* Load Workout Details */}
            {(() => {
              const workout = allLibraryCombined.find((w) => w.slug === selectedSlug);
              if (!workout) {
                return (
                  <div className="py-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-250">Workout Slug Not Found</p>
                    <p className="text-xs text-slate-400 mt-1">This specific static url key represents a pending database segment.</p>
                    <button
                      onClick={() => navigateTo("library")}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono tracking-wide mt-4"
                    >
                      Browse Available Library
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* Detailed Preview Render */}
                  <WorkoutPreview workout={workout} />

                  {/* Actions under Details */}
                  <div className="bg-slate-950 text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col text-center md:text-left">
                      <span className="text-xs font-mono uppercase text-slate-400">Share or Edit Custom Workout</span>
                      <span className="text-[11px] text-slate-350 leading-relaxed mt-0.5">
                        Download high-definition sports sheets or duplicate inside editor manually.
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5 justify-center">
                      <button
                        onClick={() => handleCopyClipboardText(workout, "simple")}
                        className="px-4 py-2 font-bold text-xs bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-orange-400" /> Copy Simple
                      </button>

                      <button
                        onClick={() => handleCopyClipboardText(workout, "structured-markdown")}
                        className="px-4 py-2 font-bold text-xs bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-400" /> Copy Markdown
                      </button>

                      <button
                        onClick={() => handleSelectForExport(workout)}
                        className="px-5 py-2 font-bold text-xs bg-orange-600 hover:bg-orange-750 text-white rounded-xl flex items-center gap-1.5 shadow active:scale-[0.98] cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Exporter Studio
                      </button>

                      <button
                        onClick={() => handleDuplicateToBuilder(workout)}
                        className="px-4 py-2 font-bold text-xs bg-slate-850 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> edit Clone
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ====================================
            PAGE 4: WORKOUT BUILDER PAGE (activeRoute === "builder") 
            ==================================== */}
        {activeRoute === "builder" && (
          <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black font-display text-slate-850 dark:text-slate-100 tracking-tight flex items-baseline gap-1.5">
                Workout Builder Lab{" "}
                <span className="text-[10px] font-mono uppercase bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 border border-orange-100 dark:border-orange-900/30 font-bold text-orange-500 rounded-sm">
                  Manual Creator
                </span>
              </h2>
              <p className="text-xs text-slate-450 leading-relaxed max-w-xl">
                Zero AI generation formulas. Design step-by-step warmup loops, repetition sets, and active cooldown profiles manually. Saves instantly inside browser context.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left side editor */}
              <div className="xl:col-span-7 space-y-6">
                <WorkoutBasicInfoForm
                  workout={builderWorkout}
                  onChange={(fields) => setBuilderWorkout({ ...builderWorkout, ...fields })}
                  intensityGuide={builderIntensityGuide}
                  onIntensityGuideChange={(guide) => setBuilderIntensityGuide(guide)}
                />

                <WorkoutBlockEditor
                  label="1. Warm-Up prescription Steps"
                  blocks={builderWorkout.warmup || []}
                  onChange={(blocks) => setBuilderWorkout({ ...builderWorkout, warmup: blocks })}
                  defaultType="warmup"
                />

                <WorkoutBlockEditor
                  label="2. Main set Prescription steps"
                  blocks={builderWorkout.mainSet || []}
                  onChange={(blocks) => setBuilderWorkout({ ...builderWorkout, mainSet: blocks })}
                  defaultType="interval"
                />

                <WorkoutBlockEditor
                  label="3. Cooldown prescription Steps"
                  blocks={builderWorkout.cooldown || []}
                  onChange={(blocks) => setBuilderWorkout({ ...builderWorkout, cooldown: blocks })}
                  defaultType="cooldown"
                />

                <WorkoutNotesEditor
                  coachingNotes={builderWorkout.coachingNotes || []}
                  setCoachingNotes={(notes) => setBuilderWorkout({ ...builderWorkout, coachingNotes: notes })}
                  safetyNotes={builderWorkout.safetyNotes || []}
                  setSafetyNotes={(notes) => setBuilderWorkout({ ...builderWorkout, safetyNotes: notes })}
                  commonMistakes={builderWorkout.commonMistakes || []}
                  setCommonMistakes={(mistakes) => setBuilderWorkout({ ...builderWorkout, commonMistakes: mistakes })}
                />
              </div>

              {/* Right side live preview panel */}
              <div className="xl:col-span-5 lg:sticky lg:top-24 space-y-4">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] p-3.5 rounded-sm">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#374151] dark:text-slate-300 font-extrabold">
                    LIVE CONSTRUCT PREVIEW
                  </span>
                  <span className="text-[9px] font-mono bg-[#FF4E00] text-white px-2 py-0.5 rounded-sm font-bold uppercase leading-none">
                    Unsaved Draft
                  </span>
                </div>

                <WorkoutPreview
                  workout={{
                    ...builderWorkout,
                    intensityGuide: builderIntensityGuide,
                  }}
                />
              </div>
            </div>

            {/* Builder Action Banner */}
            <BuilderActionBar
              onSave={handleSaveLocalCustom}
              onCopyClipboard={() => {
                const completeWorkout: Workout = {
                  ...(builderWorkout as Workout),
                  id: "custom-copy",
                  isCustom: true,
                  intensityGuide: builderIntensityGuide,
                };
                handleCopyClipboardText(completeWorkout, "simple");
              }}
              onReset={() => {
                if (confirm("Are you sure you want to clear your current progress?")) {
                  setBuilderWorkout({
                    id: "",
                    title: "",
                    shortTitle: "",
                    summary: "",
                    primaryDistance: "5K",
                    targetDistances: ["5K"],
                    category: "three-k-five-k",
                    level: "intermediate",
                    phase: "Build",
                    surface: "Track",
                    equipment: ["None"],
                    estimatedDurationMin: 40,
                    estimatedDistanceKm: 6.5,
                    difficulty: 5,
                    risk: "medium",
                    riskReason: "Interval velocities trigger muscular load",
                    warmup: [],
                    mainSet: [],
                    cooldown: [],
                    coachingNotes: [],
                    safetyNotes: [],
                    commonMistakes: [],
                  });
                }
              }}
              onGoToExport={() => {
                const completeWorkout: Workout = {
                  ...(builderWorkout as Workout),
                  id: "custom-export-draft",
                  slug: "custom-export-draft",
                  isCustom: true,
                  intensityGuide: builderIntensityGuide,
                };
                setExportSelectedWorkout(completeWorkout);
                navigateTo("export");
              }}
              copiedState={clipboardFeedback}
              isValid={!!builderWorkout.title && !!builderWorkout.summary && (builderWorkout.mainSet?.length || 0) > 0}
            />
          </div>
        )}

        {/* ====================================
            PAGE 5: SAVED PAGE (activeRoute === "saved") 
            ==================================== */}
        {activeRoute === "saved" && (
          <div className="space-y-6 animate-fade-in w-full">
            {/* Page Header */}
            <div className="flex flex-col gap-2 border-b border-[#D8DEE8] dark:border-[#2A3445] pb-4">
              <h2 className="text-3xl sm:text-4xl font-black font-display text-[#111827] dark:text-[#F8FAFC] tracking-tight flex flex-wrap items-baseline gap-2">
                Local Training Vault{" "}
                <span className="bg-orange-50 border border-orange-100 text-orange-500 text-[10px] font-mono font-bold uppercase rounded-sm px-2 py-0.5">
                  Offline browser cache
                </span>
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-350 leading-relaxed max-w-2xl">
                Custom running schedules programmed here are persisted. No telemetry, login grids, or trackers exist; data stays 100% inside your physical client browser.
              </p>
            </div>

            {localWorkoutsList.length === 0 ? (
              <div className="py-16 text-center max-w-2xl mx-auto space-y-6 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FFF1EA] dark:bg-[rgba(255,78,0,0.12)] border border-[#D8DEE8] dark:border-[#2A3445] flex items-center justify-center mx-auto text-[#FF4E00]">
                  <Bookmark className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wide">
                    Your Training Vault is Empty
                  </h3>
                  <p className="text-xs text-[#374151] dark:text-slate-350 max-w-md mx-auto leading-relaxed">
                    You haven't designed or clone-saved any professional speed sets. Create customized lactate clearance pyramids or repeated maximum anaerobic interval runs.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo("builder")}
                    className="px-6 py-3 bg-[#FF4E00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer shadow-sm active:scale-[0.98] transition-all font-sans"
                  >
                    Launch Program Builder
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#374151] dark:text-slate-400 uppercase tracking-widest font-extrabold pb-1">
                    SAVED COLLECTION ({localWorkoutsList.length})
                  </span>
                  
                  <button
                    onClick={() => {
                      if (confirm("Clear all locally saved workouts? This is irreversible!")) {
                        localStorage.removeItem("track_vault_saved_workouts");
                        refreshLocalSaved();
                      }
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                  >
                    Clear All Saved
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {localWorkoutsList.map((w) => (
                    <div
                      key={w.id}
                      className="bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-6 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                      onClick={() => {
                        setSelectedSlug(w.slug);
                        navigateTo(`library/${w.slug}`);
                      }}
                    >
                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          <LevelBadge level={w.level} />
                          <DifficultyBadge difficulty={w.difficulty} />
                          <RiskBadge risk={w.risk} />
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-slate-100 line-clamp-1 group-hover:text-[#FF4E00] transition-colors uppercase">
                          {w.title}
                        </h3>
                        <p className="text-xs text-[#374151] dark:text-slate-300 line-clamp-2 mt-1 leading-normal">
                          {w.summary}
                        </p>

                        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-[#1B2230] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm my-4 text-center text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-[#374151] dark:text-slate-400 block uppercase font-bold">Volume</span>
                            <span className="font-bold text-[#111827] dark:text-slate-200">~{w.estimatedDistanceKm} km</span>
                          </div>
                          <div className="border-l border-[#D8DEE8] dark:border-[#2A3445]">
                            <span className="text-[9px] text-[#374151] dark:text-slate-400 block uppercase font-bold">Duration</span>
                            <span className="font-bold text-[#111827] dark:text-slate-200">~{w.estimatedDurationMin} min</span>
                          </div>
                        </div>

                        {/* Prescription summaries */}
                        <div className="space-y-1 text-xs text-[#111827] dark:text-slate-200 pl-1">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#374151] dark:text-slate-400 block font-bold">
                            Prescription
                          </span>
                          {w.mainSet.slice(0, 2).map((block, index) => (
                            <div key={block.id || index} className="truncate font-mono text-xs flex gap-1.5 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E00]" />
                              <span className="font-medium">{formatWorkoutBlock(block)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Controls inside Local Cards */}
                      <div className="mt-5 pt-4 border-t border-[#D8DEE8] dark:border-[#2A3445] flex justify-between gap-1 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSlug(w.slug);
                            navigateTo(`library/${w.slug}`);
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-[#374151] dark:text-slate-300 hover:text-[#FF4E00] cursor-pointer font-mono"
                        >
                          INSPECT
                        </button>

                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleCopyClipboardText(w, "simple")}
                            title="Copy simple text training summary"
                            className="p-1.5 rounded-sm border border-[#D8DEE8] dark:border-slate-800 bg-gray-50 dark:bg-slate-900 hover:bg-[#FF4E00]/10 hover:border-[#FF4E00] text-[#374151] hover:text-[#FF4E00] dark:hover:text-[#FF4E00] cursor-pointer font-mono font-bold text-[9px] uppercase"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleSelectForExport(w)}
                            title="Export card image"
                            className="p-1.5 rounded-sm border border-[#D8DEE8] dark:border-slate-800 bg-gray-50 dark:bg-slate-900 hover:bg-[#FF4E00]/10 hover:border-[#FF4E00] text-[#374151] hover:text-[#FF4E00] dark:hover:text-[#FF4E00] cursor-pointer font-mono font-bold text-[9px] uppercase"
                          >
                            Card
                          </button>
                          <button
                            onClick={() => {
                              setBuilderWorkout({ ...w });
                              navigateTo("builder");
                            }}
                            title="Load inside build editor"
                            className="p-1.5 rounded-sm border border-[#D8DEE8] dark:border-slate-800 bg-gray-50 dark:bg-slate-900 hover:bg-[#FF4E00]/10 hover:border-[#FF4E00] text-[#374151] hover:text-[#FF4E00] dark:hover:text-[#FF4E00] cursor-pointer font-mono font-bold text-[9px] uppercase"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this local custom workout?")) {
                                deleteSavedWorkout(w.id);
                                refreshLocalSaved();
                              }
                            }}
                            title="Delete permanently"
                            className="p-1.5 font-bold text-[9px] rounded bg-rose-50 hover:bg-rose-100 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/35 text-rose-500 cursor-pointer font-mono uppercase"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================
            PAGE 6: EXPORT STUDIO PAGE (activeRoute === "export") 
            ==================================== */}
        {activeRoute === "export" && (
          <div className="space-y-6 animate-fade-in w-full">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl sm:text-4xl font-black font-display text-[#111827] dark:text-[#F8FAFC] tracking-tight flex flex-wrap items-baseline gap-2">
                Exporter Card Studio{" "}
                <span className="bg-orange-50 text-orange-550 border border-orange-100 text-[10px] font-mono uppercase rounded-sm px-2 py-0.5 font-bold">
                  PNG GENERATOR
                </span>
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-350 leading-relaxed max-w-2xl">
                Convert workout structures into clean high-resolution share cards optimized for phone lockscreens, Strava uploads, fitness blogs, or coaches' templates.
              </p>
            </div>

            {!exportSelectedWorkout ? (
              <div className="py-16 text-center max-w-2xl mx-auto space-y-6 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FFF1EA] dark:bg-[rgba(255,78,0,0.12)] border border-[#D8DEE8] dark:border-[#2A3445] flex items-center justify-center mx-auto text-[#FF4E00]">
                  <Share2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wide">
                    No Workout Selected for Exporter
                  </h3>
                  <p className="text-xs text-[#374151] dark:text-slate-350 max-w-md mx-auto leading-relaxed">
                    Select any preloaded running workout in the library or draft a custom repetition block first inside the Builder Lab.
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => navigateTo("library")}
                    className="px-5 py-3 bg-[#FF4E00] hover:bg-[#E64600] text-white text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer font-sans"
                  >
                    Select in Library
                  </button>
                  <button
                    onClick={() => navigateTo("builder")}
                    className="px-5 py-3 border border-[#D8DEE8] dark:border-[#2A3445] bg-white dark:bg-[#1B2230] text-[#374151] dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#202938] text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer font-sans"
                  >
                    Create Custom
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => navigateTo("library")}
                    className="text-slate-400 hover:text-orange-500 font-bold transition-colors cursor-pointer"
                  >
                    Library
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 font-display">
                    Card Exporter: {exportSelectedWorkout.title}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Controls column */}
                  <div className="lg:col-span-5">
                    <ExportCardControls
                      workout={exportSelectedWorkout}
                      template={exportTemplate}
                      setTemplate={setExportTemplate}
                      theme={exportTheme}
                      setTheme={setExportTheme}
                      size={exportSize}
                      setSize={setExportSize}
                    />
                  </div>

                  {/* Right live high-res card display node column */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-400 uppercase tracking-widest font-bold">
                        EST Share-Card Render Preview
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        Size: {exportSize.toUpperCase()} // Aspect Ratio
                      </span>
                    </div>

                    <WorkoutCardPreview
                      workout={exportSelectedWorkout}
                      template={exportTemplate}
                      theme={exportTheme}
                      size={exportSize}
                    />

                    {/* Quality disclaimer */}
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                      💡 Click "Download PNG Card." The output card is rendered crisp at {exportSize === "story" ? "1080x1920" : exportSize === "square" ? "1080x1080" : "1200x675"} pixels size regardless of your screen viewport size.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================
            PAGE 7: ABOUT PAGE (activeRoute === "about") 
            ==================================== */}
        {activeRoute === "about" && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="border-b border-[#D8DEE8] dark:border-[#2A3445] pb-5">
              <h2 className="text-3xl sm:text-4xl font-black font-display text-[#111827] dark:text-[#F8FAFC] tracking-tight flex items-baseline gap-1">
                About Track.Vault
              </h2>
              <span className="text-xs uppercase font-mono tracking-widest text-[#374151] dark:text-[#94A3B8] font-bold block mt-1">
                Zero-Database running design pacer system
              </span>
            </div>

            <div className="space-y-6 text-sm text-[#374151] dark:text-slate-350 leading-relaxed font-sans">
              
              <div className="p-6 bg-[#FF4E00]/5 border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm">
                <h4 className="font-bold text-[#FF4E00] dark:text-[#FF4E00] font-mono text-xs uppercase mb-2">
                  Physiological & Coaching Framework
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Track.Vault is designed with structured training principles. Every category block aligns directly with specific energy system demands. Warmup phases include cardiovascular strides, mainsets target particular clearance velocities, and active recoveries enable full glycogen restoration.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black font-display tracking-tight text-[#111827] dark:text-[#F8FAFC] uppercase">
                  Architectural Pillars
                </h3>
                <ul className="space-y-3 pl-1.5 text-sm text-[#374151] dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#FF4E00] font-bold text-lg leading-none">⚡</span>
                    <div>
                      <strong className="text-[#111827] dark:text-white font-bold">Strict Static JSON Catalog:</strong> The baseline workout catalog is fully static. Storing files as indexed, frozen JSON arrays guarantees lighting-fast response speeds, 100% offline uptime, and seamless developer onboarding.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#FF4E00] font-bold text-lg leading-none">⚡</span>
                    <div>
                      <strong className="text-[#111827] dark:text-white font-bold">Absolute Local Sandbox Security:</strong> We run no background indexing, cloud analytics, trackers, or hidden telemetry loops. Because we collect no custom user details, saved workout profiles remain entirely locked inside the client's physical browser `localStorage` sandbox.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#FF4E00] font-bold text-lg leading-none">⚡</span>
                    <div>
                      <strong className="text-[#111827] dark:text-white font-bold">Modern Layout Export Synthesis:</strong> Physical exercise schedules copy directly into multi-tier text blocks, or compile into stylized PNG graphic shapes targeting lockscrens or workout boards without relying on server-side rendering pipelines.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#D8DEE8] dark:border-[#2A3445]">
                <h3 className="text-lg font-black font-display tracking-tight text-rose-600 dark:text-rose-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5 text-rose-500" /> Professional Liability Disclaimer
                </h3>
                <p className="text-sm text-[#374151] dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] p-5 rounded-sm">
                  Workouts provided inside the dynamic library are designed solely as generic, typical training references. They are not constructed as personalized medical, health, wellness, physical rehab, or individual coaching suggestions. Runners should seek advice from professional care practitioners or certified coaches before training at intense anaerobic thresholds, severe speeds, or maximum endurance intervals.
                </p>
              </div>
            </div>

            {/* Footer stamp */}
            <div className="pt-8 border-t border-[#D8DEE8] dark:border-[#2A3445] text-center font-mono text-[10px] text-[#374151] dark:text-slate-400 font-bold uppercase tracking-wider">
              TRACK.VAULT ESTABLISHED 2026 // NO ACCUMULATIVE DATA TRACKING
            </div>
          </div>
        )}
      </main>

      {/* Main Footer */}
      <footer className="bg-white dark:bg-[#0B0F19] text-[#111827] dark:text-white mt-24 py-8 border-t border-[#D8DEE8] dark:border-[#1E2533] font-sans">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-[#FF4E00] flex items-center justify-center text-white font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-extrabold font-display text-sm tracking-tight text-[#111827] dark:text-[#F8FAFC]">
              TRACK.VAULT // BUILD. BROWSE. SHARE. RUN.
            </span>
          </div>

          <p className="text-[11px] text-[#374151] dark:text-slate-400 max-w-lg text-center md:text-right leading-relaxed font-mono">
            All custom workout programs remain inside physical browser cache. Baselines are static workout structures and do not constitute authorized medical or personal athletic coaching advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
