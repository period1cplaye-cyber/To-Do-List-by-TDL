import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashLoaderProps {
  onFinish: () => void;
  autoPlay?: boolean;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onFinish, autoPlay = true }) => {
  // 4 steps as shown in Figma: Loading 4 -> Loading 1 -> Loading 2 -> Loading 3 (10% -> 35% -> 70% -> 100%)
  const [progress, setProgress] = useState(15);
  const [stepLabel, setStepLabel] = useState('Memulai sistem...');

  useEffect(() => {
    if (!autoPlay) return;

    const t1 = setTimeout(() => {
      setProgress(40);
      setStepLabel('Menyiapkan daftar tugas...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(75);
      setStepLabel('Sinkronisasi data aktivitas...');
    }, 850);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStepLabel('Siap digunakan!');
    }, 1300);

    const t4 = setTimeout(() => {
      onFinish();
    }, 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [autoPlay, onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        id="splash-loader-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0284c7] text-white px-6 select-none"
      >
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          {/* Logo matching Figma: ṪDL with yellow font and dots */}
          <motion.div
            initial={{ scale: 0.85, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center mb-10"
          >
            <div className="relative inline-block">
              {/* Yellow dots above T */}
              <div className="flex justify-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f5b800] shadow-sm animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f5b800] shadow-sm animate-pulse" style={{ animationDelay: '150ms' }} />
              </div>
              <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#f5b800] drop-shadow-md font-serif">
                ṪDL
              </h1>
            </div>
            <p className="mt-2 text-sky-100 text-sm tracking-wide font-medium">
              To-Do List & Task Planner
            </p>
          </motion.div>

          {/* Progress Bar matching Figma */}
          <div className="w-full bg-sky-950/40 rounded-full h-3.5 p-0.5 mb-4 shadow-inner overflow-hidden border border-sky-400/30">
            <motion.div
              className="h-full bg-[#f5b800] rounded-full shadow-sm"
              initial={{ width: '15%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>

          <div className="flex justify-between items-center w-full px-1 text-xs text-sky-200">
            <span className="font-medium">{stepLabel}</span>
            <span className="font-semibold text-yellow-300">{progress}%</span>
          </div>

          {/* Skip button for quick user interaction */}
          <button
            id="btn-skip-loading"
            type="button"
            onClick={onFinish}
            className="mt-8 px-4 py-1.5 text-xs font-medium text-sky-200 hover:text-white bg-sky-800/40 hover:bg-sky-800/80 rounded-full transition-colors border border-sky-400/20"
          >
            Lewati Animasi &rarr;
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
