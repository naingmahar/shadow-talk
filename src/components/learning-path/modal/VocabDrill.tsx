"use client";

import React, { useState, useEffect } from "react";
import { Volume2, Mic, CheckCircle, Play, Loader2 } from "lucide-react";

export default function VocabDrill({ flashcards, onComplete }: { flashcards: any[], onComplete: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const currentCard = flashcards[activeIdx];

  // 1. Hear the word (Text-to-Speech)
  const playWord = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.85; // Slightly slow for technical clarity
    window.speechSynthesis.speak(speech);
  };

  // 2. Speech Recognition (Speech-to-Text)
  // Note: Only runs in browsers that support it (Chrome, Safari, Edge)
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.start();
  };

  const handleNext = () => {
    if (activeIdx < flashcards.length - 1) {
      setActiveIdx(prev => prev + 1);
      setTranscript("");
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Vocabulary Prep</h2>
          <p className="text-slate-500">Listen, repeat, and speak a sentence.</p>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {activeIdx + 1} / {flashcards.length}
        </span>
      </div>

      {/* Main Term Card */}
      <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center">
        <button 
          onClick={() => playWord(currentCard.term)}
          className="mb-4 p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group"
        >
          <Volume2 size={32} className="group-hover:scale-110 transition-transform" />
        </button>
        
        <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
          {currentCard.term}
        </h3>
        <p className="text-lg text-slate-600 mb-6 max-w-md">
          {currentCard.meaning}
        </p>
        
        <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Senior Context</p>
          <p className="text-sm text-slate-500 italic">"{currentCard.senior_context}"</p>
        </div>
      </div>

      {/* Action Zone: Speech to Text */}
      <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Voice Practice</p>
          <p className="text-slate-700">Speak a sentence using <b>"{currentCard.term}"</b></p>
        </div>

        {/* Transcript Preview */}
        <div className="min-h-[60px] w-full bg-white rounded-2xl p-4 border border-slate-100 text-center flex items-center justify-center">
          {transcript ? (
            <p className="text-blue-600 font-medium italic">"{transcript}"</p>
          ) : (
            <p className="text-slate-300 text-sm">Your spoken sentence will appear here...</p>
          )}
        </div>

        <button 
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? "bg-red-500 shadow-xl shadow-red-100 animate-pulse" 
              : "bg-blue-600 shadow-lg shadow-blue-100 hover:bg-blue-700"
          }`}
        >
          {isRecording ? <div className="w-6 h-6 bg-white rounded-sm" /> : <Mic className="text-white" size={32} />}
        </button>

        <button 
          onClick={handleNext}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          {activeIdx === flashcards.length - 1 ? "Complete Vocab" : "Next Word"}
          <Play size={18} fill="white" />
        </button>
      </div>
    </div>
  );
}