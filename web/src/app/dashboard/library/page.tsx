"use client";

import { useState, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Loader2, Plus, TrendingUp, FileText, ExternalLink, Trash2, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadNoteModal from '@/components/UploadNoteModal';
import Sidebar from '@/components/Sidebar';
import { Target, Calendar, Award } from 'lucide-react';

export default function LibraryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [myNotes, setMyNotes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Mock Study Stats
  const studyStats = [
    { label: 'Courses Completed', value: 4, total: 6, icon: Award, color: 'bg-green-500' },
    { label: 'Weekly Study Goal', value: 12, total: 20, icon: Target, color: 'bg-blue-500' },
  ];

  const upcomingExams = [
    { subject: 'Data Structures', date: 'May 15', daysLeft: 20 },
    { subject: 'Engineering Maths', date: 'May 18', daysLeft: 23 },
  ];

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
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#1E293B]">Library & Tracking</h1>
            <p className="text-[#64748B] font-medium mt-1">Monitor your academic progress and manage materials</p>
          </div>
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-[#1E293B] text-white rounded-xl px-6 h-12 font-bold flex items-center gap-2 hover:bg-black shadow-lg transition-all"
          >
            <Plus size={20} />
            Upload Note
          </Button>
        </header>

        {/* Study Progress Section */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="col-span-2 bg-white p-8 rounded-3xl border border-[#F1F5F9] shadow-sm">
            <h2 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Study Progress
            </h2>
            <div className="grid grid-cols-2 gap-8">
              {studyStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-600">{stat.label}</span>
                    <span className="text-sm font-black text-slate-900">{stat.value}/{stat.total}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                      className={`h-full ${stat.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-blue-400" />
              Exam Timeline
            </h2>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.subject} className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                  <div>
                    <p className="text-xs font-bold text-white/60 uppercase">{exam.date}</p>
                    <p className="font-bold text-sm">{exam.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black">{exam.daysLeft}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase">Days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Notes List */}
        <h2 className="text-xl font-bold text-[#1E293B] mb-6">My Uploaded Notes</h2>
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
                      <span>Sem {note.semester}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.open(note.url, '_blank')}
                    className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <ExternalLink size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                <Folder size={32} />
              </div>
              <p className="text-slate-500 font-bold">No notes uploaded yet.</p>
            </div>
          )}
        </div>
      </main>

      <UploadNoteModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        userData={userData}
        onUploadSuccess={() => {}}
      />
    </div>
  );
}

