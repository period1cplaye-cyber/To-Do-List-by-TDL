import React, { useRef, useState, useEffect } from 'react';
import { CategoryFilter } from '../types';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

interface TopChipsProps {
  categories: string[];
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  taskCounts?: Record<string, number>;
  onOpenMenu?: () => void;
}

export const TopChips: React.FC<TopChipsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  taskCounts = {},
  onOpenMenu,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to update arrow indicators
  const updateScrollIndicators = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    updateScrollIndicators();
    window.addEventListener('resize', updateScrollIndicators);
    return () => window.removeEventListener('resize', updateScrollIndicators);
  }, [categories]);

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(x - startX));
    updateScrollIndicators();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Click on chip: only select if user wasn't dragging
  const handleChipClick = (cat: CategoryFilter) => {
    if (dragDistance > 5) {
      // User was dragging to slide, do not change category
      return;
    }
    onSelectCategory(cat);
  };

  // Scroll buttons for desktop/touch accessibility
  const slide = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const offset = direction === 'left' ? -150 : 150;
    containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(updateScrollIndicators, 200);
  };

  return (
    <div className="w-full flex items-center justify-between gap-1.5 px-3 py-2.5 bg-transparent select-none">
      {/* Left scroll hint arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => slide('left')}
          className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors shrink-0"
          aria-label="Geser ke kiri"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Drag-to-slide container matching Figma auto-layout */}
      <div
        ref={containerRef}
        id="category-drag-slider"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onScroll={updateScrollIndicators}
        className={`flex-1 overflow-x-auto no-scrollbar py-1 transition-all ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollBehavior: isDragging ? 'auto' : 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex items-center gap-2 min-w-max px-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = taskCounts[cat] ?? 0;

            return (
              <button
                key={cat}
                id={`tab-chip-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleChipClick(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap active:scale-95 shadow-xs ${
                  isActive
                    ? 'bg-[#f5b800] text-slate-900 font-bold ring-2 ring-yellow-400/40'
                    : 'bg-[#0284c7] text-white hover:bg-sky-700'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center text-[10px] min-w-4 h-4 px-1 rounded-full font-bold ${
                      isActive ? 'bg-slate-900 text-yellow-300' : 'bg-sky-950 text-sky-100'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right scroll hint arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => slide('right')}
          className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors shrink-0"
          aria-label="Geser ke kanan"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* 3-dots icon matching Figma on far right */}
      {onOpenMenu && (
        <button
          id="btn-top-menu"
          type="button"
          onClick={onOpenMenu}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-full transition-colors shrink-0"
          title="Opsi Lanjutan"
        >
          <MoreVertical className="w-5 h-5 stroke-[2.2]" />
        </button>
      )}
    </div>
  );
};
