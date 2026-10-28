import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-[#E8D2B5] to-[#590907] origin-left z-50 shadow-md shadow-accent/20"
      style={{ scaleX }}
    />
  );
};

export const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    const unsubscribe = scrollYProgress.on('change', (v) => {
      setProgress(v);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle calculations
  const strokeDashoffset = 126 - (126 * progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="relative w-12 h-12 rounded-full bg-[#0e1620]/90 hover:bg-[#590907] border border-[#E8D2B5]/40 text-[#E8D2B5] flex items-center justify-center shadow-2xl backdrop-blur-md transition-all group transform hover:scale-110 active:scale-95"
          >
            {/* Circular Progress Stroke */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="20"
                className="text-white/10"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r="20"
                className="text-accent"
                strokeWidth="2.5"
                strokeDasharray="126"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>

            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
