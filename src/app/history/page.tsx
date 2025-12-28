"use client";

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDocs } from 'firebase/firestore';
import { MessageSquare, Calendar, Play, UserCircle } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer'; // Using the custom player we built earlier\

interface Session {
  id: string;
  text: string;
  ttsUrl: string;
  userVoiceUrl: string | null;
  createdAt: any;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    console.log("Current User in Dashboard:", user);
    if (!user) return;

    // Query sessions for the logged-in user, newest first
    const q = query(
      collection(db, 'shadow_sessions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const getData = async () => { 
      const querySnapshot = await getDocs(q);
      const sessionData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Session[];

      console.log("Fetched Sessions:", sessionData);
      setSessions(sessionData);
      setLoading(false);
    }

    getData();

    // // Set up real-time listener
    // const unsubscribe = getDocs(q, (snapshot) => {
    //   const sessionData = snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    //   })) as Session[];
      
    // });

    // return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
          <p className="text-slate-500">Review your past shadowing sessions and track your improvement.</p>
        </header>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No sessions found yet. Start practicing!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                    <Calendar size={14} />
                    {session.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>

                <p className="text-slate-800 font-medium text-lg mb-6 italic border-l-4 border-slate-200 pl-4">
                  "{session.text}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Model Voice */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Voice</span>
                    <AudioPlayer src={session.ttsUrl} />
                  </div>

                  {/* Your Voice */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Recording</span>
                    {session.userVoiceUrl ? (
                      <AudioPlayer src={session.userVoiceUrl} />
                    ) : (
                      <div className="h-[58px] flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs italic">
                        No recording saved for this session
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}