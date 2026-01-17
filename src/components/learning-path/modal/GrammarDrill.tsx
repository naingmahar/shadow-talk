// src/components/learning-path/modal/GrammarDrill.tsx
"use client";

import React, { useState } from "react";
import { Brain, Check, RefreshCcw } from "lucide-react";

export default function GrammarDrill({ blueprint, onComplete }: { blueprint: any, onComplete: () => void }) {
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // We can simulate a "Validation" logic 
  // In a real app, you might use AI or simple keyword matching
  const handleCheck = () => {
    // Basic validation: Check if user used at least 5 words and isn't empty
    if (userInput.trim().split(" ").length > 4) {
      setIsCorrect(true);
    } else {
      alert("Try to make a more complete sentence using the formula!");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          Grammar Construction
        </h2>
        <p className="text-slate-500 mt-1">Don't just read the formula—build with it.</p>
      </div>

      {/* The Blueprint Display */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-2">The Senior Formula</span>
          <p className="text-2xl font-mono leading-tight text-purple-100 italic">
            {blueprint.formula}
          </p>
        </div>
        {/* Decorative Background Element */}
        <div className="absolute -right-4 -bottom-4 text-white/5 font-black text-8xl italic select-none">
          STRUCTURE
        </div>
      </div>

      {/* THE ACTION: Construction Zone */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-400 uppercase tracking-wide">
          Your Turn: Apply the formula to a current project
        </label>
        
        <div className="relative">
          <textarea 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isCorrect}
            placeholder={`Example: "By leveraging ${blueprint.formula.split('+')[0] || 'JSI'}, we can mitigate..."`}
            className={`w-full h-40 p-6 rounded-[2rem] border-2 transition-all outline-none text-lg leading-relaxed ${
              isCorrect 
                ? "border-green-500 bg-green-50 text-green-900" 
                : "border-slate-100 bg-slate-50 focus:bg-white focus:border-purple-600 text-slate-700"
            }`}
          />
          {isCorrect && (
            <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
              <Check size={20} />
            </div>
          )}
        </div>

        {!isCorrect ? (
          <button 
            onClick={handleCheck}
            disabled={userInput.length < 10}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-20 transition-all flex items-center justify-center gap-2"
          >
            Validate Structure
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => {setIsCorrect(false); setUserInput("");}}
              className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <RefreshCcw size={18} /> Reset
            </button>
            <button 
              onClick={onComplete}
              className="flex-[2] py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              Blueprint Mastered <Check size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
        <p className="text-xs text-purple-800 leading-relaxed">
          <b>Pro Tip:</b> Senior communication isn't just about what you say, it's about the <b>logic flow</b>. This formula ensures your stakeholders understand the <i>Impact</i> before the <i>Implementation</i>.
        </p>
      </div>
    </div>
  );
}