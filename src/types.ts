export type CategoryType =
  | 'Kesehatan'
  | 'Kehidupan'
  | 'Olahraga'
  | 'Pikiran'
  | 'Berhenti'
  | 'Kerja'
  | 'Wishlist'
  | string;

export interface Task {
  id: string;
  title: string;
  category: CategoryType;
  completed: boolean;
  createdAt: string;
  dueDate?: string; // e.g. YYYY-MM-DD
  dueTime?: string; // e.g. HH:mm
  repeat?: 'Tidak ada' | 'Harian' | 'Mingguan' | 'Bulanan';
  isStarred?: boolean;
  description?: string;
}

export type TabType = 'home' | 'user';

export type CategoryFilter = 'Semua' | CategoryType;

export interface UserStats {
  completedCount: number;
  totalCount: number;
  pendingCount: number;
  starredCount: number;
}
