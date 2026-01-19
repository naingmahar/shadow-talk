// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSurveyStore } from "@/hooks/useSurveyStore";
// import SelectionCard from "@/components/survey/SelectionCard";
// import SurveyProgress from "@/components/survey/SurveyProgress";
// import { 
//   Briefcase, Presentation, Plane, Building2, 
//   ArrowRight, ArrowLeft, Zap, Target, Clock, Calendar,
//   Loader2
// } from "lucide-react";

// const GOALS = [
//   { id: "interview", title: "Interview", desc: "Technical & Behavioral prep", icon: <Briefcase size={20} /> },
//   { id: "presentation", title: "Presentation", desc: "Clarity & Confidence", icon: <Presentation size={20} /> },
//   { id: "immigration", title: "Immigration", desc: "Professional survival", icon: <Plane size={20} /> },
//   { id: "business", title: "Business Talk", desc: "Leadership & Meetings", icon: <Building2 size={20} /> },
// ];

// const DURATIONS = ["1 week","2 weeks","3 weeks","1 month", "45 days","2 months", "3 months", "6 months", "1 year"];
// const HOURS = ["30 mins", "1 hour", "1.5 hours", "2 hours", "3 hours"];

// export default function OnboardingPage() {
//   const router = useRouter();
//   const [isGenerating, setIsGenerating] = useState(false);
  
//   // Added setPlan from your updated useSurveyStore
//   const { 
//     data, step, nextStep, prevStep, 
//     setGoal, setRole, setLevelDescription, setDuration, setTimePerDay, setPlan 
//   } = useSurveyStore();

//   const totalSteps = 4;

//   const isStepValid = () => {
//     if (step === 1) return data.goal !== "";
//     if (step === 2) return data.role.trim().length > 3;
//     if (step === 3) return data.levelDescription.trim().length > 10;
//     if (step === 4) return data.duration && data.timePerDay;
//     return false;
//   };

//   const handleGeneratePlan = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch("/api/generate-plan", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) throw new Error("Failed to generate plan");
      
//       const result = await response.json();
      
//       // CRITICAL: Save the result to Zustand Store before navigating
//       setPlan(result);
      
//       console.log("Plan saved to store successfully.");
      
//       // Navigate to the learning path
//       router.push("/learning-path");
//     } catch (error) {
//       alert("Error generating your plan. Please try again.");
//       console.error(error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
//       <SurveyProgress currentStep={step} totalSteps={totalSteps} />

//       <div className="w-full max-w-xl bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-12 min-h-[550px] flex flex-col">
        
//         {step === 1 && (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <h1 className="text-3xl font-black text-slate-900 mb-2">Target Goal</h1>
//             <p className="text-slate-500 mb-8 text-lg">We&apos;ll adjust the AI scenarios based on your choice.</p>
//             <div className="space-y-3">
//               {GOALS.map((g) => (
//                 <SelectionCard
//                   key={g.id}
//                   title={g.title}
//                   description={g.desc}
//                   icon={g.icon}
//                   isSelected={data.goal === g.id}
//                   onClick={() => setGoal(g.id)}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-500">
//             <h1 className="text-3xl font-black text-slate-900 mb-2">Professional Role</h1>
//             <p className="text-slate-500 mb-8 text-lg">This defines the technical vocabulary used.</p>
//             <div className="space-y-6">
//               <input 
//                 type="text"
//                 autoFocus
//                 value={data.role}
//                 onChange={(e) => setRole(e.target.value)}
//                 placeholder="e.g. Senior React Native Developer"
//                 className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-xl font-semibold text-slate-900"
//               />
//               <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
//                 <Zap className="text-blue-600 shrink-0" />
//                 <p className="text-blue-800 text-sm leading-relaxed">
//                   <b>AI Tip:</b> Specific roles generate deeper architectural drills.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-500">
//             <h1 className="text-3xl font-black text-slate-900 mb-2">The Challenge</h1>
//             <p className="text-slate-500 mb-8 text-lg">Why is your English &quot;not enough&quot; right now?</p>
//             <textarea 
//               autoFocus
//               value={data.levelDescription}
//               onChange={(e) => setLevelDescription(e.target.value)}
//               placeholder="I struggle to defend architectural choices..."
//               className="w-full h-48 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-lg resize-none text-slate-900"
//             />
//           </div>
//         )}

