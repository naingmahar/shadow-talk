// src/components/survey/SelectionCard.tsx
"use client";

import { cn } from "@/lib/utils"; // Standard shadcn utility or just a template literal string
import { CheckCircle2 } from "lucide-react";

interface SelectionCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function SelectionCard({
  title,
  description,
  isSelected,
  onClick,
  icon,
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "relative w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left",
        "hover:bg-slate-50 active:scale-[0.98]",
        isSelected
          ? "border-blue-600 bg-blue-50/50 shadow-sm"
          : "border-slate-200 bg-white"
      )}
    >
      {/* Icon Section */}
      <div className={cn(
        "p-3 rounded-lg transition-colors",
        isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
      )}>
        {icon}
      </div>

      {/* Text Section */}
      <div className="flex-1">
        <h3 className={cn(
          "font-bold text-lg leading-tight",
          isSelected ? "text-blue-900" : "text-slate-800"
        )}>
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      {/* Selection Indicator */}
      <div className="ml-2">
        {isSelected ? (
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
        )}
      </div>
    </button>
  );
}