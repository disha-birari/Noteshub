"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FileText, 
  Folder, 
  LogOut,
  Sparkles,
  Clock,
  Settings,
  Bookmark,
  TrendingUp,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: 'For You', icon: Sparkles, path: '/dashboard' },
    { name: 'My Library', icon: Folder, path: '/dashboard/library' },
    { name: 'Saved Notes', icon: Bookmark, path: '/dashboard/saved' },
    { name: 'AI Assistant', icon: LayoutDashboard, path: '/dashboard/ai' },
    { name: 'Study Circles', icon: TrendingUp, path: '/dashboard/circles' },
    { name: 'Activity', icon: Clock, path: '/dashboard/activity' },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#1E293B] shadow-sm"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-[#E2E8F0] flex flex-col fixed h-full z-50
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1E293B] rounded-lg flex items-center justify-center transform rotate-45">
               <div className="w-4 h-4 bg-white/20 rounded-full" />
            </div>
            <span className="text-xl font-bold text-[#1E293B]">Notes Hub</span>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-[#94A3B8] hover:text-[#1E293B] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                  ? 'bg-[#1E293B] text-white shadow-lg shadow-slate-200' 
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#F1F5F9] flex flex-col gap-2">
          <button 
            onClick={() => handleNavigate('/dashboard/settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/dashboard/settings' 
              ? 'bg-[#1E293B] text-white' 
              : 'text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
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
    </>
  );
};

export default Sidebar;
