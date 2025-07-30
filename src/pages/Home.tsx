import { useState, useRef, useEffect } from 'react';
import styles from './Home.module.css';
import LotteryJar from '@/components/LotteryJar';
import LuckyWheel from '@/components/LuckyWheel';
import OptionInput from '@/components/OptionInput';
import ResultDisplay from '@/components/ResultDisplay';
import ModeSelector from '@/components/ModeSelector';
import { t, Lang } from '@/lib/i18n';

interface HomeProps {
  lang: Lang;
}

export default function Home({ lang }: HomeProps) {
  // 状态管理
  const [mode, setMode] = useState<'jar' | 'wheel'>("jar");
  const [options, setOptions] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [power, setPower] = useState<number>(0);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  // 新增：转盘旋转角度
  const [rotateDeg, setRotateDeg] = useState<number>(0);
  // 记录上一次的旋转角度，避免每次都从0开始
  const lastRotateRef = useRef<number>(0);

  // 日志：每次result变化时打印
  useEffect(() => {
    console.log('[LOG] result changed:', result);
  }, [result]);

  useEffect(() => {
    console.log('[LOG] options changed:', options);
  }, [options]);

  // 洗牌算法
  const shuffle = (arr: string[]) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 处理选项变化
  const handleOptionsChange = (newOptions: string[]) => {
    console.log('[LOG] handleOptionsChange', newOptions);
    setOptions(shuffle(newOptions));
    setResult(null); // 重置结果
  };

  // 开始抓阄（罐子模式）
  const startDrawing = () => {
    console.log('[LOG] startDrawing called, options:', options);
    if (options.length < 2) {
      console.log('[LOG] startDrawing aborted: options.length < 2');
      return;
    }
    setIsDrawing(true);
    // 模拟抓阄过程
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      const selected = options[randomIndex];
      console.log('[LOG] startDrawing result:', selected);
      setResult(selected);
      setIsDrawing(false);
    }, 2000);
  };

  // 开始旋转（转盘模式）
  const startSpinning = () => {
    console.log('[LOG] startSpinning called, options:', options, 'power:', power);
    if (options.length < 2 || power < 10) {
      console.log('[LOG] startSpinning aborted: options.length < 2 or power < 10');
      return;
    }
    setIsDrawing(true);
    // 随机选一个结果
    const randomIndex = Math.floor(Math.random() * options.length);
    const selected = options[randomIndex];
    // 计算目标角度（每个扇区角度 = 360 / options.length，指针始终指向扇形中心）
    const segAngle = 360 / options.length;
    // 让转盘多转几圈再停到目标扇区
    const extraRounds = 5 + Math.floor(power / 20); // 蓄力越大圈数越多
    // 让指针正对扇形中心
    const targetDeg = lastRotateRef.current + 360 * extraRounds + (360 - (randomIndex * segAngle + segAngle / 2));
    setRotateDeg(targetDeg);
    lastRotateRef.current = targetDeg % 360; // 记录本次结束后余数，避免溢出
    // 动画时长比 LuckyWheel 动画长1秒
    const spinDuration = 4000;
    setTimeout(() => {
      setResult(selected);
      setIsDrawing(false);
      setPower(0);
    }, spinDuration);
  };

  // 处理蓄力
  const handleChargeStart = () => {
    console.log('[LOG] handleChargeStart');
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
    console.log('[LOG] handleChargeEnd, power:', power);
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
    console.log('[LOG] resetGame');
    setOptions([]);
    setResult(null);
    setPower(0);
  };

  // 再试一次
  const tryAgain = () => {
    console.log('[LOG] tryAgain');
    setResult(null);
    setPower(0);
    setIsCharging(false);
    setRotateDeg(0);
    lastRotateRef.current = 0;
    setOptions(prev => shuffle(prev));
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
            lang={lang}
          />
        </div>
      </div>
      {/* 底部层：模式选择和抓阄区域 */}
      <div className={styles['home-bottom']}>
        <div className={styles['home-bottom-inner']}>
          <ModeSelector mode={mode} setMode={setMode} lang={lang} />
          {/* 抓阄区域 */}
          {result ? (
            <ResultDisplay 
              result={result} 
              tryAgain={tryAgain} 
              resetGame={resetGame}
              lang={lang}
            />
          ) : (
            mode === 'jar' ? (
              <LotteryJar 
                options={options} 
                isDrawing={isDrawing}
                startDrawing={startDrawing}
                drawingDuration={isDrawing ? 5000 + Math.random() * 5000 : 0}
                lang={lang}
              />
            ) : (
              <LuckyWheel 
                options={options} 
                isSpinning={isDrawing}
                power={power}
                isCharging={isCharging}
                onChargeStart={handleChargeStart}
                onChargeEnd={handleChargeEnd}
                lang={lang}
                rotateDeg={rotateDeg}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}