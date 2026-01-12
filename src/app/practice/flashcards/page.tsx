"use client";

import React, { useState, useRef } from 'react';
import { 
  RotateCcw, 
  Mic, 
  Square, 
  Loader2, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  Trophy,
  ArrowLeft,
  GraduationCap,
  Zap
} from 'lucide-react';

// Components
import DeckSelector from '@/components/flashcards/DeckSelector';
import CardFrame from '@/components/flashcards/CardFrame';

// Data Constants
import { PROGRAMMER_FLASHCARDS } from '@/constants/programmer';
import { FUNCTIONAL_ENGLISH_FLASHCARDS } from '@/constants/functional';
import { useRouter } from 'next/navigation';

interface GeminiFeedback {
  status: 'Correct' | 'Incorrect' | 'Incomplete';
  score: number;
  analysis: string;
  suggestion: string;
  transcript: string;
}

export default function FlashcardPage() {
  // --- 1. NAVIGATION & SELECTION STATE ---
  const [mode, setMode] = useState<'selection' | 'practice'>('selection');
  const [deckType, setDeckType] = useState<'tech' | 'english'>('tech');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // --- 2. PRACTICE & RECORDING STATE ---
  const [index, setIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [feedback, setFeedback] = useState<GeminiFeedback | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // --- 3. FILTERING LOGIC ---
  const allCards = deckType === 'tech' ? PROGRAMMER_FLASHCARDS : FUNCTIONAL_ENGLISH_FLASHCARDS;
  const filteredCards = allCards.filter(c => {
    const matchCat = c.category.toLowerCase() === category.toLowerCase();
    const matchSub = (subCategory === 'none' || !subCategory) ? true : c.sub === subCategory;
    return matchCat && matchSub;
  });

  const card = filteredCards[index % filteredCards.length] || filteredCards[0];

  // --- 4. VOICE LOGIC ---
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
      alert("Microphone access is required for voice practice.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendToGemini = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('question', card.question);
      formData.append('sub', subCategory || category);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      console.error("Gemini Error:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleNext = () => {
    setIndex((prev) => prev + 1);
    setFeedback(null);
  };

  const router = useRouter();

  // Function to navigate to exam with parameters
  const handleGoToExam = () => {
    const params = new URLSearchParams({
      deck: deckType,
      cat: category,
      sub: subCategory || 'none'
    });
    router.push(`/exam?${params.toString()}`);
  };

  // --- RENDER SELECTION MODE ---
  if (mode === 'selection') {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        {/* --- COMPACT TOP HEADER --- */}
        <div className="flex items-center justify-between mb-8 bg-slate-900 p-4 rounded-[2rem] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-2xl">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-white text-sm font-black tracking-tight leading-none">Exam Mode</h1>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">10-Card Challenge</p>
            </div>
          </div>
          
          <button 
            onClick={handleGoToExam}
            disabled={!category}
            className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              category 
              ? 'bg-blue-600 text-white animate-pulse' 
              : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
            }`}
          >
            Try Exam
          </button>
        </div>

        {/* --- MAIN TITLE --- */}
        <div className="mb-6 px-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Speaking Lab</h2>
          <p className="text-slate-400 text-xs font-medium">Select a topic below to start practicing</p>
        </div>

        {/* --- CATEGORY SELECTOR --- */}
        <DeckSelector 
          deckType={deckType} setDeckType={setDeckType}
          category={category} setCategory={setCategory}
          subCategory={subCategory} setSubCategory={setSubCategory}
          onStart={() => setMode('practice')} 
        />
        
        <p className="text-center mt-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Tip: Select a category to unlock Exam Mode
        </p>
      </div>
    );
  }

  // --- RENDER PRACTICE MODE ---
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-44 animate-in fade-in duration-500">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setMode('selection')}
          className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Menu
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{category}</p>
          <p className="text-xs font-bold text-slate-400">{subCategory === 'none' ? 'General' : subCategory}</p>
        </div>
      </div>

      {/* The Question Card */}
      <CardFrame 
        question={card?.question || "No questions found for this selection."} 
        category={category} 
        sub={subCategory} 
      />

      {/* --- FEEDBACK AREA --- */}
      <div className="mt-8 space-y-4">
        {isTranscribing && (
          <div className="p-12 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2.5rem]">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
            <p className="text-blue-600 font-bold animate-pulse">Gemini is checking your answer...</p>
          </div>
        )}

        {feedback && !isTranscribing && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
            {/* Score & Status Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase">Score</p>
                  <p className={`text-3xl font-black italic ${feedback.score >= 80 ? 'text-green-500' : 'text-orange-500'}`}>{feedback.score}</p>
                </div>
                <Trophy size={24} className="text-slate-100" />
              </div>
              <div className={`p-4 rounded-3xl border flex items-center gap-3 ${
                feedback.status === 'Correct' ? 'bg-green-50 border-green-100 text-green-600' : 
                feedback.status === 'Incomplete' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' : 
                'bg-red-50 border-red-100 text-red-600'
              }`}>
                {feedback.status === 'Correct' ? <CheckCircle2 /> : feedback.status === 'Incomplete' ? <HelpCircle /> : <AlertCircle />}
                <span className="font-black text-xs uppercase italic">{feedback.status}</span>
              </div>
            </div>

            {/* Analysis */}
            <div className="p-6 bg-white border border-slate-100 rounded-[2rem]">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Analysis</p>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{feedback.analysis}</p>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-300 italic">" {feedback.transcript} "</p>
              </div>
            </div>

            {/* Polished Suggestion */}
            <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl relative overflow-hidden">
               <Sparkles className="absolute top-4 right-4 text-blue-500 opacity-30" size={24} />
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Short & Clear Version</p>
               <p className="text-lg font-bold leading-tight">{feedback.suggestion}</p>
            </div>
          </div>
        )}
      </div>

      {/* --- FLOATING CONTROL BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-full shadow-2xl flex items-center gap-2">
          
          <button 
            onClick={() => { setFeedback(null); if (isRecording) stopRecording(); }}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all"
          >
            <RotateCcw size={20} />
          </button>

          <button 
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            className={`flex-grow h-14 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white shadow-lg shadow-blue-100'
            } disabled:opacity-50`}
          >
            {isRecording ? <Square size={16} fill="white" /> : <Mic size={18} />}
            {isRecording ? 'Stop' : 'Answer Now'}
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