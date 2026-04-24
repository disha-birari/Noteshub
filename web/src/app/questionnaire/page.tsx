"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

import { ChevronRight, ChevronLeft, Check, ArrowRight } from 'lucide-react';
import BookLoader from '@/components/BookLoader';


const BRANCHES = [
  { id: 'cse', title: 'Computer Science Engineering', subtitle: 'CSE, IT, Software Engineering', icon: '💻' },
  { id: 'civil', title: 'Civil Engineering', subtitle: 'Structural, Environmental, Transport', icon: '🏗️' },
  { id: 'chemical', title: 'Chemical Engineering', subtitle: 'Bioprocess, Polymer, Petrochemical', icon: '⚗️' },
  { id: 'ee', title: 'Electrical Engineering', subtitle: 'Power, Electronics, Control Systems', icon: '⚡' },
  { id: 'me', title: 'Mechanical Engineering', subtitle: 'Thermal, Design, Manufacturing', icon: '⚙️' },
];

const SEMESTERS = [
  { id: '1', title: 'Semester 1', subtitle: 'Freshman Fall' },
  { id: '2', title: 'Semester 2', subtitle: 'Freshman Spring' },
  { id: '3', title: 'Semester 3', subtitle: 'Sophomore Fall' },
  { id: '4', title: 'Semester 4', subtitle: 'Sophomore Spring' },
  { id: '5', title: 'Semester 5', subtitle: 'Junior Fall' },
  { id: '6', title: 'Semester 6', subtitle: 'Junior Spring' },
  { id: '7', title: 'Semester 7', subtitle: 'Senior Fall' },
  { id: '8', title: 'Semester 8', subtitle: 'Senior Spring' },
];

const YEARS = [
  { id: '1', title: 'First Year', subtitle: 'Semesters 1 & 2', emoji: '🎓' },
  { id: '2', title: 'Second Year', subtitle: 'Semesters 3 & 4', emoji: '📚' },
  { id: '3', title: 'Third Year', subtitle: 'Semesters 5 & 6', emoji: '🚀' },
  { id: '4', title: 'Fourth Year', subtitle: 'Semesters 7 & 8', emoji: '🏆' },
];

