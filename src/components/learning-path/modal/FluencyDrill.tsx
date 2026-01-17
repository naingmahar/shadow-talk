// src/components/learning-path/modal/FluencyDrill.tsx
"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FluencyDrill({ dayData, onComplete }: { dayData: any, onComplete: () => void }) {
  // We use the flashcards and the theme to show fluent examples
  const mainTerm = dayData.preparation_phase.flashcards[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={24} />
          Fluency Transformation
        </h2>
        <p className="text-slate-500 mt-1">Upgrade your natural phrasing to senior-level precision.</p>
      </div>

      <div className="space-y-4">
        {/* Comparison Card */}
        <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Standard Phrasing</span>
            <p className="text-slate-600 italic">"I will use the new library to make the app faster because it's better than the old one."</p>
          </div>
          
          <div className="p-6 bg-white">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Senior Fluent Version</span>
            <p className="text-lg font-bold text-slate-900 leading-snug">
              "We should <span className="text-blue-600 underline decoration-2 underline-offset-4">{mainTerm.term}</span> the new architecture to <span className="text-blue-600">mitigate</span> bridge overhead and ensure high-performance rendering."
            </p>
          </div>
        </div>

        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
          <h4 className="text-sm font-bold text-blue-900 mb-2">Why this works:</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span>Replaces generic "use" with <b>"{mainTerm.term}"</b> for strategic impact.</span>
            </li>
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span>Uses <b>specific technical nouns</b> (Bridge Overhead) instead of vague words (Lag).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}