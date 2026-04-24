"use client";

import React from 'react';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter antialiased overflow-x-hidden w-full">
      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-[#1E293B] rounded-sm transform rotate-45 flex items-center justify-center">
               <div className="w-4 h-4 bg-white/20 rounded-full" />
            </div>
            <span className="text-[20px] font-bold text-[#1E293B] tracking-tight">Noteshub</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm font-semibold text-[#475569] hover:text-[#1E293B] transition-colors">Find Notes</a>
            <a href="#" className="text-sm font-semibold text-[#475569] hover:text-[#1E293B] transition-colors">Upload</a>
            <a href="#" className="text-sm font-semibold text-[#475569] hover:text-[#1E293B] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-[#1E293B] border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <Button 
                className="bg-[#1E293B] text-white text-sm font-bold h-10 px-5 rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                className="bg-primary text-white text-sm font-bold h-10 px-5 rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => router.push('/auth')}
              >
                Get Started Free
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6">
        {/* Hero Section */}
        <section className="py-16 md:py-32 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <h1 className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[72px] font-extrabold leading-[1.05] tracking-tight text-[#1E293B]">
              Find Your<br />Perfect Notes<br />with AI Power
            </h1>
            <p className="text-base md:text-[20px] text-[#64748B] leading-[1.5] max-w-[576px]">
              Stop scrolling through endless folders. Our AI matches you with study materials that fit your course syllabus and learning style perfectly.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Button 
                className="h-14 px-8 bg-[#1E293B] text-white text-base font-bold rounded-xl hover:bg-[#334155] transition-all"
                onClick={() => router.push(user ? '/dashboard' : '/auth')}
              >
                {user ? 'Go to Library' : 'Start Finding Notes'}
              </Button>
              <Button 
                variant="outline"
                className="h-14 px-8 bg-white text-[#1E293B] text-base font-bold rounded-xl border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white bg-[#E2E8F0]"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#64748B]">Join 25,000+ students sharing their best work</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Background Glows */}
            <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-100/50 blur-[40px] rounded-full -z-10" />
            <div className="absolute bottom-[-10px] left-[-40px] w-64 h-64 bg-slate-200/50 blur-[40px] rounded-full -z-10" />
            
            <div className="bg-white border border-[#F1F5F9] rounded-2xl shadow-[0px_20px_50px_rgba(0,0,0,0.05)] p-8">
              {/* AI Search Bar Mock */}
              <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-[#94A3B8] text-[20px]">search</span>
                <span className="text-sm font-medium text-[#94A3B8]">AI is finding notes for you...</span>
              </div>
              
              {/* Note Item 1 */}
              <div className="bg-white border border-[#F1F5F9] rounded-xl p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] mb-4">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold uppercase rounded-md tracking-wider">Biology 101</span>
                  <span className="text-xs text-[#CBD5E1]">PDF • 12mb</span>
                </div>
                <h3 className="font-bold text-[#1E293B] text-base mb-1">Cellular Respiration Notes</h3>
                <p className="text-xs text-[#94A3B8]">Key Diagrams • Handwritten Conversion</p>
              </div>
              
              {/* Note Item 2 */}
              <div className="bg-white border border-[#F1F5F9] rounded-xl p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-[#FAF5FF] text-[#9333EA] text-[10px] font-bold uppercase rounded-md tracking-wider">History</span>
                  <span className="text-xs text-[#CBD5E1]">DOCX • 5mb</span>
                </div>
                <h3 className="font-bold text-[#1E293B] text-base mb-1">Renaissance Art Review</h3>
                <p className="text-xs text-[#94A3B8]">Summary Sheet • Exam Focused</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Trusted Institutions */}
        <section className="py-20 border-t border-[#F1F5F9]">
          <div className="text-center mb-12">
            <h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[2.4px]">Trusted by students at leading institutions</h4>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <div className="text-2xl font-black text-[#1E293B]">STANFORD</div>
             <div className="text-2xl font-black text-[#1E293B]">MIT</div>
             <div className="text-2xl font-black text-[#1E293B]">HARVARD</div>
             <div className="text-2xl font-black text-[#1E293B]">OXFORD</div>
          </div>
        </section>

        {/* Smart-Scan Preview */}
        <section className="py-12 md:py-24 border-t border-[#F1F5F9] grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="flex gap-6 items-stretch">
             {/* Raw Input Mock */}
             <div className="flex-1 flex flex-col gap-4">
                <div className="aspect-[3/4] bg-white border border-[#F1F5F9] rounded-2xl shadow-sm overflow-hidden flex items-center justify-center p-4">
                   <div className="w-full h-full bg-[#F8FAFC] rounded-lg border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center opacity-50">
                      <span className="material-symbols-outlined text-[40px] text-[#94A3B8] mb-2">draw</span>
                      <span className="text-xs text-[#94A3B8] font-bold">RAW INK</span>
                   </div>
                </div>
                <div>
                   <h4 className="font-bold text-[#1E293B] text-base">Raw Input</h4>
                   <p className="text-sm text-[#94A3B8]">Handwritten Ink</p>
                </div>
             </div>
             
             {/* Smart Output Mock */}
             <div className="flex-1 flex flex-col gap-4 pt-12">
                <div className="aspect-[3/4] bg-white border border-[#DBEAFE] rounded-2xl shadow-xl overflow-hidden p-6 flex flex-col gap-3">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="h-3 bg-[#F8FAFC] rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                   ))}
                   <div className="my-4 h-24 bg-blue-50 border border-[#DBEAFE] rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#3B82F6] text-3xl">verified</span>
                   </div>
                   <div className="h-3 bg-[#F8FAFC] rounded-full w-[80%]" />
                </div>
                <div>
                   <h4 className="font-bold text-[#2563EB] text-base">Smart Output</h4>
                   <p className="text-sm text-[#94A3B8]">Searchable PDF</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-bold text-[#3B82F6] uppercase tracking-[1.4px]">AI Optimization</span>
            <h2 className="text-[28px] md:text-[48px] font-extrabold text-[#1E293B] leading-[1.1]">Smart-Scan Preview</h2>
            <p className="text-base md:text-[18px] text-[#64748B] leading-[1.6] mt-4">
              Say goodbye to messy handwriting. Our proprietary AI transforms your raw ink notes into searchable, organized, and beautifully formatted PDFs in seconds.
            </p>
            
            <div className="flex flex-col gap-5 mt-6">
               {[
                 "OCR-powered text recognition",
                 "Automatic diagram cleaning",
                 "Instant format normalization"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                       <span className="material-symbols-outlined text-[#2563EB] text-[14px] font-bold">check</span>
                    </div>
                    <span className="text-[#334155] font-medium text-base">{text}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Study Circles */}
        <section className="py-24 border-t border-[#F1F5F9]">
           <div className="text-center flex flex-col items-center gap-4 mb-16">
              <span className="text-[14px] font-bold text-[#3B82F6] uppercase tracking-[1.4px]">Collaboration</span>
               <h2 className="text-[28px] md:text-[48px] font-extrabold text-[#1E293B] leading-[1.1]">Study Circles</h2>
               <p className="text-base md:text-[18px] text-[#64748B] max-w-[672px] leading-[1.6] px-4 md:px-0">
                  Don't study alone. Join live collaborative rooms where students from your courses share real-time insights and materials.
               </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Organic Chemistry II", desc: "Final Exam Prep & Reaction Mechanisms discussion.", users: "+11", live: true },
                { title: "Macroeconomics 101", desc: "Weekly review: Supply & Demand Equilibrium charts.", users: "+24", live: true },
                { title: "Applied Physics", desc: "Quantum mechanics and particle physics notes sharing.", users: "+5", live: false }
              ].map((circle, i) => (
                <div key={i} className="bg-white border border-[#F1F5F9] rounded-2xl p-8 transition-all hover:shadow-xl hover:translate-y-[-4px]">
                   <div className="flex justify-between items-center mb-10">
                      {circle.live ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ECFDF5] text-[#059669] rounded-md text-[10px] font-bold uppercase tracking-wider">
                           <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                           Live
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] rounded-md text-[10px] font-bold uppercase tracking-wider">
                           Idle
                        </div>
                      )}
                      
                      <div className="flex -space-x-3">
                         <div className="w-9 h-9 border-2 border-white rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-white order-last z-10">
                            {circle.users}
                         </div>
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + circle.title}`} className="w-9 h-9 border-2 border-white rounded-full bg-slate-100" />
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 99}`} className="w-9 h-9 border-2 border-white rounded-full bg-slate-100" />
                      </div>
                   </div>
                   
                   <h3 className="text-[20px] font-bold text-[#1E293B] mb-4">{circle.title}</h3>
                   <p className="text-sm text-[#64748B] leading-[1.6] mb-8">{circle.desc}</p>
                   
                   <Button className="w-full h-12 bg-[#F8FAFC] text-[#334155] font-bold text-sm border-none hover:bg-[#F1F5F9] transition-all">
                      Join Circle
                   </Button>
                </div>
              ))}
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
           <div className="bg-[#1E293B] rounded-[24px] md:rounded-[40px] py-12 px-6 md:py-24 md:px-12 text-center text-white relative shadow-2xl overflow-hidden">
              {/* Decorative Glows */}
              <div className="absolute top-[-300px] right-[-300px] w-[600px] h-[600px] bg-white/5 blur-[60px] rounded-full -z-0" />
              <div className="absolute bottom-[-200px] left-[-200px] w-[400px] h-[400px] bg-blue-400/10 blur-[50px] rounded-full -z-0" />
              
              <div className="relative z-10 flex flex-col items-center gap-8">
                 <h2 className="text-[28px] md:text-[44px] lg:text-[60px] font-extrabold leading-[1.1]">Ready to boost your grades?</h2>
                 <p className="text-base md:text-[20px] text-[#CBD5E1] font-medium max-w-[672px] leading-[1.5]">
                    Join over 500,000 students already using Noteshub to simplify their academic journey.
                 </p>
                  <div className="flex flex-wrap justify-center gap-5 mt-4">
                    <Button 
                      className="h-16 px-10 bg-white text-[#1E293B] text-[18px] font-bold rounded-2xl hover:bg-[#F8FAFC] shadow-lg transition-all"
                      onClick={() => router.push('/auth')}
                    >
                       Create Free Account
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 px-10 bg-transparent border-2 border-white/20 text-white text-[18px] font-bold rounded-2xl hover:bg-white/10 transition-all"
                      onClick={() => router.push('/marketplace')}
                    >
                       Browse Marketplace
                    </Button>
                  </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] pt-20 pb-20 mt-12">
        <div className="max-w-[1200px] mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
              <div className="flex flex-col gap-6 scale-95 origin-top-left">
                 <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#1E293B] transform rotate-45 flex items-center justify-center">
                       <div className="w-3.5 h-3.5 bg-white/20 rounded-full" />
                    </div>
                    <span className="text-[20px] font-bold text-[#1E293B]">Noteshub</span>
                 </div>
                 <p className="text-sm text-[#64748B] leading-[1.6] max-w-[320px]">
                    The premium destination for students to share, find, and master their course materials with AI-powered tools.
                 </p>
                 <div className="flex gap-4 pt-4">
                    <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center cursor-pointer hover:bg-white transition-all">
                       <span className="material-symbols-outlined text-[#94A3B8]">share</span>
                    </div>
                    <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center cursor-pointer hover:bg-white transition-all">
                       <span className="material-symbols-outlined text-[#94A3B8]">alternate_email</span>
                    </div>
                 </div>
              </div>
              
              {[
                { title: "Product", links: ["Search", "Study Circles", "AI Scan", "Marketplace"] },
                { title: "Company", links: ["About Us", "Careers", "Blog", "Privacy"] },
                { title: "Support", links: ["Help Center", "Guidelines", "Terms"] }
              ].map((group, i) => (
                <div key={i} className="flex flex-col gap-6">
                   <h5 className="font-bold text-[#1E293B] text-base">{group.title}</h5>
                   <div className="flex flex-col gap-4">
                      {group.links.map((link) => (
                        <a key={link} href="#" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">{link}</a>
                      ))}
                   </div>
                </div>
              ))}
           </div>
           
           <div className="pt-8 border-t border-[#F1F5F9] flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[12px] font-semibold text-[#94A3B8]">© 2026 Noteshub Inc. Built for students, by students.</p>
              <div className="flex gap-8">
                 <a href="#" className="text-[12px] font-semibold text-[#94A3B8] hover:text-[#1E293B]">Status</a>
                 <a href="#" className="text-[12px] font-semibold text-[#94A3B8] hover:text-[#1E293B]">Cookie Policy</a>
                 <a href="#" className="text-[12px] font-semibold text-[#94A3B8] hover:text-[#1E293B]">Security</a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
