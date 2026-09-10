/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Task, CategoryFilter, TabType, SortOption } from './types';
import { DEFAULT_TASKS, INITIAL_CATEGORIES } from './data/defaultTasks';
import { SplashLoader } from './components/SplashLoader';
import { TopChips } from './components/TopChips';
import { TaskItem } from './components/TaskItem';
import { EmptyState } from './components/EmptyState';
import { TaskInputModal } from './components/TaskInputModal';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ProfileView } from './components/ProfileView';
import { SettingsModal } from './components/SettingsModal';
import { GuideModal } from './components/GuideModal';
import { FeedbackModal } from './components/FeedbackModal';
import {
  Plus,
  ArrowUpDown,
  Search,
  X,
  Flag,
  Clock,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';

const LOCAL_STORAGE_KEY_TASKS = 'tdl_tasks_v3_clean';
const LOCAL_STORAGE_KEY_CATS = 'tdl_categories_v3_clean';

type TaskStatusFilter = 'semua' | 'aktif' | 'selesai';

export default function App() {
  // Always start with splash loading sequence as requested
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Initial tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to zero
    }
    return DEFAULT_TASKS;
  });

  // Categories list: strictly only the categories available in task creation choices + 'Semua'
  const [categories] = useState<string[]>(INITIAL_CATEGORIES);

  // Navigation & filter states
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Semua');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('semua');

  // New Features: Sort by time / Priority Level & Micro Features
  const [sortBy, setSortBy] = useState<SortOption>('waktu-terbaru');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Modals & Drawers states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // Ignore
    }
  }, [tasks]);

  // Clean and sync categories to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CATS, JSON.stringify(INITIAL_CATEGORIES));
    } catch {
      // Ignore
    }
  }, []);

  // Handle task actions
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Micro-feature: Update Task (title, priority, date)
  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  // Micro-feature: Duplicate Task
  const handleDuplicateTask = (taskToDup: Task) => {
    const duplicated: Task = {
      ...taskToDup,
      id: 't-' + Date.now(),
      title: `${taskToDup.title} (Salinan)`,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTasks((prev) => [duplicated, ...prev]);
  };

  // Micro-feature: Clear All Completed Tasks
  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: 't-' + Date.now(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // 1. Filter tasks based on Category
  const categoryFilteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeCategory !== 'Semua' && t.category !== activeCategory) {
        return false;
      }
      return true;
    });
  }, [tasks, activeCategory]);

  // 2. Filter tasks based on Task Status ('semua' | 'aktif' | 'selesai')
  const statusFilteredTasks = useMemo(() => {
    return categoryFilteredTasks.filter((t) => {
      if (statusFilter === 'aktif') return !t.completed;
      if (statusFilter === 'selesai') return t.completed;
      return true;
    });
  }, [categoryFilteredTasks, statusFilter]);

  // 3. Search & Sort by time or Priority Level
  const displayedTasks = useMemo(() => {
    let result = [...statusFilteredTasks];

    // Search query filter (Micro feature)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.dueDate && t.dueDate.toLowerCase().includes(q))
      );
    }

    // Sort options: Waktu Terbaru, Waktu Terlama, Prioritas Tinggi
    if (sortBy === 'waktu-terbaru') {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'waktu-terlama') {
      result.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === 'prioritas-tinggi') {
      const priorityWeight: Record<string, number> = {
        Tinggi: 3,
        Sedang: 2,
        Rendah: 1,
      };
      result.sort((a, b) => {
        const weightA = priorityWeight[a.priority || 'Sedang'];
        const weightB = priorityWeight[b.priority || 'Sedang'];
        return weightB - weightA;
      });
    }

    return result;
  }, [statusFilteredTasks, searchQuery, sortBy]);

  const activeCount = useMemo(
    () => categoryFilteredTasks.filter((t) => !t.completed).length,
    [categoryFilteredTasks]
  );
  const completedCount = useMemo(
    () => categoryFilteredTasks.filter((t) => t.completed).length,
    [categoryFilteredTasks]
  );

  // Task counts per category for the Drag-to-Slide chips
  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: 0 };
    tasks.forEach((t) => {
      if (!t.completed) {
        counts.Semua += 1;
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#f4f0ec] font-sans text-slate-800 antialiased flex flex-col justify-between">
      {/* 1. Splash Screen recreation from Figma Loading */}
      {showSplash && (
        <SplashLoader onFinish={() => setShowSplash(false)} />
      )}

      {/* Main App Container: 390px mobile canvas, clean borders, easy to replicate in Figma */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#f4f0ec] flex flex-col relative pb-20 shadow-xs border-x border-slate-200/60">
        {/* Top Chips Bar with Drag-to-Slide feature (bukan scroll bar biasa) */}
        {currentTab === 'home' && (
          <header className="sticky top-0 z-20 bg-[#f4f0ec]/95 backdrop-blur-xs border-b border-slate-200/60 pt-2 pb-1">
            <TopChips
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              taskCounts={taskCounts}
              onOpenMenu={() => setIsSidebarOpen(true)}
            />
          </header>
        )}

        {/* User Screen Top Bar (when on user tab) */}
        {currentTab === 'user' && (
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="flex gap-0.5 mb-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#f5b800]" />
                  <span className="w-1 h-1 rounded-full bg-[#f5b800]" />
                </div>
                <span className="text-xl font-black text-[#f5b800] tracking-tight font-serif leading-none">
                  ṪDL
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800 ml-1">Profil Pengguna</span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentTab('home')}
              className="text-xs font-semibold text-[#0284c7] hover:underline"
            >
              Ke Beranda &rarr;
            </button>
          </header>
        )}

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto">
          {/* TAB 1: HOME (Task List) */}
          {currentTab === 'home' && (
            <div className="px-4 py-3 space-y-3">
              {/* 
                Simple Dashboard & Task Status Filter from Ideate Section of Paper:
                - Simple 3-segment filter: Semua / Belum Selesai / Selesai
                - Simple progress bar
                - Priority & Sort by time selector
                - Easily drawn in free Figma using basic auto-layout frame
              */}
              {tasks.length > 0 && (
                <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Progres Aktivitas</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium text-[11px]">
                        {stats.completed} dari {stats.total} selesai
                      </span>
                      {completedCount > 0 && (
                        <button
                          type="button"
                          onClick={handleClearCompleted}
                          className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold hover:underline flex items-center gap-0.5"
                          title="Hapus semua tugas yang telah selesai"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Bersihkan</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar line */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0284c7] to-[#f5b800] h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Segmented Task Status Filter (Ideate Paper) */}
                  <div className="grid grid-cols-3 gap-1 pt-0.5 bg-slate-50 p-1 rounded-lg border border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setStatusFilter('semua')}
                      className={`py-1 text-[11px] font-semibold rounded-md transition-all text-center ${
                        statusFilter === 'semua'
                          ? 'bg-white text-slate-800 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Semua ({categoryFilteredTasks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('aktif')}
                      className={`py-1 text-[11px] font-semibold rounded-md transition-all text-center ${
                        statusFilter === 'aktif'
                          ? 'bg-white text-[#0284c7] shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Aktif ({activeCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('selesai')}
                      className={`py-1 text-[11px] font-semibold rounded-md transition-all text-center ${
                        statusFilter === 'selesai'
                          ? 'bg-white text-emerald-600 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Selesai ({completedCount})
                    </button>
                  </div>

                  {/* Micro Toolbar: Sort by Time / Priority & Quick Search Toggle */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                    {/* Sort Selector: Waktu Terbaru, Waktu Terlama, Prioritas Tinggi */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        <span>Urut:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSortBy('waktu-terbaru')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                          sortBy === 'waktu-terbaru'
                            ? 'bg-sky-100 text-[#0284c7] font-bold border border-sky-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Urutkan dari waktu pembuatan paling baru"
                      >
                        <Clock className="w-2.5 h-2.5" />
                        <span>Terbaru</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy('waktu-terlama')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                          sortBy === 'waktu-terlama'
                            ? 'bg-sky-100 text-[#0284c7] font-bold border border-sky-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Urutkan dari waktu pembuatan paling lama"
                      >
                        <span>Terlama</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy('prioritas-tinggi')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                          sortBy === 'prioritas-tinggi'
                            ? 'bg-rose-100 text-rose-700 font-bold border border-rose-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Urutkan dari prioritas paling tinggi (Tinggi > Sedang > Rendah)"
                      >
                        <Flag className="w-2.5 h-2.5" />
                        <span>Prioritas</span>
                      </button>
                    </div>

                    {/* Micro Search Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen((prev) => !prev)}
                      className={`p-1 rounded-md text-slate-500 hover:text-slate-800 transition-colors ${
                        isSearchOpen || searchQuery ? 'bg-sky-100 text-[#0284c7]' : 'hover:bg-slate-100'
                      }`}
                      title="Pencarian cepat tugas"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Micro Search Input (Expandable) */}
                  {isSearchOpen && (
                    <div className="relative pt-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari tugas / kategori..."
                        autoFocus
                        className="w-full text-xs px-2.5 py-1.5 pl-7 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7] focus:bg-white"
                      />
                      <Search className="w-3 h-3 text-slate-400 absolute left-2 top-3" />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Empty State matching Figma illustration when tasks count is 0 */}
              {tasks.length === 0 && (
                <EmptyState
                  category={activeCategory === 'Semua' ? 'aplikasi' : activeCategory}
                  onAddTask={() => setIsInputModalOpen(true)}
                />
              )}

              {/* Empty state for filtered status or search query */}
              {tasks.length > 0 && displayedTasks.length === 0 && (
                <div className="text-center py-8 px-4 bg-white rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600">
                    {searchQuery
                      ? `Tidak ditemukan tugas dengan kata kunci "${searchQuery}".`
                      : 'Tidak ada aktivitas dengan status atau filter ini.'}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-2.5">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-[#0284c7] font-bold hover:underline"
                      >
                        Reset Pencarian
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter('semua');
                        setSearchQuery('');
                      }}
                      className="text-xs text-[#0284c7] font-bold hover:underline"
                    >
                      Tampilkan Semua
                    </button>
                  </div>
                </div>
              )}

              {/* Active Tasks List with Priority & Micro-features */}
              {displayedTasks.length > 0 && (
                <div className="space-y-2">
                  {displayedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onUpdateTask={handleUpdateTask}
                      onDuplicate={handleDuplicateTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USER / PROFILE VIEW (Demo Account) */}
          {currentTab === 'user' && (
            <ProfileView
              tasks={tasks}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
            />
          )}
        </main>

        {/* Floating Action Button (FAB) matching Figma's blue + button on the right */}
        {currentTab === 'home' && (
          <div className="fixed bottom-20 right-6 sm:right-auto sm:left-1/2 sm:translate-x-32 z-30">
            <button
              id="fab-add-task"
              type="button"
              onClick={() => setIsInputModalOpen(true)}
              className="w-14 h-14 rounded-full bg-[#0284c7] hover:bg-sky-700 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-sky-300"
              title="Tambah Tugas / Aktivitas Baru"
              aria-label="Tambah Tugas Baru"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={(tab) => setCurrentTab(tab)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
      </div>

      {/* Side Bar Drawer matching Figma */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        stats={stats}
      />

      {/* Task Input Modal with pure string text box date input and priority */}
      <TaskInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onAddTask={handleAddTask}
        availableCategories={categories}
        initialCategory={activeCategory === 'Semua' ? 'Kesehatan' : activeCategory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* User Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
