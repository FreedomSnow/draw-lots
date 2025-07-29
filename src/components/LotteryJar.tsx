import { motion } from 'framer-motion';
import styles from './LotteryJar.module.css';

interface LotteryJarProps {
  options: string[];
  isDrawing: boolean;
  startDrawing: () => number;
  drawingDuration: number;
}

export default function LotteryJar({ options, isDrawing, startDrawing, drawingDuration }: LotteryJarProps) {
  return (
    <div className={styles['lotteryjar-root']}>
      {/* 罐子容器 */}
      <div className={styles['lotteryjar-jar-wrap']}>
        {/* 罐子 */}
        <motion.div
          className={styles['lotteryjar-jar']}
          animate={isDrawing ? { 
            rotate: [0, 10, -10, 10, -10, 5, -5, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={isDrawing ? { 
            duration: drawingDuration / 1000,
            type: "spring",
            stiffness: 300,
            damping: 10
          } : {}}
        >
          {/* 罐子内部阴影 */}
          <div className={styles['lotteryjar-jar-shadow']}></div>
          {/* 竹签 */}
          <div className={styles['lotteryjar-sticks']}>
            {options.map((option, index) => (
              <motion.div
                key={index}
                className={styles['lotteryjar-stick']}
                style={{ 
                  height: `${60 + Math.random() * 30}%`,
                  marginLeft: `${-15 + Math.random() * 30}px`,
                  transform: `rotate(${Math.random() * 20 - 10}deg)`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isDrawing ? {
                  rotate: [
                    `${Math.random() * 20 - 10}deg`,
                    `${Math.random() * 30 - 15}deg`,
                    `${Math.random() * 25 - 12}deg`,
                    `${Math.random() * 30 - 15}deg`,
                    `${Math.random() * 20 - 10}deg`
                  ],
                  y: [0, -5, 5, -5, 0],
                  x: [0, Math.random() * 4 - 2, Math.random() * 4 - 2, 0]
                } : { opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: isDrawing ? 0.5 : 0.5,
                  repeat: isDrawing ? Infinity : 0,
                  repeatType: "reverse"
                }}
              ></motion.div>
            ))}
          </div>
        </motion.div>
        {/* 罐子底部 */}
        <div className={styles['lotteryjar-bottom']}></div>
      </div>
      {/* 开始按钮 */}
      <button
        onClick={() => startDrawing()}
        disabled={isDrawing}
        className={styles['lotteryjar-btn']}
      >
        {isDrawing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>正在抓阄...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-hand-sparkles"></i>
            <span>开始抓阄</span>
          </div>
        )}
      </button>
    </div>
  );
}