import { motion } from 'framer-motion';
import styles from './LuckyWheel.module.css';
import { t, Lang } from '@/lib/i18n';

interface LuckyWheelProps {
  options: string[];
  isSpinning: boolean;
  power: number;
  isCharging: boolean;
  onChargeStart: () => void;
  onChargeEnd: () => void;
  lang: Lang;
  rotateDeg: number; // 新增，父组件传入旋转角度
}

export default function LuckyWheel(props: LuckyWheelProps) {
  const { options, isSpinning, power, isCharging, onChargeStart, onChargeEnd, lang, rotateDeg } = props;
  // 直接使用父组件传入的 rotateDeg，指针始终指向扇形中心
  const correctedRotateDeg = rotateDeg;

  // 生成每个扇形的SVG path
  function getSegmentPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const rad = (deg: number) => (Math.PI / 180) * deg;
    const x1 = cx + r * Math.cos(rad(startAngle));
    const y1 = cy + r * Math.sin(rad(startAngle));
    const x2 = cx + r * Math.cos(rad(endAngle));
    const y2 = cy + r * Math.sin(rad(endAngle));
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
  }

  return (
    <div className={styles['luckywheel-root']}>
      <div className={styles['luckywheel-wheel-wrap']}>
        {/* 转盘容器 */}
        <div className={styles['luckywheel-wheel-container']}>
          {/* SVG转盘，增加旋转动画 */}
          <svg
            className={styles['luckywheel-wheel']}
            width={300}
            height={300}
            viewBox="0 0 300 300"
            style={{ display: 'block', position: 'relative', zIndex: 1 }}
          >
            <motion.g
              animate={{ rotate: correctedRotateDeg }}
              initial={false}
              transition={isSpinning ? { duration: 3, ease: 'easeInOut' } : { duration: 0 }}
              transform="rotate(0 150 150)"
            >
              {options.map((option, index) => {
              // 马卡龙色系及立体渐变色
              const pastelGradients = [
                ['#FFD6E0', '#FFB7B2'],
                ['#FFDAC1', '#FFD6E0'],
                ['#E2F0CB', '#B5EAD7'],
                ['#C7CEEA', '#B5D8FA'],
                ['#E0BBE4', '#D5C6E0'],
                ['#F3EAC2', '#FFDAC1'],
                ['#B5EAD7', '#E2F0CB'],
                ['#FFB7B2', '#FFD6E0'],
                ['#B5D8FA', '#C7CEEA'],
                ['#D5C6E0', '#E0BBE4'],
              ];
              const [colorStart, colorEnd] = pastelGradients[index % pastelGradients.length];
              const segmentAngle = 360 / options.length;
              const start = segmentAngle * index - 90;
              const end = segmentAngle * (index + 1) - 90;
              // 渐变ID保证唯一
              const gradientId = `wheel-gradient-${index}`;
              // 文字径向布局
              const textAngle = (start + end) / 2;
              const textRadius = 120;
              const chars = option.length > 8 ? option.substring(0, 8) + '...' : option;
              return (
                <g key={index}>
                  <defs>
                    <radialGradient id={gradientId} cx="50%" cy="50%" r="80%" fx="40%" fy="40%">
                      <stop offset="0%" stopColor={colorStart} />
                      <stop offset="100%" stopColor={colorEnd} />
                    </radialGradient>
                    {/* 高光渐变 */}
                    <linearGradient id={`highlight-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                      <stop offset="60%" stopColor="#fff" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                    {/* 阴影渐变 */}
                    <radialGradient id={`shadow-${index}`} cx="70%" cy="80%" r="80%">
                      <stop offset="60%" stopColor="#000" stopOpacity="0" />
                      <stop offset="100%" stopColor="#000" stopOpacity="0.13" />
                    </radialGradient>
                  </defs>
                  {/* 主色扇页 */}
                  <path
                    d={getSegmentPath(150, 150, 140, start, end)}
                    fill={`url(#${gradientId})`}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
                  />
                  {/* 高光 */}
                  <path
                    d={getSegmentPath(150, 150, 140, start, end)}
                    fill={`url(#highlight-${index})`}
                    style={{ mixBlendMode: 'lighten', pointerEvents: 'none' }}
                  />
                  {/* 阴影 */}
                  <path
                    d={getSegmentPath(150, 150, 140, start, end)}
                    fill={`url(#shadow-${index})`}
                    style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
                  />
                  {/* 径向文字，每个字单独旋转分布 */}
                  {chars.split('').map((char, i) => {
                    const r = textRadius - i * 16;
                    const angle = textAngle;
                    const x = 150 + r * Math.cos((angle) * Math.PI / 180);
                    const y = 150 + r * Math.sin((angle) * Math.PI / 180);
                    return (
                      <text
                        key={i}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={16}
                        fill="#666"
                        transform={`rotate(${angle + 90},${x},${y})`}
                        style={{ userSelect: 'none', pointerEvents: 'none', textShadow: '0 1px 2px #fff' }}
                      >
                        {char}
                      </text>
                    );
                  })}
                </g>
              );
            })}
            </motion.g>
            {/* 指针 - 三角形从圆心指向上方 */}
            <polygon
              points="150,60 135,150 165,150"
              fill="red"
              stroke="#fff"
              strokeWidth={3}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.18))"
            />
            {/* 圆心小圆点，位于转盘中心，覆盖指针底部 */}
            <circle cx="150" cy="150" r="16" fill="red" stroke="#fff" strokeWidth={3} />
          </svg>
        </div>
      </div>
      {/* 蓄力区域 */}
      <div className={styles['luckywheel-power-wrap']}>
        <div className={styles['luckywheel-power-label']}>
          <span>{t(lang, 'luckywheel_power')}</span>
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
              <span>{t(lang, 'luckywheel_spinning')}</span>
            </div>
          ) : isCharging ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-bolt"></i>
              <span>{t(lang, 'luckywheel_release')}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-hand-paper"></i>
              <span>{t(lang, 'luckywheel_charge')}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}