import React, { useState } from 'react';
import { CategoryType } from '../types';
import { LIMITED_CATEGORIES } from '../data/defaultTasks';
import { Check } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  availableCategories?: string[];
  onAddNewCategory?: (newCat: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
  const [tempCategory, setTempCategory] = useState<CategoryType>(selectedCategory || 'Kesehatan');

  if (!isOpen) return null;

  const handleSave = () => {
    onSelectCategory(tempCategory);
    onClose();
  };

  return (
    <div
      id="category-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="category-modal-card"
        className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Figma: "Kategori" */}
        <h2 className="text-base font-semibold text-slate-800 mb-6">
          Kategori
        </h2>

        {/* 
          Category Buttons matching Figma Image 3 layout:
          Row 1: [ Kesehatan ]     [ Kehidupan ]
          Row 2:       [ Olahraga ]
          Row 3: [ Pikiran ]       [ Berhenti ]
        */}
        <div className="space-y-4 mb-8">
          {/* Row 1: Kesehatan (left), Kehidupan (right) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              id="cat-btn-kesehatan"
              onClick={() => setTempCategory('Kesehatan')}
              className={`py-3 px-4 rounded-md text-xs sm:text-sm font-medium transition-all text-center relative ${
                tempCategory === 'Kesehatan'
                  ? 'bg-[#0284c7] text-white font-bold shadow-sm ring-2 ring-[#0284c7]/30'
                  : 'bg-[#d8d8d8] text-slate-800 hover:bg-[#cfcfcf]'
              }`}
            >
              <span>Kesehatan</span>
              {tempCategory === 'Kesehatan' && (
                <Check className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 stroke-[3]" />
              )}
            </button>

            <button
              type="button"
              id="cat-btn-kehidupan"
              onClick={() => setTempCategory('Kehidupan')}
              className={`py-3 px-4 rounded-md text-xs sm:text-sm font-medium transition-all text-center relative ${
                tempCategory === 'Kehidupan'
                  ? 'bg-[#0284c7] text-white font-bold shadow-sm ring-2 ring-[#0284c7]/30'
                  : 'bg-[#d8d8d8] text-slate-800 hover:bg-[#cfcfcf]'
              }`}
            >
              <span>Kehidupan</span>
              {tempCategory === 'Kehidupan' && (
                <Check className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 stroke-[3]" />
              )}
            </button>
          </div>

          {/* Row 2: Olahraga (centered) */}
          <div className="flex justify-center">
            <button
              type="button"
              id="cat-btn-olahraga"
              onClick={() => setTempCategory('Olahraga')}
              className={`w-1/2 py-3 px-4 rounded-md text-xs sm:text-sm font-medium transition-all text-center relative ${
                tempCategory === 'Olahraga'
                  ? 'bg-[#0284c7] text-white font-bold shadow-sm ring-2 ring-[#0284c7]/30'
                  : 'bg-[#d8d8d8] text-slate-800 hover:bg-[#cfcfcf]'
              }`}
            >
              <span>Olahraga</span>
              {tempCategory === 'Olahraga' && (
                <Check className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 stroke-[3]" />
              )}
            </button>
          </div>

          {/* Row 3: Pikiran (left), Berhenti (right) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              id="cat-btn-pikiran"
              onClick={() => setTempCategory('Pikiran')}
              className={`py-3 px-4 rounded-md text-xs sm:text-sm font-medium transition-all text-center relative ${
                tempCategory === 'Pikiran'
                  ? 'bg-[#0284c7] text-white font-bold shadow-sm ring-2 ring-[#0284c7]/30'
                  : 'bg-[#d8d8d8] text-slate-800 hover:bg-[#cfcfcf]'
              }`}
            >
              <span>Pikiran</span>
              {tempCategory === 'Pikiran' && (
                <Check className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 stroke-[3]" />
              )}
            </button>

            <button
              type="button"
              id="cat-btn-berhenti"
              onClick={() => setTempCategory('Berhenti')}
              className={`py-3 px-4 rounded-md text-xs sm:text-sm font-medium transition-all text-center relative ${
                tempCategory === 'Berhenti'
                  ? 'bg-[#0284c7] text-white font-bold shadow-sm ring-2 ring-[#0284c7]/30'
                  : 'bg-[#d8d8d8] text-slate-800 hover:bg-[#cfcfcf]'
              }`}
            >
              <span>Berhenti</span>
              {tempCategory === 'Berhenti' && (
                <Check className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 stroke-[3]" />
              )}
            </button>
          </div>
        </div>

        {/* Action buttons matching Figma: Batal, Selesai on bottom right */}
        <div className="flex items-center justify-end gap-6 pt-2">
          <button
            id="btn-cancel-category"
            type="button"
            onClick={onClose}
            className="text-sm font-normal text-slate-700 hover:text-slate-900 transition-colors"
          >
            Batal
          </button>
          <button
            id="btn-done-category"
            type="button"
            onClick={handleSave}
            className="text-sm font-medium text-slate-900 hover:text-[#0284c7] transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
