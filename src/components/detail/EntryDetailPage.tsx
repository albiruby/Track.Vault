/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { RunningWorkoutDetail } from "./RunningWorkoutDetail";
import { SupportRoutineDetail } from "./SupportRoutineDetail";

interface EntryDetailPageProps {
  workout: any;
  onBack: () => void;
  onCopySimple: (workout: any) => void;
  onCopyMarkdown: (workout: any) => void;
  onExport: (workout: any) => void;
  onClone: (workout: any) => void;
}

export function EntryDetailPage({
  workout,
  onBack,
  onCopySimple,
  onCopyMarkdown,
  onExport,
  onClone,
}: EntryDetailPageProps) {
  if (!workout) {
    return (
      <div className="py-12 text-center bg-white border border-[#E2E8F0] rounded-3xl p-6">
        <p className="text-sm font-bold text-slate-800">No workout active</p>
      </div>
    );
  }

  // Determine workout categories or entry type
  const isSupport = workout.entryType === "support-routine" || workout.supportCategoryId !== undefined || workout.supportCategoryLabel !== undefined;

  if (isSupport) {
    return (
      <SupportRoutineDetail
        workout={workout}
        onBack={onBack}
        onCopySimple={() => onCopySimple(workout)}
        onCopyMarkdown={() => onCopyMarkdown(workout)}
        onExport={() => onExport(workout)}
        onClone={() => onClone(workout)}
      />
    );
  }

  return (
    <RunningWorkoutDetail
      workout={workout}
      onBack={onBack}
      onCopySimple={() => onCopySimple(workout)}
      onCopyMarkdown={() => onCopyMarkdown(workout)}
      onExport={() => onExport(workout)}
      onClone={() => onClone(workout)}
    />
  );
}
export default EntryDetailPage;
