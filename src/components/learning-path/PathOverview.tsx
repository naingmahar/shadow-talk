"use client";

import React from "react";
import { CheckCircle2, Circle, Lock, ArrowRight } from "lucide-react";

interface PathOverviewProps {
  planData: any;
  activeDayIdx: number;
  onSelectDay: (index: number) => void;
}

export default function PathOverview({ planData, activeDayIdx, onSelectDay }: PathOverviewProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900">Your Roadmap</h3>
        <p className="text-slate-500 text-sm">7-Day Technical English Sprint</p>
      </div>

      <div className="space-y-4">
        {planData.days.map((day: any, idx: number) => {
          const isActive = activeDayIdx === idx;
          const isCompleted = idx < activeDayIdx; // Simple logic for now
          const isLocked = idx > activeDayIdx + 1; // Future logic for locking

          return (
            <button
              key={idx}
              onClick={() => onSelectDay(idx)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all border-2 text-left group ${
                isActive 
                  ? "border-blue-600 bg-blue-50/50 shadow-md" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              {/* Status Icon */}
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : isActive ? (
                  <Circle className="text-blue-600 fill-blue-600/10" size={20} />
                ) : (
                  <Circle className="text-slate-200" size={20} />
                )}
              </div>

              {/* Day Info */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? "text-blue-600" : "text-slate-400"
                  }`}>
                    Day {day.day}
                  </span>
                  {isActive && <ArrowRight size={14} className="text-blue-600 animate-pulse" />}
                </div>
                <h4 className={`text-sm font-bold leading-tight ${
                  isActive ? "text-slate-900" : "text-slate-600"
                }`}>
                  {day.theme}
                </h4>
                
                {isActive && (
                  <div className="mt-3 flex gap-2">
                    <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                      {day.preparation_phase.flashcards.length} Words
                    </span>
                    <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                      Voice Task
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Footer */}
      <div className="mt-8 pt-6 border-t border-slate-50">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Overall Progress</span>
          <span className="text-sm font-black text-slate-900">{Math.round((activeDayIdx / 7) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-1000" 
            style={{ width: `${(activeDayIdx / 7) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}