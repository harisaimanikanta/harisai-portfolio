import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor({ cursorState = { text: '', active: false } }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  const isExpanded = cursorState.active || Boolean(cursorState.text);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center font-satoshi font-semibold tracking-wider text-[11px] uppercase transition-colors"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: isExpanded ? 1 : 0.45,
        width: isExpanded ? (cursorState.text ? 72 : 44) : 24,
        height: isExpanded ? (cursorState.text ? 72 : 44) : 24,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className={`w-full h-full rounded-full flex items-center justify-center border shadow-sm transition-all duration-200 ${
        isExpanded
          ? 'bg-black text-white border-black'
          : 'bg-black/90 text-transparent border-black'
      }`}>
        {cursorState.text && (
          <span className="text-[10px] tracking-widest font-bold">
            {cursorState.text}
          </span>
        )}
      </div>
    </motion.div>
  );
}
