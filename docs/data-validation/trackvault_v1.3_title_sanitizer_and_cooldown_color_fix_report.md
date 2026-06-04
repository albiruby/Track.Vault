# Track.Vault v1.3 - Title Sanitizer and Cooldown Color Repair Report

## 1. Executive Summary

This report outlines the technical findings and remediation actions implemented for **Track.Vault v1.3** concerning:
1. Suffix text remnants (e.g., "[Set 1]", "[Set 2]", "[Set 3]", "[Set ...]") appearing incorrectly on workout titles.
2. The fainted, nearly invisible design color of the Cooldown (CD) stage in the workout phase timeline component.

Both issues have been successfully addressed, and subsequent compiler builds were fully validated.

---

## 2. PART A: Suffix Title Sanitizer

### Discovery & Root Cause Analysis
During manual data creation or copy compilation cycles, some curated workouts retained metadata suffixes denoting sequencing steps (such as `[Set 3]` or ` - Set 1`). To resolve this without altering the underlying raw historical data library schema, a client-side display sanitizer was designed.

### Technical Implementation
We designed a regex-driven helper function `sanitizeWorkoutTitle` in `/src/lib/displayTitle.ts`:

```typescript
export function sanitizeWorkoutTitle(title: string | undefined): string {
  if (!title) return "";
  return title
    .replace(/\s*[\[\(]Set\s*\d+[\]\)]\s*$/i, "")
    .replace(/\s*[-–—]?\s*Set\s*\d+\s*$/i, "")
    .trim();
}
```

The sanitizer was uniformly integrated across all primary UI boundaries:
- **Library Cards (`WorkoutCard.tsx`)**: Displays curated library items with correct clean titles.
- **Normalizing Adapters (`workoutVisualAdapters.ts`)**: Automatically cleans workout types and support routines as they feed into custom state panels and detail pages.
- **Related Workout Panels (`RelatedEntryCard.tsx`)**: Standardizes candidate item headings.
- **Benching Matrix Compare Elements (`CompareTable.tsx`, `CompareBar.tsx`)**: Sanitizes both side-by-side specs comparison headers and clipboard markdown templates.
- **Saved Vault Cards (`App.tsx`)**: Applies direct, active cleaning on local clone backups, duplicated templates, and source reference titles.
- **Export Card Previews (`WorkoutCardPreview.tsx`)**: Keeps all generated images pristine.
- **Clipboard Presets and Generators (`workouts.ts`, `ExportCardControls.tsx`)**: Controls clean file naming during dynamic canvas downloads and formatted social/coach copy operations.
- **Draft Adaptations (`libraryToBuilder.ts`)**: Formats customized work titles during active session builder instantiation cycles.

---

## 3. PART B: Cooldown Phase Dark Color Fix

### Discovery & Root Cause Analysis
In `SessionTimeline.tsx`, the Cooldown (CD) stage backdrop was configured to look fainter and only darken on mouse indicators. Upon source inspection, our code analyzer identified a series of semantic Tailwind styling typography errors where several elements, including the phase timeline segment, attempted to load `bg-slate-705` and `text-slate-705`. Because `slate-705` is not a valid Tailwind CSS scale, values fell back to default light colors, rendering the cooldown segment almost completely transparent.

### Technical Implementation & Remediation
We replaced all inactive classes of `slate-705` with `slate-700` across our visual and detail modules:
1. **/src/components/visuals/SessionTimeline.tsx**: Changed the CD segment class to `bg-slate-700`, rendering it with an elegant and visible background by default.
2. **/src/components/detail/SupportRoutineDetail.tsx**: Corrected the required equipment text style color to `text-slate-700`.
3. **/src/App.tsx**: Repaired search input clear button hover styles to use `hover:text-slate-700`.

The Cooldown phase is now instantly visible by default without requiring hover states, harmonizing seamlessly with the Intensity Curve legends.

---

## 4. Verification Check list
- [x] Create deterministic displays title sanitizer utility.
- [x] Inject `/src/lib/displayTitle.ts` into library listings, comparing sheets, detail panes, metadata adapters, and clip-ready formatters.
- [x] Replace non-standard `slate-705` Tailwind classes with stable `slate-700` colors.
- [x] Run `npm run lint` validation (Passed).
- [x] Run `npm run build` production server bundle compilation (Success).
