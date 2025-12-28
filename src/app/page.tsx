"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import InformationPage from '@/components/InformationPage';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { Plus, BarChart3, GraduationCap, ChevronRight } from 'lucide-react';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // 1. Logged In: Show ONLY the Analysis Hub
  if (user) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          
          {/* Dashboard Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <GraduationCap className="text-white" size={16} />
                </div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                  Personal Growth
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Hello, {user.displayName?.split(' ')[0] || 'Developer'}
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Here is your tech shadowing performance at a glance.
              </p>
            </div>

            {/* Main Action Button - Since UI for generation is hidden */}
            <button 
              onClick={() => router.push('/topics')}
              className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              New Practice Session
            </button>
          </header>

          {/* Requirement: Only AnalysisDashboard */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 px-1">
              <BarChart3 className="text-slate-400" size={18} />
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Activity Analysis
              </h2>
            </div>
            
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <AnalysisDashboard />
            </section>
          </div>

          {/* Quick Navigation Footer */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/history')}
              className="p-6 bg-white rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-blue-200 transition-colors"
            >
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase">View All</p>
                <p className="font-bold text-slate-900">Session History</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 2. Logged Out: Show Information Page
  return <InformationPage />;
}