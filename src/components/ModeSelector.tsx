import { motion } from 'framer-motion';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  mode: 'jar' | 'wheel';
  setMode: (mode: 'jar' | 'wheel') => void;
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
    <div className={styles['mode-selector-root']}>
      <div className={styles['mode-selector-row']}>
        <button
          onClick={() => setMode('jar')}
          className={
            styles['mode-selector-btn'] + ' ' +
            (mode === 'jar'
              ? styles['mode-selector-btn-jar']
              : styles['mode-selector-btn-inactive'])
          }
        >
          <i className="fa-solid fa-jar-wheat"></i>
          <span>抓阄</span>
        </button>
        <button
          onClick={() => setMode('wheel')}
          className={
            styles['mode-selector-btn'] + ' ' +
            (mode === 'wheel'
              ? styles['mode-selector-btn-wheel']
              : styles['mode-selector-btn-inactive'])
          }
        >
          <i className="fa-solid fa-circle-notch"></i>
          <span>幸运转盘</span>
        </button>
      </div>
    </div>
  );
}