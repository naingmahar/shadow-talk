"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, RefreshCw, Layers, Briefcase, Zap, ChevronRight } from 'lucide-react';
import { SECTOR_DATA } from '@/constants/sectors'; 
import { useScript } from '@/context/ScriptContext';

export default function TopicsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScriptLocal] = useState('');
  const { setGeneratedScript } = useScript();
  
  const [sector, setSector] = useState("MOBILE DEVELOPMENT");
  const [selection, setSelection] = useState({
    category: "INTERVIEW",
    position: "Frontend Developer",
    tool: "React Native",
    subtopic: "Performance Optimization"
  });

  //@ts-ignore
  const currentData = SECTOR_DATA[sector] || SECTOR_DATA["DAILY & TRAVEL CONVERSATION"];

  const handleSectorChange = (newSector: string) => {
    setSector(newSector);
      //@ts-ignore
    const newData = SECTOR_DATA[newSector];
    const firstCat = Object.keys(newData.subtopics)[0];
    setSelection({
      category: firstCat,
      position: newData.positions[0],
      tool: newData.tools[0],
      subtopic: newData.subtopics[firstCat][0]
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, ...selection }),
      });
      const data = await res.json();
      setGeneratedScriptLocal(data.script);
      setGeneratedScript(data.script)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header - Clean & Minimal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm tracking-widest uppercase">
              <Zap size={16} fill="currentColor" /> AI Shadowing
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Scenario <span className="text-slate-400 font-light underline decoration-blue-500/30">Designer</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-xs text-sm">
            Customize your practice session by selecting your industry and specific role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Clean Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. SECTOR */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Briefcase size={14} /> 01. Choose Your Industry
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(SECTOR_DATA).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSectorChange(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                      sector === s
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. CATEGORY */}
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">02. Conversation Type</label>
                <div className="flex flex-col gap-2">
                  {Object.keys(currentData.subtopics).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelection({ ...selection, category: cat, subtopic: currentData.subtopics[cat][0] })}
                      className={`px-4 py-3 rounded-xl text-sm font-bold text-left transition-all border-2 flex justify-between items-center ${
                        selection.category === cat 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                      <ChevronRight size={14} opacity={selection.category === cat ? 1 : 0} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. POSITION */}
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600">03. Target Role</label>
                <div className="flex flex-col gap-2">
                  {/* @ts-ignore */}
                  {currentData.positions.slice(0, 7).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelection({ ...selection, position: p })}
                      className={`px-4 py-3 rounded-xl text-xs font-bold text-left transition-all border-2 ${
                        selection.position === p 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'bg-white border-slate-100 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. TOOLS & SUBTOPICS CARD */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">04. Technical / Tool Focus</label>
                <div className="flex flex-wrap gap-2">
                  {/* @ts-ignore */}
                  {currentData.tools.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelection({ ...selection, tool: t })}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        selection.tool === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">05. Primary Discussion Topic</label>
                <div className="flex flex-wrap gap-2">
                  {/* @ts-ignore */}
                  {(currentData.subtopics[selection.category] || []).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelection({ ...selection, subtopic: sub })}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                        selection.subtopic === sub 
                        ? 'border-slate-900 bg-slate-900 text-white' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Clean Preview Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-10 flex flex-col gap-6">
              <div className="bg-white rounded-[3rem] border-4 border-slate-100 p-10 shadow-2xl shadow-slate-200/50 min-h-[500px] flex flex-col">
                
                <div className="flex-grow space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Layers size={18} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">Script Preview</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black text-blue-600 border border-blue-100">
                      {sector}
                    </span>
                  </div>

                  <div className="flex-grow flex items-center justify-center py-6">
                    {loading ? (
                      <div className="text-center space-y-4">
                        <RefreshCw className="animate-spin text-blue-600 mx-auto" size={40} />
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-tighter">AI is thinking...</p>
                      </div>
                    ) : (
                      <div className="w-full">
                        {generatedScript ? (
                          <div className="space-y-4">
                            <p className="text-xl text-slate-800 leading-relaxed font-serif italic italic bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500">
                              "{generatedScript}"
                            </p>
                          </div>
                        ) : (
                          <div className="text-center space-y-4 opacity-20">
                            <Sparkles size={48} className="mx-auto" />
                            <p className="text-xs font-bold uppercase tracking-widest">Select your settings</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
                  >
                    <Sparkles size={20} />
                    GENERATE SCRIPT
                  </button>
                  
                  {generatedScript && (
                    <button 
                      onClick={() => {
                        sessionStorage.setItem('pending_script', generatedScript);
                        router.push('/practice');
                      }}
                      className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      START PRACTICE <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}