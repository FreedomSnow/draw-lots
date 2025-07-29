import { useState } from 'react';
import { motion } from 'framer-motion';
import LotteryJar from '@/components/LotteryJar';
import LotteryWheel from '@/components/LotteryWheel';
import OptionInput from '@/components/OptionInput';
import ResultDisplay from '@/components/ResultDisplay';
import ModeSelector from '@/components/ModeSelector';

export default function Home() {
  // 状态管理
  const [mode, setMode] = useState<'jar' | 'wheel'>('jar');
  const [options, setOptions] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [power, setPower] = useState<number>(0);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  // 处理选项变化
  const handleOptionsChange = (newOptions: string[]) => {
    setOptions(newOptions);
    setResult(null); // 重置结果
  };

  // 开始抓阄（罐子模式）
  const startDrawing = () => {
    if (options.length < 2) return;
    setIsDrawing(true);
    
    // 模拟抓阄过程
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setResult(options[randomIndex]);
      setIsDrawing(false);
    }, 2000);
  };

  // 开始旋转（转盘模式）
  const startSpinning = () => {
    if (options.length < 2 || power < 10) return;
    setIsDrawing(true);
    
    // 旋转时间基于蓄力值（3000ms - 8000ms）
    const spinDuration = 3000 + (power / 100) * 5000;
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setResult(options[randomIndex]);
      setIsDrawing(false);
      setPower(0);
    }, spinDuration);
  };

  // 处理蓄力
  const handleChargeStart = () => {
    setIsCharging(true);
    const chargeInterval = setInterval(() => {
      setPower(prev => {
        if (prev >= 100) {
          clearInterval(chargeInterval);
          setIsCharging(false);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    
    // 存储interval以便清除
    setPowerInterval(chargeInterval);
  };

  const [powerInterval, setPowerInterval] = useState<number | null>(null);
  
  const handleChargeEnd = () => {
    if (powerInterval) {
      clearInterval(powerInterval);
      setPowerInterval(null);
    }
    setIsCharging(false);
    if (power > 10) {
      startSpinning();
    }
  };

  // 重置游戏
  const resetGame = () => {
    setOptions([]);
    setResult(null);
    setPower(0);
  };

  // 再试一次
  const tryAgain = () => {
    setResult(null);
    setPower(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col items-center justify-between p-6">
      <div className="w-full max-w-md mx-auto">
        {/* 标题 */}
        <motion.h1 
          className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          神秘抓阄
        </motion.h1>
        
        {/* 模式选择 */}
        <ModeSelector mode={mode} setMode={setMode} />
        
        {/* 选项输入 */}
        <OptionInput 
          options={options} 
          setOptions={handleOptionsChange} 
          disabled={isDrawing}
        />
        
        {/* 抓阄区域 */}
        {options.length >= 2 && !result ? (
          mode === 'jar' ? (
            <LotteryJar 
              options={options} 
              isDrawing={isDrawing}
              startDrawing={startDrawing}
              drawingDuration={isDrawing ? 5000 + Math.random() * 5000 : 0}
            />
          ) : (
            <LotteryWheel 
              options={options} 
              isSpinning={isDrawing}
              power={power}
              isCharging={isCharging}
              onChargeStart={handleChargeStart}
              onChargeEnd={handleChargeEnd}
            />
          )
        ) : options.length < 2 && !result ? (
          <div className="mt-10 p-6 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">请至少输入2个选项</p>
            <div className="w-24 h-24 mx-auto relative">
              {mode === 'jar' ? (
                <div className="w-full h-full bg-gray-700/30 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-jar-wheat text-gray-500 text-4xl"></i>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-700/30 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch text-gray-500 text-4xl"></i>
                </div>
              )}
            </div>
          </div>
        ) : null}
        
        {/* 结果展示 */}
        {result && (
          <ResultDisplay 
            result={result} 
            tryAgain={tryAgain} 
            resetGame={resetGame}
          />
        )}
      </div>
      
      {/* 页脚 */}
      <div className="text-center text-gray-500 text-sm mt-12">
        <p>神秘抓阄 &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}