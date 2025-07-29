import { motion } from 'framer-motion';

interface LotteryJarProps {
  options: string[];
  isDrawing: boolean;
  startDrawing: () => number;
  drawingDuration: number;
}

export default function LotteryJar({ options, isDrawing, startDrawing, drawingDuration }: LotteryJarProps) {
  return (
    <div className="mt-8 flex flex-col items-center">
      {/* 罐子容器 */}
      <div className="relative w-40 h-64 mb-8">
        {/* 罐子 */}
        <motion.div
          className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-full border-4 border-gray-800 overflow-hidden relative"
          animate={isDrawing ? { 
            rotate: [0, 10, -10, 10, -10, 5, -5, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={isDrawing ? { 
            duration: drawingDuration / 1000, // 转换为秒
            type: "spring",
            stiffness: 300,
            damping: 10
          } : {}}
        >
          {/* 罐子内部阴影 */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* 竹签 */}
          <div className="absolute inset-0 flex items-end justify-center p-4 gap-1">
            {options.map((option, index) => (
               <motion.div
                 key={index}
                 className="w-2 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-500 rounded-t-md transform origin-bottom"
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
        <div className="w-48 h-4 bg-gray-800 rounded-full absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 border-x-4 border-gray-700"></div>
      </div>
      
      {/* 开始按钮 */}
        <button
          onClick={() => startDrawing()}
          disabled={isDrawing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isDrawing ? (
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>正在抓阄...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-hand-sparkles"></i>
              <span>开始抓阄</span>
            </div>
          )}
        </button>
    </div>
  );
}