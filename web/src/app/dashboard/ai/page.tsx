"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, BookOpen, Trash2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { chatWithAI } from '@/lib/gemini';
import { useAuth } from '@/hooks/useAuth';

export default function AIPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ role: string; parts: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', parts: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAI(messages, input);
      setMessages(prev => [...prev, { role: 'model', parts: response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', parts: "I'm sorry, I encountered an error. Please make sure your Gemini API key is configured correctly." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="p-6 bg-white border-b border-[#E2E8F0] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1E293B]">AI Study Assistant</h1>
              <p className="text-xs text-[#64748B] font-medium">Powered by Gemini 1.5 Flash</p>

            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="p-2 text-[#94A3B8] hover:text-red-500 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
        </header>

        {/* Chat Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center animate-bounce">
                <Bot size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1E293B]">Hello {user?.displayName?.split(' ')[0] || 'Student'}!</h2>
                <p className="text-[#64748B] mt-2 font-medium">
                  I'm your AI tutor. I can help you summarize notes, explain complex topics, or help you prepare for exams.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 w-full">
                {[
                  "Explain Quantum Physics simply",
                  "Summarize my recent OS notes",
                  "Create a study plan for Finals"
                ].map(prompt => (
                  <button 
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="p-4 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-[#1E293B] hover:border-indigo-400 hover:shadow-md transition-all text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-[#1E293B] text-white' : 'bg-white text-indigo-600 border border-indigo-100'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[70%] p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-[#1E293B] rounded-tl-none border border-slate-100'
                }`}>
                  {msg.parts}
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-indigo-500" size={16} />
                <span className="text-sm font-bold text-indigo-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-white border-t border-[#E2E8F0]">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your studies..."
              className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 bg-[#1E293B] text-white rounded-xl font-bold flex items-center justify-center hover:bg-black transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[10px] text-[#94A3B8] font-bold mt-4 tracking-widest uppercase">
            AI can make mistakes. Verify important academic information.
          </p>
        </div>
      </main>
    </div>
  );
}
