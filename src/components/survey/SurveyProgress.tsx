// src/components/survey/SurveyProgress.tsx
"use client";

interface SurveyProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function SurveyProgress({ currentStep, totalSteps }: SurveyProgressProps) {
  // Calculate percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Current Phase
          </span>
          <h2 className="text-slate-900 font-semibold">
            Step {currentStep} of {totalSteps}
          </h2>
        </div>
        <span className="text-sm font-medium text-slate-400">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        {/* Animated Progress Fill */}
        <div
          className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}