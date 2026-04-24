"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bookmark, FileText, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleBookmark } from '@/lib/engagement';

export default function SavedNotesPage() {
  const { user, loading } = useAuth();
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || !mounted) return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'bookmarks'),
      (snapshot) => {
        const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        setSavedNotes(notes);
        setLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, [user, mounted]);

  const removeBookmark = async (noteId: string) => {
    if (user) {
      await toggleBookmark(user.uid, noteId, {});
    }
  };

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1E293B]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-10 lg:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-[#1E293B]">Saved Notes</h1>
          <p className="text-[#64748B] font-medium mt-1">Your personal collection of important resources</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {loadingData ? (
            <div className="flex justify-center py-20 text-slate-300">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : savedNotes.length > 0 ? (
            savedNotes.map((note) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={note.id}
                className="bg-white p-4 lg:p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                    <Bookmark size={28} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E293B]">{note.title}</h3>
                    <p className="text-xs font-bold text-[#94A3B8] uppercase">{note.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.open(note.url, '_blank')}
                    className="h-10 px-4 bg-[#1E293B] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all"
                  >
                    <ExternalLink size={16} /> Open Note
                  </button>
                  <button 
                    onClick={() => removeBookmark(note.id)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                <Bookmark size={32} />
              </div>
              <p className="text-slate-500 font-bold">No saved notes yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
