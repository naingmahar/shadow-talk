// src/components/learning-path/modal/PerformanceDrill.tsx
"use client";

import React, { useState } from "react";
import { Mic, Square, CheckCircle2, RotateCcw } from "lucide-react";

export default function PerformanceDrill({ task, onComplete }: { task: any, onComplete: () => void }) {
  const [status, setStatus] = useState<"idle" | "recording" | "review">("idle");
  
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">Final Performance</h2>
        <p className="text-slate-500 mt-1">Record your response to the scenario below.</p>
      </div>

      {/* Scenario Box */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-slate-200">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-3">The Scenario</span>
        <h3 className="text-xl font-medium leading-relaxed mb-6">
          {task.prompt}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {task.required_keywords.map((word: string) => (
            <span key={word} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-blue-300">
              #{word}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {status === "idle" && (
          <button 
            onClick={() => setStatus("recording")}
            className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
          >
            <Mic size={32} />
          </button>
        )}

        {status === "recording" && (
          <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={() => setStatus("review")}
              className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white animate-pulse"
            >
              <Square size={32} fill="currentColor" />
            </button>
            <span className="text-red-500 font-black text-xs uppercase tracking-widest">Recording...</span>
          </div>
        )}

        {status === "review" && (
          <div className="w-full space-y-4">
            <div className="p-6 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4">
              <CheckCircle2 className="text-green-600" size={32} />
              <div>
                <p className="font-bold text-green-900">Recording Captured</p>
                <p className="text-sm text-green-700">Ready to submit for AI evaluation.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setStatus("recording")}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-50"
              >
                <RotateCcw size={18} /> Retake
              </button>
              <button 
                onClick={onComplete}
                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
              >
                Submit Performance
              </button>
            </div>
          </div>
        )}
        
        {status === "idle" && <p className="text-slate-400 font-bold text-sm">Tap to start recording</p>}
      </div>
    </div>
  );
}