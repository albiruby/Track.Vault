/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Save, Clipboard, RefreshCw, Eye, Sparkles } from "lucide-react";

interface BuilderActionBarProps {
 onSave: () => void;
 onCopyClipboard: () => void;
 onReset: () => void;
 onGoToExport: () => void;
 copiedState: boolean;
 isValid: boolean;
}

export function BuilderActionBar({
 onSave,
 onCopyClipboard,
 onReset,
 onGoToExport,
 copiedState,
 isValid,
}: BuilderActionBarProps) {
 return (
 <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
 <div className="flex flex-col text-center sm:text-left">
 <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
 Track.Vault Custom Engine
 </span>
 <span className="text-xs font-semibold text-slate-200 mt-0.5">
 {isValid ? "Workout fully structured. Ready for sharing & local save!" : "Configure required parameters on left to unlock actions."}
 </span>
 </div>

 <div className="flex flex-wrap gap-2.5 justify-center w-full sm:w-auto">
 <button
 type="button"
 onClick={onReset}
 className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
 >
 <RefreshCw className="w-3.5 h-3.5" />
 <span>Reset</span>
 </button>

 <button
 type="button"
 onClick={onCopyClipboard}
 disabled={!isValid}
 className={`px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
 >
 <Clipboard className="w-3.5 h-3.5" />
 <span>{copiedState ? "Copied!" : "Copy Clipboard"}</span>
 </button>

 <button
 type="button"
 onClick={onSave}
 disabled={!isValid}
 className={`px-4.5 py-2 rounded-xl text-xs font-extrabold shadow bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
 >
 <Save className="w-3.5 h-3.5" />
 <span>Save Local Vault</span>
 </button>

 <button
 type="button"
 onClick={onGoToExport}
 disabled={!isValid}
 className={`px-4.5 py-2 rounded-xl text-xs font-bold border border-blue-500/30 text-blue-400 bg-blue-950/20 hover:bg-blue-950/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
 >
 <Sparkles className="w-3.5 h-3.5 text-blue-400" />
 <span>Image Share Studio</span>
 </button>
 </div>
 </div>
 );
}
