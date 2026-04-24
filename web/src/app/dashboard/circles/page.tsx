"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  ArrowRight, 
  Search,
  Loader2,
  Lock,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

export default function CirclesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [circles, setCircles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // New Circle Form
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || !mounted) return;

    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) setUserData(userDoc.data());
    };
    fetchUser();

    // Fetch circles for the user's branch
    const q = query(
      collection(db, 'circles'),
      where('branch', '==', userData?.branch || 'cse') // Fallback to cse for now
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      setCircles(docs);
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user, mounted, userData?.branch]);

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName || !user || !userData) return;

    try {
      await addDoc(collection(db, 'circles'), {
        name: newCircleName,
        description: newCircleDesc,
        branch: userData.branch,
        semester: userData.semester,
        createdBy: user.uid,
        creatorName: user.displayName,
        memberCount: 1,
        createdAt: serverTimestamp()
      });
      setNewCircleName('');
      setNewCircleDesc('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating circle:', error);
    }
  };

  if (!mounted || loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#1E293B]">Study Circles</h1>
            <p className="text-[#64748B] font-medium mt-1">Collaborate with peers from {userData?.branch?.toUpperCase()}</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#1E293B] text-white rounded-xl px-6 h-12 font-bold flex items-center gap-2 hover:bg-black shadow-lg transition-all"
          >
            <Plus size={20} />
            Create Circle
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingData ? (
            <div className="col-span-2 flex justify-center py-20">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : circles.length > 0 ? (
            circles.map((circle) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={circle.id}
                className="bg-white p-8 rounded-3xl border border-[#F1F5F9] shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group"
                onClick={() => router.push(`/dashboard/circles/${circle.id}`)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Users size={28} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#1E293B] mb-2">{circle.name}</h3>
                <p className="text-sm text-[#64748B] font-medium mb-6 line-clamp-2">{circle.description || 'Discuss topics, share resources, and study together for exams.'}</p>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${circle.id + i}`} alt="Avatar" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400">{circle.memberCount || 1} Members</span>
                  </div>
                  <div className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Join Circle <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                <Users size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">No circles in your branch</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Be the first to start a study circle and invite your classmates!</p>
              </div>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 bg-[#1E293B] text-white rounded-xl px-8 h-12 font-bold"
              >
                Start a Circle
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden p-8"
            >
              <h2 className="text-2xl font-black text-[#1E293B] mb-6">Start Study Circle</h2>
              <form onSubmit={handleCreateCircle} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Circle Name</label>
                  <input 
                    required value={newCircleName} onChange={e => setNewCircleName(e.target.value)}
                    placeholder="e.g. Midterm Prep - Calculus"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={newCircleDesc} onChange={e => setNewCircleDesc(e.target.value)}
                    placeholder="What will you study?"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium h-32"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full h-14 bg-[#1E293B] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
                >
                  Launch Circle
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
