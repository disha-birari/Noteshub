"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Folder, 
  LogOut,
  Sparkles,
  Trash2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadNoteModal from '@/components/UploadNoteModal';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';

export default function LibraryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [myNotes, setMyNotes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || !mounted) return;

    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };
    fetchUserData();

    // Listen for notes uploaded by THIS user
    const q = query(
      collection(db, 'notes'),
      where('uploadedBy', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      setMyNotes(notes);
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user, mounted]);

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteDoc(doc(db, 'notes', noteId));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-all"
          >
            <Sparkles size={18} />
            For You
          </button>
          <button 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all bg-[#1E293B] text-white shadow-lg"
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
          <div>
            <h1 className="text-3xl font-black text-[#1E293B]">My Library</h1>
            <p className="text-[#64748B] font-medium mt-1">Manage and upload your academic contributions</p>
          </div>
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-[#1E293B] text-white rounded-xl px-6 h-12 font-bold flex items-center gap-2 hover:bg-black shadow-lg"
          >
            <Plus size={20} />
            Upload New Note
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {loadingData ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : myNotes.length > 0 ? (
            myNotes.map((note) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={note.id}
                className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex items-center justify-between group hover:border-[#1E293B] transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E293B]">{note.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs font-bold text-[#94A3B8] uppercase">
                      <span>{note.subject}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{note.branch}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>Sem {note.semester}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => window.open(note.url, '_blank')}
                    className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                    title="View Note"
                  >
                    <ExternalLink size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                    title="Delete Note"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                <Folder size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your library is empty</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Start sharing your notes with other students to build your academic profile.</p>
              </div>
              <Button 
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4 bg-[#1E293B] text-white rounded-xl px-8 h-12 font-bold"
              >
                Upload Your First Note
              </Button>
            </div>
          )}
        </div>
      </main>

      <UploadNoteModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        userData={userData}
        onUploadSuccess={() => {}} // Snapshot takes care of updates
      />
    </div>
  );
}
