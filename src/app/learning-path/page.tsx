// "use client";

// import React, { useState, useEffect } from "react";
// import { useSurveyStore } from "@/hooks/useSurveyStore";
// import PathOverview from "@/components/learning-path/PathOverview";
// import LessonCard from "@/components/learning-path/LessonCard";
// import ExerciseModal from "@/components/learning-path/modal/ExerciseModal";
// import { Sparkles, LayoutDashboard, Loader2, Trophy } from "lucide-react";
// import Link from "next/link";

// export default function LearningPathPage() {
//   const { activePlan } = useSurveyStore();
//   const [isMounted, setIsMounted] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  
//   // Track completed days to update the Sidebar UI
//   const [completedDays, setCompletedDays] = useState<number[]>([]);

//   useEffect(() => {
//     setIsMounted(true);
//     // In a real app, you'd load completedDays from a DB or the Store
//   }, []);

//   if (!isMounted) return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600" size={32} />
//     </div>
//   );

//   if (!activePlan || !activePlan.days) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
//         <Trophy className="text-slate-200 w-20 h-20 mb-4" />
//         <h2 className="text-2xl font-bold text-slate-900 mb-2">Roadmap Not Found</h2>
//         <p className="text-slate-500 mb-6">Create your personalized path to start training.</p>
//         <Link href="/onboarding" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100">
//           Start Onboarding
//         </Link>
//       </div>
//     );
//   }

//   const currentDayData = activePlan.days[selectedDayIdx];

//   // Callback for when the final PerformanceDrill is finished
//   const handleFinishTraining = () => {
//     if (!completedDays.includes(selectedDayIdx)) {
//       setCompletedDays([...completedDays, selectedDayIdx]);
//     }
//     setIsModalOpen(false);
    
//     // Auto-advance to next day if available
//     if (selectedDayIdx < activePlan.days.length - 1) {
//       setSelectedDayIdx(prev => prev + 1);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">
//       {/* Top Navbar */}
//       <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-600 p-1.5 rounded-lg">
//             <Sparkles className="text-white w-5 h-5" />
//           </div>
//           <span className="font-black text-xl tracking-tight text-slate-900 uppercase">En.Lab</span>
//         </div>
        
//         <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
//           <LayoutDashboard size={18} /> Dashboard
//         </Link>
//       </nav>

//       <main className="max-w-7xl mx-auto py-12 px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
//           {/* Main Content Area */}
//           <div className="lg:col-span-8 space-y-8">
//             <header className="space-y-3">
//               <div className="flex items-center gap-3">
//                 <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
//                   Day {currentDayData.day}
//                 </span>
//                 {completedDays.includes(selectedDayIdx) && (
//                   <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
//                     Completed
//                   </span>
//                 )}
//               </div>
//               <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
//                 {currentDayData.theme}
//               </h1>
//               <p className="text-slate-500 text-xl font-medium max-w-2xl">
//                 Master the vocabulary and grammar patterns needed to lead discussions on this topic.
//               </p>
//             </header>

            

//             <LessonCard 
//               day={currentDayData.day}
//               theme={currentDayData.theme}
//               wordCount={currentDayData.preparation_phase.flashcards.length}
//               onStart={() => setIsModalOpen(true)}
//               isCompleted={completedDays.includes(selectedDayIdx)}
//             />

//             {/* Context Card for the Specific Day */}
//             <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex gap-6">
//               <div className="bg-blue-50 p-4 rounded-2xl h-fit">
//                 <Sparkles className="text-blue-600" size={24} />
//               </div>
//               <div className="space-y-2">
//                 <h4 className="font-bold text-slate-900 text-lg">Daily Briefing</h4>
//                 <p className="text-slate-600 leading-relaxed italic">
//                   &quot;{currentDayData.exercise_phase.task_1_voice.prompt}&quot;
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Roadmap Sidebar */}
//           <aside className="lg:col-span-4 sticky top-28">
//             <PathOverview 
//               planData={activePlan} 
//               activeDayIdx={selectedDayIdx}
//               completedDays={completedDays}
//               onSelectDay={(idx) => setSelectedDayIdx(idx)} 
//             />
//           </aside>
//         </div>
//       </main>

