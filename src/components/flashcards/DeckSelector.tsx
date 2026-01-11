"use client";

interface DeckSelectorProps {
  currentDeck: 'tech' | 'english';
  setDeck: (deck: 'tech' | 'english') => void;
}

export default function DeckSelector({ currentDeck, setDeck }: DeckSelectorProps) {
  return (
    <div className="flex bg-slate-200 p-1 rounded-2xl w-full max-w-sm mx-auto mb-8">
      <button
        onClick={() => setDeck('tech')}
        className={`flex-1 py-3 rounded-xl font-bold transition-all ${
          currentDeck === 'tech' 
          ? 'bg-white text-blue-600 shadow-md scale-100' 
          : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        💻 Programmer
      </button>
      <button
        onClick={() => setDeck('english')}
        className={`flex-1 py-3 rounded-xl font-bold transition-all ${
          currentDeck === 'english' 
          ? 'bg-white text-green-600 shadow-md scale-100' 
          : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        🗣️ English
      </button>
    </div>
  );
}