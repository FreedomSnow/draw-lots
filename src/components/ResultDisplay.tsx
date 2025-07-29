import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ResultDisplayProps {
  result: string;
  tryAgain: () => void;
  resetGame: () => void;
}

export default function ResultDisplay({ result, tryAgain, resetGame }: ResultDisplayProps) {
  return (
    <motion.div
      className="mt-8 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-800/50 rounded-2xl p-8 text-center shadow-xl shadow-purple-900/20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="mb-6">
        <div className="inline-block p-3 rounded-full bg-purple-600/20 border border-purple-500/30 mb-4">
          <i className="fa-solid fa-star text-4xl text-yellow-400 animate-pulse"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">抓阄结果</h2>
        <p className="text-gray-400">命运的选择是...</p>
      </div>
      
      <div className="mb-8">
        <motion.div
          className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 text-2xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {result}
        </motion.div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={tryAgain}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-redo"></i>
            <span>再试一次</span>
          </div>
        </button>
        
        <button
          onClick={resetGame}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-edit"></i>
            <span>重新输入</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}