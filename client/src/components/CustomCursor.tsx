import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for outer ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device is touch-only
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [role="button"], .interactive-hover');
      const isCard = target.closest('.group, [data-cursor-text]');

      if (interactive) {
        setIsPointer(true);
        setHoverText(null);
      } else if (isCard) {
        setIsPointer(true);
        const customText = (target.closest('[data-cursor-text]') as HTMLElement)?.dataset.cursorText;
        setHoverText(customText || 'VIEW');
      } else {
        setIsPointer(false);
        setHoverText(null);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* 1. Outer Smooth Trailing Magnetic Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: smoothX,
          y: smoothY
        }}
      >
        <motion.div
          animate={{
            width: hoverText ? 76 : isPointer ? 48 : 34,
            height: hoverText ? 76 : isPointer ? 48 : 34,
            scale: isClicking ? 0.8 : 1,
            backgroundColor: hoverText
              ? 'rgba(89, 9, 7, 0.45)'
              : isPointer
              ? 'rgba(220, 165, 69, 0.15)'
              : 'rgba(232, 210, 181, 0.05)',
            borderColor: hoverText
              ? '#E8D2B5'
              : isPointer
              ? '#dca545'
              : 'rgba(232, 210, 181, 0.4)',
            boxShadow: isPointer
              ? '0 0 20px rgba(220, 165, 69, 0.35)'
              : '0 0 10px rgba(89, 9, 7, 0.2)'
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 350 }}
          className="rounded-full border backdrop-blur-[1px] flex items-center justify-center"
        >
          {hoverText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#E8D2B5] font-mono pointer-events-none select-none"
            >
              {hoverText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* 2. Inner Precise Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY
        }}
      >
        <motion.div
          animate={{
            scale: hoverText ? 0 : isClicking ? 0.6 : isPointer ? 1.4 : 1,
            opacity: hoverText ? 0 : 1,
            backgroundColor: isPointer ? '#dca545' : '#E8D2B5'
          }}
          transition={{ duration: 0.15 }}
          className="w-2 h-2 rounded-full shadow-md shadow-black"
        />
      </motion.div>
    </>
  );
};
