/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkoutBlock, WorkoutRecovery } from "../../types/workout";
import { Plus, Trash, ArrowUp, ArrowDown, Footprints } from "lucide-react";

interface WorkoutBlockEditorProps {
 label: string; // e.g., "Warm-up Blocks", "Main Set Blocks"
 blocks: WorkoutBlock[];
 onChange: (updatedBlocks: WorkoutBlock[]) => void;
 defaultType: string;
}

export function WorkoutBlockEditor({ label, blocks, onChange, defaultType }: WorkoutBlockEditorProps) {
 const addBlock = () => {
 const uniq = Math.random().toString(36).substr(2, 9);
 const newBlock: WorkoutBlock = {
 id: `block-${uniq}`,
 type: defaultType,
 name: defaultType.charAt(0).toUpperCase() + defaultType.slice(1),
 repetitions: 1,
 work: {
 targetType: "duration",
 durationSeconds: 300, // 5 min
 intensity: "easy zone 2",
 },
 recovery: {
 type: "none",
 durationSeconds: 0,
 },
 };
 onChange([...blocks, newBlock]);
 };

 const removeBlock = (id: string) => {
 onChange(blocks.filter((b) => b.id !== id));
 };

 const moveBlock = (index: number, direction: "up" | "down") => {
 const nextIndex = direction === "up" ? index - 1 : index + 1;
 if (nextIndex < 0 || nextIndex >= blocks.length) return;
 
 const result = [...blocks];
 const temp = result[index];
 result[index] = result[nextIndex];
 result[nextIndex] = temp;
 onChange(result);
 };

 const updateBlockField = (id: string, updatedFields: Partial<WorkoutBlock>) => {
 onChange(
 blocks.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
 );
 };

 const updateWorkField = (id: string, updatedWorkFields: any) => {
 onChange(
 blocks.map((b) => {
 if (b.id === id) {
 return {
 ...b,
 work: {
 ...b.work,
 ...updatedWorkFields,
 },
 };
 }
 return b;
 })
 );
 };

 const updateRecoveryField = (id: string, updatedRecoveryFields: Partial<WorkoutRecovery>) => {
 onChange(
 blocks.map((b) => {
 if (b.id === id) {
 return {
 ...b,
 recovery: {
 ...(b.recovery || { type: "none" }),
 ...updatedRecoveryFields,
 } as WorkoutRecovery,
 };
 }
 return b;
 })
 );
 };

 const blockTypesList = [
 "warmup", "drill", "stride", "repeat", "interval", "tempo", 
 "threshold", "fartlek", "long-run", "recovery", "cooldown", "note"
 ];

 const recoveryTypesList = ["none", "active", "passive", "walk", "jog"];

 return (
 <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm">
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
 <Footprints className="w-4 h-4 text-blue-650" /> {label} ({blocks.length})
 </h3>
 <button
 type="button"
 onClick={addBlock}
 className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide flex items-center gap-1 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" /> Block
 </button>
 </div>

 {blocks.length === 0 ? (
 <div className="py-6 text-center text-xs text-slate-400 italic border border-dashed border-[#E2E8F0] rounded-xl bg-slate-55/30 ">
 No prescriptive blocks added yet. Click "+ Block" to configure.
 </div>
 ) : (
 <div className="space-y-4">
 {blocks.map((block, index) => (
 <div
 key={block.id}
 className="p-4 bg-slate-50/55 rounded-2xl border border-[#E2E8F0] space-y-3 relative group"
 >
 {/* Position and Removal Tooling */}
 <div className="flex justify-between items-center bg-slate-100 p-2 rounded-xl border border-[#E2E8F0]">
 <div className="flex items-center gap-1.5">
 <span className="text-[10px] font-mono font-bold text-[#0F172A] px-1.5">
 STEP #{index + 1}
 </span>
 <select
 value={block.type}
 onChange={(e) => updateBlockField(block.id, { type: e.target.value })}
 className="p-1 px-2 text-[10px] uppercase font-mono font-bold bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] focus:outline-none cursor-pointer"
 >
 {blockTypesList.map((t) => (
 <option key={t} value={t}>{t}</option>
 ))}
 </select>
 </div>

 <div className="flex gap-1">
 <button
 type="button"
 onClick={() => moveBlock(index, "up")}
 disabled={index === 0}
 className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
 >
 <ArrowUp className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={() => moveBlock(index, "down")}
 disabled={index === blocks.length - 1}
 className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
 >
 <ArrowDown className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={() => removeBlock(block.id)}
 className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
 >
 <Trash className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 {/* Block Inputs Block */}
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
 <div className="space-y-1">
 <span className="text-[10px] font-semibold text-slate-600 block">Block Name</span>
 <input
 type="text"
 value={block.name}
 onChange={(e) => updateBlockField(block.id, { name: e.target.value })}
 placeholder="e.g. Threshold interval"
 className="w-full p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 </div>

 <div className="space-y-1">
 <span className="text-[10px] font-semibold text-slate-600 block">Repetitions</span>
 <input
 type="number"
 min="1"
 value={block.repetitions || 1}
 onChange={(e) => updateBlockField(block.id, { repetitions: parseInt(e.target.value, 10) || 1 })}
 className="w-full p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 </div>

 <div className="space-y-1 col-span-1 sm:col-span-2">
 <span className="text-[10px] font-semibold text-slate-600 block">Work Target Type</span>
 <div className="flex gap-2">
 <select
 value={block.work.targetType}
 onChange={(e) => updateWorkField(block.id, { targetType: e.target.value as any })}
 className="p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-slate-700 cursor-pointer font-sans"
 >
 <option value="duration">Target Duration (secs)</option>
 <option value="distance">Target Distance (meters)</option>
 <option value="unlimited">Goal Effort Notes Only</option>
 </select>

 {block.work.targetType === "duration" ? (
 <input
 type="number"
 min="1"
 placeholder="Seconds (e.g. 180 for 3m)"
 value={block.work.durationSeconds || ""}
 onChange={(e) => updateWorkField(block.id, { durationSeconds: parseInt(e.target.value, 10) || 0 })}
 className="flex-1 p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 ) : block.work.targetType === "distance" ? (
 <input
 type="number"
 min="1"
 placeholder="Meters (e.g. 1000 for 1k)"
 value={block.work.distanceMeters || ""}
 onChange={(e) => updateWorkField(block.id, { distanceMeters: parseInt(e.target.value, 10) || 0 })}
 className="flex-1 p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 ) : (
 <span className="p-2 text-slate-400 text-xs italic">Preserve custom reps</span>
 )}
 </div>
 </div>

 <div className="space-y-1">
 <span className="text-[10px] font-semibold text-slate-600 block">Work Intensity</span>
 <input
 type="text"
 value={block.work.intensity || ""}
 onChange={(e) => updateWorkField(block.id, { intensity: e.target.value })}
 placeholder="e.g. 5K pace or Hardy RPE 8"
 className="w-full p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 </div>

 {/* Rest & Recovery configs */}
 <div className="space-y-1">
 <span className="text-[10px] font-semibold text-slate-600 block">Rest Recovery Type</span>
 <select
 value={block.recovery?.type || "none"}
 onChange={(e) => updateRecoveryField(block.id, { type: e.target.value })}
 className="w-full p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-slate-750 cursor-pointer font-sans"
 >
 {recoveryTypesList.map((rt) => (
 <option key={rt} value={rt}>{rt.toUpperCase()}</option>
 ))}
 </select>
 </div>

 {block.recovery && block.recovery.type !== "none" && (
 <>
 <div className="space-y-1 col-span-1">
 <span className="text-[10px] font-semibold text-slate-600 block">Rest Stop Target</span>
 <div className="flex gap-1.5">
 <input
 type="number"
 placeholder="Secs"
 value={block.recovery.durationSeconds || ""}
 onChange={(e) => updateRecoveryField(block.id, { durationSeconds: parseInt(e.target.value, 10) || 0 })}
 className="w-1/2 p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 <input
 type="number"
 placeholder="Mtrs"
 value={block.recovery.distanceMeters || ""}
 onChange={(e) => updateRecoveryField(block.id, { distanceMeters: parseInt(e.target.value, 10) || 0 })}
 className="w-1/2 p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 </div>
 </div>
 <div className="space-y-1">
 <span className="text-[10px] font-semibold text-slate-600 block">Rest Intensity</span>
 <input
 type="text"
 value={block.recovery.intensity || ""}
 onChange={(e) => updateRecoveryField(block.id, { intensity: e.target.value })}
 placeholder="e.g. walk/easy jog"
 className="w-full p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A] "
 />
 </div>
 </>
 )}

 <div className="space-y-1 col-span-1 sm:col-span-2 md:col-span-4">
 <span className="text-[10px] font-semibold text-slate-600 block">Block execution cues / notes (optional)</span>
 <input
 type="text"
 value={block.notes || ""}
 onChange={(e) => updateBlockField(block.id, { notes: e.target.value })}
 placeholder="e.g. Focus on quick ground contact time, relaxed stride"
 className="w-full p-2 bg-white border border-[#E2E8F0] text-xs rounded-xl text-[#0F172A]"
 />
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
