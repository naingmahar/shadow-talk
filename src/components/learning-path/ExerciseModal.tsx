// // src/components/learning-path/ExerciseModal.tsx
// "use client";

// import React, { useState } from "react";
// import { X, Check, ArrowRight, Volume2 } from "lucide-react";

// interface ExerciseModalProps {
//   flashcards: any[];
//   onClose: () => void;
// }

// export default function ExerciseModal({ flashcards, onClose }: ExerciseModalProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showMCQ, setShowMCQ] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const currentCard = flashcards[currentIndex];

//   // --- NEW SOUND LOGIC ---
//   const handlePlaySound = (text: string) => {
//     if (!window.speechSynthesis) {
//       alert("Your browser does not support text-to-speech.");
//       return;
//     }

//     // Cancel any ongoing speech
//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.rate = 0.9; // Slightly slower for better learning

//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);

//     window.speechSynthesis.speak(utterance);
//   };

//   const handleNext = () => {
//     if (currentIndex < flashcards.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//       setShowMCQ(false);
//       setSelectedOption(null);
//     } else {
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
        
//         {/* Header */}
//         <div className="p-6 flex justify-between items-center border-b border-slate-50">
//           <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">
//             Card {currentIndex + 1} of {flashcards.length}
//           </span>
//           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 p-8 flex flex-col">
//           {!showMCQ ? (
//             <div className="animate-in fade-in zoom-in-95 duration-300 flex-1 flex flex-col">
//               <h2 className="text-4xl font-black text-slate-900 mb-4">{currentCard.term}</h2>
              
//               {/* WORKING SOUND BUTTON */}
//               <button 
//                 onClick={() => handlePlaySound(currentCard.term)}
//                 className={`flex items-center gap-2 mb-6 font-bold transition-colors ${
//                   isSpeaking ? "text-blue-400" : "text-blue-600 hover:text-blue-700"
//                 }`}
//               >
//                 <Volume2 size={24} className={isSpeaking ? "animate-pulse" : ""} />
//                 <span>{isSpeaking ? "Speaking..." : "Listen Pronunciation"}</span>
//               </button>
              
//               <div className="space-y-4">
//                 <p className="text-lg text-slate-600 leading-relaxed">{currentCard.meaning}</p>
//                 <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-600">
//                   <span className="text-xs font-black uppercase text-blue-600 block mb-1">Senior Context</span>
//                   <p className="text-sm italic text-slate-700">{currentCard.senior_context}</p>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => setShowMCQ(true)}
//                 className="w-full mt-auto bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
//               >
//                 Test Knowledge <ArrowRight size={20} />
//               </button>
//             </div>
//           ) : (
//             <div className="animate-in slide-in-from-right-8 duration-300 flex-1 flex flex-col">
//               <h3 className="text-xl font-bold text-slate-800 mb-6">{currentCard.mcq.question}</h3>
              
//               <div className="space-y-3">
//                 {currentCard.mcq.options.map((option: any, idx: number) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedOption(idx)}
//                     className={`w-full p-4 rounded-2xl border-2 text-left transition-all font-medium ${
//                       selectedOption === idx 
//                         ? (option.is_correct ? "border-green-500 bg-green-50 text-green-900" : "border-red-500 bg-red-50 text-red-900")
//                         : "border-slate-100 hover:border-slate-200 text-slate-700"
//                     }`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <span>{option.text}</span>
//                       {selectedOption === idx && (
//                         option.is_correct ? <Check className="text-green-600" /> : <X className="text-red-600" />
//                       )}
//                     </div>
//                   </button>
//                 ))}
//               </div>

//               <button 
//                 disabled={selectedOption === null}
//                 onClick={handleNext}
//                 className="w-full mt-auto bg-slate-900 text-white py-4 rounded-2xl font-bold disabled:opacity-20 hover:bg-slate-800 transition-all"
//               >
//                 Continue
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// src/components/learning-path/ExerciseModal.tsx
// "use client";

// import React, { useState } from "react";
// import { X, Mic, Play, CheckCircle, BookOpen, MessageSquare } from "lucide-react";

// export default function ExerciseModal({ dayData, onClose }: { dayData: any, onClose: () => void }) {
//   const [stage, setStage] = useState<"flashcards" | "blueprint" | "voice">("flashcards");
//   const [isRecording, setIsRecording] = useState(false);

//   return (
//     <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px] shadow-2xl">
        
//         {/* Progress Header */}
//         <div className="p-6 flex justify-between items-center bg-slate-50/50">
//           <div className="flex gap-4">
//             <StageTab label="Vocab" active={stage === "flashcards"} done={stage !== "flashcards"} />
//             <StageTab label="Blueprint" active={stage === "blueprint"} done={stage === "voice"} />
//             <StageTab label="Voice" active={stage === "voice"} done={false} />
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex-1 p-10 overflow-y-auto">
//           {/* STAGE 1: FLASHCARDS (Already Built) */}
//           {stage === "flashcards" && (
//              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                {/* Your existing flashcard logic goes here */}
//                <button 
//                  onClick={() => setStage("blueprint")}
//                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold mt-8"
//                >
//                  Move to Grammar Blueprint
//                </button>
//              </div>
//           )}

