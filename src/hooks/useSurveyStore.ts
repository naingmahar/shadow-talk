// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface SurveyData {
//   goal: string;
//   role: string;
//   levelDescription: string;
//   duration: string;
//   timePerDay: string;
//   technicalPillars: string[];
// }

// interface SurveyState {
//   data: SurveyData;
//   step: number;
//   activePlan: any | null; // Added to store Gemini response

//   // Actions
//   setGoal: (goal: string) => void;
//   setRole: (role: string) => void;
//   setLevelDescription: (desc: string) => void;
//   setDuration: (duration: string) => void;
//   setTimePerDay: (time: string) => void;
//   togglePillar: (pillar: string) => void;
//   setPlan: (plan: any) => void; // Added to save generated plan
  
//   // Navigation
//   nextStep: () => void;
//   prevStep: () => void;
//   reset: () => void;
// }

// export const useSurveyStore = create<SurveyState>()(
//   persist(
//     (set) => ({
//       // Initial State
//       step: 1,
//       activePlan: null,
//       data: {
//         goal: '',
//         role: '',
//         levelDescription: '',
//         duration: '1 month',
//         timePerDay: '1 hour',
//         technicalPillars: [],
//       },

//       // Actions
//       setGoal: (goal) => 
//         set((state) => ({ data: { ...state.data, goal } })),

//       setRole: (role) => 
//         set((state) => ({ data: { ...state.data, role } })),

//       setLevelDescription: (levelDescription) => 
//         set((state) => ({ data: { ...state.data, levelDescription } })),

//       setDuration: (duration) => 
//         set((state) => ({ data: { ...state.data, duration } })),

//       setTimePerDay: (timePerDay) => 
//         set((state) => ({ data: { ...state.data, timePerDay } })),

//       togglePillar: (pillar) => 
//         set((state) => {
//           const current = state.data.technicalPillars;
//           const updated = current.includes(pillar)
//             ? current.filter((p) => p !== pillar)
//             : [...current, pillar];
//           return { data: { ...state.data, technicalPillars: updated } };
//         }),

//       setPlan: (plan) => set({ activePlan: plan }),

//       nextStep: () => set((state) => ({ step: state.step + 1 })),
      
//       prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
      
//       reset: () => set({ 
//         step: 1, 
//         activePlan: null, 
//         data: { 
//           goal: '', role: '', levelDescription: '', 
//           duration: '1 month', timePerDay: '1 hour', technicalPillars: [] 
//         } 
//       }),
//     }),
//     {
//       name: 'en-lab-learning-session', // LocalStorage key
//     }
//   )
// );


import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Day {
  day: number;
  title: string;
  type: "lesson" | "revision" | "exam";
}

interface Package {
  package_name: string;
  days: Day[];
}

interface LearningPlan {
  plan_metadata: {
    total_days: number;
    hours_per_day: string;
  };
  roadmap: Package[];
}

interface SurveyData {
  goal: string;
  role: string;
  levelDescription: string;
  duration: string;
  timePerDay: string;
  selectedTitles: string[]; // Step 5 selections
}

interface SurveyState {
  // Current UI State
  step: number;
  data: SurveyData;
  
  // AI Generated Options
  suggestedTitles: string[]; 
  
  // The Final Roadmap
  plan: LearningPlan | null;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  
  // Data Setters
  setGoal: (goal: string) => void;
  setRole: (role: string) => void;
  setLevelDescription: (desc: string) => void;
  setDuration: (duration: string) => void;
  setTimePerDay: (time: string) => void;
  
  // Title Selection Actions
  setSuggestedTitles: (titles: string[]) => void;
  setSelectedTitles: (titles: string[]) => void;
  toggleTitle: (title: string) => void;

  // Final Plan Action
  setPlan: (plan: LearningPlan) => void;
  resetSurvey: () => void;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      step: 1,
      data: {
        goal: "",
        role: "",
        levelDescription: "",
        duration: "",
        timePerDay: "",
        selectedTitles: [],
      },
      suggestedTitles: [],
      plan: null,

      // Navigation
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: state.step - 1 })),
      setStep: (step) => set({ step }),

      // Basic Data Setters
      setGoal: (goal) => set((state) => ({ data: { ...state.data, goal } })),
      setRole: (role) => set((state) => ({ data: { ...state.data, role } })),
      setLevelDescription: (levelDescription) =>
        set((state) => ({ data: { ...state.data, levelDescription } })),
      setDuration: (duration) =>
        set((state) => ({ data: { ...state.data, duration } })),
      setTimePerDay: (timePerDay) =>
        set((state) => ({ data: { ...state.data, timePerDay } })),

      // Title Selection
      setSuggestedTitles: (titles) => set({ suggestedTitles: titles }),
      setSelectedTitles: (selectedTitles) =>
        set((state) => ({ data: { ...state.data, selectedTitles } })),
      
      toggleTitle: (title) =>
        set((state) => {
          const current = state.data.selectedTitles;
          const isSelected = current.includes(title);
          const next = isSelected
            ? current.filter((t) => t !== title)
            : [...current, title];
          return { data: { ...state.data, selectedTitles: next } };
        }),

      // Final Plan
      setPlan: (plan) => set({ plan }),

      // Reset
      resetSurvey: () =>
        set({
          step: 1,
          data: {
            goal: "",
            role: "",
            levelDescription: "",
            duration: "",
            timePerDay: "",
            selectedTitles: [],
          },
          suggestedTitles: [],
          plan: null,
        }),
    }),
    {
      name: "survey-storage", // Key in LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);