//       {/* Modular Exercise Engine */}
//       {isModalOpen && (
//         <ExerciseModal 
//           dayData={currentDayData} 
//           onClose={handleFinishTraining} 
//         />
//       )}
//     </div>
//   );
// }
// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { db, auth } from "@/lib/firebase";
// import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
// import { useSurveyStore } from "@/hooks/useSurveyStore";
// import { 
//   Loader2, Lock, Play, CheckCircle2, 
//   ChevronRight, Target, Award, BookOpen 
// } from "lucide-react";

// export default function LearningPathPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const { plan, setPlan } = useSurveyStore();

//   useEffect(() => {
//     const fetchPlan = async () => {
//       const user = auth.currentUser;
//       if (!user) return;
//       if (!plan) {
//         // const docRef = doc(db, "users", user.uid, "plans", "active_plan");
//         // const docSnap = await getDoc(docRef);
//         // if (docSnap.exists()) setPlan(docSnap.data() as any);
//         // else router.push("/onboarding");

//         try {
//           // 1. Create a query to find the document where uid matches
//           const plansRef = collection(db, "users_plans");
//           const q = query(
//             plansRef, 
//             where("uid", "==", user.uid),
//             orderBy("createdAt", "desc"), // Get the most recent one
//             limit(1)
//           );

//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             // 2. Get the first document from the results
//             const docData = querySnapshot.docs[0].data();
//             setPlan(docData.plan); // Make sure to access the .plan property
//           } else {
//             router.push("/onboarding");
//           }
//         } catch (err) {
//           console.error("Firestore Query Error:", err);
//         }
//       }
//       setLoading(false);
//     };
//     fetchPlan();
//   }, [plan, setPlan, router]);

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <Loader2 className="animate-spin text-blue-600" size={40} />
//     </div>
//   );

//   return (
//     <main className="min-h-screen bg-[#F8FAFC]">
//       {/* 1. STICKY DASHBOARD HEADER */}
//       <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
//               <Target size={20} />
//             </div>
//             <div>
//               <h2 className="font-black text-slate-900 tracking-tight">MY ROADMAP</h2>
//               <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
//                 {plan?.plan_metadata.total_days} Days • {plan?.plan_metadata.hours_per_day} daily
//               </p>
//             </div>
//           </div>
          
//           <div className="hidden md:flex items-center gap-6">
//             <div className="text-right">
//               <p className="text-[10px] font-black text-slate-400 uppercase">Overall Progress</p>
//               <p className="font-bold text-slate-900">0% Completed</p>
//             </div>
//             <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
//               <div className="h-full bg-blue-600 w-[2%]" />
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto px-6 py-12">
//         {/* 2. INTRO SECTION */}
//         <section className="mb-16">
//           <h1 className="text-4xl font-black text-slate-900 mb-4">
//             The Path to <span className="text-blue-600">Senior Mastery</span>
//           </h1>
//           <p className="text-slate-500 text-lg max-w-2xl font-medium">
//             Your custom curriculum is divided into focused modules. Master each day to build your architectural vocabulary.
//           </p>
//         </section>

//         {/* 3. THE SYLLABUS MAP */}
//         <div className="space-y-12 relative">
//           {/* Vertical Line Connector */}
//           <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block" />

//           {plan?.roadmap.map((pkg, pIdx) => (
//             <div key={pIdx} className="relative">
//               {/* Module Header */}
//               <div className="flex items-center gap-6 mb-8 relative z-10">
//                 <div className="w-14 h-14 bg-white border-4 border-[#F8FAFC] ring-2 ring-slate-200 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm">
//                   <Award size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Module {pIdx + 1}</h3>
//                   <h2 className="text-2xl font-black text-slate-900">{pkg.package_name}</h2>
//                 </div>
//               </div>

