"use client";

import React, { useState } from "react";
import { PlayCircle, Volume2, Sparkles, Loader2, CheckCircle, Headphones, ChevronRight } from "lucide-react";

export default function AudioSummary({ data, onComplete }: any) {
  const [userInput, setUserInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Safely access the audio text from the new prompt structure
  const audioContent = data?.preparation_phase?.audio_reference?.data || "";

  const playAudio = () => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(audioContent);
    msg.rate = 0.85; 
    
    msg.onstart = () => setIsPlaying(true);
    msg.onend = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(msg);
  };

  const handleCheckSummary = async () => {
    if (userInput.length < 15) return;
    setIsChecking(true);
    try {
      const res = await fetch("/api/check-seniority", {
        method: "POST",
        body: JSON.stringify({
          sentence: userInput,
          // We tell the AI to compare the user's summary against the original transcript
          targetTerm: `Check if this summary accurately captures: ${audioContent}`,
        }),
      });
      const result = await res.json();
      setFeedback(result);
    } catch (err) {
      console.error("Check failed");
    } finally {
      setIsChecking(false);
    }
  };

  // Determine if the user is allowed to proceed
  const canProgress = feedback?.score >= 50;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 animate-in fade-in zoom-in-95">
      {/* 1. Header Section */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
          <Headphones size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Architectural Briefing</h2>
        <p className="text-slate-500 font-medium italic px-6">
          Listen to the technical breakdown. You must summarize the key trade-offs to proceed.
        </p>
      </div>

      {/* 2. Audio Control Player */}
      <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-10 border border-slate-100 flex flex-col items-center">
        <button
          onClick={playAudio}
          className={`group flex items-center gap-4 px-12 py-6 rounded-3xl transition-all shadow-xl active:scale-95 ${
            isPlaying 
              ? "bg-indigo-100 text-indigo-600 animate-pulse" 
              : "bg-slate-900 text-white hover:bg-indigo-600"
          }`}
        >
          {isPlaying ? <Volume2 size={28} className="animate-bounce" /> : <PlayCircle size={28} />}
          <span className="text-xl font-black">{isPlaying ? "Listening..." : "Start Briefing"}</span>
        </button>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {isPlaying ? "Focus on the verbs and architectural patterns" : "Click to play audio"}
        </p>
      </div>

      {/* 3. Summary Input Area */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Summary</label>
          {feedback && (
             <span className={`text-[10px] font-black uppercase ${canProgress ? 'text-green-500' : 'text-amber-500'}`}>
               Accuracy: {feedback.score}%
             </span>
          )}
        </div>
        
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g., The architect suggests leveraging TurboModules to mitigate bridge congestion..."
          className="w-full h-44 p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] focus:border-indigo-600 focus:bg-white outline-none transition-all text-lg font-medium leading-relaxed"
        />

        {/* AI Feedback Display */}
        {feedback && (
          <div className={`p-6 rounded-3xl border animate-in slide-in-from-top-4 ${
            canProgress ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className={canProgress ? "text-green-600" : "text-amber-600"} />
              <span className={`font-black text-[10px] uppercase ${canProgress ? "text-green-600" : "text-amber-600"}`}>
                Mentor Review
              </span>
            </div>
            <p className="text-slate-700 italic text-sm leading-relaxed font-medium">
              "{feedback.advice}"
            </p>
          </div>
        )}

        {/* Dynamic Button Logic */}
        {!canProgress ? (
          <button
            onClick={handleCheckSummary}
            disabled={userInput.length < 15 || isChecking}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale shadow-lg shadow-indigo-100"
          >
            {isChecking ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle size={24} />}
            Verify Summary
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-green-600 transition-all shadow-xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2"
          >
            Continue to Shadow Practice
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}