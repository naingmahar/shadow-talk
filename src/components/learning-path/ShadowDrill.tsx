"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Info, PlayCircle, Loader2, CheckCircle2, MicOff } from "lucide-react";

export default function ShadowDrill({ data, onComplete }: any) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsRecording(false);
        handleAICheck(text);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const playMentorVoice = () => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(data.prompt);
    msg.rate = 0.9;
    msg.lang = "en-US";
    console.log("Speech started");
    msg.onstart = () => {
      console.log("Speech started");
    };
    msg.onend = () => {
      console.log("Speech ended");
    };
    msg.onerror = (s) => {
      console.log("Speech error",s);
    };

    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      setFeedback(null);
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const handleAICheck = async (text: string) => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/check-seniority", {
        method: "POST",
        body: JSON.stringify({
          sentence: text,
          targetTerm: `Shadowing task: ${data.prompt}. Must include: ${data.required_keywords.join(", ")}`,
        }),
      });
      const result = await res.json();
      setFeedback(result);
    } catch (err) {
      console.error("AI Check failed");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">Interview Shadow</h2>
        <p className="text-slate-500 font-medium text-lg">
          Listen to the model, then repeat it perfectly.
        </p>
      </div>

      {/* 1. Mentor Example Card */}
      <button 
        onClick={playMentorVoice}
        className="group w-full bg-blue-50 border-2 border-blue-100 rounded-[2.5rem] p-6 flex items-center justify-between hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm"
      >
        <div className="flex items-center gap-4 text-left">
          <PlayCircle size={40} className="text-blue-600 group-hover:text-white" />
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase group-hover:text-blue-200">Step 1: Listen</span>
            <p className="font-bold text-slate-700 group-hover:text-white">Hear Senior Implementation</p>
          </div>
        </div>
      </button>

      {/* 2. Recording Area */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white text-left relative overflow-hidden shadow-2xl">
        <div className="flex flex-wrap gap-2 mb-6">
          {data.required_keywords.map((word: string) => (
            <span key={word} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-wider text-blue-400">
              {word}
            </span>
          ))}
        </div>

        <p className="text-2xl font-bold leading-relaxed mb-10 opacity-90 italic">
          "{data.prompt}"
        </p>
        
        <button 
          onClick={toggleRecording}
          disabled={isChecking}
          className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl ${
            isRecording 
              ? "bg-red-500 text-white animate-pulse" 
              : "bg-white text-slate-900 hover:bg-blue-50"
          }`}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} className="text-blue-600" />}
          {isRecording ? "Listening..." : isChecking ? "Analyzing..." : "Repeat Statement"}
        </button>

        {transcript && (
          <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black text-slate-500 uppercase">Your Recording</span>
            <p className="text-slate-300 italic mt-2">"{transcript}"</p>
          </div>
        )}
        
        {feedback && (
          <div className="mt-6 p-6 bg-blue-600 rounded-3xl animate-in zoom-in">
             <div className="flex justify-between items-center mb-2">
                <span className="font-black text-xs uppercase text-blue-100">Seniority Score: {feedback.score}%</span>
                <CheckCircle2 size={18} />
             </div>
             <p className="text-sm font-medium leading-relaxed">{feedback.advice}</p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
           <Info size={14} /> AI Constraint: {data.constraint}
        </div>
      </div>

      {/* 3. Footer Action */}
      {feedback?.score >= 0 && (
        <button 
          onClick={onComplete}
          className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-green-600 transition-all shadow-xl"
        >
          Proceed to Practice Phase
        </button>
      )}
    </div>
  );
}