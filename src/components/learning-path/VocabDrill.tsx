// // "use client";
// // import { Volume2, Mic, CheckCircle2 } from "lucide-react";

// // export default function VocabDrill({ data, onComplete }: any) {
// //   return (
// //     <div className="space-y-6 animate-in fade-in zoom-in-95">
// //       {data.map((item: any, i: number) => (
// //         <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
// //           <div className="flex justify-between items-start mb-6">
// //             <div>
// //               <h2 className="text-3xl font-black text-slate-900">{item.term}</h2>
// //               <p className="text-slate-500 font-medium">{item.meaning}</p>
// //             </div>
// //             <button className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
// //               <Volume2 size={24} />
// //             </button>
// //           </div>

// //           {/* MCQ Section */}
// //           <div className="bg-slate-50 p-6 rounded-3xl mb-6">
// //             <p className="font-bold text-slate-700 mb-4">{item.mcq.question}</p>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //               {item.mcq.options.map((opt: any, idx: number) => (
// //                 <button key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl text-left font-bold hover:border-blue-600 transition-all text-slate-600">
// //                   {opt.text}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Sentence Construction (Text + Voice) */}
// //           <div className="space-y-4">
// //             <label className="text-[10px] font-black text-slate-400 uppercase">Construct a Senior Sentence</label>
// //             <textarea 
// //               className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl focus:border-blue-600 outline-none"
// //               placeholder={`Use "${item.term}" in a technical context...`}
// //             />
// //             <button className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 p-3 rounded-xl transition-all">
// //               <Mic size={18} /> Record Pronunciation
// //             </button>
// //           </div>
// //         </div>
// //       ))}
// //       <button onClick={onComplete} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black">Next: Grammar Drill</button>
// //     </div>
// //   );
// // }

// "use client";

// import React, { useState } from "react";
// import { Volume2, Mic, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

// export default function VocabDrill({ data, onComplete }: any) {
//   // Track state for each vocab item index
//   const [answers, setAnswers] = useState<Record<number, number | null>>({});
//   const [sentences, setSentences] = useState<Record<number, string>>({});

//   // 1. Text-to-Speech (Pronunciation)
//   const playAudio = (text: string) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9; // Slightly slower for clarity
//     window.speechSynthesis.speak(utterance);
//   };

//   // 2. Handle MCQ Selection
//   const handleSelectOption = (itemIdx: number, optIdx: number) => {
//     setAnswers((prev) => ({ ...prev, [itemIdx]: optIdx }));
//   };

//   return (
//     <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//       {data.map((item: any, i: number) => {
//         const selectedOpt = answers[i];
//         const isAnswered = selectedOpt !== undefined;

//         return (
//           <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
//             {/* Header with TTS */}
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{item.term}</h2>
//                 <p className="text-slate-500 font-medium text-lg mt-1">{item.meaning}</p>
//               </div>
//               <button 
//                 onClick={() => playAudio(item.term)}
//                 className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
//               >
//                 <Volume2 size={24} />
//               </button>
//             </div>

//             {/* MCQ Section with logic */}
//             <div className="bg-slate-50 p-6 rounded-3xl mb-8">
//               <p className="font-bold text-slate-700 mb-4">{item.mcq.question}</p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {item.mcq.options.map((opt: any, idx: number) => {
//                   const isCorrect = opt.is_correct;
//                   const isChosen = selectedOpt === idx;
                  
//                   let buttonStyle = "bg-white border-slate-200 text-slate-600";
//                   if (isAnswered) {
//                     if (isCorrect) buttonStyle = "bg-green-50 border-green-500 text-green-700";
//                     else if (isChosen) buttonStyle = "bg-red-50 border-red-500 text-red-700";
//                   } else {
//                     buttonStyle = "bg-white border-slate-200 hover:border-blue-600 text-slate-600";
//                   }

//                   return (
//                     <button
//                       key={idx}
//                       disabled={isAnswered}
//                       onClick={() => handleSelectOption(i, idx)}
//                       className={`p-4 border-2 rounded-2xl text-left font-bold transition-all flex justify-between items-center ${buttonStyle}`}
//                     >
//                       {opt.text}
//                       {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-green-600" />}
//                       {isAnswered && isChosen && !isCorrect && <XCircle size={18} className="text-red-600" />}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Senior Context Sentence Builder */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Construct Senior Briefing</label>
//                 {sentences[i]?.length > 10 && <span className="text-green-500 text-[10px] font-bold uppercase">Ready</span>}
//               </div>
//               <textarea 
//                 value={sentences[i] || ""}
//                 onChange={(e) => setSentences(prev => ({ ...prev, [i]: e.target.value }))}
//                 className="w-full h-28 p-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-700 font-medium leading-relaxed"
//                 placeholder={`Use "${item.term}" in an architectural context...`}
//               />
//               <div className="flex gap-4">
//                 <button 
//                   className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-black text-xs p-4 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all"
//                   onClick={() => playAudio(sentences[i] || item.example)}
//                 >
//                   <Mic size={16} /> Practice Pronunciation
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}

//       {/* Completion Button */}
//       <button 
//         onClick={onComplete}
//         className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
//       >
//         Finish Vocabulary Drill <ChevronRight className="group-hover:translate-x-1 transition-transform" />
//       </button>
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import VocabCard from "./vocab/VocabCard";
import ContextComparison from "./vocab/ContextComparison";
import SentenceBuilder from "./vocab/SentenceBuilder";

export default function VocabDrill({ data, onComplete }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [isAnswered, setIsAnswered] = useState(false); // Controls Step 1 lock

  const currentItem = data[currentIndex];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (currentIndex < data.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setStep(1);
        setIsAnswered(false); // Reset lock for next word
      } else {
        onComplete();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 1. PROGRESS BREADCRUMBS */}
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step === s ? "w-8 bg-blue-600" : "w-2 bg-slate-200"
            }`} 
          />
        ))}
      </div>

      {/* 2. CONDITIONAL FEATURE DISPLAY */}
      <div className="min-h-[450px]">
        {/* Step 1: Learning & Knowledge Check */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black w-fit uppercase">
              Phase 1: Knowledge Check
            </div>
            <VocabCard 
              item={currentItem} 
              onVerified={() => setIsAnswered(true)} 
            />
          </div>
        )}

        {/* Step 2: Hidden until Step 1 is done */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-[10px] font-black w-fit uppercase">
              Phase 2: Senior Perspective
            </div>
            <ContextComparison 
              normal={currentItem.normal_context} 
              senior={currentItem.senior_context} 
            />
          </div>
        )}

        {/* Step 3: Hidden until Step 2 is done */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-[10px] font-black w-fit uppercase">
              Phase 3: Production
            </div>
            <SentenceBuilder term={currentItem.term} />
          </div>
        )}
      </div>

      {/* 3. CONTROL BAR */}
      <div className="mt-10 flex flex-col gap-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-all"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        )}

        <button 
          onClick={handleNext}
          disabled={step === 1 && !isAnswered}
          className={`w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
            step === 1 && !isAnswered 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-slate-900 text-white hover:bg-blue-600"
          }`}
        >
          {step === 3 ? "Complete Word" : "Continue"}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}