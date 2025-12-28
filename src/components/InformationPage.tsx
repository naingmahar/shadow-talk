import Link from 'next/link';
import { ArrowRight, Mic2, Sparkles, BookOpen } from 'lucide-react';

export default function InformationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
          Master Tech English <span className="text-blue-600">Faster.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate shadowing tool for developers. Generate AI scripts for interviews, standups, and meetings.
        </p>
        <Link 
          href="/auth" 
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-200"
        >
          Get Started Now <ArrowRight size={20} />
        </Link>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<Sparkles />} title="AI Scripting" desc="Gemini 1.5 Flash creates scripts for 100+ tech scenarios." />
          <FeatureCard icon={<Mic2 />} title="Shadowing Practice" desc="Real-time feedback on your rhythm and pronunciation." />
          <FeatureCard icon={<BookOpen />} title="Progress Tracking" desc="Save your sessions and see your fluency grow daily." />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500">{desc}</p>
    </div>
  );
}