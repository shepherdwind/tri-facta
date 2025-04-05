import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Fireworks } from './Fireworks';

export const VictoryCrown: React.FC = () => {
  const crownRef = useRef<HTMLDivElement>(null);
  const [playerNamePosition, setPlayerNamePosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  useEffect(() => {
    // 获取皇冠元素的位置，这通常是玩家名字的位置
    if (crownRef.current) {
      const rect = crownRef.current.getBoundingClientRect();
      setPlayerNamePosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  return (
    <>
      <Fireworks playerNamePosition={playerNamePosition} />
      <motion.div
        ref={crownRef}
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        style={{ left: 'calc(50% - 20px)' }}
      >
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            className="w-10 h-10 text-yellow-400"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 16L3 3L8.5 12L12 5L15.5 12L21 3L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
};
