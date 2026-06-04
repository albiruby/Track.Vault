/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout } from "../../types/workout";
import { sanitizeWorkoutTitle } from "../../lib/displayTitle";
import { 
  RunningMinimalTemplate,
  RunningIntervalTemplate,
  RunningLongRunTemplate,
  RunningRaceWeekTemplate,
  RunningCoachSheetTemplate,
  SupportRoutineTemplate,
  SupportWarmupTemplate,
  SupportCooldownTemplate,
  SupportStrengthTemplate,
  SupportMobilityTemplate,
  UniversalCompactSummaryTemplate,
  UniversalDetailedTrainingSheetTemplate,
  UniversalStoryShareTemplate,
  UniversalSquareShareTemplate,
  UniversalWideCoachTemplate
} from "./templates/ExportCardV2Templates";

interface WorkoutCardPreviewProps {
  workout: Workout;
  template: string;
  theme: "light" | "dark" | "orange" | "mono";
  size: "square" | "story" | "compact" | "wide" | "compact-4-5" | "a4-sheet";
  showBrandFooter?: boolean;
}

export function WorkoutCardPreview({ workout, template, theme, size, showBrandFooter = true }: WorkoutCardPreviewProps) {
  const sanitizedWorkout = {
    ...workout,
    title: sanitizeWorkoutTitle(workout.title),
  };

  const renderTemplate = () => {
    switch (template) {
      // 1. Running Templates
      case "minimal":
      case "minimal-session":
        return <RunningMinimalTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "interval":
      case "interval-session":
        return <RunningIntervalTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "longrun":
      case "endurance-longrun":
        return <RunningLongRunTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "raceweek":
      case "raceweek-taper":
        return <RunningRaceWeekTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "coach":
      case "coach-sheet":
        return <RunningCoachSheetTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;

      // 2. Support Templates
      case "support":
      case "support-routine":
        return <SupportRoutineTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "warmup":
      case "warmup-flow":
        return <SupportWarmupTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "cooldown":
      case "cooldown-flow":
        return <SupportCooldownTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "strength":
      case "strength-routine":
        return <SupportStrengthTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "mobility":
      case "mobility-routine":
        return <SupportMobilityTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;

      // 3. Universal / General Templates
      case "compact-summary":
        return <UniversalCompactSummaryTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "training-sheet":
        return <UniversalDetailedTrainingSheetTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "story-share":
        return <UniversalStoryShareTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "square-share":
        return <UniversalSquareShareTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
      case "wide-coach":
        return <UniversalWideCoachTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;

      default:
        // Adapts safely depending on what entryType we have
        const isSupportRoutine = workout.entryType === "support-routine" || (workout as any).supportCategoryId !== undefined;
        if (isSupportRoutine) {
          return <SupportRoutineTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
        } else {
          return <RunningMinimalTemplate workout={sanitizedWorkout} theme={theme} size={size} showBrandFooter={showBrandFooter} />;
        }
    }
  };

  return (
    <div className="flex justify-center items-center p-4 bg-slate-100 rounded-2xl border border-slate-200/60 border-dashed">
      {/* Outer helper centered container */}
      <div className="w-full flex justify-center max-w-full overflow-auto p-2">
        <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
