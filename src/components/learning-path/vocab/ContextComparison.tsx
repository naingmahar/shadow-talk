"use client";

import React, { useState } from "react";
import { PlayCircle, Zap, ShieldCheck, ChevronRight } from "lucide-react";

interface ContextProps {
  normal: string; // "I need to make the app faster."
  senior: string; // "We must implement a caching layer to optimize latency."
}

export default function ContextComparison({ normal, senior }: ContextProps) {
  const [showSenior, setShowSenior] = useState(false);
  const [playedJunior, setPlayedJunior] = useState(false);

  const playTTS = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.85;
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* PART 1: The "Junior" Baseline */}
      <div className="bg-slate-100 rounded-3xl p-6 border-2 border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Standard Communication</span>
        </div>
        <p className="text-slate-600 font-medium text-lg italic mb-4">"{normal}"</p>
        <button 
          onClick={() => { playTTS(normal); setPlayedJunior(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 shadow-sm transition-all"
        >
          <PlayCircle size={16} /> Listen to Baseline
        </button>
      </div>

      {/* PART 2: The "Senior" Challenge (Hidden until Baseline is heard) */}
      <div className={`transition-all duration-700 ${playedJunior ? "opacity-100 translate-y-0" : "opacity-30 blur-sm pointer-events-none"}`}>
        <div className="relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={120} className="text-blue-400" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="text-blue-400" size={18} />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Architectural Refactoring</span>
            </div>

            {!showSenior ? (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-bold">How would a Senior Lead say this?</h3>
                <button 
                  onClick={() => setShowSenior(true)}
                  className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all"
                >
                  Reveal Senior Pattern <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="animate-in zoom-in-95 duration-500">
                <p className="text-white text-2xl font-black leading-relaxed mb-6">
                  "{senior}"
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => playTTS(senior)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-500 transition-all"
                  >
                    <PlayCircle size={18} /> Listen to Professional Tone
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSenior && (
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
             <Zap size={16} />
          </div>
          <div>
            <p className="text-blue-900 font-bold text-sm">Pro Tip</p>
            <p className="text-blue-700 text-xs">Observe how the Senior version uses precise technical verbs instead of generic ones.</p>
          </div>
        </div>
      )}
    </div>
  );
}