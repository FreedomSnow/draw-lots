import { motion } from 'framer-motion';
import { toast } from 'sonner';
import styles from './ResultDisplay.module.css';

interface ResultDisplayProps {
  result: string;
  tryAgain: () => void;
  resetGame: () => void;
}

export default function ResultDisplay({ result, tryAgain, resetGame }: ResultDisplayProps) {
  return (
    <motion.div
      className={styles['result-root']}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={styles['result-header']}>
        <div className={styles['result-header-icon']}>
          <i className="fa-solid fa-star"></i>
        </div>
        <h2 className={styles['result-title']}>抓阄结果</h2>
        <p className={styles['result-desc']}>命运的选择是...</p>
      </div>
      <div className={styles['result-value-wrap']}>
        <motion.div
          className={styles['result-value']}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {result}
        </motion.div>
      </div>
      <div className={styles['result-btn-row']}>
        <button
          onClick={tryAgain}
          className={styles['result-btn'] + ' ' + styles['result-btn-try']}
        >
          <i className="fa-solid fa-redo"></i>
          <span>再试一次</span>
        </button>
        <button
          onClick={resetGame}
          className={styles['result-btn'] + ' ' + styles['result-btn-reset']}
        >
          <i className="fa-solid fa-edit"></i>
          <span>重新输入</span>
        </button>
      </div>
    </motion.div>
  );
}