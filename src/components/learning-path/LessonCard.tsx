// src/components/learning-path/LessonCard.tsx
"use client";

import { BookOpen, Mic2, Star } from "lucide-react";

interface LessonCardProps {
  day: number;
  theme: string;
  wordCount: number;
  onStart: () => void;
}

export default function LessonCard({ day, theme, wordCount, onStart }: LessonCardProps) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-blue-200 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase">
          Day {day}
        </div>
        <div className="flex gap-1 text-yellow-400">
          {[1, 2, 3].map((s) => <Star key={s} size={14} fill="currentColor" />)}
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">
        {theme}
      </h3>

      <div className="flex gap-4 mb-8 text-slate-500 text-sm">
        <span className="flex items-center gap-1">
          <BookOpen size={16} /> {wordCount} Terms
        </span>
        <span className="flex items-center gap-1">
          <Mic2 size={16} /> 1 Voice Task
        </span>
      </div>

      <button 
        onClick={onStart}
        className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-blue-600 transition-colors"
      >
        Start Lesson
      </button>
    </div>
  );
}