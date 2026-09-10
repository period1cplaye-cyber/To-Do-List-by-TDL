import React from 'react';
import { TabType } from '../types';
import { AlignJustify, BookOpen, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenSidebar: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  onOpenSidebar,
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-md py-2.5 px-6"
    >
      <div className="max-w-md mx-auto flex items-center justify-between px-4 sm:px-8">
        {/* 
          1. Side Bar Trigger Icon (first icon on the left, matching Figma's ≡ icon with arrow pointing to Side Bar)
        */}
        <button
          id="nav-bottom-sidebar-trigger"
          type="button"
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center"
          title="Buka Menu Samping"
          aria-label="Buka Menu Samping"
        >
          <AlignJustify className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 
          2. Home / Tugas (Center notebook icon, with yellow highlight card when active as in Figma "Home semua")
        */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onChangeTab('home')}
          className={`px-4 py-1.5 rounded-lg transition-all flex items-center justify-center active:scale-95 ${
            currentTab === 'home'
              ? 'bg-[#fef08a] border border-[#f5b800]/60 text-slate-900 shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Daftar Tugas (Home)"
          aria-label="Daftar Tugas"
        >
          <BookOpen className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 
          3. User / Profil (Right icon, with yellow highlight card when active as in Figma "User")
        */}
        <button
          id="nav-tab-user"
          type="button"
          onClick={() => onChangeTab('user')}
          className={`px-4 py-1.5 rounded-lg transition-all flex items-center justify-center active:scale-95 ${
            currentTab === 'user'
              ? 'bg-[#fef08a] border border-[#f5b800]/60 text-slate-900 shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Profil Pengguna"
          aria-label="Profil Pengguna"
        >
          <User className="w-6 h-6 stroke-[2]" />
        </button>
      </div>
    </nav>
  );
};
