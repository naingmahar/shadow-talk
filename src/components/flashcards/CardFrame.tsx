"use client";
import { useState, useEffect } from 'react';

interface CardFrameProps {
  question: string;
  category: string;
  sub?: string;
}

export default function CardFrame({ question, category, sub }: CardFrameProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip when question changes
  useEffect(() => {
    setIsFlipped(false);
  }, [question]);

  return (
    <div 
      className="w-full max-w-md h-80 [perspective:1000px] cursor-pointer group mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full bg-white border-2 border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl [backface-visibility:hidden]">
          <span className="absolute top-6 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
            Question
          </span>
          <h2 className="text-2xl font-medium text-slate-800 text-center leading-snug">
            {question}
          </h2>
          <p className="absolute bottom-6 text-slate-400 text-xs font-medium">
            Tap to see category
          </p>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 text-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold uppercase border border-blue-500/30">
              {category}
            </div>
            {sub && (
              <p className="text-slate-400 text-lg capitalize">{sub}</p>
            )}
            <p className="text-slate-500 text-sm italic pt-4">
              "Focus on fluency and confidence"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}