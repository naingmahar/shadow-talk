"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Type, Send, Sparkles, RotateCcw, CheckCircle, Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

interface PracticeDrillProps {
  theme: string;
  requiredKeywords: string[];
  onComplete: () => void;
}

export default function PracticeDrill({ theme, requiredKeywords, onComplete }: PracticeDrillProps) {
  const { dayId } = useParams();
  const { user } = useAuth();
  
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; advice: string } | null>(null);
  
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition for Voice Mode
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInput(transcript);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const handleAiCheckAndSave = async () => {
    if (!user || input.length < 20) return;
    
    setIsChecking(true);
    setFeedback(null);

    try {
      // 1. AI SENIORITY CHECK
      const res = await fetch("/api/check-seniority", {
        method: "POST",
        body: JSON.stringify({
          sentence: input,
          targetTerm: `Synthesis of ${theme}. Required technical concepts: ${requiredKeywords.join(", ")}`,
        }),
      });
      
      const aiResult = await res.json();
      setFeedback(aiResult);

      // 2. PERSISTENCE LOGIC (Only if score >= 70%)
      if (aiResult.score >= 0) {
        await addDoc(collection(db, "user_activity"), {
          uid: user.uid,
          type: "mission_complete",
          day: Number(dayId),
          theme: theme,
          score: aiResult.score,
          content: input,
          timestamp: serverTimestamp(), // Correct way to handle dates in Firebase
          metadata: {
            mode: mode,
            keywords_found: requiredKeywords.filter(k => input.toLowerCase().includes(k.toLowerCase()))
          }
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const isPassing = feedback && feedback.score >= 0;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-10">
        <div className="inline-block p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
          <Sparkles size={24} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Final Synthesis</h2>
        <p className="text-slate-500 font-medium text-lg px-4 leading-snug">
          Synthesize your approach to <span className="text-slate-900 font-bold underline decoration-indigo-200">"{theme}"</span>.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit mx-auto">
          <button 
            onClick={() => setMode("text")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${mode === "text" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
          >
            <Type size={18} /> Text
          </button>
          <button 
            onClick={() => setMode("voice")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${mode === "voice" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
          >
            <Mic size={18} /> Voice
          </button>
        </div>

        {/* Input Area */}
        <div className="relative mb-8">
          {mode === "text" ? (
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Structure your architectural defense here..."
              className="w-full h-48 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg leading-relaxed text-slate-700 resize-none shadow-inner"
            />
          ) : (
            <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-900 rounded-[2rem] text-white overflow-hidden p-6">
              {input && <p className="mb-4 text-slate-400 text-sm italic text-center line-clamp-2">"{input}"</p>}
              <button 
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 animate-pulse scale-110 shadow-[0_0_25px_rgba(239,68,68,0.5)]" : "bg-indigo-600 hover:bg-indigo-500"}`}
              >
                <Mic size={32} />
              </button>
              <p className="mt-4 font-bold text-slate-400">
                {isRecording ? "Listening to your logic..." : "Click to speak your briefing"}
              </p>
            </div>
          )}
        </div>

        {/* Requirements Checklist */}
        <div className="mb-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Senior Terminology</p>
          <div className="flex flex-wrap gap-2">
            {requiredKeywords.map((word) => {
              const isUsed = input.toLowerCase().includes(word.toLowerCase());
              return (
                <span 
                  key={word} 
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all duration-500 ${
                    isUsed 
                    ? "bg-green-50 border-green-200 text-green-600 scale-105" 
                    : "bg-slate-50 border-slate-100 text-slate-400"
                  }`}
                >
                  {word} {isUsed && <CheckCircle size={12} className="inline ml-1" />}
                </span>
              );
            })}
          </div>
        </div>

        {/* AI Feedback Display */}
        {feedback && (
          <div className={`mb-8 p-6 rounded-3xl border-2 animate-in slide-in-from-top-4 ${isPassing ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-black text-xs uppercase ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {isPassing ? 'Mission Success' : 'Critique Received'} ({feedback.score}%)
              </span>
              {!isPassing && <AlertCircle size={18} className="text-red-500" />}
            </div>
            <p className="text-slate-700 text-sm italic leading-relaxed">"{feedback.advice}"</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button 
            onClick={() => { setInput(""); setFeedback(null); }}
            className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
          >
            <RotateCcw size={24} />
          </button>
          
          {isPassing ? (
            <button 
              onClick={onComplete}
              className="flex-1 py-5 bg-green-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-all animate-bounce"
            >
              Finish Training <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              disabled={input.length < 20 || isChecking}
              onClick={handleAiCheckAndSave}
              className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg"
            >
              {isChecking ? (
                <><Loader2 size={20} className="animate-spin" /> Analyzing Seniority...</>
              ) : (
                <><Send size={20} /> Verify & Persist Mission</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}