export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBookLoader, setShowBookLoader] = useState(false);


  const router = useRouter();
  const { user } = useAuth();

  const handleNext = () => {
    if (step === 1 && !branch) return;
    if (step === 2 && !year) return;
    if (step === 3 && !semester) return;

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        branch,
        semester,
        year,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setShowBookLoader(true);
      
      // Keep loading true so the background UI doesn't flicker
      // and the button stays in "Saving..." state if visible
      
      // Show the animation for 3 seconds before redirecting
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error("Error saving questionnaire data:", error);
      alert("Failed to save data. Please check your Firestore security rules.");
      setLoading(false); // Only reset loading on error
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Enhanced Header */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E293B] rounded-lg flex items-center justify-center shadow-md">
              <div className="w-6 h-6 bg-white rounded" />
            </div>
            <span className="text-2xl font-bold text-[#1E293B]">NotesHub</span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <motion.div key={s} className="flex items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: step >= s ? 1 : 0.9,
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s
                      ? 'bg-[#1A2632] text-white shadow-lg'
                      : 'bg-[#E2E8F0] text-[#64748B]'
                      }`}
                  >
                    {step > s ? <Check size={16} /> : s}
                  </motion.div>
                  {s < 3 && (
                    <motion.div
                      initial={false}
                      animate={{
                        scaleX: step > s ? 1 : 0,
                        opacity: step > s ? 1 : 0.3,
                      }}
                      className="w-8 h-0.5 bg-[#1A2632] origin-left transition-all"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-sm font-semibold text-[#64748B] uppercase tracking-widest">
              Step {step}/3
            </div>
          </div>
        </div>
      </header>

      {/* Book Loader Overlay */}
      <AnimatePresence>
        {showBookLoader && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <BookLoader />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Main Content */}

      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-[#F1F5F9] shadow-lg p-8 md:p-12 min-h-[500px] flex flex-col"
          >
            {/* Step 1: Branch Selection */}
            {step === 1 && (
              <div className="flex flex-col gap-8 flex-1">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
                    Select your Engineering<br />Branch
                  </h1>
                  <p className="text-lg text-[#64748B] leading-relaxed">
                    Personalize your study materials and curriculum dashboard for your specialization.
                  </p>
                </div>

                <div className="flex-1 space-y-3">
                  <label className="text-sm font-bold text-[#334155] uppercase tracking-wide">Engineering Branch</label>
                  <div className="space-y-3">
                    {BRANCHES.map((b, idx) => (
                      <motion.button
                        key={b.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setBranch(b.id)}
                        className={`w-full p-5 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-102 text-left ${branch === b.id
                          ? 'border-[#197FE6] bg-blue-50 shadow-md'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm'
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${branch === b.id
                            ? 'bg-[#197FE6] bg-opacity-15 ring-2 ring-[#197FE6]'
                            : 'bg-[#F1F5F9]'
                            }`}>
                            {b.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#0F172A]">{b.title}</h3>
                            <p className="text-sm text-[#64748B] mt-1">{b.subtitle}</p>
                          </div>
                          {branch === b.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-[#197FE6] flex items-center justify-center text-white flex-shrink-0"
                            >
                              <Check size={14} />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Year Selection */}
            {step === 2 && (
              <div className="flex flex-col gap-8 flex-1">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
                    Select your Academic Year
                  </h1>
                  <p className="text-lg text-[#64748B] leading-relaxed">
                    This helps us tailor the curriculum and assign subjects that match your academic progression.
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {YEARS.map((y, idx) => (
                    <motion.button
                      key={y.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setYear(y.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 text-left flex items-center gap-4 ${year === y.id
                        ? 'bg-gradient-to-br from-[#1A2632] to-[#0F172A] border-[#1A2632] text-white shadow-lg'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                        }`}
                    >
                      <div className={`text-4xl flex-shrink-0 ${year === y.id ? 'opacity-100' : 'opacity-70'
                        }`}>
                        {y.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{y.title}</h3>
                        <p className={`text-sm mt-1 uppercase tracking-wide font-semibold ${year === y.id ? 'text-slate-300' : 'text-[#64748B]'
                          }`}>
                          {y.subtitle}
                        </p>
                      </div>
                      {year === y.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Semester Selection */}
            {step === 3 && (
              <div className="flex flex-col gap-8 flex-1">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
                    Select your Current Semester
                  </h1>
                  <p className="text-lg text-[#64748B] leading-relaxed">
                    We'll find notes matching your exact academic level and current subjects.
                  </p>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-bold text-[#334155] uppercase tracking-wide mb-4 block">
                    Current Semester
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SEMESTERS.map((s, idx) => (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSemester(s.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 text-center ${semester === s.id
                          ? 'bg-[#1A2632] border-[#1A2632] text-white shadow-lg'
                          : 'border-[#E2E8F0] bg-white hover:border-[#1A2632]'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 mx-auto transition-all ${semester === s.id
                          ? 'bg-white/20'
                          : 'bg-[#F1F5F9]'
                          }`}>
                          <div className={`w-5 h-5 rounded-sm ${semester === s.id ? 'bg-white' : 'bg-[#64748B]'
                            }`} />
                        </div>
                        <h3 className="font-bold text-sm">{s.title}</h3>
                        <p className={`text-xs mt-1 uppercase tracking-wide font-semibold ${semester === s.id ? 'text-slate-300' : 'text-[#64748B]'
                          }`}>
                          {s.subtitle}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-10 pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
              <motion.button
                whileHover={{ scale: step === 1 ? 1 : 1.02 }}
                whileTap={{ scale: step === 1 ? 1 : 0.98 }}
                onClick={handleBack}
                disabled={step === 1}
                className={`h-12 px-6 rounded-xl font-semibold flex items-center gap-2 transition-all ${step === 1
                  ? 'opacity-40 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]'
                  : 'bg-[#F1F5F9] text-[#1A2632] hover:bg-[#E2E8F0] shadow-sm'
                  }`}
              >
                <ChevronLeft size={18} />
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: !(loading || (step === 1 && !branch) || (step === 2 && !year) || (step === 3 && !semester)) ? 1.02 : 1 }}
                whileTap={{ scale: !(loading || (step === 1 && !branch) || (step === 2 && !year) || (step === 3 && !semester)) ? 0.98 : 1 }}
                onClick={handleNext}
                disabled={loading || (step === 1 && !branch) || (step === 2 && !year) || (step === 3 && !semester)}
                className="h-12 px-8 rounded-xl font-bold text-white bg-[#1A2632] hover:bg-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Saving...' : step === 3 ? 'Complete Setup' : 'Continue'}
                {!loading && <ArrowRight size={18} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 text-sm font-medium text-[#94A3B8]"
          >
            © 2026 NotesHub Inc. Built for students, by students.
          </motion.div>
        </div>
      </main>
    </div>
  );
}