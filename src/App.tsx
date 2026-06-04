/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import {
  getWorkoutIndex,
  getAllWorkouts,
  searchWorkouts,
  filterWorkouts,
  sortWorkouts,
  formatWorkoutForClipboard,
  WorkoutFiltersState,
  getWorkoutsByCategory,
  formatWorkoutBlock,
  getWorkoutFilters,
  matchSidebarDistance,
} from "./lib/workouts";
import {
  getSavedWorkouts,
  saveWorkoutLocally,
  deleteSavedWorkout,
} from "./lib/localWorkouts";
import {
  getSavedVaultItems,
  saveVaultItem,
  updateSavedVaultItem,
  deleteSavedVaultItem,
  duplicateSavedVaultItem,
  togglePinnedSavedItem,
  clearSavedVault,
  filterSavedVaultItems,
  searchSavedVaultItems,
  SavedVaultItem,
} from "./lib/savedVault";
import {
  getCompareTray,
  isItemInCompareTray,
  addToCompareTray,
  removeFromCompareTray,
  clearCompareTray,
  CompareTrayItem,
} from "./lib/compareEntries";
import { createBuilderDraftFromEntry } from "./lib/libraryToBuilder";
import { copyToClipboard } from "./lib/clipboard";
import { sanitizeWorkoutTitle, getDefaultExportTemplateForEntry } from "./lib/displayTitle";
import { trackVaultNavigation } from "./data/workouts/trackVaultNavigation.v1.2";
import { Workout } from "./types/workout";
import { Pin, Trash2, Edit, Check, Search, GitCompare } from "lucide-react";

// Import modular UI components
import { EmptyLibraryState } from "./components/library/EmptyLibraryState";
import { WorkoutCard } from "./components/library/WorkoutCard";
import { WorkoutSearch } from "./components/library/WorkoutSearch";
import { WorkoutSort } from "./components/library/WorkoutSort";
import { WorkoutFilters } from "./components/library/WorkoutFilters";
import { LevelBadge } from "./components/library/LevelBadge";
import { DifficultyBadge } from "./components/library/DifficultyBadge";
import { RiskBadge } from "./components/library/RiskBadge";
import { FilterPresetBar } from "./components/library/FilterPresetBar";
import { FILTER_PRESETS } from "./lib/filterPresets";

// Compare elements
import CompareBar from "./components/compare/CompareBar";
import CompareDrawer from "./components/compare/CompareDrawer";
import BuilderQualityChecklist from "./components/builder/BuilderQualityChecklist";

// Import Builder components
import { WorkoutBasicInfoForm } from "./components/builder/WorkoutBasicInfoForm";
import { WorkoutBlockEditor } from "./components/builder/WorkoutBlockEditor";
import { WorkoutNotesEditor } from "./components/builder/WorkoutNotesEditor";
import { WorkoutPreview } from "./components/builder/WorkoutPreview";
import { BuilderActionBar } from "./components/builder/BuilderActionBar";
import { EntryDetailPage } from "./components/detail/EntryDetailPage";

// Load enhanced Dashboard Layers
import {
  DashboardHero,
  DashboardSummaryGrid,
  DashboardCategoryShowcase,
} from "./components/dashboard/DashboardPanels";

// Import Export components
import { WorkoutCardPreview } from "./components/export/WorkoutCardPreview";
import { ExportCardControls } from "./components/export/ExportCardControls";

// Import Layout Component
import { LeftSidebar } from "./components/layout/LeftSidebar";
import { TrackVaultIcon } from "./components/icons/trackVaultIcons";

// Icons
import {
  Sparkles,
  Dumbbell,
  ShieldAlert,
  Sliders,
  Zap,
  BookOpen,
  PlusCircle,
  Bookmark,
  Share2,
  Sun,
  Moon,
  Copy,
  ChevronRight,
  AlertTriangle,
  Menu,
  RotateCcw,
  Footprints,
  Heart,
  Compass,
  ArrowRight,
  Activity,
  Lock,
  Layers,
  X,
} from "lucide-react";

