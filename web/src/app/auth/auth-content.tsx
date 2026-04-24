"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AuthContentProps {
  initialMode?: 'login' | 'signup';
}

export default function AuthContent({ initialMode = 'login' }: AuthContentProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Sync mode if initialMode changes
  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Set persistence based on "Remember Me"
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      }
      router.push('/questionnaire');
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/invalid-api-key' || err.code === 'auth/network-request-failed') {
        setError("Firebase configuration error. Please ensure you have replaced the placeholder API keys in .env.local with your real project keys.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/questionnaire');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 font-inter overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 max-w-[1280px] h-full mx-auto pointer-events-none" />
      
      <div className="w-full max-w-[440px] flex flex-col gap-10 relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-[#1E293B] shadow-sm rounded-lg flex items-center justify-center transform rotate-45">
             <div className="w-5 h-5 bg-white/20 rounded-full" />
          </div>
          <h1 className="text-[24px] font-bold text-[#1E293B]">Notes Hub</h1>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-[#F1F5F9] p-12 shadow-[0px_8px_10px_-6px_rgba(226,232,240,0.50),0px_20px_25px_-5px_rgba(226,232,240,0.50)]">
          <div className="flex flex-col gap-3 mb-8">
            <h2 className="text-[30px] font-black text-[#1E293B] tracking-tight leading-tight">
              {isLogin ? 'Welcome to Notes Hub' : 'Create an Account'}
            </h2>
            <p className="text-base text-[#64748B]">Please enter your details</p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-md border border-red-100 whitespace-pre-wrap">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 text-green-600 text-xs font-semibold rounded-md border border-green-100 whitespace-pre-wrap">
                {success}
              </div>
            )}

            {/* Name Field (Signup only) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-2 overflow-hidden"
                >
                  <label className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[1.2px]">Full Name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-white border border-[#E2E8F0] rounded-lg text-base text-[#1E293B] placeholder-[#CBD5E1] outline-none focus:border-[#1E293B] transition-all"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">person</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[1.2px]">Email address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="name@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#E2E8F0] rounded-lg text-base text-[#1E293B] placeholder-[#CBD5E1] outline-none focus:border-[#1E293B] transition-all"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">mail</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[1.2px]">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 bg-white border border-[#E2E8F0] rounded-lg text-base text-[#1E293B] placeholder-[#CBD5E1] outline-none focus:border-[#1E293B] transition-all"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">lock</span>
                <span 
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer hover:text-[#475569] select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>

            {/* Extra Options */}
            <div className="flex items-center justify-between py-1">
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                  rememberMe ? 'bg-[#1E293B] border-[#1E293B]' : 'border-[#CBD5E1] bg-white group-hover:border-[#94A3B8]'
                }`}>
                   {rememberMe && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
                </div>
                <span className="text-sm text-[#475569]">Remember for 30 days</span>
              </div>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm font-semibold text-[#197FE6] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1E293B] text-white text-base font-bold rounded-lg shadow-md hover:bg-[#334155] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
            </Button>

            {/* Divider */}
            <div className="flex items-center py-2">
              <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
              <span className="px-4 text-[12px] font-bold text-[#94A3B8] uppercase tracking-[1.2px]">Or continue with</span>
              <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
            </div>

            {/* Google Sign In */}
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-14 bg-white border border-[#E2E8F0] rounded-lg flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-base font-bold text-[#334155]">Sign in with Google</span>
            </button>
          </form>
        </div>

        {/* Toggle Login/Signup */}
        <div className="flex items-center justify-center gap-1.5 py-4">
           <span className="text-base text-[#64748B]">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
           <button 
             onClick={() => {
               setIsLogin(!isLogin);
               setError('');
             }}
             className="text-base font-bold text-[#197FE6] hover:underline"
           >
             {isLogin ? 'Sign up' : 'Sign in'}
           </button>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-6 mt-4 opacity-50">
           <a href="#" className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[1px] hover:text-[#475569]">Privacy Policy</a>
           <a href="#" className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[1px] hover:text-[#475569]">Terms of Service</a>
           <a href="#" className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[1px] hover:text-[#475569]">Support</a>
        </div>
      </div>
    </div>
  );
}
