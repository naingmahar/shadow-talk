"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Sparkles, Loader2, ChevronRight, Lightbulb, CheckCircle2, Volume2 } from "lucide-react";

export default function VocalDrill({ drills, onComplete }: any) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const currentDrill = drills[currentIdx];

  // 1. Voice Synthesis Logic
  const playQuestion = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any existing speech
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.8; // Natural senior dev pace
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  // 2. Auto-play when question changes
  useEffect(() => {
    if (currentDrill?.question) {
      playQuestion(currentDrill.question);
    }
  }, [currentIdx, currentDrill]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVerify(transcript);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const handleVerify = async (text: string) => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/check-seniority", {
        method: "POST",
        body: JSON.stringify({
          sentence: text,
          targetTerm: `Answer to: ${currentDrill.question}. Keywords: ${currentDrill.required_keywords.join(",")}`,
        }),
      });
      const result = await res.json();
      setFeedback(result);
    } catch (err) {
      console.error("Verification failed");
    } finally {
      setIsChecking(false);
    }
  };

  const nextDrill = () => {
    if (currentIdx < drills.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setFeedback(null);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
              Vocal Drill {currentIdx + 1}/{drills.length}
            </span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">
              Target: <span className="text-blue-600">{currentDrill.target_term}</span>
            </span>
          </div>
          
          {/* Manual Replay Button */}
          <button 
            onClick={() => playQuestion(currentDrill.question)}
            className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
          >
            <Volume2 size={20} />
          </button>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight group flex items-start gap-2">
          "{currentDrill.question}"
        </h2>

        <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 mb-10 border border-amber-100">
          <Lightbulb className="text-amber-500 shrink-0" size={20} />
          <p className="text-amber-800 text-sm font-medium italic">{currentDrill.hint}</p>
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div className="mb-8 p-6 bg-slate-900 rounded-3xl border border-slate-800 animate-in zoom-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-400 font-black text-[10px] uppercase">Accuracy: {feedback.score}%</span>
              {feedback.score >= 70 && <CheckCircle2 className="text-green-500" size={16} />}
            </div>
            <p className="text-white text-sm leading-relaxed italic">"{feedback.advice}"</p>
          </div>
        )}

        <button
          onClick={() => {
            setIsRecording(true);
            recognitionRef.current?.start();
          }}
          disabled={isChecking || isRecording}
          className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl ${
            isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-900 text-white hover:bg-blue-600"
          }`}
        >
          {isChecking ? <Loader2 className="animate-spin" /> : <Mic size={24} />}
          {isRecording ? "Listening..." : "Speak Your Answer"}
        </button>
      </div>

      {feedback?.score >= 0 && (
        <button
          onClick={nextDrill}
          className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg"
        >
          {currentIdx === drills.length - 1 ? "Complete Vocal Drills" : "Next Drill"}
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}