export default function App() {
  const [activeRoute, setActiveRoute] = useState<string>("home"); // "home" | "library" | "detail" | "builder" | "saved" | "export" | "about"
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trackvault_sidebar_collapsed_v1");
      if (saved !== null) {
        return saved === "true";
      }
      // Default to collapsed (rail mode) on tablet or mobile if screen width is narrow
      if (window.innerWidth < 1024) {
        return true;
      }
    }
    return false;
  });

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(
        "trackvault_sidebar_collapsed_v1",
        JSON.stringify(next),
      );
      return next;
    });
  };

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Compare states
  const [compareItems, setCompareItems] = useState<CompareTrayItem[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  useEffect(() => {
    // Synchronize compare tray on mount
    setCompareItems(getCompareTray());
  }, []);

  const handleToggleCompare = (entry: any) => {
    if (isItemInCompareTray(entry)) {
      const list = getCompareTray();
      const targetId = entry.localId || entry.id;
      const targetSlug = entry.slug;
      const found = list.find(
        (item) =>
          (targetId &&
            (item.entryId === targetId || item.localId === targetId)) ||
          (targetSlug && item.slug === targetSlug),
      );
      if (found) {
        const updated = removeFromCompareTray(found.localCompareId);
        setCompareItems(updated);
        showToast("Removed from comparison tray.", "info");
      }
    } else {
      const result = addToCompareTray(entry);
      if (result.success) {
        setCompareItems(result.items);
        showToast("Added to comparison tray!", "success");
      } else if (result.error === "limit_reached") {
        if (
          confirm(
            "Comparison tray limit of 3 reached. Would you like to replace the oldest slot with this new workout?",
          )
        ) {
          const forceResult = addToCompareTray(entry, {
            forceReplaceOldest: true,
          });
          setCompareItems(forceResult.items);
          showToast("Replaced oldest slot with new selection.", "success");
        }
      }
    }
  };

  const handleRemoveCompareItem = (localCompareId: string) => {
    const updated = removeFromCompareTray(localCompareId);
    setCompareItems(updated);
    showToast("Removed from comparison.", "info");
  };

  const handleClearCompare = () => {
    clearCompareTray();
    setCompareItems([]);
    showToast("Comparison tray cleared.", "info");
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Library State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("title");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
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
  const [exportSelectedWorkout, setExportSelectedWorkout] =
    useState<Workout | null>(null);
  const [exportTemplate, setExportTemplate] = useState("minimal");
  const [exportTheme, setExportTheme] = useState<
    "light" | "dark" | "orange" | "mono"
  >("light");
  const [exportSize, setExportSize] = useState<"square" | "story" | "compact">(
    "square",
  );

  // Local storage cache trigger
  const [localWorkoutsList, setLocalWorkoutsList] = useState<Workout[]>([]);
  const [localSavedItems, setLocalSavedItems] = useState<SavedVaultItem[]>([]);
  const [savedSearchQuery, setSavedSearchQuery] = useState("");
  const [savedCategoryFilter, setSavedCategoryFilter] = useState("all");
  const [savedSortBy, setSavedSortBy] = useState("recent");
  const [editingItem, setEditingItem] = useState<SavedVaultItem | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editTagsInput, setEditTagsInput] = useState("");
  const [clipboardFeedback, setClipboardFeedback] = useState(false);
  const [clipboardText, setClipboardText] = useState("");
  const [showClipboardOverlay, setShowClipboardOverlay] = useState(false);
  const [exportShowBrandFooter, setExportShowBrandFooter] = useState(true);

  // Listen to Hash Changes for state routing
  useEffect(() => {
    // Sync localStorage list
    refreshLocalSaved();

    document.documentElement.classList.remove("dark");

    // Hash Parser for Dynamic Nav
    const handleHashNav = () => {
      const hash = window.location.hash || "#/";
      if (hash === "#/") {
        setSearchQuery("");
        setActiveRoute("home");
      } else if (hash.startsWith("#/library/")) {
        const slug = hash.replace("#/library/", "");
        setSelectedSlug(slug);
        setActiveRoute("detail");
      } else if (hash === "#/library") {
        setActiveRoute("library");
      } else if (hash === "#/builder") {
        setSearchQuery("");
        setActiveRoute("builder");
      } else if (hash === "#/saved") {
        setSearchQuery("");
        setActiveRoute("saved");
      } else if (hash === "#/export") {
        setSearchQuery("");
        setActiveRoute("export");
      } else if (hash === "#/about") {
        setSearchQuery("");
        setActiveRoute("about");
      }
    };

    window.addEventListener("hashchange", handleHashNav);
    handleHashNav(); // Run immediately on mount

    return () => {
      window.removeEventListener("hashchange", handleHashNav);
    };
  }, []);

  // Synchronize and clean preset compatibility when changing sidebar tracks
  useEffect(() => {
    const isSupport =
      selectedDistance === "All Support" ||
      trackVaultNavigation.supportNavigation.some(
        (nav) =>
          nav.label.toLowerCase() === selectedDistance.toLowerCase() ||
          nav.id.toLowerCase() === selectedDistance.toLowerCase(),
      );

    const isRunning =
      selectedDistance === "All Running" ||
      selectedDistance === "All Workouts" ||
      trackVaultNavigation.runningNavigation.some(
        (nav) =>
          nav.label.toLowerCase() === selectedDistance.toLowerCase() ||
          nav.id.toLowerCase() === selectedDistance.toLowerCase(),
      );

    if (isSupport) {
      if (selectedPresetId) {
        const activePreset = FILTER_PRESETS.find(
          (p) => p.id === selectedPresetId,
        );
        if (
          activePreset &&
          (activePreset.group === "running" ||
            activePreset.entryType === "running-workout")
        ) {
          setSelectedPresetId(null);
        }
      }
      setFilters((prev) => ({
        ...prev,
        targetDistance: "All",
        surface:
          prev.surface === "Track" ||
          prev.surface === "Treadmill" ||
          prev.surface === "Trail"
            ? "All"
            : prev.surface,
      }));
    } else if (isRunning) {
      if (selectedPresetId) {
        const activePreset = FILTER_PRESETS.find(
          (p) => p.id === selectedPresetId,
        );
        if (
          activePreset &&
          (activePreset.group === "support" ||
            activePreset.entryType === "support-routine")
        ) {
          setSelectedPresetId(null);
        }
      }
      setFilters((prev) => ({
        ...prev,
        category: "All",
      }));
    }
  }, [selectedDistance, selectedPresetId]);

  // Sync pending builder templates on page load
  useEffect(() => {
    if (activeRoute === "builder") {
      try {
        const pendingValue = localStorage.getItem(
          "trackvault_pending_builder_draft",
        );
        if (pendingValue) {
          const draft = JSON.parse(pendingValue);
          setBuilderWorkout(draft);
          if (draft.intensityGuide) {
            setBuilderIntensityGuide(draft.intensityGuide);
          }
          localStorage.removeItem("trackvault_pending_builder_draft");
          showToast(
            `Template "${draft.title}" loaded successfully!`,
            "success",
          );
        }
      } catch (e) {
        console.error("Failed to parse pending builder template:", e);
      }
    }
  }, [activeRoute]);

  const navigateTo = (route: string) => {
    window.location.hash = `#/${route}`;
    // Scroll window back to top on navigation actions
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Saved local storage actions
  const refreshLocalSaved = () => {
    const items = getSavedVaultItems();
    setLocalSavedItems(items);
    setLocalWorkoutsList(
      items.map((it) => ({
        ...it.data,
        id: it.localId,
        localId: it.localId,
        pinned: it.pinned,
        localTags: it.localTags,
        notes: it.notes,
        savedAt: it.savedAt,
        slug: it.slug || `local-${it.localId}`,
      })),
    );
  };

  const handleSaveLocalCustom = () => {
    if (!builderWorkout.title || !builderWorkout.summary) {
      showToast("Please fill in basic fields: Title and Summary.", "error");
      return;
    }
    const id =
      builderWorkout.id || `custom-${Math.random().toString(36).substr(2, 9)}`;
    const slug =
      builderWorkout.slug ||
      `${builderWorkout.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`;

    const completeWorkout: Workout = {
      ...(builderWorkout as Workout),
      id,
      slug,
      isCustom: true,
      intensityGuide: builderIntensityGuide,
      createdAt: builderWorkout.createdAt || new Date().toISOString(),
    };

    saveVaultItem(completeWorkout);
    refreshLocalSaved();
    showToast(
      "Workout successfully saved to your browser local vault!",
      "success",
    );
    navigateTo("saved");
  };

  const handleDuplicateToBuilder = (workout: Workout) => {
    const draft = createBuilderDraftFromEntry(workout);
    if (!draft) {
      showToast("Could not create template draft from this entry.", "error");
      return;
    }

    try {
      localStorage.setItem(
        "trackvault_pending_builder_draft",
        JSON.stringify(draft),
      );
    } catch (e) {
      console.error(
        "Failed to write pending builder draft to localStorage:",
        e,
      );
    }

    setBuilderWorkout(draft);
    if (draft.intensityGuide) {
      setBuilderIntensityGuide(draft.intensityGuide);
    } else {
      setBuilderIntensityGuide({
        warmup: "Easy jogging below aerobic threshold",
        mainSet: "Target pacing zone based on goal velocity",
        cooldown: "Light active recovery stroll",
      });
    }

    showToast(
      `Loaded "${workout.title}" as custom editable template!`,
      "success",
    );
    navigateTo("builder");
  };

  const handleSelectForExport = (workout: Workout) => {
    setExportSelectedWorkout(workout);
    setExportTemplate(getDefaultExportTemplateForEntry(workout));
    navigateTo("export");
  };

  const handleCopyClipboardText = async (
    workout: Workout,
    format: any = "simple",
  ) => {
    const formatted = formatWorkoutForClipboard(workout, format);
    const success = await copyToClipboard(formatted);
    if (success) {
      setClipboardText(formatted);
      setClipboardFeedback(true);
      setShowClipboardOverlay(true);
      if (format === "simple") {
        showToast("Simple summary copied to clipboard", "success");
      } else {
        showToast("Markdown workout sheet copied", "success");
      }
      setTimeout(() => setClipboardFeedback(false), 2000);
    } else {
      showToast("Alternate copy overlay box activated.", "info");
      setClipboardText(formatted);
      setShowClipboardOverlay(true);
    }
  };

  // Combine static and local storage list for the search/filter library page
  const staticWorkouts = getAllWorkouts();
  const allLibraryCombined = [...staticWorkouts, ...localWorkoutsList];

  const distanceFiltered = allLibraryCombined.filter((w) =>
    matchSidebarDistance(w, selectedDistance),
  );

  const filteredCombined = filterWorkouts(
    searchWorkouts(distanceFiltered, searchQuery),
    filters,
  );
  // Apply our selectedPreset if any
  let finalWorkoutsBeforeSort = filteredCombined;
  if (selectedPresetId) {
    const activePreset = FILTER_PRESETS.find((p) => p.id === selectedPresetId);
    if (activePreset) {
      finalWorkoutsBeforeSort = filteredCombined.filter((w) =>
        activePreset.apply(w),
      );
    }
  }

  // Category Selection and State Leak Reset Handler (BUG 3)
  const handleSelectCategory = (categoryName: string) => {
    setSelectedDistance(categoryName);
    setSearchQuery("");
    setSelectedPresetId(null);
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
    });
  };

  // Saved Vault Action Handlers
  const handleTogglePin = (localId: string) => {
    togglePinnedSavedItem(localId);
    refreshLocalSaved();
    showToast("Pin state updated!", "success");
  };

  const handleDuplicateSaved = (localId: string) => {
    const updated = duplicateSavedVaultItem(localId);
    refreshLocalSaved();
    showToast("Duplicated saved item successfully!", "success");
  };

  const handleDeleteSaved = (localId: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      deleteSavedVaultItem(localId);
      refreshLocalSaved();
      showToast(`Deleted "${title}" successfully.`, "success");
    }
  };

  const handleOpenEditDialog = (item: SavedVaultItem) => {
    setEditingItem(item);
    setEditNotes(item.notes || "");
    setEditTagsInput((item.localTags || []).join(", "));
  };

  const handleSaveEditChanges = () => {
    if (!editingItem) return;
    const tagsArray = editTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    updateSavedVaultItem(editingItem.localId, {
      notes: editNotes,
      localTags: tagsArray,
    });

    setEditingItem(null);
    refreshLocalSaved();
    showToast("Annotation saved successfully!", "success");
  };

  const renderSavedCard = (item: SavedVaultItem) => {
    const d = item.data || {};
    const isSupport =
      item.entryType?.includes("support") ||
      d.sessionStructure ||
      d.supportCategoryLabel;

    const typeLabel =
      item.entryType === "running-workout"
        ? "Curated Workout"
        : item.entryType === "support-routine"
          ? "Curated Support"
          : item.entryType === "custom-running-workout"
            ? "Custom Running"
            : "Custom Support";

    const typeColor =
      item.entryType === "running-workout"
        ? "bg-violet-50 text-violet-700 border-violet-100"
        : item.entryType === "support-routine"
          ? "bg-teal-50 text-teal-700 border-teal-100"
          : item.entryType === "custom-running-workout"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-blue-50 text-blue-700 border-blue-100";

    const savedDateFormatted = new Date(item.savedAt).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );

    return (
      <div
        key={item.localId}
        className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between relative group animate-fade-in text-slate-800"
      >
        <div>
          {/* Top category row & Pinned Badge */}
          <div className="flex justify-between items-start gap-1 pb-2">
            <div className="flex flex-wrap gap-1 items-center">
              <span
                className={`text-[9px] font-mono font-bold uppercase tracking-wide border px-1.5 py-0.5 rounded-md ${typeColor}`}
              >
                {typeLabel}
              </span>
              {item.pinned && (
                <span className="bg-orange-50 text-orange-600 text-[9px] border border-orange-100 px-1.5 py-0.5 rounded-md font-mono font-bold flex items-center gap-0.5">
                  <Pin className="w-2.5 h-2.5" /> PINNED
                </span>
              )}
            </div>

            <button
              onClick={() => handleTogglePin(item.localId)}
              title={
                item.pinned ? "Unpin this entry" : "Pin this entry to the top"
              }
              className={`p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 text-slate-400 hover:text-orange-550 cursor-pointer transition-colors ${
                item.pinned
                  ? "text-orange-500 border-orange-100 bg-orange-50/40"
                  : ""
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug font-display mt-1 group-hover:text-blue-650 transition-colors line-clamp-1">
            {sanitizeWorkoutTitle(item.title)}
          </h3>

          {/* Source Entry Detail References */}
          {item.createdFromLibrary ? (
            <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5 line-clamp-1">
              {item.sourceEntryTitle
                ? `Copy • Based on: ${sanitizeWorkoutTitle(item.sourceEntryTitle)}`
                : "Curated adaptation"}
            </p>
          ) : (
            <p className="text-[10px] text-emerald-600 font-mono font-black uppercase tracking-wider mt-0.5">
              ✦ Custom Design Craft
            </p>
          )}

          <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block mt-1.5">
            Saved {savedDateFormatted}
          </span>

          {/* Structure Metrics */}
          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-center">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                {isSupport ? "Focus Type" : "Distance"}
              </span>
              <span className="text-[10px] font-bold text-slate-800 font-mono truncate block">
                {isSupport
                  ? d.supportCategoryLabel || d.routineType || "Support Group"
                  : d.rawDistance && typeof d.rawDistance === "object"
                    ? `${d.rawDistance.min}-${d.rawDistance.max}k`
                    : d.estimatedDistanceKm
                      ? `~${d.estimatedDistanceKm}k`
                      : "Track Set"}
              </span>
            </div>
            <div className="border-l border-slate-200">
              <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                Duration
              </span>
              <span className="text-[10px] font-bold text-slate-800 font-mono truncate block">
                {d.rawDuration && typeof d.rawDuration === "object"
                  ? `${d.rawDuration.min}-${d.rawDuration.max}m`
                  : d.estimatedDurationMin
                    ? `~${d.estimatedDurationMin}m`
                    : "Untimed"}
              </span>
            </div>
          </div>

          {/* Local Note Section */}
          {item.notes && (
            <div className="my-2.5 p-2 bg-amber-50/50 border border-amber-100 rounded-xl text-[11px] leading-relaxed italic text-slate-600">
              <span className="font-bold text-amber-800 font-mono text-[9px] uppercase tracking-wide block not-italic leading-none mb-1">
                Local Training Note:
              </span>
              "${item.notes}"
            </div>
          )}

          {/* Local Tags badging */}
          {item.localTags && item.localTags.length > 0 && (
            <div className="flex flex-wrap gap-1 my-2">
              {item.localTags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions Button Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-150 flex flex-col gap-2">
          {/* Row 1 Primary actions */}
          <div className="flex gap-1">
            <button
              onClick={() => {
                setSelectedSlug(item.slug || `local-${item.localId}`);
                navigateTo(`library/${item.slug || `local-${item.localId}`}`);
              }}
              className="flex-1 py-1 px-2.5 rounded-lg border border-slate-200 bg-[#0F172A] hover:bg-slate-800 text-white hover:text-slate-100 cursor-pointer text-[10px] font-bold font-mono uppercase tracking-wider text-center"
            >
              Inspect
            </button>

            <button
              onClick={() => {
                const completeWorkout = {
                  ...item.data,
                  id: item.localId,
                  slug: item.slug || `local-${item.localId}`,
                  isCustom: true,
                };
                handleDuplicateToBuilder(completeWorkout);
              }}
              className="flex-1 py-1 px-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-pointer text-[10px] font-bold font-mono uppercase tracking-wider text-center transition-all"
            >
              Use Draft
            </button>
          </div>

          {/* Row 2 Admin secondary Actions */}
          <div className="flex justify-between items-center gap-1">
            <button
              onClick={() => handleOpenEditDialog(item)}
              className="text-[9px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 font-mono uppercase cursor-pointer"
              title="Edit notes & tags"
            >
              <Edit className="w-3 h-3" /> Note/Tag
            </button>

            <div className="flex gap-1">
              <button
                onClick={() => {
                  const completeWorkout = {
                    ...item.data,
                    id: item.localId,
                    localId: item.localId,
                    slug: item.slug || `local-${item.localId}`,
                    title: item.title,
                    summary: item.notes || item.data?.summary || "",
                    isCustom: true,
                    entryType: item.entryType,
                  };
                  handleToggleCompare(completeWorkout);
                }}
                className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                  isItemInCompareTray({
                    id: item.localId,
                    localId: item.localId,
                    slug: item.slug || `local-${item.localId}`,
                  })
                    ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    : "border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-500"
                }`}
                title="Toggle Workout Comparison State"
              >
                <GitCompare className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  const completeWorkout = {
                    ...item.data,
                    id: `custom-export-${item.localId}`,
                    slug: `custom-export-${item.localId}`,
                    isCustom: true,
                  };
                  setExportSelectedWorkout(completeWorkout);
                  setExportTemplate(getDefaultExportTemplateForEntry(completeWorkout));
                  navigateTo("export");
                }}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-500 cursor-pointer transition-colors"
                title="Open Sharing Cards Export Studio"
              >
                <Share2 className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleDuplicateSaved(item.localId)}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
                title="Duplicate entry in Saved Vault list"
              >
                <Copy className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleDeleteSaved(item.localId, item.title)}
                className="p-1.5 rounded-lg border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                title="Delete from browser cache"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sortedCombined = sortWorkouts(finalWorkoutsBeforeSort, sortKey);

  const filterMetrics = getAllWorkouts().length > 0 ? getWorkoutIndex() : null;

  return (
    <div className="min-h-screen flex text-slate-900 bg-[#F4F7FB] transition-colors duration-250 font-sans">
      {/* 1. Global Left Categories Menu Panel */}
      <LeftSidebar
        selectedDistance={selectedDistance}
        onSelectDistance={(dist) => {
          handleSelectCategory(dist);
        }}
        workouts={allLibraryCombined}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onNavigateHome={() => {
          handleSelectCategory("All Workouts");
          navigateTo("");
        }}
        onNavigateTo={navigateTo}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* 2. Global Right Workspace Wrapper (Adjust padding on desktop to clear Left Fixed Sidebar) */}
      <div
        className={`flex-1 flex flex-col ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"} min-w-0 transition-all duration-200`}
      >
        {/* Dynamic clipboard override popup modal */}
        {showClipboardOverlay && (
          <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 max-w-xl w-full flex flex-col gap-4 shadow-2xl animate-fade-in text-slate-900 ">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
                  Structured Alternate Output
                </span>
                <button
                  onClick={() => setShowClipboardOverlay(false)}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-mono tracking-wide cursor-pointer text-slate-700 font-bold"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-slate-500 ">
                Your formatted training card has been processed. Copy directly
                inside the editor below.
              </p>

              <textarea
                readOnly
                rows={12}
                value={clipboardText}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="w-full font-mono text-[11px] leading-relaxed p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 h-96 overflow-y-auto"
              />

              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => {
                    copyToClipboard(clipboardText);
                    showToast("Copied to clipboard!", "success");
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Force Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Top Horizontal Header (Clean, sleek, search & profile indicator) */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8F0] w-full h-18 flex items-center">
          <div className="page-container flex items-center justify-between w-full">
            {/* Left Header Brand Trigger (Hamburger for Mobile) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-[#E2E8F0] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Category Title/Indicator or Mini Title */}
              <div className="hidden sm:block">
                <div onClick={() => navigateTo("")} className="cursor-pointer">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#64748B] block uppercase">
                    Runner Performance Hub
                  </span>
                  <span className="text-sm font-black text-slate-900 tracking-tight uppercase font-display">
                    Track.Vault
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Nav Tab list */}
            <nav className="flex space-x-1 border border-slate-100 bg-slate-50/50 p-1 rounded-2xl text-xs font-bold leading-none">
              <button
                onClick={() => navigateTo("")}
                className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeRoute === "home"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo("library")}
                className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeRoute === "library" || activeRoute === "detail"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Library
              </button>
              <button
                onClick={() => navigateTo("builder")}
                className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeRoute === "builder"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Builder
              </button>
              <button
                onClick={() => navigateTo("saved")}
                className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeRoute === "saved"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>Saved</span>
                {localWorkoutsList.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-blue-600 text-white leading-none">
                    {localWorkoutsList.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigateTo("about")}
                className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeRoute === "about"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                About
              </button>
            </nav>

            {/* Right Nav Options (Universal Search & Initials Bubble) */}
            <div className="flex items-center gap-3">
              {/* Header Input Search Autodelegation */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search Vault..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeRoute !== "library") {
                      setSelectedDistance("All Workouts");
                      navigateTo("library");
                    }
                  }}
                  className="w-40 xl:w-52 py-1.5 pl-3 pr-8 text-sm bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 placeholder:text-slate-400 font-medium text-slate-800 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 4. Main content pages view framework */}
        <main className="flex-1 w-full page-container pt-10 pb-16 flex flex-col justify-start">
          {/* ====================================
 PAGE 1: HOME PAGE (activeRoute === "home") 
 ==================================== */}
          {activeRoute === "home" && (
            <>
              <div className="space-y-12 animate-fade-in w-full text-slate-800">
                {/* Visual, real-capacity upgraded Hero Banner */}
                <DashboardHero
                  staticWorkouts={staticWorkouts}
                  localWorkoutsList={localWorkoutsList}
                  onNavigate={navigateTo}
                  onSelectCategory={() => {}}
                />

                {/* Structured Variable Size Stats Summary Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">
                    System Overview & Diagnostics
                  </h3>
                  <DashboardSummaryGrid
                    staticWorkouts={staticWorkouts}
                    localWorkoutsList={localWorkoutsList}
                    onNavigate={navigateTo}
                    onSelectCategory={() => {}}
                  />
                </div>

                {/* Upgraded Premium Categorized Showcase Grid */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#64748B] font-mono">
                      Structured Curated Index
                    </h3>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display uppercase">
                      Workout Library Coverage
                    </h2>
                    <p className="text-xs text-slate-500 max-w-xl font-medium leading-relaxed">
                      Delve into focused training matrices categorized by
                      scientific block divisions, track durations, loading
                      metrics, and musculoskeletal recovery disciplines.
                    </p>
                  </div>

                  <DashboardCategoryShowcase
                    staticWorkouts={staticWorkouts}
                    localWorkoutsList={localWorkoutsList}
                    onNavigate={navigateTo}
                    onSelectCategory={(categoryName) => {
                      handleSelectCategory(categoryName);
                      navigateTo("library");
                    }}
                  />
                </div>

                {/* Local Storage Saved summary row */}
                {localWorkoutsList.length > 0 && (
                  <div
                    onClick={() => navigateTo("saved")}
                    className="group bg-white p-5 rounded-3xl border-2 border-dashed border-blue-500/20 hover:border-blue-600 transition-all cursor-pointer shadow-sm flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-lg">
                        ⭐
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-[#0F172A] uppercase transition-colors group-hover:text-blue-600 font-display">
                          LOCAL PROGRAM CLIPS
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          See your customized designed intervals browser cache
                          list.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                      {localWorkoutsList.length} SAVED
                    </span>
                  </div>
                )}
              </div>

              <div className="hidden">
                <div className="space-y-8 animate-fade-in w-full">
                  {/* Track.Vault Workout Library Hero & Utility Grid */}
                  <div className="space-y-6">
                    {/* Full-Width Real-utility Hero Banner */}
                    <div className="w-full bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[260px]">
                      <div className="space-y-4 z-10">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 uppercase font-display">
                          Track.Vault Workout Library
                        </h1>

                        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">
                          A zero-database running workout vault for browsing,
                          building, saving locally, copying, and exporting
                          workout cards.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-6 z-10">
                        <button
                          onClick={() => navigateTo("library")}
                          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center gap-1.5"
                        >
                          <BookOpen className="w-4 h-4" /> Browse Library
                        </button>
                        <button
                          onClick={() => navigateTo("builder")}
                          className="px-5 py-3 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <PlusCircle className="w-4 h-4 text-blue-600" /> Open
                          Builder
                        </button>
                      </div>
                    </div>

                    {/* Honest Track.Vault Real Utility Metric widgets */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      {/* 1. Total Entries */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-slate-900 font-mono block">
                            {staticWorkouts.length}
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter mt-1 block">
                            Total Entries
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight font-medium">
                            Static references in frozen library.
                          </span>
                        </div>
                      </div>

                      {/* 2. Running Workouts */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-550 flex items-center justify-center mb-3">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-slate-900 font-mono block">
                            {
                              staticWorkouts.filter(
                                (w) => w.entryType !== "support-routine",
                              ).length
                            }
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter mt-1 block">
                            Running Workouts
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight font-medium">
                            Speed development sessions.
                          </span>
                        </div>
                      </div>

                      {/* 3. Support-Routines */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-slate-900 font-mono block">
                            {
                              staticWorkouts.filter(
                                (w) => w.entryType === "support-routine",
                              ).length
                            }
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter mt-1 block">
                            Support-Routines
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight font-medium">
                            Physical prep & active recovery.
                          </span>
                        </div>
                      </div>

                      {/* 4. Total Categories */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-slate-900 font-mono block">
                            26
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter mt-1 block">
                            Total Categories
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight font-medium">
                            15 Running + 11 Support modules.
                          </span>
                        </div>
                      </div>

                      {/* 5. Local Saved Workouts */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3 font-bold text-center pl-1 pt-0.5">
                          ★
                        </div>
                        <div>
                          <span className="text-2xl font-black text-slate-900 font-mono block">
                            {localWorkoutsList.length}
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter mt-1 block">
                            Local Saves
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight font-medium">
                            Custom templates inside browser.
                          </span>
                        </div>
                      </div>

                      {/* 5. Export Ready */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[13px] font-black text-slate-900 uppercase font-mono block leading-7">
                            Ready
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter mt-1 block">
                            Export Cards
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight font-medium">
                            Generate high-resolution locking PNGs easily.
                          </span>
                        </div>
                      </div>

                      {/* 6. Zero Database */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-xl bg-[#FFF1F2] text-rose-500 flex items-center justify-center mb-3">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[13px] font-black text-slate-900 uppercase font-mono block leading-7">
                            Offline
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter mt-1 block">
                            Zero Database
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight font-medium">
                            Private storage. No credentials or tracking logs.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Training Module Grid Roadmap */}
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#64748B] font-mono">
                          Track & Field Index
                        </h3>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 font-display uppercase">
                          Workout Library Coverage
                        </h2>
                      </div>
                      <span className="text-[10px] bg-blue-50 border border-blue-100 px-2.5 py-1 font-bold text-blue-600 font-mono rounded-lg uppercase">
                        {getWorkoutIndex().categories.length} MODULES READY
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {getWorkoutIndex().categories.map((c) => {
                        const workoutsCount = getWorkoutsByCategory(
                          c.id,
                        ).length;

                        const isSupportCat = [
                          "upper-strength",
                          "lower-strength",
                          "core",
                          "mobility",
                          "activation",
                          "plyometric",
                          "running-drills",
                          "warmup",
                          "cooldown",
                          "recovery",
                          "injury-risk",
                        ].includes(c.id);

                        const entryType = isSupportCat
                          ? "Support Routine"
                          : "Running Workout";

                        return (
                          <div
                            key={c.id}
                            onClick={() => {
                              handleSelectCategory(c.name);
                              navigateTo("library");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleSelectCategory(c.name);
                                navigateTo("library");
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Category ${c.name}, ${workoutsCount} presets, ${entryType}`}
                            className="group bg-white p-5 rounded-3xl border border-[#E2E8F0] hover:border-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div
                                  className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${
                                    isSupportCat
                                      ? "bg-violet-50/70 border-violet-100 text-violet-600 group-hover:bg-violet-100 group-hover:text-violet-700"
                                      : "bg-blue-50/70 border-blue-100 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                                  }`}
                                >
                                  <TrackVaultIcon
                                    id={c.id}
                                    className="w-5 h-5"
                                    strokeWidth={2}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 font-mono">
                                  {workoutsCount} PRESETS
                                </span>
                              </div>
                              <h4 className="font-extrabold text-sm leading-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase font-display">
                                {c.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                {c.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Local Storage Saved summary row */}
                  {localWorkoutsList.length > 0 && (
                    <div
                      onClick={() => navigateTo("saved")}
                      className="group bg-white p-5 rounded-3xl border-2 border-dashed border-blue-500/20 hover:border-blue-600 transition-all cursor-pointer shadow-sm flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-lg">
                          ⭐
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#0F172A] uppercase transition-colors group-hover:text-blue-600 font-display">
                            LOCAL PROGRAM CLIPS
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            See your customized designed intervals browser cache
                            list.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                        {localWorkoutsList.length} SAVED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ====================================
 PAGE 2: LIBRARY PAGE (activeRoute === "library") 
 ==================================== */}
          {activeRoute === "library" && (
            <div className="space-y-6 animate-fade-in w-full">
              {/* Page Header */}
              <div className="flex flex-col gap-1.5">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#0F172A] uppercase">
                  Browse Workout Vault
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-semibold">
                  Inspect athletic speed development templates. Use categorical
                  filters to trim the selection based on distance, level,
                  running interfaces, and pacing durations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Filters (Compact stickied sidebar block) */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-[90px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto pr-1">
                  {(() => {
                    const isSupportActive =
                      selectedDistance === "All Support" ||
                      trackVaultNavigation.supportNavigation.some(
                        (nav) =>
                          nav.label.toLowerCase() ===
                            selectedDistance.toLowerCase() ||
                          nav.id.toLowerCase() ===
                            selectedDistance.toLowerCase(),
                      );
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
                        isSupport={isSupportActive}
                      />
                    );
                  })()}
                </div>

                {/* Right Column: Search bar, sort, and grid of workout cards */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <WorkoutSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <WorkoutSort value={sortKey} onChange={setSortKey} />
                    </div>
                  </div>

                  <FilterPresetBar
                    selectedPresetId={selectedPresetId}
                    onSelectPreset={(presetId) => {
                      setSelectedPresetId(presetId);
                      // Clear category if switching active preset
                      if (presetId) {
                        setFilters((prev) => ({ ...prev, category: "All" }));
                      }
                    }}
                    resultsCount={sortedCombined.length}
                  />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-1 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-sm sm:text-base font-black font-display tracking-tight text-slate-850 uppercase">
                        {(() => {
                          if (
                            filters.category &&
                            filters.category !== "All" &&
                            filterMetrics
                          ) {
                            const selectedCat = filterMetrics.categories.find(
                              (c) => c.id === filters.category,
                            );
                            if (selectedCat) return `${selectedCat.name}`;
                          }
                          return selectedDistance === "All Workouts"
                            ? "All Categories"
                            : `${selectedDistance}`;
                        })()}
                      </h3>
                      {selectedPresetId && (
                        <p className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest leading-none">
                          Static Preset Filter:{" "}
                          {
                            FILTER_PRESETS.find(
                              (p) => p.id === selectedPresetId,
                            )?.label
                          }
                        </p>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                      {(() => {
                        const isSupport =
                          selectedDistance === "All Support" ||
                          trackVaultNavigation.supportNavigation.some(
                            (nav) =>
                              nav.label.toLowerCase() ===
                                selectedDistance.toLowerCase() ||
                              nav.id.toLowerCase() ===
                                selectedDistance.toLowerCase(),
                          );

                        const totalInTrack = distanceFiltered.length;
                        let labelUnits = "workouts";

                        if (isSupport) {
                          labelUnits = "support-routines";
                        } else {
                          labelUnits = "running workouts";
                          if (selectedDistance === "All Workouts") {
                            labelUnits = "workouts";
                          }
                        }

                        if (selectedPresetId) {
                          const presetLabel = FILTER_PRESETS.find(
                            (p) => p.id === selectedPresetId,
                          )?.label;
                          return `Showing ${sortedCombined.length} Filtered by ${presetLabel} (${labelUnits})`;
                        }
                        return `Showing ${sortedCombined.length} of ${totalInTrack} ${labelUnits}`;
                      })()}
                    </p>
                  </div>

                  {/* Grid layout results */}
                  {sortedCombined.length === 0 ? (
                    (() => {
                      const isAnyFilterActive =
                        searchQuery !== "" ||
                        selectedPresetId !== null ||
                        Object.values(filters).some((v) => v !== "All");
                      if (isAnyFilterActive) {
                        return (
                          <div className="flex flex-col items-center text-center p-10 max-w-xl mx-auto my-12 bg-white border border-[#E2E8F0] rounded-3xl shadow-xs space-y-4 font-sans">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100 shadow-xs">
                              <X className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black font-display tracking-tight text-slate-800 uppercase">
                              No entries match current parameters
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-md font-medium">
                              No workouts match your current filter parameters
                              or the active preset layer. Try resetting search
                              queries, clearing the preset, or returning
                              categories to wide defaults.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center pt-2">
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery("")}
                                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-905 font-bold tracking-wide rounded-xl cursor-pointer text-[10px] uppercase border border-slate-200 transition-all font-sans"
                                >
                                  Clear Search
                                </button>
                              )}
                              {selectedPresetId && (
                                <button
                                  onClick={() => setSelectedPresetId(null)}
                                  className="px-3.5 py-1.5 bg-blue-550 hover:bg-blue-600 text-white font-bold tracking-wide rounded-xl cursor-pointer text-[10px] uppercase shadow-xs transition-all font-sans"
                                >
                                  Clear Preset
                                </button>
                              )}
                              {Object.values(filters).some(
                                (v) => v !== "All",
                              ) && (
                                <button
                                  onClick={() =>
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
                                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold tracking-wide rounded-xl cursor-pointer text-[10px] uppercase border border-rose-150 transition-all font-sans"
                                >
                                  Clear Manual Filters
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <EmptyLibraryState
                          onNavigateToBuilder={() => navigateTo("builder")}
                        />
                      );
                    })()
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
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
                          isInCompare={isItemInCompareTray(w)}
                          onToggleCompare={handleToggleCompare}
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
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto w-full">
              {/* Quick Actions Bar */}
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0] ">
                <button
                  onClick={() => navigateTo("library")}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  Back to Library
                </button>

                <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest pl-2">
                  {(() => {
                    const workout = allLibraryCombined.find(
                      (w) => w.slug === selectedSlug,
                    );
                    if (!workout) return "Back to Library";
                    return workout.entryType === "support-routine"
                      ? `SUPPORT ROUTINE // ${workout.supportCategoryLabel || "Routine"}`
                      : `RUNNING WORKOUT // ${workout.distanceNavLabel || workout.primaryDistance || "Workout"}`;
                  })()}
                </span>
              </div>

              {/* Load Workout Details */}
              {(() => {
                const workout = allLibraryCombined.find(
                  (w) => w.slug === selectedSlug,
                );
                if (!workout) {
                  return (
                    <div className="py-12 text-center bg-white border border-[#E2E8F0] rounded-3xl p-6">
                      <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-800 ">
                        Workout Slug Not Found
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        This specific static url key represents a pending
                        database segment.
                      </p>
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
                  <EntryDetailPage
                    workout={workout}
                    onBack={() => navigateTo("library")}
                    onCopySimple={(w) => handleCopyClipboardText(w, "simple")}
                    onCopyMarkdown={(w) =>
                      handleCopyClipboardText(w, "structured-markdown")
                    }
                    onExport={(w) => handleSelectForExport(w)}
                    onClone={(w) => handleDuplicateToBuilder(w)}
                    isInCompare={workout ? isItemInCompareTray(workout) : false}
                    onToggleCompare={handleToggleCompare}
                  />
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
                <h2 className="text-2xl font-black font-display text-slate-900 uppercase tracking-tight flex items-baseline gap-1.5">
                  Workout Builder Lab{" "}
                  <span className="text-[10px] font-mono uppercase bg-blue-50 px-2 py-0.5 border border-blue-200 font-bold text-blue-600 rounded-lg">
                    Manual Creator
                  </span>
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-semibold">
                  Zero automatic algorithm generation. Design step-by-step
                  warmup repetition sets and cooldown profiles manually. Saves
                  locally.
                </p>
              </div>

              {/* Curated Library Draft Banner */}
              {builderWorkout.createdFromLibrary && (
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black font-display text-slate-900 uppercase tracking-tight flex items-center gap-1.5 leading-none">
                        Draft Created from Curated Template
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-slate-500 font-medium select-none">
                        <span>Based on:</span>
                        <span className="font-bold text-slate-850">
                          {builderWorkout.sourceEntryTitle ||
                            "Curated Template"}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="font-bold font-mono text-[9px] uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          {builderWorkout.sourceEntryType === "support-routine"
                            ? "Support Routine"
                            : "Running Workout"}
                        </span>
                        {builderWorkout.distanceNavId && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span className="font-bold uppercase font-mono text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded animate-pulse-slow">
                              Category: {builderWorkout.distanceNavId}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-semibold">
                        This is a local editable draft clone of the curated
                        database entry. The original curated library entry
                        remains strictly immutable and unaffected.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {builderWorkout.sourceEntrySlug && (
                      <button
                        onClick={() => {
                          setSelectedSlug(builderWorkout.sourceEntrySlug);
                          navigateTo(
                            `library/${builderWorkout.sourceEntrySlug}`,
                          );
                        }}
                        className="px-3 py-1.5 bg-white text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 font-bold font-mono text-[9px] uppercase rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        View Original Info
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setBuilderWorkout((prev) => ({
                          ...prev,
                          createdFromLibrary: false,
                          sourceEntrySlug: undefined,
                          sourceEntryId: undefined,
                          sourceEntryTitle: undefined,
                        }));
                      }}
                      className="px-3 py-1.5 bg-slate-205 hover:bg-slate-300 text-slate-700 font-bold font-mono text-[9px] uppercase rounded-xl transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left side editor form card components */}
                <div className="xl:col-span-7 space-y-6">
                  <WorkoutBasicInfoForm
                    workout={builderWorkout}
                    onChange={(fields) =>
                      setBuilderWorkout({ ...builderWorkout, ...fields })
                    }
                    intensityGuide={builderIntensityGuide}
                    onIntensityGuideChange={(guide) =>
                      setBuilderIntensityGuide(guide)
                    }
                  />

                  {builderWorkout.entryType === "custom-support-routine" ? (
                    <div className="space-y-6">
                      {/* Alert Info Box */}
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4.5 flex items-start gap-3 text-xs font-sans">
                        <div className="text-amber-600 shrink-0 mt-0.5">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-800">
                            Support Routine Customization Active
                          </p>
                          <p className="text-amber-700 mt-0.5 leading-relaxed font-semibold">
                            Support routine templates are designed as continuous
                            loops instead of running repetition steps. Customize
                            metadata, accessories list, target body focus, and
                            the structural session sets below.
                          </p>
                        </div>
                      </div>

                      {/* Configuration Grid */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm font-sans">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                          <Dumbbell className="w-4 h-4 text-blue-600" /> Support
                          Routine Configuration
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600">
                              Support Category Label
                            </label>
                            <input
                              type="text"
                              value={builderWorkout.supportCategoryLabel || ""}
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  supportCategoryLabel: e.target.value,
                                })
                              }
                              placeholder="e.g. Injury Warm-up"
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-sm rounded-xl text-[#0F172A] focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600">
                              Routine Type
                            </label>
                            <input
                              type="text"
                              value={builderWorkout.routineType || ""}
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  routineType: e.target.value,
                                })
                              }
                              placeholder="e.g. Mobility"
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-sm rounded-xl text-[#0F172A] focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600">
                              Duration (Minutes)
                            </label>
                            <input
                              type="number"
                              value={
                                builderWorkout.durationMin ||
                                builderWorkout.estimatedDurationMin ||
                                15
                              }
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  durationMin: parseInt(e.target.value) || 15,
                                  estimatedDurationMin:
                                    parseInt(e.target.value) || 15,
                                })
                              }
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-sm rounded-xl text-[#0F172A] focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2 md:col-span-3">
                            <label className="text-xs font-bold text-slate-600">
                              Equipment / Accessories List (comma isolated)
                            </label>
                            <input
                              type="text"
                              value={
                                builderWorkout.equipment
                                  ? builderWorkout.equipment.join(", ")
                                  : ""
                              }
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  equipment: e.target.value
                                    .split(",")
                                    .map((itm) => itm.trim())
                                    .filter(Boolean),
                                })
                              }
                              placeholder="e.g. Foam Roller, Resistance Loop Band"
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-sm rounded-xl text-[#0F172A] focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-1 md:col-span-1.5">
                            <label className="text-xs font-bold text-slate-600">
                              Target Body Focus (comma isolated)
                            </label>
                            <input
                              type="text"
                              value={
                                builderWorkout.bodyFocus
                                  ? builderWorkout.bodyFocus.join(", ")
                                  : ""
                              }
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  bodyFocus: e.target.value
                                    .split(",")
                                    .map((itm) => itm.trim())
                                    .filter(Boolean),
                                })
                              }
                              placeholder="e.g. Quads, Glutes, IT-Band"
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-sm rounded-xl text-[#0F172A] focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-1 md:col-span-1.5">
                            <label className="text-xs font-bold text-slate-600">
                              Key Movement Goals (comma isolated)
                            </label>
                            <input
                              type="text"
                              value={
                                builderWorkout.movementGoals
                                  ? builderWorkout.movementGoals.join(", ")
                                  : ""
                              }
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  movementGoals: e.target.value
                                    .split(",")
                                    .map((itm) => itm.trim())
                                    .filter(Boolean),
                                })
                              }
                              placeholder="e.g. Foam Rolling, Dynamic Range"
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-sm rounded-xl text-[#0F172A] focus:outline-none font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Session Exercises Structure */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm font-sans font-semibold text-slate-800">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-blue-600" /> Session
                          Exercises Structure
                        </h3>
                        <p className="text-[11px] text-slate-400 font-sans font-medium">
                          Describe step-by-step reps, sets, timing durations, or
                          foam roller instructions in prose or outlines.
                        </p>
                        <textarea
                          rows={10}
                          value={
                            typeof builderWorkout.sessionStructure === "string"
                              ? builderWorkout.sessionStructure
                              : ""
                          }
                          onChange={(e) =>
                            setBuilderWorkout({
                              ...builderWorkout,
                              sessionStructure: e.target.value,
                            })
                          }
                          placeholder="Step 1: Roll outer calves 10 passes each side..."
                          className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A] focus:outline-none font-mono"
                        />
                      </div>

                      {/* Routine Variants */}
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm font-sans font-medium">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                          <Compass className="w-4 h-4 text-blue-600" /> Routine
                          Grade Variants
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600">
                              Easier Variant Level
                            </label>
                            <textarea
                              rows={3}
                              value={
                                typeof builderWorkout.easierVariant === "string"
                                  ? builderWorkout.easierVariant
                                  : ""
                              }
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  easierVariant: e.target.value,
                                })
                              }
                              placeholder="e.g. Perform exercises on floor with support"
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-xs rounded-xl focus:outline-none font-sans font-semibold text-slate-750"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600">
                              Harder Variant Level
                            </label>
                            <textarea
                              rows={3}
                              value={
                                typeof builderWorkout.harderVariant === "string"
                                  ? builderWorkout.harderVariant
                                  : ""
                              }
                              onChange={(e) =>
                                setBuilderWorkout({
                                  ...builderWorkout,
                                  harderVariant: e.target.value,
                                })
                              }
                              placeholder="e.g. Elevate legs or increase resistance loops"
                              className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-xs rounded-xl focus:outline-none font-sans font-semibold text-slate-750"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <WorkoutBlockEditor
                        label="1. Warm-Up prescription Steps"
                        blocks={builderWorkout.warmup || []}
                        onChange={(blocks) =>
                          setBuilderWorkout({
                            ...builderWorkout,
                            warmup: blocks,
                          })
                        }
                        defaultType="warmup"
                      />

                      <WorkoutBlockEditor
                        label="2. Main set Prescription steps"
                        blocks={builderWorkout.mainSet || []}
                        onChange={(blocks) =>
                          setBuilderWorkout({
                            ...builderWorkout,
                            mainSet: blocks,
                          })
                        }
                        defaultType="interval"
                      />

                      <WorkoutBlockEditor
                        label="3. Cooldown prescription Steps"
                        blocks={builderWorkout.cooldown || []}
                        onChange={(blocks) =>
                          setBuilderWorkout({
                            ...builderWorkout,
                            cooldown: blocks,
                          })
                        }
                        defaultType="cooldown"
                      />
                    </>
                  )}

                  <WorkoutNotesEditor
                    coachingNotes={builderWorkout.coachingNotes || []}
                    setCoachingNotes={(notes) =>
                      setBuilderWorkout({
                        ...builderWorkout,
                        coachingNotes: notes,
                      })
                    }
                    safetyNotes={builderWorkout.safetyNotes || []}
                    setSafetyNotes={(notes) =>
                      setBuilderWorkout({
                        ...builderWorkout,
                        safetyNotes: notes,
                      })
                    }
                    commonMistakes={builderWorkout.commonMistakes || []}
                    setCommonMistakes={(mistakes) =>
                      setBuilderWorkout({
                        ...builderWorkout,
                        commonMistakes: mistakes,
                      })
                    }
                  />
                </div>

                {/* Right side floating live preview component */}
                <div className="xl:col-span-5 lg:sticky lg:top-24 space-y-4">
                  <div className="flex justify-between items-center bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-black">
                      Live Construct Preview
                    </span>
                    <span className="text-[9px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold uppercase leading-none">
                      UNSAVED DRAFT
                    </span>
                  </div>

                  <WorkoutPreview
                    workout={{
                      ...builderWorkout,
                      intensityGuide: builderIntensityGuide,
                    }}
                  />

                  <BuilderQualityChecklist
                    workout={builderWorkout}
                    intensityGuide={builderIntensityGuide}
                    entryType={builderWorkout.entryType}
                  />
                </div>
              </div>

              {/* Action controller bar layout footer */}
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
                  if (
                    confirm(
                      "Are you sure you want to clear your current progress?",
                    )
                  ) {
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
                  setExportTemplate(getDefaultExportTemplateForEntry(completeWorkout));
                  navigateTo("export");
                }}
                copiedState={clipboardFeedback}
                isValid={
                  !!builderWorkout.title &&
                  !!builderWorkout.summary &&
                  (builderWorkout.entryType === "custom-support-routine"
                    ? !!builderWorkout.sessionStructure
                    : (builderWorkout.mainSet?.length || 0) > 0)
                }
              />
            </div>
          )}

          {/* ====================================
 PAGE 5: SAVED PAGE (activeRoute === "saved") 
 ==================================== */}
          {activeRoute === "saved" &&
            (() => {
              const searchedItems = searchSavedVaultItems(
                localSavedItems,
                savedSearchQuery,
              );
              const filteredItems = filterSavedVaultItems(searchedItems, {
                categoryType: savedCategoryFilter as any,
                sortBy: savedSortBy as any,
              });

              const pinnedItemsList = filteredItems.filter((it) => it.pinned);
              const unpinnedItemsList = filteredItems.filter(
                (it) => !it.pinned,
              );

              return (
                <div className="space-y-6 animate-fade-in w-full text-slate-800">
                  {/* Header Block with Trust Badges */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight flex items-baseline gap-2">
                        SAVED VAULT
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono border border-emerald-100 px-2.5 py-0.5 rounded-lg font-black uppercase">
                          Local-Only
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 font-semibold">
                        Saved entries are stored only in this browser. Stored
                        offline, data stays 100% inside your client physical
                        browser.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-center text-xs self-center">
                        <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase leading-none">
                          Security Status
                        </span>
                        <span className="text-xs font-bold text-slate-700 font-mono mt-1 block">
                          🔒 Zero Database / Zero AI
                        </span>
                      </div>
                      {localSavedItems.length > 0 && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to completely wipe your browser training vault? This is irreversible!",
                              )
                            ) {
                              clearSavedVault();
                              refreshLocalSaved();
                              showToast("Vault completely wiped.", "info");
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors uppercase font-mono tracking-wider cursor-pointer"
                        >
                          Clear Vault
                        </button>
                      )}
                    </div>
                  </div>

                  {localSavedItems.length === 0 ? (
                    /* Elegant Empty State Page */
                    <div className="py-16 text-center max-w-2xl mx-auto space-y-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
                        <Bookmark className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-950 uppercase tracking-wide font-display">
                          Your Training Vault is Empty
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-semibold">
                          You haven't saved any coached workouts or programmed
                          templates yet. Stored strictly client-side, your
                          library runs offline with zero server sync.
                        </p>
                      </div>
                      <div className="flex justify-center gap-3 pt-2">
                        <button
                          onClick={() => navigateTo("library")}
                          className="px-5 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all font-sans"
                        >
                          Browse Library
                        </button>
                        <button
                          onClick={() => navigateTo("builder")}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all font-sans"
                        >
                          Launch Builder
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Visual Real totals grid summary card row */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Bookmark className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                              Total Saved
                            </span>
                            <span className="text-lg font-black text-slate-900 mt-1 block">
                              {localSavedItems.length}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                            <Pin className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                              Pinned List
                            </span>
                            <span className="text-lg font-black text-slate-900 mt-1 block">
                              {localSavedItems.filter((it) => it.pinned).length}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                          <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                              Running List
                            </span>
                            <span className="text-lg font-black text-slate-900 mt-1 block">
                              {
                                localSavedItems.filter(
                                  (it) => it.entryType === "running-workout",
                                ).length
                              }
                            </span>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-650 border border-teal-100">
                            <Dumbbell className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                              Support List
                            </span>
                            <span className="text-lg font-black text-slate-900 mt-1 block">
                              {
                                localSavedItems.filter(
                                  (it) => it.entryType === "support-routine",
                                ).length
                              }
                            </span>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs col-span-2 lg:col-span-1">
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                              Custom Drafts
                            </span>
                            <span className="text-lg font-black text-slate-900 mt-1 block">
                              {
                                localSavedItems.filter(
                                  (it) =>
                                    it.entryType?.startsWith("custom") ||
                                    it.data.isCustom,
                                ).length
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controls Filter Options Panel */}
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search by title, original workouts, keywords, internal coaching notes, saved tags..."
                              value={savedSearchQuery}
                              onChange={(e) =>
                                setSavedSearchQuery(e.target.value)
                              }
                              className="w-full pl-10 pr-16 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden text-slate-800"
                            />
                            {savedSearchQuery && (
                              <button
                                onClick={() => setSavedSearchQuery("")}
                                className="absolute right-3.5 top-2.5 text-[10px] font-mono font-black text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                CLEAR
                              </button>
                            )}
                          </div>

                          <div className="shrink-0">
                            <select
                              value={savedSortBy}
                              onChange={(e) => setSavedSortBy(e.target.value)}
                              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                            >
                              <option value="recent">⏱️ Recently Saved</option>
                              <option value="title-asc">🔤 Title A-Z</option>
                              <option value="type">📂 Category Type</option>
                              <option value="pinned-first">
                                📌 Pin Items First
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/50">
                          {[
                            {
                              id: "all",
                              label: "All Items",
                              count: localSavedItems.length,
                            },
                            {
                              id: "running-workout",
                              label: "Running Workouts",
                              count: localSavedItems.filter(
                                (it) => it.entryType === "running-workout",
                              ).length,
                            },
                            {
                              id: "support-routine",
                              label: "Support-Routines",
                              count: localSavedItems.filter(
                                (it) => it.entryType === "support-routine",
                              ).length,
                            },
                            {
                              id: "custom-running",
                              label: "Custom Running Drafts",
                              count: localSavedItems.filter(
                                (it) =>
                                  it.entryType === "custom-running-workout",
                              ).length,
                            },
                            {
                              id: "custom-support",
                              label: "Custom Support Drafts",
                              count: localSavedItems.filter(
                                (it) =>
                                  it.entryType === "custom-support-routine",
                              ).length,
                            },
                            {
                              id: "pinned",
                              label: "Pinned Only",
                              count: localSavedItems.filter((it) => it.pinned)
                                .length,
                            },
                          ].map((btn) => (
                            <button
                              key={btn.id}
                              onClick={() => setSavedCategoryFilter(btn.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 border ${
                                savedCategoryFilter === btn.id
                                  ? "bg-blue-600 text-white border-blue-650"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              <span>{btn.label}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded ${
                                  savedCategoryFilter === btn.id
                                    ? "bg-blue-700 text-blue-100"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {btn.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Results Grid Displays */}
                      {filteredItems.length === 0 ? (
                        (() => {
                          if (savedCategoryFilter === "custom-running") {
                            return (
                              <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                                  <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-display">
                                    No Custom Running Drafts Stored
                                  </h4>
                                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    You haven't saved any custom running workouts yet. Tap the Workout Builder to design and save a custom intervals draft.
                                  </p>
                                </div>
                                <button
                                  onClick={() => navigateTo("builder")}
                                  className="px-4 py-2 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
                                >
                                  Go to Workout Builder
                                </button>
                              </div>
                            );
                          }
                          if (savedCategoryFilter === "custom-support") {
                            return (
                              <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-650">
                                  <Dumbbell className="w-5 h-5" />
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-display">
                                    No Custom Support Drafts Stored
                                  </h4>
                                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    Your custom strength or mobility routine list is empty. Go to the Workout Builder page to draft and preserve local custom routines.
                                  </p>
                                </div>
                                <button
                                  onClick={() => navigateTo("builder")}
                                  className="px-4 py-2 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
                                >
                                  Go to Workout Builder
                                </button>
                              </div>
                            );
                          }
                          if (savedCategoryFilter === "pinned") {
                            return (
                              <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                                <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto text-orange-550">
                                  <Pin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-display">
                                    No Pinned Training Cards
                                  </h4>
                                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    Pin your favorite sessions to find them here instantly! Click the Pin icon in the top right of any training card in your library or vault.
                                  </p>
                                </div>
                                <button
                                  onClick={() => setSavedCategoryFilter("all")}
                                  className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-200 transition-colors"
                                >
                                  Browse All Saved Items
                                </button>
                              </div>
                            );
                          }
                          return (
                            <div className="py-12 text-center max-w-md mx-auto space-y-3 bg-white border border-slate-200 rounded-3xl p-6">
                              <Search className="w-8 h-8 text-slate-350 mx-auto" />
                              <h4 className="text-xs font-bold text-slate-700">
                                No matching items in your search filters.
                              </h4>
                              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                                Try typing a different name or note comment, or
                                clear your query entirely to reset your metrics.
                              </p>
                              <button
                                onClick={() => {
                                  setSavedSearchQuery("");
                                  setSavedCategoryFilter("all");
                                }}
                                className="px-3.5 py-1.5 bg-slate-900 text-white text-[10px] font-mono tracking-wide rounded-md font-bold uppercase mt-1 cursor-pointer"
                              >
                                Reset Filtering Queries
                              </button>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="space-y-8">
                          {/* Pinned Section */}
                          {pinnedItemsList.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-1.5 text-xs text-orange-500 font-mono font-black uppercase tracking-wider pl-1">
                                <Pin className="w-3.5 h-3.5" />
                                <span>
                                  PINNED ENTRIES ({pinnedItemsList.length})
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {pinnedItemsList.map((item) =>
                                  renderSavedCard(item),
                                )}
                              </div>
                            </div>
                          )}

                          {/* General Section */}
                          {unpinnedItemsList.length > 0 && (
                            <div className="space-y-3 mt-4">
                              {pinnedItemsList.length > 0 && (
                                <div className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider pl-1 border-t border-slate-100 pt-5">
                                  <span>
                                    ALL VAULT ENTRIES (
                                    {unpinnedItemsList.length})
                                  </span>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {unpinnedItemsList.map((item) =>
                                  renderSavedCard(item),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Note/Tag Annotations Editor Modal Overlays */}
                  {editingItem && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
                      <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 max-w-md w-full space-y-4 animate-scale-up text-slate-800">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="text-sm font-black font-mono uppercase tracking-widest text-slate-950">
                            Edit Training Annotations
                          </h3>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3.5">
                          <p className="text-xs text-slate-500 font-semibold italic border-l-2 border-blue-500 pl-2 leading-relaxed">
                            "{editingItem.title}"
                          </p>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block font-bold">
                              Local Workout Notes:
                            </label>
                            <textarea
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="e.g. Done on track in light rain. Felt good. Target pacing was hard to hit at step 3."
                              className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block block font-bold flex justify-between">
                              <span>Local Custom Tags (comma-separated):</span>
                              <span className="text-slate-300">
                                Max 5 advised
                              </span>
                            </label>
                            <input
                              type="text"
                              value={editTagsInput}
                              onChange={(e) => setEditTagsInput(e.target.value)}
                              placeholder="e.g. recovery, track, outdoor"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEditChanges}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Save Annotations
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          {/* ====================================
 PAGE 6: EXPORT STUDIO PAGE (activeRoute === "export") 
 ==================================== */}
          {activeRoute === "export" && (
            <div className="space-y-6 animate-fade-in w-full">
              {/* Page Header */}
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 uppercase tracking-tight flex flex-wrap items-baseline gap-2">
                  Card Exporter Studio{" "}
                  <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-mono uppercase rounded-lg px-2.5 py-1 font-bold ">
                    PNG GENERATOR
                  </span>
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-semibold">
                  Convert workout structures into clean high-resolution share
                  cards optimized for phone lockscrens, Strava uploads, fitness
                  blogs, or coaches' templates.
                </p>
              </div>

              {!exportSelectedWorkout ? (
                <div className="py-16 text-center max-w-2xl mx-auto space-y-6 bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-blue-50 border border-[#E2E8F0] flex items-center justify-center mx-auto text-blue-600">
                    <Share2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide font-display">
                      No Workout Selected for Exporter
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-semibold">
                      Select any curater running workout in the library or
                      program a custom repetition set first to initialize
                      parameters.
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => navigateTo("library")}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Select in Library
                    </button>
                    <button
                      onClick={() => navigateTo("builder")}
                      className="px-5 py-3 border border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Program Custom
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      onClick={() => navigateTo("library")}
                      className="text-slate-400 hover:text-blue-600 font-bold transition-colors cursor-pointer uppercase"
                    >
                      Library
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="font-semibold text-slate-800 font-display">
                      Exporter Studio: {exportSelectedWorkout.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Controls column */}
                    <div className="lg:col-span-5">
                      <ExportCardControls
                        workout={exportSelectedWorkout}
                        template={exportTemplate}
                        setTemplate={setExportTemplate}
                        theme={exportTheme}
                        setTheme={setExportTheme}
                        size={exportSize}
                        setSize={setExportSize as any}
                        showBrandFooter={exportShowBrandFooter}
                        setShowBrandFooter={setExportShowBrandFooter}
                      />
                    </div>

                    {/* Right live high-res card display node column */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-400 uppercase tracking-widest font-black">
                          EST Share-Card Render Preview
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-[#F1F3F6] px-2.5 py-1 rounded-lg">
                          Size: {exportSize.toUpperCase()} // Aspect Ratio
                        </span>
                      </div>

                      <WorkoutCardPreview
                        showBrandFooter={exportShowBrandFooter}
                        workout={exportSelectedWorkout}
                        template={exportTemplate}
                        theme={exportTheme}
                        size={exportSize}
                      />

                      {/* Quality disclaimer */}
                      <p className="text-[10px] text-slate-400 text-center leading-relaxed font-semibold">
                        💡 Click "Download PNG Card." The output card is
                        rendered crisp at{" "}
                        {exportSize === "story"
                          ? "1080x1920"
                          : exportSize === "square"
                            ? "1080x1080"
                            : "1200x675"}{" "}
                        pixels size regardless of your screen viewport size.
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
              <div className="border-b border-[#E2E8F0] pb-5">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight uppercase">
                  About Track.Vault
                </h2>
                <span className="text-xs uppercase font-mono tracking-widest text-[#64748B] font-bold block mt-1">
                  Zero-Database running workout vault
                </span>
              </div>

              <div className="space-y-6 text-sm text-[#0F172A] leading-relaxed font-sans">
                {/* Critical Service Limitations Banner */}
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                  <h4 className="font-bold text-blue-600 font-mono text-xs uppercase mb-2">
                    Scope of Service & Limitations
                  </h4>
                  <p className="text-slate-700 text-xs sm:text-sm font-bold">
                    Track.Vault does not track VO2max, strain, readiness,
                    calories, TSS, or live physiological metrics. It is a static
                    workout library and builder.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border border-[#E2E8F0] rounded-3xl">
                  <h4 className="font-bold text-slate-700 font-mono text-xs uppercase mb-2">
                    Track.Vault v1.2 updates
                  </h4>
                  <div className="text-slate-700 text-xs sm:text-sm">
                    <strong>Track.Vault v1.2 includes:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>1,300 curated static entries</li>
                      <li>750 running workouts</li>
                      <li>550 support-routines</li>
                      <li>zero database</li>
                      <li>no account</li>
                      <li>no telemetry</li>
                      <li>no fake performance analytics</li>
                      <li>localStorage only for saved custom workouts</li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border border-[#E2E8F0] rounded-3xl mt-6">
                  <h4 className="font-bold text-slate-700 font-mono text-xs uppercase mb-2">
                    Coaching & Load Principle Framework
                  </h4>
                  <p className="text-[#334155] text-xs sm:text-sm font-medium">
                    Track.Vault is designed with structured training principles.
                    Every category block aligns directly with specific energy
                    system demands. Warmup phases include cardiovascular
                    strides, mainsets target particular physiological clearance
                    velocities, and active recoveries enable full cellular
                    recovery.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black font-display tracking-tight text-[#0F172A] uppercase">
                    Core Pillars
                  </h3>
                  <ul className="space-y-3 pl-1 text-sm text-[#374151] font-semibold">
                    <li className="flex items-start gap-2.5 flex-row">
                      <span className="text-blue-600 font-bold text-lg leading-none">
                        ⚡
                      </span>
                      <div>
                        <strong className="text-slate-900 ">
                          Strict Static Catalog:
                        </strong>{" "}
                        The baseline workout catalog is fully static. Storing
                        files as indexed, frozen JSON arrays guarantees
                        lighting-fast response speeds, 100% offline uptime, and
                        pristine preservation of workout parameters.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 flex-row">
                      <span className="text-blue-600 font-bold text-lg leading-none">
                        ⚡
                      </span>
                      <div>
                        <strong className="text-slate-900 ">
                          Absolute Local Sandbox Security:
                        </strong>{" "}
                        We run no background telemetry trackers, API
                        synchronization, or cloud cookies. Because we collect no
                        custom user details, saved workout profiles remain
                        entirely locked inside your browser.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 flex-row">
                      <span className="text-blue-600 font-bold text-lg leading-none">
                        ⚡
                      </span>
                      <div>
                        <strong className="text-slate-900 ">
                          Modern Share Canvas:
                        </strong>{" "}
                        Physical exercise schedules copy directly into clean
                        Markdown, or render into gorgeous PNG graphics optimized
                        for lockscreens or Strava maps without relying on
                        complex backend layers.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 pt-6 border-t border-[#E2E8F0]">
                  <h3 className="text-lg font-black font-display tracking-tight text-rose-600 uppercase flex items-center gap-1.5 font-display">
                    <AlertTriangle className="w-5 h-5 text-rose-500" /> Coaching
                    Disclaimer
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 bg-slate-50 border border-[#E2E8F0] p-5 rounded-2xl leading-relaxed">
                    Workouts provided inside the static library are designed
                    solely as general indices. They are not constructed as
                    personalized medical, health, wellness, physical rehab, or
                    individual coaching suggestions. Runners should seek advice
                    from certified performance experts or coaches before
                    training at intense anaerobic thresholds, severe speeds, or
                    maximum lactic limits.
                  </p>
                </div>
              </div>

              {/* Footer stamp */}
              <div className="pt-8 border-t border-[#E2E8F0] text-center font-mono text-[9px] text-[#64748B] font-bold uppercase tracking-wider">
                TRACK.VAULT // ZERO DATABASE PRIVATE RUNNING WORKOUT LIBRARY
                v1.1
              </div>
            </div>
          )}
        </main>

        {/* 5. Clean, integrated minimal Footer */}
        <footer className="bg-white text-slate-900 mt-16 py-8 border-t border-[#E2E8F0] font-sans">
          <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                TV
              </div>
              <span className="font-extrabold font-display text-xs tracking-tight text-slate-900 uppercase">
                TRACK.VAULT // BROWSE. BUILD. EXPORT. RUN.
              </span>
            </div>

            <p className="text-[10px] text-[#64748B] leading-relaxed font-mono font-bold uppercase tracking-wider text-center md:text-right">
              ESTABLISHED 2026 // data stored locally in client browser context.
            </p>
          </div>
        </footer>

        {/* Elegant Toast notification overlay */}
        {toast && (
          <div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white text-slate-800 max-w-sm"
            style={{
              borderColor:
                toast.type === "error"
                  ? "#EF4444"
                  : toast.type === "info"
                    ? "#3B82F6"
                    : "#10B981",
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-500" : toast.type === "info" ? "bg-blue-500" : "bg-emerald-500"}`}
            />
            <span className="text-xs font-semibold leading-relaxed font-sans">
              {toast.message}
            </span>
          </div>
        )}

        {/* Modern Comparison Components */}
        <CompareBar
          items={compareItems}
          onRemove={handleRemoveCompareItem}
          onClear={handleClearCompare}
          onOpenCompare={() => setIsCompareDrawerOpen(true)}
        />

        <CompareDrawer
          isOpen={isCompareDrawerOpen}
          onClose={() => setIsCompareDrawerOpen(false)}
          items={compareItems}
          onRemove={handleRemoveCompareItem}
          onInspect={(slug) => {
            setSelectedSlug(slug);
            navigateTo(`library/${slug}`);
            setIsCompareDrawerOpen(false);
          }}
          onUseDraft={(workout) => {
            handleDuplicateToBuilder(workout);
            setIsCompareDrawerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
