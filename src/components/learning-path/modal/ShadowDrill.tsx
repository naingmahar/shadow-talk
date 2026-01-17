// src/components/learning-path/modal/ShadowDrill.tsx
"use client";

import React, { useState } from "react";
import { Volume2, Mic, CheckCircle, RefreshCcw, Edit3, Save, X } from "lucide-react";

export default function ShadowDrill({ audioRef: initialAudioRef, onComplete }: { audioRef: string, onComplete: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Script Editing State
  const [script, setScript] = useState(initialAudioRef);
  const [isEditing, setIsEditing] = useState(false);

  const playReference = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(script); // Uses the updated script
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const startShadowing = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (e: any) => setUserTranscript(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">Shadow Talk</h2>
        <p className="text-slate-500 mt-1">Listen to the reference, then repeat it exactly.</p>
      </div>

      {/* EDITABLE REFERENCE SECTION */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative border-4 border-transparent focus-within:border-blue-500/30 transition-all">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
            {isEditing ? "Editing Script..." : "Native Reference"}
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Edit Script"
            >
              {isEditing ? <X size={18} /> : <Edit3 size={18} />}
            </button>
            {!isEditing && (
              <button 
                onClick={playReference}
                className={`p-2 rounded-xl transition-all ${isPlaying ? "bg-blue-500 animate-pulse" : "bg-white/10 hover:bg-white/20"}`}
              >
                <Volume2 size={18} />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xl font-medium text-white outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              autoFocus
            />
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold ml-auto"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        ) : (
          <p className="text-xl font-medium leading-relaxed pr-8">
            {script}
          </p>
        )}
      </div>

      {/* USER ACTION SECTION */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-full min-h-[80px] p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-center">
          {userTranscript ? (
            <p className="text-blue-700 font-bold italic">"{userTranscript}"</p>
          ) : (
            <p className="text-slate-400 text-sm italic">Click below and start shadowing...</p>
          )}
        </div>

        <button 
          onClick={startShadowing}
          disabled={isRecording || isEditing}
          className={`group flex items-center gap-4 px-10 py-5 rounded-full font-black text-lg transition-all shadow-xl ${
            isRecording ? "bg-red-500 text-white scale-105" : "bg-white text-slate-900 border-2 border-slate-100 hover:border-blue-600 disabled:opacity-50"
          }`}
        >
          {isRecording ? "Recording..." : "Start Shadowing"}
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="pt-4 border-t border-slate-50 flex gap-3">
        <button 
          onClick={() => setUserTranscript("")}
          className="p-4 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50"
        >
          <RefreshCcw size={20} />
        </button>
        <button 
          onClick={onComplete}
          disabled={!userTranscript || isEditing}
          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-20 flex items-center justify-center gap-2"
        >
          Check Pronunciation <CheckCircle size={20} />
        </button>
      </div>
    </div>
  );
}