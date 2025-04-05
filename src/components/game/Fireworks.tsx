import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FireworksProps {
  playerNamePosition?: { x: number; y: number };
}

export const Fireworks: React.FC<FireworksProps> = ({ playerNamePosition }) => {
  const [showFireworks] = useState(true);
  const [fireworkCount, setFireworkCount] = useState(0);

  // 默认位置为屏幕中心，如果有提供玩家名字位置则使用该位置
  const centerX = playerNamePosition?.x || window.innerWidth / 2;
  const centerY = playerNamePosition?.y || window.innerHeight / 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setFireworkCount((prev) => prev + 1);
    }, 2000); // Duration of each firework cycle

    return () => clearTimeout(timer);
  }, [fireworkCount]);

  if (!showFireworks) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {showFireworks && (
          <motion.div
            key={`firework-${fireworkCount}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              left: centerX,
              top: centerY,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Firework 1 */}
            <motion.div
              initial={{ scale: 0, x: -100, y: 100 }}
              animate={{
                scale: [0, 1, 0],
                x: [-100, 0, 100],
                y: [100, -100, 100],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute"
            >
              <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-300"></div>
            </motion.div>

            {/* Firework 2 */}
            <motion.div
              initial={{ scale: 0, x: 100, y: 100 }}
              animate={{
                scale: [0, 1, 0],
                x: [100, 0, -100],
                y: [100, -100, 100],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              className="absolute"
            >
              <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-300"></div>
            </motion.div>

            {/* Firework 3 */}
            <motion.div
              initial={{ scale: 0, x: 0, y: 100 }}
              animate={{
                scale: [0, 1, 0],
                x: [0, 0, 0],
                y: [100, -100, 100],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
              className="absolute"
            >
              <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-300"></div>
            </motion.div>

            {/* Firework particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeOut',
                  delay: Math.random() * 0.5,
                }}
                className="absolute"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    i % 3 === 0 ? 'bg-yellow-400' : i % 3 === 1 ? 'bg-red-400' : 'bg-blue-400'
                  }`}
                ></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
