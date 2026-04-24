"use client";

import React from 'react';
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
  LayoutDashboard
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#1E293B] rounded-lg flex items-center justify-center transform rotate-45">
           <div className="w-4 h-4 bg-white/20 rounded-full" />
        </div>
        <span className="text-xl font-bold text-[#1E293B]">Notes Hub</span>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
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
          onClick={() => router.push('/dashboard/settings')}
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
  );
};

export default Sidebar;
