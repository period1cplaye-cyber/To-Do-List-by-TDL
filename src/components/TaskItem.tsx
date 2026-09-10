import React from 'react';
import { Task } from '../types';
import { CATEGORY_COLORS } from '../data/defaultTasks';
import { Check, Trash2, Calendar, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
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

  return (
    <div
      id={`task-item-${task.id}`}
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 opacity-65'
          : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
      }`}
    >
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

      {/* Task Content */}
      <div className="flex-1 min-w-0 pr-1">
        <p
          className={`text-xs sm:text-sm font-medium leading-snug transition-colors break-words ${
            task.completed ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        >
          {task.title}
        </p>

        {/* Metadata Chips */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
          {/* Category Pill */}
          <span
            className={`px-2 py-0.5 rounded-md font-semibold border ${categoryStyle.bg} ${categoryStyle.border}`}
          >
            {task.category}
          </span>

          {/* Due Date if any */}
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
      </div>

      {/* Delete Action button */}
      <div className="flex items-center shrink-0 pt-0.5">
        <button
          id={`btn-delete-${task.id}`}
          type="button"
          onClick={() => onDelete(task.id)}
          className="p-1 rounded-md text-slate-300 hover:text-rose-600 transition-colors opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
          title="Hapus tugas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
