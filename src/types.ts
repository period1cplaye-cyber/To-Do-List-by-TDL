export type CategoryType =
  | 'Kesehatan'
  | 'Kehidupan'
  | 'Olahraga'
  | 'Pikiran'
  | 'Berhenti';

export type PriorityLevel = 'Tinggi' | 'Sedang' | 'Rendah';

export interface Task {
  id: string;
  title: string;
  category: CategoryType;
  completed: boolean;
  createdAt: string;
  priority?: PriorityLevel;
  dueDate?: string; // e.g. YYYY-MM-DD or pure text string
  dueTime?: string; // e.g. HH:mm
  repeat?: 'Tidak ada' | 'Harian' | 'Mingguan' | 'Bulanan';
  isStarred?: boolean;
  description?: string;
}

export type SortOption = 'waktu-terbaru' | 'waktu-terlama' | 'prioritas-tinggi';

export type TabType = 'home' | 'user';

export type CategoryFilter = 'Semua' | CategoryType;

export interface UserStats {
  completedCount: number;
  totalCount: number;
  pendingCount: number;
  starredCount: number;
}
