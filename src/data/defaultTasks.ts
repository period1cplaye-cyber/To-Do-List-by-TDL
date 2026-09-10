import { Task } from '../types';

export const LIMITED_CATEGORIES = [
  'Kesehatan',
  'Kehidupan',
  'Olahraga',
  'Pikiran',
  'Berhenti',
] as const;

export const INITIAL_CATEGORIES = [
  'Semua',
  'Kesehatan',
  'Kehidupan',
  'Olahraga',
  'Pikiran',
  'Berhenti',
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Kesehatan: { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200' },
  Kehidupan: { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-700', border: 'border-purple-200' },
  Olahraga: { bg: 'bg-orange-50 text-orange-700', text: 'text-orange-700', border: 'border-orange-200' },
  Pikiran: { bg: 'bg-indigo-50 text-indigo-700', text: 'text-indigo-700', border: 'border-indigo-200' },
  Berhenti: { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700', border: 'border-rose-200' },
};

// Initial task list is set to ZERO (empty) as requested
export const DEFAULT_TASKS: Task[] = [];
