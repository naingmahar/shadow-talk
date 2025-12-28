"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Save, Volume2, User, UserCheck } from 'lucide-react';
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
  
  // Use the custom hook for recording logic (Feature 6)
  const { isRecording, audioBlob, startRecording, stopRecording } = useRecorder();

  useEffect(() => {
  const pending = localStorage.getItem('pending_script');
  if (pending) {
    setText(pending);
    localStorage.removeItem('pending_script'); // Clear it so it doesn't stay forever
  }
}, []);

  // 1. Generate Speech + Upload TTS to Storage + Create Firestore Record
  const generateSpeech = async () => {
    if (!text) return;
    setLoadingTTS(true);
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login first");

      // A. Call the Next.js API for Google TTS
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, gender }),
      });
      
      if (!response.ok) throw new Error("Failed to generate speech");
      
      const audioBlob = await response.blob();
      
      // B. Upload the TTS audio to Firebase Storage (getStorage)
      const ttsFileName = `tts_generated/${user.uid}/${Date.now()}.mp3`;
      const ttsStorageRef = ref(storage, ttsFileName);
      
      await uploadBytes(ttsStorageRef, audioBlob);
      const downloadUrl = await getDownloadURL(ttsStorageRef);

      // C. Save the text and the new URL to Firestore (initial record)
      // We use 'shadow_sessions' so it shows up in your history later
      const docRef = await addDoc(collection(db, 'shadow_sessions'), {
        userId: user.uid,
        text: text,
        ttsUrl: downloadUrl,
        userVoiceUrl: null, // Placeholder until user records
        gender: gender,
        createdAt: new Date(),
      });

      setTtsAudioUrl(downloadUrl);
      setCurrentDocId(docRef.id); 
      alert("Professional voice ready!");

    } catch (error) {
      console.error("TTS Error:", error);
      alert("Error generating speech. Please try again.");
    } finally {
      setLoadingTTS(false);
    }
  };

  // 2. Playback Speed Control (Feature 5)
  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // 3. Upload User Recording + Update Firestore Record
  const handleSaveSession = async () => {
    if (!audioBlob || !currentDocId) return alert("Please record your voice first");
    const user = auth.currentUser;
    if (!user) return alert("Please login first");

    setIsSaving(true);
    try {
      // A. Upload User Voice to Storage
      const voiceRef = ref(storage, `recordings/${user.uid}/${currentDocId}.mp3`);
      await uploadBytes(voiceRef, audioBlob);
      const userVoiceUrl = await getDownloadURL(voiceRef);

      // B. Update the existing Firestore Document
      const sessionDoc = doc(db, 'shadow_sessions', currentDocId);
      await updateDoc(sessionDoc, {
        userVoiceUrl: userVoiceUrl,
      });

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
        
        {/* Step 1: Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">1. Enter Script & Choose Voice</label>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setGender('FEMALE')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition-all ${gender === 'FEMALE' ? 'bg-pink-50 border-pink-500 text-pink-700 ring-2 ring-pink-100' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              <User size={16} /> Female
            </button>
            <button 
              onClick={() => setGender('MALE')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition-all ${gender === 'MALE' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              <UserCheck size={16} /> Male
            </button>
          </div>

          <textarea
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
            rows={4}
            placeholder="Type what you want to practice..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button 
            onClick={generateSpeech}
            disabled={loadingTTS || !text}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all font-bold shadow-lg shadow-blue-100"
          >
            {loadingTTS ? "Processing..." : <><Volume2 size={20} /> Generate {gender.toLowerCase()} Voice</>}
          </button>
        </div>

        {/* Step 2: TTS Playback & Speed */}
        {ttsAudioUrl && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">2. Listen & Shadow</label>
            <audio ref={audioRef} src={ttsAudioUrl} controls className="w-full mb-4" />
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Speed:</span>
              {[0.5, 0.75, 1].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                    playbackRate === rate ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Recording Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-700 mb-4">3. Record Your Voice</p>
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isRecording ? 'bg-red-500 scale-95 shadow-red-200 ring-4 ring-red-100 animate-pulse' : 'bg-slate-800 hover:bg-black text-white'
            }`}
          >
            {isRecording ? <Square fill="white" size={24} /> : <Mic size={28} />}
          </button>
          
          <p className="text-xs text-slate-400 mt-4 italic">
            {isRecording ? "Release to stop recording" : "Hold button to record"}
          </p>

          {/* Show save button only after a recording exists */}
          {audioBlob && !isRecording && (
            <button 
              onClick={handleSaveSession}
              disabled={isSaving}
              className="mt-6 flex items-center gap-2 bg-green-600 text-white px-8 py-2 rounded-full font-bold hover:bg-green-700 transition-all shadow-md disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? "Saving..." : "Save this Session"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}