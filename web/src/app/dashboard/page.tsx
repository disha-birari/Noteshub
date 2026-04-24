"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  Folder, 
  Clock, 
  Settings, 
  LogOut,
  Bell,
  Sparkles,
  ArrowRight,
  ThumbsUp, 
  Eye, 
  Download, 
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadNoteModal from '@/components/UploadNoteModal';

import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { incrementView, toggleLike, incrementDownload } from '@/lib/engagement';
import { formatDistanceToNow } from 'date-fns';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [recommendedNotes, setRecommendedNotes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoadingData(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);

        if (!data.onboardingCompleted) {
          router.push('/questionnaire');
          return;
        }

        const notesRef = collection(db, 'notes');
        const branchLower = (data.branch || '').toLowerCase();
        
        // ML-Inspired Recommendation Query
        const q = query(
          notesRef, 
          where('branch', '==', branchLower)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          let allNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
          
          // Scoring Algorithm
          const scoredNotes = allNotes.map(note => {
            let score = 0;
            
            // 1. Semester Match
            if (note.semester?.toString() === data.semester?.toString()) score += 100;
            
            // 2. Year Match
            if (note.year?.toString() === data.year?.toString()) score += 50;
            
            // 3. Engagement Score
            score += (note.likes || 0) * 5;
            score += (note.downloads || 0) * 10;
            score += (note.views || 0) * 1;
            
            // 4. Quality Multiplier
            score += (note.qualityScore || 5) * 2;

            return { ...note, recommendationScore: score };
          });

          scoredNotes.sort((a, b) => b.recommendationScore - a.recommendationScore);

          setRecommendedNotes(scoredNotes.slice(0, 4));
          setNotes(scoredNotes);
          setLoadingData(false);
        });

        return unsubscribe;
      } else {
        router.push('/questionnaire');
        setLoadingData(false);
      }
    } catch (error) {
      console.error("Error setting up data listener:", error);
      setError("Failed to load dashboard data.");
      setLoadingData(false);
    }
  };

  useEffect(() => {
    let unsubscribe: any;
    const setup = async () => {
      unsubscribe = await fetchData();
    };
    setup();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [user, router]);

  // Prevent hydration mismatch and wait for auth
  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1E293B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1E293B] rounded-lg flex items-center justify-center transform rotate-45">
             <div className="w-4 h-4 bg-white/20 rounded-full" />
          </div>
          <span className="text-xl font-bold text-[#1E293B]">Notes Hub</span>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all bg-[#1E293B] text-white shadow-lg"
          >
            <Sparkles size={18} />
            For You
          </button>
          <button 
            onClick={() => router.push('/dashboard/library')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-all"
          >
            <Folder size={18} />
            My Library
          </button>
        </nav>

        <div className="p-4 border-t border-[#F1F5F9] flex flex-col gap-2">
          <button 
            onClick={async () => { await signOut(auth); router.push('/'); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-[#1E293B]">
              Top Picks for {user.displayName?.split(' ')[0]} 🎯
            </h1>
            <p className="text-[#64748B] font-medium">
              Based on your {userData?.branch?.toUpperCase()} Curriculum
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-[#E2E8F0]">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Recommended Horizontal Scroll */}
        {recommendedNotes.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-xl font-bold text-[#1E293B]">Recommended Quality Notes</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {recommendedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-3xl border border-[#F1F5F9] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-4">
                     <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full flex items-center gap-1">
                       <Star size={10} fill="currentColor" />
                       PREMIUM
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                       <FileText size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-[#1E293B] leading-tight">{note.title}</h3>
                       <p className="text-xs text-[#64748B] font-medium">{note.subject}</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-6 text-[#94A3B8] mb-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Eye size={14} /> {note.views || 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <ThumbsUp size={14} /> {note.likes || 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500">
                        <Download size={14} /> {note.downloads || 0}
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                     <button 
                       onClick={() => { incrementView(note.id); window.open(note.url, '_blank'); }}
                       className="flex-1 h-12 bg-[#1E293B] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all"
                     >
                       <Eye size={16} /> View Note
                     </button>
                     <button 
                        onClick={() => toggleLike(note.id)}
                        className="w-12 h-12 border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                       <ThumbsUp size={18} />
                     </button>
                   </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Notes List */}
        <section>
          <h2 className="text-xl font-bold text-[#1E293B] mb-6">Recent from your Branch</h2>
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="bg-white p-5 rounded-2xl border border-[#F1F5F9] flex items-center justify-between hover:border-blue-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E293B] text-sm">{note.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{note.subject}</span>
                      <span className="w-1 h-1 bg-[#CBD5E1] rounded-full" />
                      <span className="text-[10px] font-bold text-[#94A3B8]">
                        {note.createdAt ? formatDistanceToNow(new Date(note.createdAt.seconds * 1000)) + ' ago' : 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4 text-[#94A3B8]">
                    <div className="flex items-center gap-1.5 text-xs font-bold"><Eye size={14} /> {note.views || 0}</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold"><ThumbsUp size={14} /> {note.likes || 0}</div>
                  </div>
                  <button 
                    onClick={() => { incrementDownload(note.id); incrementView(note.id); window.open(note.url, '_blank'); }}
                    className="h-10 px-4 border border-[#E2E8F0] rounded-lg text-sm font-bold text-[#1E293B] hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Download size={16} /> Get PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      <UploadNoteModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        userData={userData}
        onUploadSuccess={() => fetchData()}
      />
    </div>
  );
}
