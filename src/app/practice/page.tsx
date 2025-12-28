"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Save, Volume2, User, UserCheck, Loader2 } from 'lucide-react';
import { db, storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';
import { useRecorder } from '@/hooks/useRecorder';

export default function PracticePage() {
  const [text, setText] = useState('');
  const [ttsAudioUrl, setTtsAudioUrl] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const [loadingTTS, setLoadingTTS] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isProcessingRef = useRef(false);
  
  const { isRecording, audioBlob, startRecording, stopRecording } = useRecorder();

  useEffect(() => {
    const pending = localStorage.getItem('shared_script');
    console.log("Pending Script from localStorage:", pending);
    if (pending) {
      setText(pending);
      // localStorage.removeItem('shared_script'); 
    }
  }, []);

  const handleToggleRecording = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      if (isRecording) {
        await stopRecording();
      } else {
        await startRecording();
      }
    } catch (err) {
      console.error("Recording error:", err);
    } finally {
      setTimeout(() => { isProcessingRef.current = false; }, 500);
    }
  };

  const generateSpeech = async () => {
    if (!text) return;
    setLoadingTTS(true);
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login first");

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, gender }),
      });
      
      if (!response.ok) throw new Error("Failed to generate speech");
      const blob = await response.blob();
      
      const ttsFileName = `tts_generated/${user.uid}/${Date.now()}.mp3`;
      const ttsStorageRef = ref(storage, ttsFileName);
      
      await uploadBytes(ttsStorageRef, blob);
      const downloadUrl = await getDownloadURL(ttsStorageRef);

      const docRef = await addDoc(collection(db, 'shadow_sessions'), {
        userId: user.uid,
        text: text,
        ttsUrl: downloadUrl,
        userVoiceUrl: null,
        gender: gender,
        createdAt: new Date(),
      });

      setTtsAudioUrl(downloadUrl);
      setCurrentDocId(docRef.id); 

    } catch (error) {
      console.error("TTS Error:", error);
      alert("Error generating speech.");
    } finally {
      setLoadingTTS(false);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleSaveSession = async () => {
    if (!audioBlob || !currentDocId) return alert("Please record your voice first");
    const user = auth.currentUser;
    if (!user) return alert("Please login first");

    setIsSaving(true);
    try {
      const voiceRef = ref(storage, `recordings/${user.uid}/${currentDocId}.mp3`);
      await uploadBytes(voiceRef, audioBlob);
      const userVoiceUrl = await getDownloadURL(voiceRef);

      const sessionDoc = doc(db, 'shadow_sessions', currentDocId);
      await updateDoc(sessionDoc, { userVoiceUrl: userVoiceUrl });

      alert("Success! Your practice session is saved to History.");
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save session.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Step 1: Input Section - UPDATED TEXTAREA SIZE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">1. Enter Script & Choose Voice</label>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setGender('FEMALE')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-sm ${gender === 'FEMALE' ? 'bg-pink-50 border-pink-500 text-pink-700 ring-2 ring-pink-100' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              <User size={16} /> Female
            </button>
            <button 
              onClick={() => setGender('MALE')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-sm ${gender === 'MALE' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              <UserCheck size={16} /> Male
            </button>
          </div>

          <textarea
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium min-h-[250px] transition-all"
            rows={10}
            placeholder="Paste your long technical script or presentation here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button 
            onClick={generateSpeech}
            disabled={loadingTTS || !text}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all font-bold shadow-lg shadow-blue-100"
          >
            {loadingTTS ? <Loader2 className="animate-spin" /> : <><Volume2 size={20} /> Generate Professional Voice</>}
          </button>
        </div>

        {/* Step 2: TTS Playback & Speed */}
        {ttsAudioUrl && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">2. Listen & Shadow</label>
            
            <div className="mb-4 p-4 bg-slate-50 rounded-xl max-h-[250px] overflow-y-auto border border-slate-100">
              <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{text}</p>
            </div>

            <audio ref={audioRef} src={ttsAudioUrl} controls className="w-full mb-4" />
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Playback Speed</span>
              {[0.5, 0.75, 1].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    playbackRate === rate ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Recording Section */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col items-center">
          <p className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest text-[10px]">3. Practice Session</p>
          
          <button
            onClick={handleToggleRecording}
            className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl ${
              isRecording 
                ? 'bg-red-500 scale-95 shadow-red-200 ring-8 ring-red-50' 
                : 'bg-slate-900 hover:bg-black text-white'
            }`}
          >
            {isRecording ? (
              <>
                <Square fill="white" size={24} className="animate-pulse mb-1" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-white">Stop</span>
              </>
            ) : (
              <>
                <Mic size={32} className="mb-1" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-white">Start</span>
              </>
            )}
            
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
            )}
          </button>
          
          <p className={`text-sm font-bold mt-6 transition-colors ${isRecording ? 'text-red-500' : 'text-slate-400'}`}>
            {isRecording ? "Recording... Click to end" : "Click to start recording"}
          </p>

          {audioBlob && !isRecording && (
            <button 
              onClick={handleSaveSession}
              disabled={isSaving}
              className="mt-8 flex items-center gap-3 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isSaving ? "Saving..." : "Save to History"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}