"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Trophy, Loader2, ArrowRight, Mic, Square, 
  Volume2, CheckCircle2, Sparkles, GraduationCap 
} from 'lucide-react';

import DeckSelector from '@/components/flashcards/DeckSelector';
import { PROGRAMMER_FLASHCARDS } from '@/constants/programmer';
import { FUNCTIONAL_ENGLISH_FLASHCARDS } from '@/constants/functional';

export default function ExamPage() {
  // --- 1. STATE MANAGEMENT ---
  const [view, setView] = useState<'select' | 'test' | 'result'>('select');
  const [deckType, setDeckType] = useState<'tech' | 'english'>('tech');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const [examCards, setExamCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  
  // Audio Refs
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // --- 2. TEXT TO SPEECH (TTS) LOGIC ---
  const playQuestion = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any current audio

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Strategy to find the best voice actor based on device
    const selectedVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      if (gender === 'male') {
        return name.includes('male') || name.includes('david') || name.includes('google us english');
      } else {
        return name.includes('female') || name.includes('samantha') || name.includes('zira');
      }
    });

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.95; 
    utterance.pitch = gender === 'male' ? 0.9 : 1.1;
    utterance.lang = 'en-US';
    
    window.speechSynthesis.speak(utterance);
  };

  // --- 3. AUTO-START VOICE ON QUESTION CHANGE ---
  useEffect(() => {
    if (view === 'test' && examCards[currentIndex]) {
      const timer = setTimeout(() => {
        playQuestion(examCards[currentIndex].question);
      }, 400); // Small delay for smooth transition
      return () => clearTimeout(timer);
    }
    return () => window.speechSynthesis.cancel();
  }, [currentIndex, view, gender]);

  // --- 4. EXAM FLOW CONTROLS ---
  const handleStartExam = () => {
    const all = deckType === 'tech' ? PROGRAMMER_FLASHCARDS : FUNCTIONAL_ENGLISH_FLASHCARDS;
    const filtered = all.filter(c => 
      c.category.toLowerCase() === category.toLowerCase() && 
      (subCategory === 'none' || !subCategory ? true : c.sub === subCategory)
    );

    if (filtered.length === 0) return alert("No cards found for this selection!");

    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);
    setExamCards(shuffled);
    setScores([]);
    setCurrentIndex(0);
    setView('test');
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      await sendToGemini(blob);
    };
    audioChunks.current = [];
    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const sendToGemini = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('question', examCards[currentIndex].question);
      
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
    } finally { setIsTranscribing(false); }
  };

  const nextQuestion = async () => {
    const newScores = [...scores, feedback.score];
    setScores(newScores);

    if (currentIndex < examCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback(null);
    } else {
      const finalAvg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
      await addDoc(collection(db, "exam_results"), {
        score: finalAvg,
        category,
        subCategory: subCategory || 'General',
        timestamp: serverTimestamp(),
        type: 'exam_10'
      });
      setView('result');
    }
  };

  // --- 5. RENDER VIEWS ---

  if (view === 'select') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-blue-100">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Exam Mode</h1>
          <p className="text-slate-400 font-medium text-sm">Challenge yourself with 10 random cards</p>
        </div>
        
        <DeckSelector 
          deckType={deckType} setDeckType={setDeckType}
          category={category} setCategory={setCategory}
          subCategory={subCategory} setSubCategory={setSubCategory}
          onStart={handleStartExam}
        />
      </div>
    );
  }

  if (view === 'result') {
    const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
    return (
      <div className="max-w-md mx-auto py-20 text-center px-6 animate-in zoom-in-95">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
          <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
          <h2 className="text-2xl font-black text-slate-900">Exam Finished!</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Total Average Score</p>
          <div className="text-7xl font-black my-8 italic text-slate-900">{avg}%</div>
          <button 
            onClick={() => setView('select')} 
            className="w-full py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-lg transition-transform active:scale-95"
          >
            Try Another Category
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in">
      {/* Top Navigation / Progress */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-1000 ease-out" 
            style={{ width: `${((currentIndex + 1) / examCards.length) * 100}%` }}
          />
        </div>
        <button 
          onClick={() => setGender(gender === 'male' ? 'female' : 'male')}
          className="shrink-0 px-4 py-2 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-tight hover:border-blue-100 transition-all shadow-sm"
        >
          {gender === 'male' ? '👨 Male AI' : '👩 Female AI'}
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Question {currentIndex + 1} of 10</span>
          <p className="text-[10px] font-bold text-blue-500 uppercase">{category} • {subCategory || 'General'}</p>
        </div>
        <button 
          onClick={() => playQuestion(examCards[currentIndex].question)}
          className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all active:scale-90"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-xl shadow-slate-100/50 mb-8 flex flex-col items-center justify-center min-h-[220px]">
        <h2 className="text-2xl font-bold leading-tight text-slate-800 text-center italic tracking-tight">
          "{examCards[currentIndex].question}"
        </h2>
      </div>

      {/* Evaluation Feedback Area */}
      <div className="min-h-[200px] mb-28">
        {isTranscribing && (
          <div className="flex flex-col items-center py-10 animate-pulse">
            <Loader2 className="animate-spin text-blue-500 mb-3" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Evaluation in progress...</p>
          </div>
        )}

        {feedback && !isTranscribing && (
           <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
              <div className="flex items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className={`text-4xl font-black ${feedback.score >= 80 ? 'text-green-500' : 'text-blue-600'}`}>
                  {feedback.score}
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Your Answer</p>
                  <p className="text-xs text-slate-500 italic font-medium leading-relaxed">"{feedback.transcript}"</p>
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
              >
                Confirm & Next Question <ArrowRight size={18} />
              </button>
           </div>
        )}
      </div>

      {/* Fixed Voice Control Bar */}
      {!feedback && !isTranscribing && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all ${
              isRecording 
              ? 'bg-red-500 text-white animate-pulse shadow-red-200' 
              : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}
          >
            {isRecording ? <Square size={18} fill="white" /> : <Mic size={20} />}
            {isRecording ? 'Stop Recording' : 'Answer Now'}
          </button>
        </div>
      )}
    </div>
  );
}