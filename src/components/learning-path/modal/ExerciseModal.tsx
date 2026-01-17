"use client";

import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import VocabDrill from "./VocabDrill";
import ShadowDrill from "./ShadowDrill";
import GrammarDrill from "./GrammarDrill";
import FluencyDrill from "./FluencyDrill";
import PerformanceDrill from "./PerformanceDrill";

export default function ExerciseModal({ dayData, onClose }: { dayData: any, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-[80vh] shadow-2xl">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-900">Day {dayData.day} Training</h3>
            <div className="flex gap-1 mt-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${step > i ? 'bg-blue-600' : 'bg-slate-100'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10">
          {step === 1 && <VocabDrill flashcards={dayData.preparation_phase.flashcards} onComplete={next} />}
          {step === 2 && <ShadowDrill audioRef={dayData.preparation_phase.audio_reference.data} onComplete={next} />}
          {step === 3 && <GrammarDrill blueprint={dayData.preparation_phase.grammar_blueprint} onComplete={next} />}
          {step === 4 && <FluencyDrill dayData={dayData} onComplete={next} />}
          {step === 5 && <PerformanceDrill task={dayData.exercise_phase.task_1_voice} onComplete={onClose} />}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-slate-50 flex justify-between">
          <button onClick={prev} disabled={step === 1} className="px-6 py-2 font-bold text-slate-400 disabled:opacity-0 flex items-center gap-2">
            <ChevronLeft size={20} /> Back
          </button>
          <button onClick={next} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">
            Continue <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}