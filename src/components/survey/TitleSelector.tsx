"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";

interface TitleSelectorProps {
  titles: string[];
  selectedTitles: string[];
  onToggle: (title: string) => void;
}

export default function TitleSelector({ titles, selectedTitles, onToggle }: TitleSelectorProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="text-amber-500" size={20} />
        <h1 className="text-3xl font-black text-slate-900">Custom Focus</h1>
      </div>
      <p className="text-slate-500 mb-8 text-lg">Pick the professional identities you want to master.</p>
      
      <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
        {titles.map((title) => {
          const isSelected = selectedTitles.includes(title);
          return (
            <button
              key={title}
              onClick={() => onToggle(title)}
              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                isSelected 
                  ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <span className={`font-bold text-lg ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                {title}
              </span>
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                isSelected ? "bg-blue-600 border-blue-600" : "border-slate-200"
              }`}>
                {isSelected && <Check size={14} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}