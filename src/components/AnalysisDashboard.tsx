"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { CheckCircle2, XCircle, TrendingUp, Calendar, Hash, Activity } from 'lucide-react';

export default function AnalysisDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>({ totalCount: 0, totalDays: 0, yesterdayCount: 0, last7Days: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAnalysis();
  }, [user]);

  console.log("User in AnalysisDashboard:", user);
  const fetchAnalysis = async () => {
    try {
      const q = query(
        collection(db, 'shadow_sessions'),
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      console.log("Fetched shadow_session documents:", snapshot.docs.map(doc => doc.data()));
      const sessions = snapshot.docs.map(doc => ({
        ...doc.data(),
        dateStr: (doc.data() as any).createdAt?.toDate().toISOString().split('T')[0]
      }));



      const totalCount = sessions.length;
      const uniqueDays = new Set(sessions.map(s => s.dateStr));
      const totalDays = uniqueDays.size;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const yesterdayCount = sessions.filter(s => s.dateStr === yesterdayStr).length;

      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const dayCount = sessions.filter(s => s.dateStr === dStr).length;
        return {
          date: d.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: dStr,
          count: dayCount,
          active: dayCount > 0
        };
      }).reverse();

      console.log("Analysis Data:", { totalCount, totalDays, yesterdayCount, last7Days });
      setData({ totalCount, totalDays, yesterdayCount, last7Days });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse text-slate-400">
      <Activity className="animate-spin mb-2" />
      <p className="text-sm font-bold uppercase tracking-widest">Analyzing Stats</p>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Requirement 1, 2, 3: Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
        <MetricCard icon={<Hash />} label="Total Exercises" value={data.totalCount} color="text-blue-600" />
        <MetricCard icon={<Calendar />} label="Days Active" value={data.totalDays} color="text-purple-600" />
        <MetricCard icon={<TrendingUp />} label="Yesterday" value={data.yesterdayCount} color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Requirement 4: Attendance Chart - Flex Wrap for Mobile */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Attendance (Last 7 Days)</h3>
          <div className="flex flex-wrap justify-between gap-y-4 bg-slate-50 p-4 md:p-6 rounded-2xl">
            {data.last7Days.map((day: any) => (
              <div key={day.fullDate} className="flex flex-col items-center min-w-[45px] gap-2">
                {day.active ? (
                  <CheckCircle2 className="text-emerald-500 w-6 h-6 md:w-7 md:h-7" />
                ) : (
                  <XCircle className="text-slate-200 w-6 h-6 md:w-7 md:h-7" />
                )}
                <span className={`text-[10px] md:text-xs font-bold ${day.active ? 'text-slate-900' : 'text-slate-400'}`}>
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Requirement 5: Progress Intensity Chart - Better scaling */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Exercise Intensity</h3>
          <div className="flex items-end justify-between h-28 md:h-32 gap-1 md:gap-2 px-1">
            {data.last7Days.map((day: any) => (
              <div key={day.fullDate} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.count} lessons
                </div>
                <div 
                  className="w-full max-w-[30px] bg-blue-500 rounded-t-md md:rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${Math.max(day.count * 15, 4)}px` }}
                ></div>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-slate-50 ${color}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-tight">{label}</p>
        <p className="text-lg md:text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}