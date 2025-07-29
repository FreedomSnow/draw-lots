import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import styles from './OptionInput.module.css';
import { t, Lang } from '@/lib/i18n';

interface OptionInputProps {
  options: string[];
  setOptions: (options: string[]) => void;
  disabled: boolean;
  lang: Lang;
}

export default function OptionInput({ options, setOptions, disabled, lang }: OptionInputProps) {
  const [newOption, setNewOption] = useState('');
  
  const addOption = () => {
    if (!newOption.trim() || options.includes(newOption.trim())) return;
    
    const updatedOptions = [...options, newOption.trim()];
    setOptions(updatedOptions);
    setNewOption('');
    toast.success(t(lang, 'option_added') + ': ' + newOption.trim());
  };
  
  const removeOption = (indexToRemove: number) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);
  };
  
  return (
    <div className={styles['option-input-root']}>
      <div className={styles['option-input-title-row']}>
        <h2 className={styles['option-input-title']} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <i className="fa-solid fa-list-ul" style={{ minWidth: 20, textAlign: 'center' }}></i>
          </span>
          {t(lang, 'option_title')}
          <span className={styles['option-input-tip']}>{t(lang, 'option_tip')}</span>
        </h2>
      </div>
      <div className={styles['option-input-row']}>
        <input
          type="text"
          value={newOption}
          onChange={(e) => {
            if (e.target.value.length <= 15) setNewOption(e.target.value);
          }}
          onKeyPress={(e) => e.key === 'Enter' && addOption()}
          placeholder={t(lang, 'option_placeholder')}
          disabled={disabled}
          className={styles['option-input-input']}
          maxLength={15}
        />
      </div>
      <div className={styles['option-input-list']}>
        {options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={styles['option-input-item']}
          >
            <span className={styles['option-input-item-text']} title={option}>{option}</span>
            <button
              onClick={() => removeOption(index)}
              disabled={disabled}
              className={styles['option-input-item-remove']}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}