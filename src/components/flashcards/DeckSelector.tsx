"use client";

interface DeckSelectorProps {
  deckType: 'tech' | 'english';
  setDeckType: (type: 'tech' | 'english') => void;
  category: string;
  setCategory: (cat: string) => void;
  subCategory: string;
  setSubCategory: (sub: string) => void;
  onStart: () => void;
}
import { Terminal, Languages, ChevronRight, Check } from 'lucide-react';

interface DeckSelectorProps {
  deckType: 'tech' | 'english';
  setDeckType: (type: 'tech' | 'english') => void;
  category: string;
  setCategory: (cat: string) => void;
  subCategory: string;
  setSubCategory: (sub: string) => void;
  onStart: () => void;
}

export default function DeckSelector({ 
  deckType, setDeckType, 
  category, setCategory, 
  subCategory, setSubCategory,
  onStart 
}: DeckSelectorProps) {
  
  const data = {
    tech: [
      { id: 'frontend', name: 'Frontend' },
      { id: 'backend', name: 'Backend' },
      { id: 'rn', name: 'React Native', subs: ['Navigation', "Deployment", "Testing", "Security", "Styling", "Architecture", 'State', 'Performance', 'Native', "Animations"] },
      { id: 'appstore', name: 'Appstore' },
      { id: 'mentoring', name: 'Mentoring' },
      { id: 'leadership', name: 'Leadership' },
      { id: 'personal', name: 'Personal' },
      { id: 'algorithms', name: 'Algorithms' },
      { id: 'behavioral', name: 'Behavioral' },
    ],
    english: [
      { id: 'ielts', name: 'IELTS', subs: [
        'Cooking', 'Passion', 'Mentality', 'Introduction', 'Hotel Booking', 'Immigration', 'Restaurant', 
        'Daily Routine', 'Health', 'Social', 'Travel', 'Future', 'Shopping', 'Daily Life', 'Work/Study', 
        'Hometown', 'Technology', 'Leisure', 'Food', 'Environment', 'Education', 'Friends', 'Art', 
        'Weather', 'Hobby', 'Sports', 'Music', 'Transport', 'History', 'Dreams', 'Animals', 
        'Happiness', 'Culture', 'Cities', 'Ambition'
      ] },
    ]
  };

  const currentCats = data[deckType];
  const selectedCatData = currentCats.find(c => c.id === category);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-[70vh] sm:h-auto">
      
      {/* 1. Main Type Selection (Stays Top) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => { setDeckType('tech'); setCategory(''); setSubCategory(''); }}
          className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${deckType === 'tech' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 bg-white'}`}
        >
          <Terminal size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Programmer</span>
        </button>
        <button 
          onClick={() => { setDeckType('english'); setCategory(''); setSubCategory(''); }}
          className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${deckType === 'english' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 bg-white'}`}
        >
          <Languages size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">English</span>
        </button>
      </div>

      {/* SCROLLABLE AREA: Categories and Subcategories */}
      <div className="flex-grow overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        
        {/* 2. Category Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {currentCats.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setSubCategory(''); }}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-between ${
                  category === cat.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-100'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {category === cat.id && <Check size={14} className="shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Sub-Category (Vertical Grid) */}
        {selectedCatData?.subs && (
          <div className="space-y-3 animate-in fade-in duration-300 pb-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Topic</label>
            <div className="grid grid-cols-3 gap-2">
              {selectedCatData.subs.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSubCategory(sub)}
                  className={`p-2 rounded-xl text-[10px] font-bold transition-all border text-center break-words h-full flex items-center justify-center ${
                    subCategory === sub 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white text-slate-500 border-slate-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Start Button (Fixed at Bottom) */}
      <div className="pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button
          disabled={!category || (selectedCatData?.subs && !subCategory)}
          onClick={onStart}
          className="w-full py-5 bg-blue-600 disabled:bg-slate-200 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          Start Practice <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// import { Terminal, Languages, ChevronRight } from 'lucide-react';

// export default function DeckSelector({ 
//   deckType, setDeckType, 
//   category, setCategory, 
//   subCategory, setSubCategory,
//   onStart 
// }:DeckSelectorProps) {
//   const data = {
//     tech: [
//       { id: 'frontend', name: 'Frontend' },
//       { id: 'backend', name: 'Backend' },
//       { id: 'rn', name: 'React Native', subs: ['Navigation',"Deployment","Testing","Security", "Styling", "Architecture", 'State', 'Performance','Native',"Animations"] },
//       { id: 'appstore', name: 'Appstore' },
//       { id: 'mentoring', name: 'Mentoring' },
//       { id: 'leadership', name: 'Leadership' },
//       { id: 'personal', name: 'Personal' },
//       { id: 'algorithms', name: 'Algorithms' },
//       { id: 'behavioral', name: 'Behavioral' },
//     ],
//     english: [
//       { id: 'ielts', name: 'IELTS', subs: [
//   ,'Cooking'
//   ,'Passion'
//   ,'Mentality'
//   ,'Introduction'
//   ,'Hotel Booking'
//   ,'Immigration'
//   ,'Restaurant'
//   ,'Daily Routine'
//   ,'Health'
//   ,'Social'
//   ,'Travel'
//   ,'Future'
//   ,'Shopping'
//   ,'Daily Life'
//   ,'Work/Study'
//   ,'Hometown'
//   ,'Technology'
//   ,'Leisure'
//   ,'Food'
//   ,'Environment'
//   ,'Education'
//   ,'Friends'
//   ,'Art'
//   ,'Weather'
//   ,'Hobby'
//   ,'Sports'
//   ,'Music'
//   ,'Transport'
//   ,'History'
//   ,'Dreams'
//   ,'Animals'
//   ,'Happiness'
//   ,'Culture'
//   ,'Cities'
//   ,'Ambition'
//       ] },
//       // { id: 'business', name: 'Business English', subs: ['Meetings', 'Interviews', 'Emails'] }
//     ]
//   };

//   const currentCats = data[deckType];
//   const selectedCatData = currentCats.find(c => c.id === category);

//   return (
//     <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-500">
//       {/* STEP 1: Main Type */}
//       <div className="grid grid-cols-2 gap-3">
//         <button 
//           onClick={() => { setDeckType('tech'); setCategory(''); setSubCategory(''); }}
//           className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${deckType === 'tech' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}
//         >
//           <Terminal size={24} />
//           <span className="text-[10px] font-black uppercase tracking-widest">Programmer</span>
//         </button>
//         <button 
//           onClick={() => { setDeckType('english'); setCategory(''); setSubCategory(''); }}
//           className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${deckType === 'english' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}
//         >
//           <Languages size={24} />
//           <span className="text-[10px] font-black uppercase tracking-widest">English</span>
//         </button>
//       </div>

//       {/* STEP 2: Category */}
//       <div className="space-y-2">
//         <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Select Category</label>
//         <div className="grid grid-cols-2 gap-2">
//           {currentCats.map(cat => (
//             <button
//               key={cat.id}
//               onClick={() => { setCategory(cat.id); setSubCategory(cat.subs ? '' : 'default'); }}
//               className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border ${category === cat.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-100'}`}
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* STEP 3: Sub-Category (Conditional) */}
//       {selectedCatData?.subs && (
//         <div className="space-y-2 animate-in slide-in-from-top-2">
//           <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Select Topic</label>
//           <div className="flex flex-wrap gap-2">
//             {selectedCatData.subs.map(sub => (
//               <button
//                 key={sub}
//                 onClick={() => setSubCategory(sub)}
//                 className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${subCategory === sub ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
//               >
//                 {sub}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* START BUTTON */}
//       <button
//         disabled={!category || !subCategory}
//         onClick={onStart}
//         className="w-full py-5 bg-blue-600 disabled:bg-slate-200 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-blue-100 disabled:shadow-none transition-all active:scale-95"
//       >
//         Start Practice <ChevronRight size={18} />
//       </button>
//     </div>
//   );
// }