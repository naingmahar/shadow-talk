"use client";
import { useState, useEffect } from 'react';
import { Volume2, User, UserCheck } from 'lucide-react';

interface CardFrameProps {
  question: string;
  category: string;
  sub?: string;
}

export default function CardFrame({ question, category, sub }: CardFrameProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('female');

  useEffect(() => {
    setIsFlipped(false);
  }, [question]);

  const handleSpeak = (e: React.MouseEvent|undefined) => {
    if(e) e.stopPropagation();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(question);
    const voices = window.speechSynthesis.getVoices();

    // Finding the best voice based on keywords
    const selectedVoice = voices.find(voice => {
      const name = voice.name.toLowerCase();
      if (gender === 'male') {
        return name.includes('male') || name.includes('david') || name.includes('google us english');
      } else {
        return name.includes('female') || name.includes('zira') || name.includes('samantha') || name.includes('google uk english female');
      }
    });

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    utterance.pitch = gender === 'male' ? 0.9 : 1; // Subtle pitch adjustment
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    handleSpeak(undefined)
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

          {/* GENDER TOGGLE & SPEAK BUTTON */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setGender(gender === 'male' ? 'female' : 'male'); }}
              className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all text-[10px] font-bold uppercase px-3"
            >
              {gender}
            </button>
            <button 
              onClick={handleSpeak}
              className="p-3 bg-slate-900 text-white hover:bg-blue-600 rounded-xl transition-all active:scale-90"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <h2 className="text-2xl font-medium text-slate-800 text-center leading-snug px-4">
            {question}
          </h2>
          
          <p className="absolute bottom-6 text-slate-400 text-xs font-medium">
            Tap card to see category
          </p>
        </div>

        {/* BACK SIDE (Stayed the same) */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 text-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold uppercase border border-blue-500/30">
              {category}
            </div>
            {sub && <p className="text-slate-400 text-lg capitalize">{sub}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}