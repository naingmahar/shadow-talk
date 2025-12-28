"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  label?: string;
}

export default function AudioPlayer({ src, label }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSpeed = (newSpeed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
      setSpeed(newSpeed);
    }
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full">
      {label && <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">{label}</p>}
      
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setIsPlaying(false)}
        className="hidden" 
      />

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Play/Pause Button */}
        <button 
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>

        {/* Speed Controls */}
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          {[0.5, 0.75, 1].map((rate) => (
            <button
              key={rate}
              onClick={() => changeSpeed(rate)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                speed === rate ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button 
          onClick={reset}
          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
          title="Restart"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}