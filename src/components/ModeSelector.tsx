import { motion } from 'framer-motion';

interface ModeSelectorProps {
  mode: 'jar' | 'wheel';
  setMode: (mode: 'jar' | 'wheel') => void;
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
    <div className="mb-8 bg-gray-800/50 p-1 rounded-full border border-gray-700">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMode('jar')}
          className={`flex-1 py-3 px-4 rounded-full transition-all duration-300 ${
            mode === 'jar' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-jar-wheat"></i>
            <span>抓阄</span>
          </div>
        </button>
        
        <button
          onClick={() => setMode('wheel')}
          className={`flex-1 py-3 px-4 rounded-full transition-all duration-300 ${
            mode === 'wheel' 
              ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/20' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-circle-notch"></i>
            <span>幸运转盘</span>
          </div>
        </button>
      </div>
    </div>
  );
}