import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface OptionInputProps {
  options: string[];
  setOptions: (options: string[]) => void;
  disabled: boolean;
}

export default function OptionInput({ options, setOptions, disabled }: OptionInputProps) {
  const [newOption, setNewOption] = useState('');
  
  const addOption = () => {
    if (!newOption.trim() || options.includes(newOption.trim())) return;
    
    const updatedOptions = [...options, newOption.trim()];
    setOptions(updatedOptions);
    setNewOption('');
    toast.success(`已添加: ${newOption.trim()}`);
  };
  
  const removeOption = (indexToRemove: number) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);
  };
  
  return (
    <div className="mb-8 bg-gray-800/50 p-5 rounded-xl border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <i className="fa-solid fa-list-ul mr-2 text-purple-400"></i>
        抓阄选项
      </h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOption()}
          placeholder="输入选项并添加..."
          disabled={disabled}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <button
          onClick={addOption}
          disabled={!newOption.trim() || disabled}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      
      {/* 选项列表 */}
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {options.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            <i className="fa-regular fa-file-text-o text-2xl mb-2 block"></i>
            <p>暂无选项，请添加至少2个选项开始抓阄</p>
          </div>
        ) : (
          options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-gray-900/70 rounded-lg p-3 flex items-center justify-between border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                  {index + 1}
                </div>
                <span>{option}</span>
              </div>
              <button
                onClick={() => removeOption(index)}
                disabled={disabled}
                className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}