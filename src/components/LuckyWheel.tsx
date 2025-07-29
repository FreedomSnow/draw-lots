import { motion } from 'framer-motion';
import styles from './LuckyWheel.module.css';

// 定义赤橙黄绿青蓝紫七种基础颜色
const getSegmentColor = (index: number) => {
  const colors = [
    'bg-red-500',     // 赤
    'bg-orange-500',  // 橙
    'bg-yellow-500',  // 黄
    'bg-green-500',   // 绿
    'bg-cyan-500',    // 青
    'bg-blue-500',    // 蓝
    'bg-purple-500',  // 紫
  ];
  
  return colors[index % colors.length];
};

interface LuckyWheelProps {
  options: string[];
  isSpinning: boolean;
  power: number;
  isCharging: boolean;
  onChargeStart: () => void;
  onChargeEnd: () => void;
}

export default function LuckyWheel({ 
  options, 
  isSpinning, 
  power, 
  isCharging,
  onChargeStart,
  onChargeEnd
}: LuckyWheelProps) {
  const segmentAngle = 360 / options.length;
  
  return (
    <div className={styles['luckywheel-root']}>
      <div className={styles['luckywheel-wheel-wrap']}>
        {/* 转盘容器 */}
        <div className={styles['luckywheel-wheel-container']}>
          {/* 转盘 */}
          <motion.div
            className={styles['luckywheel-wheel']}
            animate={isSpinning ? { 
              rotate: 360 * (3 + power / 100 * 5)
            } : {}}
            transition={isSpinning ? { 
              type: "easeOut",
              duration: 3 + power / 100 * 5,
              ease: [0.2, 0.1, 0.2, 1]
            } : {}}
          >
            {/* 转盘 segments */}
            {options.map((option, index) => (
              <div
                key={index}
                className={styles['luckywheel-segment'] + ' ' + getSegmentColor(index)}
                style={{
                  clipPath: `polygon(50% 50%, 
                    ${50 + 51 * Math.cos((segmentAngle * index - 90) * Math.PI / 180)}% 
                    ${50 + 51 * Math.sin((segmentAngle * index - 90) * Math.PI / 180)}%, 
                    ${50 + 51 * Math.cos((segmentAngle * (index + 1) - 90) * Math.PI / 180)}% 
                    ${50 + 51 * Math.sin((segmentAngle * (index + 1) - 90) * Math.PI / 180)}%
                  )`
                }}
              >
                {/* 选项文本 - 从圆外到中心排列 */}
                <div 
                  className={styles['luckywheel-segment-text']}
                  style={{ 
                    transform: `
                      rotate(${segmentAngle * index + segmentAngle/2}deg) 
                      translateY(20px) 
                      rotate(${-segmentAngle * index - segmentAngle/2}deg)
                    `,
                    width: `${100 - (index % 3) * 20}px`,
                  }}
                >
                  {option.length > 6 ? option.substring(0, 6) + '...' : option}
                </div>
              </div>
            ))}
          </motion.div>
          {/* 指针 - 顶部粗底部细的针状 */}
          <div className={styles['luckywheel-pointer']}>
            <div className={styles['luckywheel-pointer-dot']}></div>
            <div className={styles['luckywheel-pointer-bar1']}></div>
            <div className={styles['luckywheel-pointer-bar2']}></div>
          </div>
        </div>
      </div>
      {/* 蓄力区域 */}
      <div className={styles['luckywheel-power-wrap']}>
        <div className={styles['luckywheel-power-label']}>
          <span>蓄力</span>
          <span>{power}%</span>
        </div>
        {/* 蓄力进度条 */}
        <div className={styles['luckywheel-power-bar-bg']}>
          <motion.div
            className={styles['luckywheel-power-bar']}
            initial={{ width: 0 }}
            animate={{ width: `${power}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          ></motion.div>
        </div>
        {/* 蓄力按钮 */}
        <button
          onMouseDown={onChargeStart}
          onMouseUp={onChargeEnd}
          onMouseLeave={onChargeEnd}
          onTouchStart={onChargeStart}
          onTouchEnd={onChargeEnd}
          disabled={isSpinning || isCharging && power >= 100}
          className={styles['luckywheel-charge-btn']}
        >
          {isSpinning ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>转盘转动中...</span>
            </div>
          ) : isCharging ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-bolt"></i>
              <span>释放开始旋转!</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-hand-paper"></i>
              <span>长按蓄力</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}