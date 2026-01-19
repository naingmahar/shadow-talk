"use client";

import React, { useState, useEffect } from "react";
import { Volume2, CheckCircle2, XCircle, Info } from "lucide-react";

interface VocabCardProps {
  item: {
    term: string;
    meaning: string;
    example: string;
    mcq: {
      question: string;
      options: { text: string; is_correct: boolean }[];
    };
  };
  onVerified: () => void;
}

export default function VocabCard({ item, onVerified }: VocabCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // IMPORTANT: Reset state when the item changes (moving to the next word)
  useEffect(() => {
    setSelectedIdx(null);
    setIsCorrect(null);
  }, [item]);

  const playTTS = (text: string) => {
    window.speechSynthesis.cancel(); // Clear queue
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9;
    msg.lang = "en-US";
    msg.pitch = 1;

    window.speechSynthesis.speak(msg);
  };

  const handleOptionClick = (idx: number, isCorrectOption: boolean) => {
    // FIX: Only prevent clicking if the user has ALREADY found the correct answer.
    // If they got it wrong previously, we allow them to click a different option.
    if (isCorrect === true) return; 

    setSelectedIdx(idx);
    setIsCorrect(isCorrectOption);

    if (isCorrectOption) {
      onVerified();
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Core Term Definition */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              {item.term}
            </h2>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Info size={14} /> Meaning
            </div>
            <p className="text-slate-600 font-medium text-lg leading-snug">
              {item.meaning}
            </p>
          </div>
          <button 
            onClick={() => playTTS(item.term)}
            className="p-5 bg-blue-50 text-blue-600 rounded-3xl hover:bg-blue-600 hover:text-white transition-all active:scale-90"
          >
            <Volume2 size={24} />
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-400">
          <p className="text-slate-500 italic text-sm font-medium">
            "{item.example}"
          </p>
        </div>
      </div>

      {/* 2. Knowledge Check (MCQ) */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-6">
          Quick Verification
        </h3>
        <p className="font-bold text-slate-800 text-lg mb-6 leading-relaxed">
          {item.mcq.question}
        </p>

        <div className="grid grid-cols-1 gap-3">
          {item.mcq.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            // A button is "Success" if it's the correct option AND the user found it
            const showSuccess = isCorrect === true && opt.is_correct;
            // A button is "Error" ONLY if the user clicked it and it's wrong
            const showError = isSelected && !opt.is_correct;

            return (
              <button
                key={idx}
                // Only disable interaction if the word is already verified (isCorrect is true)
                disabled={isCorrect === true}
                onClick={() => handleOptionClick(idx, opt.is_correct)}
                className={`group p-5 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center ${
                  showSuccess
                    ? "bg-green-50 border-green-500 text-green-700"
                    : showError
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "bg-white border-slate-100 hover:border-blue-200 text-slate-600"
                }`}
              >
                <span>{opt.text}</span>
                {showSuccess && <CheckCircle2 size={20} className="text-green-600 animate-in zoom-in" />}
                {showError && <XCircle size={20} className="text-red-600 animate-in shake" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Messages */}
        <div className="h-6 mt-4 flex items-center justify-center">
            {isCorrect === false && (
            <p className="text-red-500 text-xs font-black uppercase animate-bounce">
                Try again! Choose the most professional context.
            </p>
            )}
            {isCorrect === true && (
            <p className="text-green-600 text-xs font-black uppercase">
                Excellent. Unlocked Senior Perspective.
            </p>
            )}
        </div>
      </div>
    </div>
  );
}