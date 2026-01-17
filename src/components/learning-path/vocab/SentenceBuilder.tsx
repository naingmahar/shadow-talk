"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Sparkles, RotateCcw, Loader2, CheckCircle, Award, MicOff } from "lucide-react";

interface SentenceBuilderProps {
  term: string;
}

export default function SentenceBuilder({ term }: SentenceBuilderProps) {
  const [userInput, setUserInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; advice: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // Reference for the Speech Recognition object
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        setUserInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setUserInput(""); // Clear previous text for a new recording
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleAICheck = async () => {
    if (userInput.length < 10) return;
    setIsChecking(true);
    try {
      const res = await fetch("/api/check-seniority", {
        method: "POST",
        body: JSON.stringify({ sentence: userInput, targetTerm: term }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error("AI Check failed");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 tracking-tight">Final Production</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-slate-400">Oral Briefing Exercise</p>
          </div>
        </div>

        <div className="relative group">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={!!feedback || isChecking}
            placeholder={`Click Mic to speak or type an architectural decision using "${term.toUpperCase()}"...`}
            className={`w-full h-40 p-6 rounded-[2rem] border-2 transition-all outline-none text-slate-700 font-medium leading-relaxed resize-none ${
              isRecording ? "border-red-400 bg-red-50/30" : "border-transparent bg-slate-50 focus:border-blue-500 focus:bg-white"
            }`}
          />
          
          <div className="absolute bottom-4 right-4">
            <button 
              type="button"
              onClick={toggleRecording}
              className={`p-4 rounded-2xl transition-all shadow-lg flex items-center gap-2 ${
                isRecording 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              {isRecording && <span className="text-xs font-black uppercase">Recording...</span>}
            </button>
          </div>
        </div>

        {!feedback && (
          <div className="mt-6 flex gap-3">
            <button 
              onClick={handleAICheck}
              disabled={userInput.length < 10 || isChecking || isRecording}
              className="flex-1 py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2"
            >
              {isChecking ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Analyze Sentence</>}
            </button>
          </div>
        )}

        {feedback && (
          <div className="mt-6 animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                  <Award size={16} /> Seniority Score
                </div>
                <span className="text-3xl font-black">{feedback.score}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${feedback.score}%` }} 
                />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{feedback.advice}"</p>
              <button onClick={() => { setUserInput(""); setFeedback(null); }} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
                <RotateCcw size={14} /> Try a different approach
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-6">
        <CheckCircle size={14} className={userInput.toLowerCase().includes(term.toLowerCase()) ? "text-green-500" : "text-slate-300"} />
        <span className="text-[10px] font-black text-slate-400 uppercase">Usage of "{term}"</span>
      </div>
    </div>
  );
}