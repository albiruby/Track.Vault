/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { getAllEntries } from "../../lib/workouts";
import { 
  getSimilarEntries, 
  getEasierEntries, 
  getHarderEntries, 
  getSameGoalEntries 
} from "../../lib/relatedWorkouts";
import { RelatedEntryCard } from "./RelatedEntryCard";
import { Info } from "lucide-react";

interface RelatedSectionsProps {
  currentEntry: any;
}

export function RelatedSections({ currentEntry }: RelatedSectionsProps) {
  if (!currentEntry) return null;

  const allEntries = getAllEntries();

  // Retrieve matching entries
  const similar = getSimilarEntries(currentEntry, allEntries, 3);
  const easier = getEasierEntries(currentEntry, allEntries, 1);
  const harder = getHarderEntries(currentEntry, allEntries, 1);
  const sameGoal = getSameGoalEntries(currentEntry, allEntries, 3);

  const isRunning = currentEntry.entryType === "running-workout";

  const handleCardClick = (slug: string) => {
    if (slug) {
      window.location.hash = `#/library/${slug}`;
    }
  };

  const hasAnyRelated = similar.length > 0 || easier.length > 0 || harder.length > 0 || sameGoal.length > 0;
  if (!hasAnyRelated) return null;

  return (
    <div className="border-t border-slate-100 pt-8 mt-10 space-y-8">
      {/* Transparency Copy Tag */}
      <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-150 text-xs font-sans">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          Related entries are matched from static category, structure, level, and tag fields.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Similar Entries Section */}
        {similar.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-400 border-l-4 border-blue-500 pl-2">
              {isRunning ? "Similar Workouts" : "Similar Routines"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {similar.map((cand) => (
                <RelatedEntryCard
                  key={cand.id}
                  currentEntry={currentEntry}
                  candidate={cand}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. Same Goal Entries Section */}
        {sameGoal.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-400 border-l-4 border-blue-500 pl-2">
              Same Goal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sameGoal.map((cand) => (
                <RelatedEntryCard
                  key={cand.id}
                  currentEntry={currentEntry}
                  candidate={cand}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Easier / Harder Option Sections */}
        {(easier.length > 0 || harder.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Easier Option list */}
            {easier.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-400 border-l-4 border-emerald-500 pl-2">
                  Easier Option
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {easier.map((cand) => (
                    <RelatedEntryCard
                      key={cand.id}
                      currentEntry={currentEntry}
                      candidate={cand}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </div>
            ) : <div />}

            {/* Harder Option list */}
            {harder.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-400 border-l-4 border-rose-500 pl-2">
                  Harder Option
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {harder.map((cand) => (
                    <RelatedEntryCard
                      key={cand.id}
                      currentEntry={currentEntry}
                      candidate={cand}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </div>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  );
}

export default RelatedSections;
