/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Task, CategoryFilter, TabType } from './types';
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
import { Plus, CheckCircle2, ListFilter, CheckCircle, Clock } from 'lucide-react';

const LOCAL_STORAGE_KEY_TASKS = 'tdl_tasks_v3_clean';
const LOCAL_STORAGE_KEY_CATS = 'tdl_categories_v3_clean';

type TaskStatusFilter = 'semua' | 'aktif' | 'selesai';

export default function App() {
  // Always start with splash loading sequence as requested: "alur aplikasi selalu dari loading"
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Initial tasks state is ZERO (empty array) as requested: "buat aktifitas menjadi nol"
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to zero
    }
    return DEFAULT_TASKS; // []
  });

  // Categories list
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CATS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_CATEGORIES;
  });

  // Navigation & filter states
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Semua');
  // Simple feature from Ideate paper: Task Status Filter ('semua' | 'aktif' | 'selesai')
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('semua');

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

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CATS, JSON.stringify(categories));
    } catch {
      // Ignore
    }
  }, [categories]);

  // Handle task actions
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: 't-' + Date.now(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    // Track category in chips if new
    if (newTask.category && !categories.includes(newTask.category)) {
      setCategories((prev) => [...prev, newTask.category]);
    }
  };

  const handleAddNewCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      setCategories((prev) => [...prev, newCat]);
    }
  };

  // Filter tasks based on Category and Task Status (Ideate paper)
  const categoryFilteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeCategory !== 'Semua' && t.category !== activeCategory) {
        return false;
      }
      return true;
    });
  }, [tasks, activeCategory]);

  const displayedTasks = useMemo(() => {
    return categoryFilteredTasks.filter((t) => {
      if (statusFilter === 'aktif') return !t.completed;
      if (statusFilter === 'selesai') return t.completed;
      return true;
    });
  }, [categoryFilteredTasks, statusFilter]);

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
      {/* 1. Splash Screen recreation from Figma Loading 4 -> Loading 1 -> Loading 2 -> Loading 3 */}
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
                - Easily drawn in free Figma using basic auto-layout frame
              */}
              {tasks.length > 0 && (
                <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Progres Aktivitas</span>
                    <span className="text-slate-500 font-medium text-[11px]">
                      {stats.completed} dari {stats.total} selesai
                    </span>
                  </div>

                  {/* Progress bar line */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0284c7] to-[#f5b800] h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Segmented Task Status Filter (Ideate Paper) */}
                  <div className="grid grid-cols-3 gap-1 pt-1 bg-slate-50 p-1 rounded-lg border border-slate-200/60">
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
                </div>
              )}

              {/* Empty State matching Figma illustration when tasks count is 0 */}
              {tasks.length === 0 && (
                <EmptyState
                  category={activeCategory === 'Semua' ? 'aplikasi' : activeCategory}
                  onAddTask={() => setIsInputModalOpen(true)}
                />
              )}

              {/* Empty state for filtered status */}
              {tasks.length > 0 && displayedTasks.length === 0 && (
                <div className="text-center py-8 px-4 bg-white rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600">
                    Tidak ada aktivitas dengan status ini.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('semua')}
                    className="mt-2 text-xs text-[#0284c7] font-bold hover:underline"
                  >
                    Tampilkan Semua Status
                  </button>
                </div>
              )}

              {/* Active Tasks List */}
              {displayedTasks.length > 0 && (
                <div className="space-y-2">
                  {displayedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
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

      {/* Task Input Modal with pure string text box date input */}
      <TaskInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onAddTask={handleAddTask}
        availableCategories={categories}
        initialCategory={activeCategory === 'Semua' ? 'Kesehatan' : activeCategory}
        onAddNewCategory={handleAddNewCategory}
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
