import { useState, useRef } from 'react';
import styles from './Home.module.css';
import LotteryJar from '@/components/LotteryJar';
import LuckyWheel from '@/components/LuckyWheel';
import OptionInput from '@/components/OptionInput';
import ResultDisplay from '@/components/ResultDisplay';
import ModeSelector from '@/components/ModeSelector';
import { t, Lang } from '@/lib/i18n';

interface HomeProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export default function Home({ lang, setLang }: HomeProps) {
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
    <div className={styles['home-root']}>
      {/* 中间层：选项输入 */}
      <div className={styles['home-top']}>
        <div className={styles['home-input']}>
          <OptionInput 
            options={options} 
            setOptions={handleOptionsChange} 
            disabled={isDrawing}
          />
        </div>
      </div>
      {/* 底部层：模式选择和抓阄区域 */}
      {options.length >= 2 && (
        <div className={styles['home-bottom']}>
          <div className={styles['home-bottom-inner']}>
            <ModeSelector mode={mode} setMode={setMode} />
            {/* 抓阄区域 */}
            {!result ? (
              mode === 'jar' ? (
                <LotteryJar 
                  options={options} 
                  isDrawing={isDrawing}
                  startDrawing={startDrawing}
                  drawingDuration={isDrawing ? 5000 + Math.random() * 5000 : 0}
                  // lang={lang}
                />
              ) : (
                <LuckyWheel 
                  options={options} 
                  isSpinning={isDrawing}
                  power={power}
                  isCharging={isCharging}
                  onChargeStart={handleChargeStart}
                  onChargeEnd={handleChargeEnd}
                  // lang={lang}
                />
              )
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
        </div>
      )}
    </div>
  );
}