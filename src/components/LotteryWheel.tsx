import { motion } from 'framer-motion';

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

interface LotteryWheelProps {
  options: string[];
  isSpinning: boolean;
  power: number;
  isCharging: boolean;
  onChargeStart: () => void;
  onChargeEnd: () => void;
}

export default function LotteryWheel({ 
  options, 
  isSpinning, 
  power, 
  isCharging,
  onChargeStart,
  onChargeEnd
}: LotteryWheelProps) {
  const segmentAngle = 360 / options.length;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        {/* 转盘容器 */}
        <div className="relative w-64 h-64">
          {/* 转盘 */}
          <motion.div
             className="absolute inset-0 rounded-full border-8 border-gray-800 shadow-xl shadow-purple-900/20"

            animate={isSpinning ? { 
              rotate: 360 * (3 + power / 100 * 5) // 旋转圈数基于蓄力值
            } : {}}
            transition={isSpinning ? { 
              type: "easeOut",
              duration: 3 + power / 100 * 5, // 旋转时间基于蓄力值
              ease: [0.2, 0.1, 0.2, 1]
            } : {}}
          >
            {/* 转盘 segments */}
               {options.map((option, index) => (
                 <div
                   key={index}
                    className={`absolute inset-0 rounded-full ${getSegmentColor(index)}`}
                   style={{
                     // 西瓜式切割 - 所有切角指向圆心，增加半径确保完全覆盖
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
                    className="absolute text-black text-xs font-bold text-center" 
                   style={{ 
                     left: '50%',
                     top: '50%',
                     transformOrigin: 'center center',
                     transform: `
                       rotate(${segmentAngle * index + segmentAngle/2}deg) 
                       translateY(20px) 
                       rotate(${-segmentAngle * index - segmentAngle/2}deg)
                     `,
                     width: `${100 - (index % 3) * 20}px`,  // 不同层的文本宽度略有差异
                     height: '40px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center'
                   }}
                 >
                   {option.length > 6 ? option.substring(0, 6) + '...' : option}
                 </div>
               </div>
              ))}
           </motion.div>
          
           {/* 指针 - 顶部粗底部细的针状 */}
           <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
             <div className="w-4 h-4 bg-red-600 rounded-full shadow-lg"></div>
             <div className="w-1 h-16 bg-gradient-to-b from-red-600 to-red-400"></div>
             <div className="w-0.5 h-4 bg-red-400"></div>
           </div>
        </div>
      </div>
      
      {/* 蓄力区域 */}
      <div className="w-full max-w-xs">
        <div className="mb-2 flex justify-between text-sm text-gray-400">
          <span>蓄力</span>
          <span>{power}%</span>
        </div>
        
        {/* 蓄力进度条 */}
        <div className="h-3 bg-gray-800 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? (
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>转盘转动中...</span>
            </div>
          ) : isCharging ? (
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-bolt"></i>
              <span>释放开始旋转!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-hand-paper"></i>
              <span>长按蓄力</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}