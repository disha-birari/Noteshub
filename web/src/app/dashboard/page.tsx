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
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth Redirection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Data Fetching and Onboarding Check
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoadingData(true);
        // 1. Fetch User Data (Branch, Semester, Year)
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          // 1.5 Check if onboarding is completed
          if (!data.onboardingCompleted) {
            router.push('/questionnaire');
            return;
          }

          // 2. Fetch Notes based on User's Branch
          const notesRef = collection(db, 'notes');
          const q = query(notesRef, where('branch', '==', data.branch || ''));
          const querySnapshot = await getDocs(q);
          
          let fetchedNotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
          
          // Filter locally to avoid requiring complex Firestore Composite Indexes for beginners
          if (data.semester) {
            fetchedNotes = fetchedNotes.filter(note => note.semester === data.semester);
          }
          
          setNotes(fetchedNotes);
        } else {
          // User exists in Auth but not in Firestore yet? 
          // This happens right after signup before questionnaire
          router.push('/questionnaire');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const stats = [
    { label: 'Total Notes', value: notes.length.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Study Circles', value: '0', icon: Folder, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'AI Scans', value: '0', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

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
          {[
            { name: 'My Library', icon: FileText, active: true },
            { name: 'Shared with me', icon: Folder, active: false },
            { name: 'Recent Activity', icon: Clock, active: false },
            { name: 'AI Scanner', icon: Sparkles, active: false },
          ].map((item) => (
            <button
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                item.active 
                ? 'bg-[#1E293B] text-white shadow-lg shadow-slate-200' 
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#F1F5F9] flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-all">
            <Settings size={18} />
            Settings
          </button>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-[#1E293B]">
              Welcome back, {user.displayName?.split(' ')[0] || 'Scholar'}! 👋
            </h1>
            <p className="text-[#64748B] font-medium">
              {loadingData ? 'Loading your curriculum...' : userData ? `Curriculum: ${userData.branch?.toUpperCase()} • Semester ${userData.semester}` : 'Ready to master your courses today?'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input 
                type="text" 
                placeholder="Search notes..."
                className="pl-12 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-[#1E293B] transition-all w-64"
              />
            </div>
            <button className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] hover:bg-white hover:border-[#1E293B] transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-[#E2E8F0]">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#1E293B]">{stat.value}</span>
                <span className="text-sm font-medium text-[#64748B]">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notes Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1E293B]">Recent Notes</h2>
            <Button className="bg-[#1E293B] text-white rounded-xl px-5 h-10 font-bold flex items-center gap-2 hover:bg-[#334155]">
              <Plus size={18} />
              New Note
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {loadingData ? (
              <div className="col-span-2 text-center py-10 text-[#64748B]">Loading your notes...</div>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={note.id}
                  className="group bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm hover:border-[#1E293B] transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#F8FAFC] rounded-lg text-[#1E293B] group-hover:bg-[#1E293B] group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      {note.date || 'Recently Added'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1E293B] mb-2">{note.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2">
                    {note.description || 'No description available for this note.'}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-md">
                       {note.subject || 'General'}
                    </div>
                    <div className="flex items-center gap-2 text-[#3B82F6] font-bold text-xs">
                      <Sparkles size={12} />
                      AI Summary Available
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 bg-white p-10 rounded-2xl border border-dashed border-[#CBD5E1] text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8]">
                  <Folder size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E293B]">No notes found yet</h3>
                  <p className="text-[#64748B] mt-2">There are currently no notes available for {userData?.branch?.toUpperCase()} Semester {userData?.semester}.</p>
                </div>
                <Button className="mt-4 bg-[#1E293B] text-white rounded-xl px-6 h-12 font-bold hover:bg-[#334155]">
                  Upload First Note
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
