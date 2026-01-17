"use client";

import React, { useState, useRef, useEffect } from "react";
import { Edit3, Mic, MicOff, Loader2, CheckCircle, PlayCircle, Sparkles, ChevronRight } from "lucide-react";

export default function GrammarDrill({ data, onComplete }: any) {
  // 1. Lesson Pagination State
  const [activeLesson, setActiveLesson] = useState(0);
  console.log("Grammar Drill Data:", data);
  const blueprints = data.preparation_phase.grammar_blueprints || [];
  const currentBlueprint = blueprints[activeLesson];

  // 2. Exercise State (Resets per lesson)
  const [sentences, setSentences] = useState(["", "", ""]);
  const [checking, setChecking] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording((prevIndex) => {
          if (prevIndex !== null) {
            handleUpdateSentence(prevIndex, transcript);
          }
          return null;
        });
      };
      recognitionRef.current.onerror = () => setIsRecording(null);
      recognitionRef.current.onend = () => setIsRecording(null);
    }
  }, []);

  const handleUpdateSentence = (index: number, val: string) => {
    setSentences(prev => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const toggleVoice = (index: number) => {
    if (isRecording === index) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(index);
      recognitionRef.current?.start();
    }
  };

  const playVoice = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  };

  const checkWithAI = async (index: number) => {
    if (!sentences[index]) return;
    setChecking(index);
    try {
      const res = await fetch("/api/check-seniority", {
        method: "POST",
        body: JSON.stringify({ 
          sentence: sentences[index], 
          targetTerm: `Using formula: ${currentBlueprint.formula}` 
        }),
      });
      const feedback = await res.json();
      setResults(prev => {
        const updated = [...prev];
        updated[index] = feedback;
        return updated;
      });
    } catch (err) {
      console.error("AI Error");
    } finally {
      setChecking(null);
    }
  };

  // 3. Navigation Logic
  const handleAction = () => {
    if (activeLesson < blueprints.length - 1) {
      // Move to next lesson and reset local exercise state
      setActiveLesson(prev => prev + 1);
      setSentences(["", "", ""]);
      setResults([]);
    } else {
      onComplete();
    }
  };

  // Check if current lesson is finished (at least 1 result or all 3 filled)
  const isLessonComplete = results.filter(Boolean).length >= 1;

  if (!currentBlueprint) return null;

  return (
    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="flex items-center gap-4 mb-8">
        {blueprints.map((_: any, i: number) => (
          <div 
            key={i} 
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i <= activeLesson ? "bg-blue-600" : "bg-slate-100"
            }`}
          />
        ))}
      </div>

      <div className="mb-10">
        <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-2">
          Grammar Lesson {activeLesson + 1} of {blueprints.length}
        </h3>
        <h2 className="text-4xl font-black text-slate-900 mb-6">{currentBlueprint.title}</h2>
        
        {/* Dynamic Formula Display */}
        <div className="p-8 bg-slate-900 rounded-[2rem] shadow-xl mb-8">
           <div className="flex flex-wrap justify-center items-center gap-3">
             {currentBlueprint.formula.split('+').map((part: string, i: number) => (
               <React.Fragment key={i}>
                 <span className="px-4 py-2 bg-white/10 rounded-xl text-blue-400 font-mono text-lg border border-white/5">
                   {part.trim()}
                 </span>
                 {i < currentBlueprint.formula.split('+').length - 1 && (
                   <span className="text-slate-600 font-bold">+</span>
                 )}
               </React.Fragment>
             ))}
           </div>
        </div>

        {/* Master Example */}
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase">Native Example</span>
            <p className="text-slate-700 font-bold text-lg italic mt-1">"{currentBlueprint.example}"</p>
          </div>
          <button 
            onClick={() => playVoice(currentBlueprint.example)}
            className="p-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-90"
          >
            <PlayCircle size={24} />
          </button>
        </div>
      </div>

      {/* Practice Inputs */}
      <div className="space-y-8">
        <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest">Construction Zone</h4>
        
        {sentences.map((text, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center gap-4">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${results[idx] ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-slate-100 text-slate-400'}`}>
                {idx + 1}
              </span>
              
              <div className="flex-1 relative">
                <input 
                  value={text}
                  onChange={(e) => handleUpdateSentence(idx, e.target.value)}
                  className={`w-full bg-transparent border-b-2 outline-none py-3 text-lg font-medium pr-24 transition-all ${
                    isRecording === idx ? "border-red-400 text-red-600" : "border-slate-100 focus:border-blue-600"
                  }`}
                  placeholder={isRecording === idx ? "Listening..." : "Build your sentence..."}
                />
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
                  <button 
                    onClick={() => toggleVoice(idx)}
                    className={`p-2 rounded-lg ${isRecording === idx ? "text-red-500 animate-pulse bg-red-50" : "text-slate-400 hover:text-blue-600"}`}
                  >
                    {isRecording === idx ? <MicOff size={20}/> : <Mic size={20}/>}
                  </button>
                  
                  <button 
                    onClick={() => checkWithAI(idx)}
                    disabled={!text || checking === idx}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-20"
                  >
                    {checking === idx ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {results[idx] && (
              <div className="ml-14 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="text-blue-600 font-black text-[10px] uppercase">AI Review: {results[idx].score}% Accuracy</span>
                </div>
                <p className="text-slate-600 text-sm italic leading-relaxed">"{results[idx].advice}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={handleAction}
        disabled={!isLessonComplete}
        className={`w-full mt-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 ${
          isLessonComplete ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-slate-100 text-slate-400 cursor-not-allowed"
        }`}
      >
        {activeLesson < blueprints.length - 1 ? "Next Grammar Pattern" : "Complete Grammar Phase"}
        <ChevronRight size={24} />
      </button>
    </div>
  );
}