"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit 
} from "firebase/firestore";
import { useSurveyStore } from "@/hooks/useSurveyStore";

// Components
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import VocabDrill from "@/components/learning-path/VocabDrill";
import GrammarDrill from "@/components/learning-path/GrammarDrill";
import AudioSummary from "@/components/learning-path/AudioSummary"; // New Component
import ShadowDrill from "@/components/learning-path/ShadowDrill";
import PracticeDrill from "@/components/learning-path/PracticeDrill";
import { useAuth } from "@/context/AuthContext";
import VocalDrill from "@/components/learning-path/VocalDrill";

// Added "audio" to the Phase progression
type Phase = "vocab" | "grammar" | "audio" | "shadow" | "practice" | "vocal" | "complete";

export default function DayDetailPage() {
  const { dayId } = useParams();
  const router = useRouter();
  
  const { plan, setPlan, data: surveyData } = useSurveyStore();
  const { user , loading: authLoading} = useAuth();
  
  const [activePhase, setActivePhase] = useState<Phase>("practice");
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDayContent = async () => {
      if (!user) return; 

      setLoading(true);
      let currentPlan = plan;

      try {
        if (!currentPlan) {
          const q = query(
            collection(db, "users_plans"),
            where("uid", "==", user.uid),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const planData = querySnapshot.docs[0].data();
            currentPlan = planData.plan;
            //@ts-ignore
            setPlan(currentPlan); 
          } else {
            router.push("/onboarding");
            return;
          }
        }

        const dayMeta = currentPlan?.roadmap
          ?.flatMap((p: any) => p.days)
          ?.find((d: any) => d.day === Number(dayId));

        if (!dayMeta) {
          router.push("/learning-path");
          return;
        }

        //@ts-ignore
        const detailRef = doc(db, "users", user.uid, "days_content", dayId.toString());
        const snap = await getDoc(detailRef);

        if (snap.exists()) {
          setContent(snap.data());
        } else {
          const res = await fetch("/api/generate-day-details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              day: dayId,
              title: dayMeta.title,
              role: surveyData.role || "Senior Software Engineer",
              //@ts-ignore
              package: currentPlan.roadmap.find((p: any) => 
                p.days.some((d: any) => d.day === Number(dayId))
              )?.package_name,
            }),
          });
          
          if (!res.ok) throw new Error("AI Generation failed");
          
          const json = await res.json();
          await setDoc(detailRef, json);
          setContent(json);
        }
      } catch (err: any) {
        console.error("Critical Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchDayContent();
  }, [dayId, plan, surveyData.role, router, setPlan, authLoading, user]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <h2 className="text-xl font-black text-slate-900">Assembling Training</h2>
        <p className="text-slate-400">Fetching senior technical drills...</p>
      </div>
    );
  }

  const getProgressWidth = () => {
    const phases: Phase[] = ["vocab", "grammar", "audio", "shadow","vocal", "practice", "complete"];
    const index = phases.indexOf(activePhase);
    return `${((index + 1) / phases.length) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/learning-path")}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all"
          >
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Exit Session</span>
          </button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Day {dayId} Progress
            </span>
            <div className="h-2 w-32 md:w-64 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                style={{ width: getProgressWidth() }}
              />
            </div>
          </div>
          <div className="w-12 md:w-20" /> 
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-6">
        {activePhase !== "complete" && (
          <header className="mb-10 text-center animate-in fade-in slide-in-from-top-4">
            <h1 className="text-3xl font-black text-slate-900 mb-2">{content?.theme}</h1>
            <p className="text-slate-500 font-medium tracking-tight">
              Technical Mastery Phase: <span className="text-blue-600 uppercase font-black text-xs">{activePhase}</span>
            </p>
          </header>
        )}

        <div className="min-h-[550px]">
          {/* Phase 1: Vocabulary & Initial Sentence Building */}
          {activePhase === "vocab" && (
            <VocabDrill 
              data={content.preparation_phase.flashcards} // Passed full content to access drills in SentenceBuilder
              onComplete={() => setActivePhase("grammar")} 
            />
          )}

          {/* Phase 2: Structural Grammar Blueprints (Multiple Exercises) */}
          {activePhase === "grammar" && (
            <GrammarDrill 
              data={content} 
              onComplete={() => setActivePhase("audio")} 
            />
          )}

          {/* Phase 3: Listening Comprehension (Audio Reference) */}
          {activePhase === "audio" && (
            <AudioSummary 
              data={content} 
              onComplete={() => setActivePhase("shadow")} 
            />
          )}

          {/* Phase 4: Pronunciation & Fluency */}
          {activePhase === "shadow" && (
            <ShadowDrill 
              data={content?.exercise_phase?.task_1_voice} 
              onComplete={() => setActivePhase("vocal")}
            />
          )}

          {/* NEW Phase 4: AI Vocal Drills (Specific Term Practice) */}
          {activePhase === "vocal" && (
            <VocalDrill 
              drills={content?.exercise_phase?.ai_vocal_drills} 
              onComplete={() => setActivePhase("practice")} 
            />
          )}

          {/* Phase 5: Final Production & Scenarios */}
          {activePhase === "practice" && (
            <PracticeDrill 
              theme={content?.theme}
              requiredKeywords={content?.exercise_phase?.task_1_voice?.required_keywords}
              onComplete={() => setActivePhase("complete")}
            />
          )}

          {activePhase === "complete" && (
            <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4">Mastery Achieved!</h1>
              <p className="text-slate-500 text-lg mb-10 font-medium">
                You’ve finished the drills for Day {dayId}. Keep up the momentum.
              </p>
              <button 
                onClick={() => router.push("/learning-path")}
                className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-slate-200"
              >
                Continue Roadmap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}