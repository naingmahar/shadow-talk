import React from 'react';

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* This wraps ONLY the flashcard pages */}
      <header className="py-4 px-6 bg-slate-50 border-b border-slate-200">
        <h1 className="text-sm font-bold text-slate-500 uppercase tracking-tight">
          Practice Mode: Flashcards
        </h1>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}