/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Workout } from "../../types/workout";
import { MinimalWorkoutCard } from "./templates/MinimalWorkoutCard";
import { CoachWorkoutCard } from "./templates/CoachWorkoutCard";
import { TrackSessionCard } from "./templates/TrackSessionCard";
import { LongRunCard } from "./templates/LongRunCard";
import { RaceWeekCard } from "./templates/RaceWeekCard";

interface WorkoutCardPreviewProps {
 workout: Workout;
 template: string; // "minimal" | "coach" | "track" | "longrun" | "raceweek"
 theme: "light" | "dark" | "orange" | "mono";
 size: "square" | "story" | "compact";
}

export function WorkoutCardPreview({ workout, template, theme, size }: WorkoutCardPreviewProps) {
 const renderTemplate = () => {
 switch (template) {
 case "coach":
 return <CoachWorkoutCard workout={workout} theme={theme} size={size} />;
 case "track":
 return <TrackSessionCard workout={workout} theme={theme} size={size} />;
 case "longrun":
 return <LongRunCard workout={workout} theme={theme} size={size} />;
 case "raceweek":
 return <RaceWeekCard workout={workout} theme={theme} size={size} />;
 case "minimal":
 default:
 return <MinimalWorkoutCard workout={workout} theme={theme} size={size} />;
 }
 };

 return (
 <div className="flex justify-center items-center p-4 bg-slate-100 rounded-2xl border border-slate-200/60 border-dashed">
 {/* Outer scale helper wrapper to prevent big cards overflowing the screen dashboard */}
 <div className="w-full flex justify-center max-w-full overflow-auto p-2">
 <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
 {renderTemplate()}
 </div>
 </div>
 </div>
 );
}
