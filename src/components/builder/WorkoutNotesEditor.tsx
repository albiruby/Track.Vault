/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";

interface WorkoutNotesEditorProps {
  coachingNotes: string[];
  setCoachingNotes: (notes: string[]) => void;
  safetyNotes: string[];
  setSafetyNotes: (notes: string[]) => void;
  commonMistakes: string[];
  setCommonMistakes: (mistakes: string[]) => void;
}

export function WorkoutNotesEditor({
  coachingNotes,
  setCoachingNotes,
  safetyNotes,
  setSafetyNotes,
  commonMistakes,
  setCommonMistakes,
}: WorkoutNotesEditorProps) {
  const [newCoachNote, setNewCoachNote] = useState("");
  const [newSafetyNote, setNewSafetyNote] = useState("");
  const [newMistake, setNewMistake] = useState("");

  const handleAddCoachNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCoachNote.trim()) {
      setCoachingNotes([...coachingNotes, newCoachNote.trim()]);
      setNewCoachNote("");
    }
  };

  const handleAddSafetyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSafetyNote.trim()) {
      setSafetyNotes([...safetyNotes, newSafetyNote.trim()]);
      setNewSafetyNote("");
    }
  };

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMistake.trim()) {
      setCommonMistakes([...commonMistakes, newMistake.trim()]);
      setNewMistake("");
    }
  };

  const removeItem = (list: string[], setter: (val: string[]) => void, index: number) => {
    setter(list.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coaching notes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Coaching Notes & Cues
        </h3>
        
        <form onSubmit={handleAddCoachNote} className="flex gap-2">
          <input
            type="text"
            value={newCoachNote}
            onChange={(e) => setNewCoachNote(e.target.value)}
            placeholder="Add pacing cue or mental tip..."
            className="flex-1 p-2 bg-slate-50 dark:bg-slate-800/40 border border-[#E2E8F0] dark:border-[#334155] text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/20 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="p-2 bg-sky-500 text-white hover:bg-sky-600 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <ul className="space-y-1.5 max-h-40 overflow-y-auto">
          {coachingNotes.map((note, index) => (
            <li key={index} className="flex items-start justify-between gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/20 text-xs rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="flex-1">{note}</span>
              <button
                type="button"
                onClick={() => removeItem(coachingNotes, setCoachingNotes, index)}
                className="text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
          {coachingNotes.length === 0 && (
            <p className="text-[10px] text-slate-400 italic">No notes created yet. e.g. Keep a fluid stride, focus on cadence.</p>
          )}
        </ul>
      </div>

      {/* Common mistakes */}
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Mistakes to Correct
        </h3>
        
        <form onSubmit={handleAddMistake} className="flex gap-2">
          <input
            type="text"
            value={newMistake}
            onChange={(e) => setNewMistake(e.target.value)}
            placeholder="Add mistake to correct..."
            className="flex-1 p-2 bg-slate-50 dark:bg-slate-800/40 border border-[#E2E8F0] dark:border-[#334155] text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/20 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="p-2 bg-sky-500 text-white hover:bg-sky-600 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <ul className="space-y-1.5 max-h-40 overflow-y-auto">
          {commonMistakes.map((mistake, index) => (
            <li key={index} className="flex items-start justify-between gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/20 text-xs rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="flex-1">{mistake}</span>
              <button
                type="button"
                onClick={() => removeItem(commonMistakes, setCommonMistakes, index)}
                className="text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
          {commonMistakes.length === 0 && (
            <p className="text-[10px] text-slate-400 italic">No warnings created yet. e.g. Running reps too fast, starting too hard.</p>
          )}
        </ul>
      </div>

      {/* Safety notes */}
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-rose-500" /> Safety Precautions
        </h3>
        
        <form onSubmit={handleAddSafetyNote} className="flex gap-2">
          <input
            type="text"
            value={newSafetyNote}
            onChange={(e) => setNewSafetyNote(e.target.value)}
            placeholder="Add general safety warning..."
            className="flex-1 p-2 bg-slate-50 dark:bg-slate-800/40 border border-[#E2E8F0] dark:border-[#334155] text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/20 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="p-2 bg-sky-500 text-white hover:bg-sky-600 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <ul className="space-y-1.5 max-h-40 overflow-y-auto">
          {safetyNotes.map((note, index) => (
            <li key={index} className="flex items-start justify-between gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/20 text-xs rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="flex-1">{note}</span>
              <button
                type="button"
                onClick={() => removeItem(safetyNotes, setSafetyNotes, index)}
                className="text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
          {safetyNotes.length === 0 && (
            <p className="text-[10px] text-slate-400 italic">No safety alerts. e.g. Do not attempt on slick grades or icy tracks.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
