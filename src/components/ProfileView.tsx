import React from 'react';
import { Task } from '../types';
import { CATEGORY_COLORS } from '../data/defaultTasks';
import { Award, CheckCircle, Clock, ShieldCheck, Mail, ListTodo } from 'lucide-react';

interface ProfileViewProps {
  tasks: Task[];
  onOpenFeedback: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  tasks,
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Category breakdown
  const categoryStats: Record<string, { total: number; completed: number }> = {};
  tasks.forEach((t) => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = { total: 0, completed: 0 };
    }
    categoryStats[t.category].total += 1;
    if (t.completed) categoryStats[t.category].completed += 1;
  });

  return (
    <div id="profile-view-container" className="max-w-xl mx-auto px-4 py-4 space-y-4 pb-20">
      {/* Profile Header Card matching Figma wireframe: Demo Account */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#f5b800] p-1 flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sm font-black text-[#0284c7]">
              DEMO
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight uppercase truncate">
              Akun Demo
            </h2>
            <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <Mail className="w-3 h-3" />
            <span className="truncate">demo@tdl.app</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              AKUN DEMO
            </span>
            <span className="text-[11px] text-slate-400">
              Mode Pratinjau
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards (Total, Selesai, Tertunda - no star) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Total Tasks */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284c7] flex items-center justify-center mx-auto mb-1.5">
            <ListTodo className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-800">{total}</div>
          <div className="text-[11px] font-medium text-slate-500">Total</div>
        </div>

        {/* Completed */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-800">{completed}</div>
          <div className="text-[11px] font-medium text-slate-500">Selesai</div>
        </div>

        {/* Pending */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1.5">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-800">{pending}</div>
          <div className="text-[11px] font-medium text-slate-500">Tertunda</div>
        </div>
      </div>

      {/* Big Card: Overall Productivity & Category Breakdown matching Figma */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#f5b800]" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">Tingkat Penyelesaian</h3>
          </div>
          <span className="text-xs font-bold text-[#0284c7]">{completionRate}% Selesai</span>
        </div>

        {/* Main Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-[#0284c7] to-[#f5b800] h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        {/* Category breakdown */}
        {Object.keys(categoryStats).length > 0 ? (
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-600 mb-3">Distribusi Kategori Aktivitas:</h4>
            <div className="space-y-2.5">
              {Object.entries(categoryStats).map(([catName, s]) => {
                const catPercent = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{catName}</span>
                      <span className="text-slate-500">
                        {s.completed}/{s.total} ({catPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          catPercent === 100 ? 'bg-emerald-500' : 'bg-[#0284c7]'
                        }`}
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-2">
            Belum ada aktivitas yang dicatat.
          </p>
        )}
      </div>
    </div>
  );
};
