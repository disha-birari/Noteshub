"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import { 
  Send, 
  Users, 
  ArrowLeft, 
  MoreVertical, 
  FileText, 
  Plus,
  Loader2,
  Info,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

function CircleChatContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();
  const router = useRouter();
  const [circle, setCircle] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!id || !user) return;

    // Fetch Circle Info
    const fetchCircle = async () => {
      const docRef = doc(db, 'circles', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCircle({ id: docSnap.id, ...docSnap.data() });
      } else {
        router.push('/dashboard/circles');
      }
    };
    fetchCircle();

    // Listen for messages
    const q = query(
      collection(db, 'circles', id as string, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      setMessages(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, user, router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !circle) return;

    const text = input;
    setInput('');

    try {
      await addDoc(collection(db, 'circles', circle.id, 'messages'), {
        text: text,
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        senderPhoto: user.photoURL,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading || !circle) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Chat Header */}
        <header className="p-4 lg:p-6 bg-white border-b border-[#E2E8F0] flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-3 lg:gap-4">
            <button 
              onClick={() => router.push('/dashboard/circles')}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
              {circle.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-[#1E293B] leading-tight">{circle.name}</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Users size={12} /> {circle.memberCount || 1} Members Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
              <Info size={20} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-6 bg-slate-50/50"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-16 h-16 bg-slate-200 rounded-3xl flex items-center justify-center mb-4">
                <MessageSquare size={32} />
              </div>
              <p className="font-bold">No messages yet. Be the first to start the discussion!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderId === user?.uid;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-1 shadow-sm border border-white">
                    <img src={msg.senderPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} alt="Avatar" />
                  </div>
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[60%]`}>
                    {!isMe && <span className="text-[10px] font-black text-slate-400 ml-1 mb-1 uppercase tracking-wider">{msg.senderName}</span>}
                    <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                      isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-white'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-1 mx-1">
                      {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000)) + ' ago' : 'Sending...'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 lg:p-6 bg-white border-t border-[#E2E8F0]">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
            <button 
              type="button"
              className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100"
            >
              <Plus size={20} />
            </button>
            <div className="flex-1 relative">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full h-12 pl-5 pr-14 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="absolute right-1 top-1 bottom-1 px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CircleChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    }>
      <CircleChatContent />
    </Suspense>
  );
}
