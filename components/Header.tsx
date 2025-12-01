import React from 'react';
import { Trophy, Zap } from 'lucide-react';

interface HeaderProps {
  bestScore: number | null;
}

const Header: React.FC<HeaderProps> = ({ bestScore }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
      <div className="flex items-center gap-2 text-white/80 backdrop-blur-sm bg-black/10 px-4 py-2 rounded-full">
        <Zap className="w-5 h-5 text-yellow-400" />
        <span className="font-medium tracking-wide">极速反应</span>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 text-white/90 backdrop-blur-md bg-white/10 px-5 py-3 rounded-2xl shadow-lg border border-white/10">
          <Trophy className={`w-6 h-6 ${bestScore ? 'text-yellow-400' : 'text-gray-400'}`} />
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">历史最佳</div>
            <div className="text-2xl font-bold font-mono leading-none">
              {bestScore ? `${bestScore} ms` : '--'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;