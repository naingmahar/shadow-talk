"use client";

import React, { useState, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Loader2, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  MessageSquareText
} from 'lucide-react';

// Components & Data
import DeckSelector from '@/components/flashcards/DeckSelector';
import CardFrame from '@/components/flashcards/CardFrame';
import { PROGRAMMER_FLASHCARDS } from '@/constants/programmer';
import { FUNCTIONAL_ENGLISH_FLASHCARDS } from '@/constants/functional';

interface GeminiFeedback {
  status: 'Correct' | 'Incorrect' | 'Incomplete';
  analysis: string;
  suggestion: string;
  transcript: string;
}

export default function FlashcardPage() {
  // 1. STATE
  const [deckType, setDeckType] = useState<'tech' | 'english'>('tech');
  const [index, setIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [feedback, setFeedback] = useState<GeminiFeedback | null>(null);

  // 2. REFS
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const currentData = deckType === 'tech' ? PROGRAMMER_FLASHCARDS : FUNCTIONAL_ENGLISH_FLASHCARDS;
  const card = currentData[index];

  // 3. RECORDING LOGIC
  const startRecording = async () => {
    try {
      setFeedback(null);
      audioChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await sendToGemini(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied. Please enable it in browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // 4. API CALL (Sends Audio + Question)
  const sendToGemini = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('question', card.question); // Send the specific question

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("API Route Failed");
      
      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      console.error("Evaluation Error:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleNext = () => {
    setIndex(Math.floor(Math.random() * currentData.length));
    setFeedback(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-12 pb-40">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Speaking Lab <Sparkles size={20} className="text-blue-500" />
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">AI-Powered Evaluation</p>
        </div>
        <div className="bg-slate-100 p-2 rounded-xl text-slate-400">
          <MessageSquareText size={20} />
        </div>
      </div>

      <DeckSelector 
        currentDeck={deckType} 
        setDeck={(d) => { setDeckType(d); setFeedback(null); }} 
      />
      
      <div className="mt-8">
        <CardFrame 
          question={card.question} 
          category={card.category} 
          sub={card.sub} 
        />
      </div>

      {/* --- FEEDBACK SECTION --- */}
      <div className="mt-8 space-y-4 min-h-[200px]">
        {isTranscribing && (
          <div className="p-12 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-blue-600 font-bold animate-pulse">AI is checking your answer...</p>
          </div>
        )}

        {feedback && !isTranscribing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            
            {/* PART 1: STATUS BAR */}
            <div className={`p-4 rounded-2xl flex items-center justify-between border-l-8 shadow-sm ${
              feedback.status === 'Correct' ? 'bg-green-50 border-green-500 text-green-700' :
              feedback.status === 'Incomplete' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
              'bg-red-50 border-red-500 text-red-700'
            }`}>
              <div className="flex items-center gap-3">
                {feedback.status === 'Correct' ? <CheckCircle2 size={24} /> : feedback.status === 'Incomplete' ? <HelpCircle size={24} /> : <AlertCircle size={24} />}
                <span className="font-black text-sm uppercase tracking-tight italic">Result: {feedback.status}</span>
              </div>
              <span className="text-[10px] font-bold opacity-60">Verified by Gemini Flash</span>
            </div>

            {/* PART 2: ANALYSIS & TRANSCRIPT */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Detailed Analysis</span>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {feedback.analysis}
              </p>
              <div className="pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Your exact words:</span>
                <p className="text-slate-400 text-xs italic italic">"{feedback.transcript}"</p>
              </div>
            </div>

            {/* PART 3: PRO SUGGESTION */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Recommended Polish</span>
              </div>
              <p className="text-lg font-bold leading-relaxed">
                {feedback.suggestion}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- FLOATING CONTROL BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200 p-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-3">
          
          <button 
            onClick={() => { setFeedback(null); if (isRecording) stopRecording(); }}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors"
          >
            <RotateCcw size={20} />
          </button>

          <button 
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            className={`flex-grow h-14 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-200'
            } disabled:opacity-50`}
          >
            {isRecording ? (
              <>
                <Square size={16} fill="white" />
                Finish Answer
              </>
            ) : (
              <>
                <Mic size={18} />
                Record Answer
              </>
            )}
          </button>

          <button 
            onClick={handleNext}
            className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-full hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}