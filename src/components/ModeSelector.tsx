import styles from './ModeSelector.module.css';
import { t, Lang } from '@/lib/i18n';

interface ModeSelectorProps {
  mode: 'jar' | 'wheel';
  setMode: (mode: 'jar' | 'wheel') => void;
  lang: Lang;
}

export default function ModeSelector({ mode, setMode, lang }: ModeSelectorProps) {
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
          <span>{t(lang, 'modeJar')}</span>
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
          <span>{t(lang, 'modeWheel')}</span>
        </button>
      </div>
    </div>
  );
}