//               {/* Days Grid */}
//               <div className="grid grid-cols-1 gap-4 ml-0 md:ml-20">
//                 {pkg.days.map((day) => {
//                   const isUnlocked = day.day === 1; // Example logic
//                   return (
//                     <button
//                       key={day.day}
//                       onClick={() => isUnlocked && router.push(`/learning-path/day/${day.day}`)}
//                       className={`group flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all text-left ${
//                         isUnlocked 
//                         ? "bg-white border-white shadow-sm hover:shadow-xl hover:border-blue-100" 
//                         : "bg-slate-50 border-transparent opacity-60 cursor-not-allowed"
//                       }`}
//                     >
//                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
//                         isUnlocked ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-slate-200 text-slate-400"
//                       }`}>
//                         {day.day}
//                       </div>
                      
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${
//                             day.type === 'exam' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'
//                           }`}>
//                             {day.type}
//                           </span>
//                         </div>
//                         <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
//                           {day.title}
//                         </h4>
//                       </div>

//                       {isUnlocked ? (
//                         <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
//                           <ChevronRight size={20} />
//                         </div>
//                       ) : (
//                         <Lock size={18} className="text-slate-300" />
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  limit, 
  orderBy, 
  query, 
  where 
} from "firebase/firestore";
import { useSurveyStore } from "@/hooks/useSurveyStore";
import { 
  Loader2, Play, CheckCircle2, 
  ChevronRight, Target, Award, Lock, BookOpen 
} from "lucide-react";

export default function LearningPathPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [completedDays, setCompletedDays] = useState<number[]>([]); // Store completed day IDs
  const { plan, setPlan } = useSurveyStore();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // 1. Fetch User Plan
        if (!plan) {
          const plansRef = collection(db, "users_plans");
          const qPlan = query(
            plansRef, 
            where("uid", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const planSnap = await getDocs(qPlan);
          if (!planSnap.empty) {
            setPlan(planSnap.docs[0].data().plan);
          } else {
            router.push("/onboarding");
            return;
          }
        }

        // 2. Fetch User Activity (Completed Missions)
        const activityRef = collection(db, "user_activity");
        const qActivity = query(
          activityRef,
          where("uid", "==", user.uid),
          where("type", "==", "mission_complete")
        );
        const activitySnap = await getDocs(qActivity);
        const completedIds = activitySnap.docs.map(doc => doc.data().day);
        setCompletedDays(completedIds);

      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plan, setPlan, router]);

  // Calculate percentage
  const totalDays = plan?.plan_metadata.total_days || 1;
  const progressPercent = Math.round((completedDays.length / totalDays) * 100);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* 1. STICKY DASHBOARD HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Target size={20} />
            </div>
            <div>
              <h2 className="font-black text-slate-900 tracking-tight text-sm md:text-base">MY ROADMAP</h2>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                {completedDays.length} / {totalDays} Missions Passed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">Mastery Progress</p>
              <p className="font-bold text-slate-900">{progressPercent}%</p>
            </div>
            <div className="w-24 md:w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 2. INTRO SECTION */}
        <section className="mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            The Path to <span className="text-blue-600">Senior Mastery</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
            All modules are accessible. Complete missions to earn architectural seniority points.
          </p>
        </section>

        {/* 3. THE SYLLABUS MAP */}
        <div className="space-y-12 relative">
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block" />

          {plan?.roadmap.map((pkg, pIdx) => (
            <div key={pIdx} className="relative">
              <div className="flex items-center gap-6 mb-8 relative z-10">
                <div className="w-14 h-14 bg-white border-4 border-[#F8FAFC] ring-2 ring-slate-200 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Module {pIdx + 1}</h3>
                  <h2 className="text-2xl font-black text-slate-900">{pkg.package_name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 ml-0 md:ml-20">
                {pkg.days.map((day) => {
                  const isCompleted = completedDays.includes(day.day);
                  
                  return (
                    <button
                      key={day.day}
                      onClick={() => router.push(`/learning-path/day/${day.day}`)}
                      className={`group flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all text-left ${
                        isCompleted 
                        ? "bg-green-50/30 border-green-100 hover:border-green-300" 
                        : "bg-white border-white shadow-sm hover:shadow-xl hover:border-blue-100"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                        isCompleted 
                        ? "bg-green-500 text-white" 
                        : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                      }`}>
                        {isCompleted ? <CheckCircle2 size={24} /> : day.day}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${
                            day.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {day.type}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md bg-green-100 text-green-600">
                              Completed
                            </span>
                          )}
                        </div>
                        <h4 className={`font-bold text-lg transition-colors ${
                          isCompleted ? "text-slate-600" : "text-slate-800 group-hover:text-blue-600"
                        }`}>
                          {day.title}
                        </h4>
                      </div>

                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted 
                        ? "bg-green-100 text-green-600" 
                        : "bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white"
                      }`}>
                        <ChevronRight size={20} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}