//         {step === 4 && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-500">
//             <h1 className="text-3xl font-black text-slate-900 mb-2">The Plan</h1>
//             <p className="text-slate-500 mb-10 text-lg">How much intensity can you handle?</p>
            
//             <div className="space-y-8">
//               <section>
//                 <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
//                   <Calendar size={14} /> Total Duration
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {DURATIONS.map((d) => (
//                     <button
//                       key={d}
//                       type="button"
//                       onClick={() => setDuration(d)}
//                       className={`px-5 py-2.5 rounded-full border-2 font-bold transition-all ${data.duration === d ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
//                     >
//                       {d}
//                     </button>
//                   ))}
//                 </div>
//               </section>

//               <section>
//                 <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
//                   <Clock size={14} /> Daily Commitment
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {HOURS.map((h) => (
//                     <button
//                       key={h}
//                       type="button"
//                       onClick={() => setTimePerDay(h)}
//                       className={`px-5 py-2.5 rounded-full border-2 font-bold transition-all ${data.timePerDay === h ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
//                     >
//                       {h}
//                     </button>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           </div>
//         )}

//         <div className="mt-auto pt-12 flex gap-4">
//           {step > 1 && (
//             <button 
//               onClick={prevStep}
//               className="px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
//             >
//               <ArrowLeft size={20} /> Back
//             </button>
//           )}
          
//           <button 
//             disabled={!isStepValid() || isGenerating}
//             onClick={step === totalSteps ? handleGeneratePlan : nextStep}
//             className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
//           >
//             {isGenerating ? (
//               <>
//                 <Loader2 className="animate-spin" /> Generating...
//               </>
//             ) : (
//               <>
//                 {step === totalSteps ? "Create My Roadmap" : "Continue"}
//                 <ArrowRight size={20} />
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/hooks/useSurveyStore";
import SelectionCard from "@/components/survey/SelectionCard";
import SurveyProgress from "@/components/survey/SurveyProgress";
import TitleSelector from "@/components/survey/TitleSelector"; // Your new separate component
import { 
  Briefcase, Presentation, Plane, Building2, 
  ArrowRight, ArrowLeft, Zap, Clock, Calendar,
  Loader2, Sparkles
} from "lucide-react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db,auth } from "@/lib/firebase";

const GOALS = [
  { id: "interview", title: "Interview", desc: "Technical & Behavioral prep", icon: <Briefcase size={20} /> },
  { id: "presentation", title: "Presentation", desc: "Clarity & Confidence", icon: <Presentation size={20} /> },
  { id: "immigration", title: "Immigration", desc: "Professional survival", icon: <Plane size={20} /> },
  { id: "business", title: "Business Talk", desc: "Leadership & Meetings", icon: <Building2 size={20} /> },
];

const DURATIONS = ["1 week","2 weeks","3 weeks","1 month", "45 days","2 months", "3 months"];
const HOURS = ["30 mins", "1 hour", "1.5 hours", "2 hours"];

export default function OnboardingPage() {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<"titles" | "plan" | null>(null);
  
  const { 
    data, step, nextStep, prevStep, suggestedTitles,
    setGoal, setRole, setLevelDescription, setDuration, setTimePerDay, 
    setSuggestedTitles, toggleTitle, setPlan 
  } = useSurveyStore();

  const totalSteps = 5;

  const isStepValid = () => {
    if (step === 1) return data.goal !== "";
    if (step === 2) return data.role.trim().length > 3;
    if (step === 3) return data.levelDescription.trim().length > 10;
    if (step === 4) return data.duration && data.timePerDay;
    if (step === 5) return data.selectedTitles.length > 0;
    return false;
  };

  // Step 4 -> 5: Generate the "Menu" of professional titles
  const handleFetchTitles = async () => {
    setLoadingType("titles");
    try {
      const response = await fetch("/api/generate-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: data.role, challenge: data.levelDescription , goal: data.goal }),
      });
      if (!response.ok) throw new Error();
      const titles = await response.json();
      setSuggestedTitles(titles);
      nextStep();
    } catch (error) {
      alert("AI failed to generate titles. Please try again.");
    } finally {
      setLoadingType(null);
    }
  };

  // Step 5 -> Learning Path: Generate the 60-day skeleton
  const handleGenerateFinalPlan = async () => {
    setLoadingType("plan");
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      const planResult = await response.json();
      setPlan(planResult);


    // const userPlanRef = doc(db, "users", auth.currentUser?.uid, "plans", "active_plan");
    
    // await setDoc(userPlanRef, {
    //   ...planResult,
    //   createdAt: serverTimestamp(),
    //   status: "in_progress",
    //   currentDay: 1,
    //   // Store metadata for easy filtering later
    //   metadata: {
    //     role: data.role,
    //     duration: data.duration,
    //     selectedTitles: data.selectedTitles
    //   }
    // });

    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, 'users_plans'), {
            uid: user?.uid,
            createdAt: serverTimestamp(),
            plan: planResult,
            metadata: {
              role: data.role,
              duration: data.duration,
              selectedTitles: data.selectedTitles,
            }
    });

      router.push("/learning-path");
    } catch (error) {
      alert("Error building your roadmap.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <SurveyProgress currentStep={step} totalSteps={totalSteps} />

      <div className="w-full max-w-xl bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-12 min-h-[600px] flex flex-col">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Target Goal</h1>
            <p className="text-slate-500 mb-8 text-lg">We&apos;ll adjust the AI scenarios based on your choice.</p>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <SelectionCard
                  key={g.id}
                  title={g.title}
                  description={g.desc}
                  icon={g.icon}
                  isSelected={data.goal === g.id}
                  onClick={() => setGoal(g.id)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Professional Role</h1>
            <p className="text-slate-500 mb-8 text-lg">This defines the technical vocabulary used.</p>
            <input 
              type="text"
              autoFocus
              value={data.role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior React Native Developer"
              className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-xl font-semibold text-slate-900"
            />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-black text-slate-900 mb-2">The Challenge</h1>
            <p className="text-slate-500 mb-8 text-lg">Why is your English &quot;not enough&quot; right now?</p>
            <textarea 
              autoFocus
              value={data.levelDescription}
              onChange={(e) => setLevelDescription(e.target.value)}
              placeholder="I struggle to defend architectural choices..."
              className="w-full h-48 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-lg resize-none text-slate-900"
            />
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-black text-slate-900 mb-2">The Plan</h1>
            <p className="text-slate-500 mb-10 text-lg">How much intensity can you handle?</p>
            <div className="space-y-8">
              <section>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4"><Calendar size={14}/> Duration</label>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map(d => (
                    <button key={d} onClick={() => setDuration(d)} className={`px-4 py-2 rounded-full border-2 font-bold ${data.duration === d ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-100 text-slate-500'}`}>{d}</button>
                  ))}
                </div>
              </section>
              <section>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4"><Clock size={14}/> Daily Time</label>
                <div className="flex flex-wrap gap-2">
                  {HOURS.map(h => (
                    <button key={h} onClick={() => setTimePerDay(h)} className={`px-4 py-2 rounded-full border-2 font-bold ${data.timePerDay === h ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-100 text-slate-500'}`}>{h}</button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {step === 5 && (
          <TitleSelector 
            titles={suggestedTitles} 
            selectedTitles={data.selectedTitles} 
            onToggle={toggleTitle} 
          />
        )}

        <div className="mt-auto pt-12 flex gap-4">
          {step > 1 && (
            <button onClick={prevStep} className="px-6 py-4 font-bold text-slate-400 flex items-center gap-2 hover:bg-slate-50 rounded-2xl">
              <ArrowLeft size={20} /> Back
            </button>
          )}
          
          <button 
            disabled={!isStepValid() || !!loadingType}
            onClick={() => {
              if (step === 4) handleFetchTitles();
              else if (step === 5) handleGenerateFinalPlan();
              else nextStep();
            }}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            {loadingType ? (
              <>
                <Loader2 className="animate-spin" /> 
                {loadingType === "titles" ? "Analyzing Role..." : "Building Roadmap..."}
              </>
            ) : (
              <>
                {step === 4 ? "Suggest Focus" : step === 5 ? "Create My Roadmap" : "Continue"}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}