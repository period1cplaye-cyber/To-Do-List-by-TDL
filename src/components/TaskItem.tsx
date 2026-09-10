import React, { useState } from 'react';
import { Task, PriorityLevel } from '../types';
import { CATEGORY_COLORS } from '../data/defaultTasks';
import {
  Check,
  Trash2,
  Calendar,
  Clock,
  Flag,
  Edit2,
  Copy,
  CheckCheck,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  onDuplicate?: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onUpdateTask,
  onDuplicate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [copied, setCopied] = useState(false);

  const categoryStyle = CATEGORY_COLORS[task.category] || {
    bg: 'bg-slate-100 text-slate-700',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  const handleCheck = () => {
    if (!task.completed) {
      // Fire subtle celebratory confetti
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#f5b800', '#0284c7', '#10b981'],
        disableForReducedMotion: true,
      });
    }
    onToggleComplete(task.id);
  };

  // Micro-feature: Cycle Priority on badge click
  const handleCyclePriority = () => {
    if (!onUpdateTask) return;
    const order: PriorityLevel[] = ['Tinggi', 'Sedang', 'Rendah'];
    const currentPriority = task.priority || 'Sedang';
    const nextIdx = (order.indexOf(currentPriority) + 1) % order.length;
    onUpdateTask(task.id, { priority: order[nextIdx] });
  };

  // Micro-feature: Quick Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard?.writeText(task.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Save inline edit
  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editTitle.trim()) return;
    onUpdateTask?.(task.id, {
      title: editTitle.trim(),
      dueDate: editDueDate.trim() || undefined,
    });
    setIsEditing(false);
  };

  // Cancel inline edit
  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const priorityStyle = (lvl?: PriorityLevel) => {
    switch (lvl) {
      case 'Tinggi':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-200',
          dot: 'bg-rose-500',
          label: 'Tinggi',
        };
      case 'Rendah':
        return {
          badge: 'bg-sky-50 text-sky-700 border-sky-300',
          dot: 'bg-sky-500',
          label: 'Rendah',
        };
      case 'Sedang':
      default:
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-300',
          dot: 'bg-amber-500',
          label: 'Sedang',
        };
    }
  };

  const prio = priorityStyle(task.priority);

  return (
    <div
      id={`task-item-${task.id}`}
      className={`group relative flex flex-col p-3 sm:p-3.5 rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 opacity-65'
          : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Checkbox */}
        <button
          id={`btn-check-${task.id}`}
          type="button"
          onClick={handleCheck}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 shrink-0 ${
            task.completed
              ? 'bg-[#0284c7] border-[#0284c7] text-white scale-95'
              : 'border-slate-300 hover:border-[#0284c7] bg-white'
          }`}
          aria-label={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
        >
          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* Task Content or Inline Edit Form */}
        <div className="flex-1 min-w-0 pr-1">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-2 py-0.5">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                placeholder="Nama tugas..."
                className="w-full text-xs font-semibold px-2.5 py-1.5 border border-sky-400 rounded-lg bg-sky-50/40 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  placeholder="Batas waktu teks (cth: Besok sore)..."
                  className="flex-1 text-[11px] px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#0284c7] text-white text-[11px] font-bold rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <>
              <p
                onDoubleClick={() => setIsEditing(true)}
                className={`text-xs sm:text-sm font-medium leading-snug transition-colors break-words cursor-text ${
                  task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {task.title}
              </p>

              {/* Metadata Chips (Category, Priority, Date) */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                {/* Category Pill */}
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold border ${categoryStyle.bg} ${categoryStyle.border}`}
                >
                  {task.category}
                </span>

                {/* Priority Level Badge (Ideate Paper) - Clickable micro-interaction */}
                <button
                  type="button"
                  onClick={handleCyclePriority}
                  title="Klik untuk ubah prioritas cepat"
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold border transition-transform active:scale-95 cursor-pointer ${prio.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
                  <Flag className="w-2.5 h-2.5" />
                  <span>{prio.label}</span>
                </button>

                {/* Due Date if any (Pure String) */}
                {task.dueDate && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {task.dueDate}
                  </span>
                )}

                {/* Due Time if any */}
                {task.dueTime && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {task.dueTime}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Micro Action Buttons (Edit, Duplicate, Copy, Delete) */}
        {!isEditing && (
          <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
            {/* Quick Copy Title */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title={copied ? 'Disalin ke clipboard!' : 'Salin nama tugas'}
            >
              {copied ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Quick Duplicate */}
            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(task)}
                className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                title="Gandakan tugas ini"
              >
                <span className="text-[10px] font-bold px-0.5">+1</span>
              </button>
            )}

            {/* Edit Title */}
            {onUpdateTask && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-md text-slate-400 hover:text-[#0284c7] hover:bg-slate-100 transition-colors"
                title="Edit tugas"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete button */}
            <button
              id={`btn-delete-${task.id}`}
              type="button"
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Hapus tugas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
