"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, RefreshCw, Layers } from 'lucide-react';

const OPTIONS = {
  categories: ["Interview", "Daily Standup", "Client Meeting", "Technical Presentation", "Peer Review", "Salary Negotiation"],
  positions: ["Frontend Developer", "Backend Developer", "Mobile Developer", "DevOps Engineer", "Fullstack Developer", "QA Automation", "Data Engineer", "Security Specialist"],
  languages: ["React Native", "Flutter", "Swift", "Kotlin", "TypeScript", "Python", "Go", "Rust", "Java", "C#", "SQL", "PHP", "Ruby on Rails"],
  subtopics: [
    "Performance Optimization", "Unit Testing", "Memory Management", "CI/CD Pipelines", "State Management", 
    "API Design", "Database Indexing", "Authentication", "Cloud Infrastructure", "Microservices",
    "Responsive Design", "Error Handling", "Code Refactoring", "Scalability", "System Architecture",
    "Git Workflow", "Dockerization", "Kubernetes", "GraphQL", "Websockets", "Legacy Code", 
    "Dependency Injection", "Concurrency", "Asynchronous Programming", "Security Headers", 
    "OAuth2 Flow", "Middleware", "Caching Strategies", "Load Balancing", "Serverless Functions"
  ]
};

export default function TopicsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  
  // Selection state
  const [selection, setSelection] = useState({
    category: "Interview",
    position: "Software Developer",
    language: "React Native",
    subtopic: "Performance"
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selection),
      });
      console.log("Generate Script Response:", selection);
      const data = await res.json();
      setGeneratedScript(data.script);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Script Generator</h1>
          <p className="text-slate-500">Mix and match options to create a custom practice scenario.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Multi-Category Selectors */}
          <div className="lg:col-span-5 space-y-6">
            {Object.entries(OPTIONS).map(([key, values]) => (
              <div key={key} className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  {key}
                </label>
                <div className="flex flex-wrap gap-2">
                  {values.map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelection({ ...selection, [key.slice(0, -1)]: val })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        (selection as any)[key.slice(0, -1)] === val
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: AI Preview Panel */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/50 h-full flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <Layers size={20} />
                  <span>Preview Configuration</span>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[200px] flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="animate-spin text-blue-600" size={32} />
                      <p className="font-bold text-slate-500">Gemini is writing your script...</p>
                    </div>
                  ) : (
                    <p className="text-xl text-slate-700 leading-relaxed text-center italic">
                      {generatedScript ? `"${generatedScript}"` : "Adjust the filters and click Generate"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-[1] bg-white border-2 border-slate-900 text-slate-900 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  REGENERATE
                </button>
                
                {generatedScript && (
                  <button 
                    onClick={() => {
                      sessionStorage.setItem('shared_script', generatedScript);
                      router.push('/practice');
                    }}
                    className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    PRACTICE NOW <ArrowRight size={20} />
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}