//           {/* STAGE 2: GRAMMAR BLUEPRINT */}
//           {stage === "blueprint" && (
//             <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
//               <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
//                 <h3 className="text-blue-700 font-black text-sm uppercase mb-2 tracking-widest">Today's Formula</h3>
//                 <h2 className="text-3xl font-bold text-slate-900 mb-4">{dayData.preparation_phase.grammar_blueprint.title}</h2>
//                 <div className="bg-white p-4 rounded-xl font-mono text-blue-600 border border-blue-100 mb-4">
//                   {dayData.preparation_phase.grammar_blueprint.formula}
//                 </div>
//                 <p className="text-slate-600 italic">Example: "{dayData.preparation_phase.grammar_blueprint.example}"</p>
//               </div>
//               <button 
//                 onClick={() => setStage("voice")}
//                 className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold"
//               >
//                 Start Voice Performance
//               </button>
//             </div>
//           )}

//           {/* STAGE 3: VOICE TASK */}
//           {stage === "voice" && (
//             <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center text-center">
//               <div className="bg-slate-100 p-4 rounded-full mb-6">
//                 <MessageSquare className="text-blue-600" size={32} />
//               </div>
//               <h2 className="text-2xl font-black text-slate-900 mb-2">Scenario: {dayData.exercise_phase.task_1_voice.prompt}</h2>
//               <p className="text-slate-500 mb-8">Constraint: {dayData.exercise_phase.task_1_voice.constraint}</p>
              
//               {/* Record Button */}
//               <button 
//                 onMouseDown={() => setIsRecording(true)}
//                 onMouseUp={() => setIsRecording(false)}
//                 className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
//                   isRecording 
//                     ? "bg-red-500 scale-110 shadow-xl shadow-red-200" 
//                     : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
//                 }`}
//               >
//                 <Mic className="text-white" size={40} />
//               </button>
//               <p className="mt-4 font-bold text-slate-400">
//                 {isRecording ? "Recording... Release to stop" : "Hold to speak"}
//               </p>

//               <div className="mt-10 p-4 bg-green-50 border border-green-100 rounded-2xl w-full">
//                 <p className="text-xs font-bold text-green-700 uppercase mb-2">Required Keywords:</p>
//                 <div className="flex flex-wrap justify-center gap-2">
//                   {dayData.exercise_phase.task_1_voice.required_keywords.map((kw: string) => (
//                     <span key={kw} className="bg-white px-3 py-1 rounded-full text-sm font-bold border border-green-200 text-green-700">
//                       {kw}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StageTab({ label, active, done }: { label: string, active: boolean, done: boolean }) {
//   return (
//     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition-all ${
//       active ? "bg-blue-600 text-white shadow-md shadow-blue-100" : 
//       done ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
//     }`}>
//       {done ? <CheckCircle size={14} /> : <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-slate-300'}`} />}
//       {label}
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { X, ArrowRight, Mic, BookOpen, MessageSquare, CheckCircle } from "lucide-react";

interface ExerciseModalProps {
  dayData: any;
  onClose: () => void;
}

export default function ExerciseModal({ dayData, onClose }: ExerciseModalProps) {
  // Stages: 'vocab' -> 'grammar' -> 'voice'
  const [stage, setStage] = useState<"vocab" | "grammar" | "voice">("vocab");
  const [isRecording, setIsRecording] = useState(false);

  const { preparation_phase, exercise_phase } = dayData;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px] shadow-2xl">
        
        {/* Header with Step Indicator */}
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${stage === 'vocab' ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-600'}`}>
              1. Vocabulary
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${stage === 'grammar' ? 'bg-blue-600 text-white' : stage === 'voice' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              2. Grammar
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${stage === 'voice' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              3. Voice Performance
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 p-10 flex flex-col">
          {/* STAGE 1: VOCABULARY (Preparation Phase) */}
          {stage === "vocab" && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Key Terminology</h2>
                <p className="text-slate-500">Master these words before speaking.</p>
              </div>
              
              <div className="space-y-4 flex-1">
                {preparation_phase.flashcards.map((card: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-blue-600 text-lg">{card.term}</h4>
                    <p className="text-slate-600 text-sm">{card.meaning}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setStage("grammar")}
                className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Next: Grammar Blueprint <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STAGE 2: GRAMMAR (Preparation Phase) */}
          {stage === "grammar" && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-slate-900 mb-6">Grammar Blueprint</h2>
              <div className="bg-blue-50 p-8 rounded-[2rem] border-2 border-blue-100 mb-8">
                <h3 className="text-blue-700 font-bold mb-2 uppercase tracking-widest text-xs">The Formula</h3>
                <p className="text-2xl font-mono text-slate-800 mb-6">{preparation_phase.grammar_blueprint.formula}</p>
                
                <h3 className="text-blue-700 font-bold mb-2 uppercase tracking-widest text-xs">Example</h3>
                <p className="text-lg italic text-slate-600">"{preparation_phase.grammar_blueprint.example}"</p>
              </div>
              <button 
                onClick={() => setStage("voice")}
                className="w-full mt-auto bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Final Step: Voice Task <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STAGE 3: VOICE (Exercise Phase) */}
          {stage === "voice" && (
            <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Voice Performance</h2>
              <p className="text-slate-500 mb-8">Apply everything you learned in this scenario.</p>
              
              <div className="w-full p-6 bg-slate-900 text-white rounded-[2rem] mb-8 text-left">
                <p className="text-blue-400 font-bold text-xs uppercase mb-2">Scenario</p>
                <p className="text-lg font-medium leading-relaxed">{exercise_phase.task_1_voice.prompt}</p>
              </div>

              <button 
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => setIsRecording(false)}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-blue-600 shadow-blue-200'}`}
              >
                <Mic className="text-white" size={32} />
              </button>
              <p className="mt-4 font-bold text-slate-400">{isRecording ? "Recording..." : "Hold to Record"}</p>

              <div className="mt-8 flex flex-wrap gap-2 justify-center">
                {exercise_phase.task_1_voice.required_keywords.map((word: string) => (
                  <span key={word} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}