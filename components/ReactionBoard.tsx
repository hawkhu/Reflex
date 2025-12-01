import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameState } from '../types';
import { MousePointer2, AlertCircle, Timer, RotateCcw, Play } from 'lucide-react';

interface ReactionBoardProps {
  gameState: GameState;
  score: number | null;
  onStateChange: (newState: GameState) => void;
  onScore: (time: number) => void;
}

const ReactionBoard: React.FC<ReactionBoardProps> = ({ 
  gameState, 
  score, 
  onStateChange, 
  onScore 
}) => {
  // Use number | undefined for browser setTimeout/clearTimeout compatibility
  const timerRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  // Constants
  const MIN_DELAY = 2000;
  const MAX_DELAY = 5000;

  const startWaiting = useCallback(() => {
    onStateChange(GameState.WAITING);
    const delay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
    
    // Explicitly use window.setTimeout to ensure return type is number
    timerRef.current = window.setTimeout(() => {
      onStateChange(GameState.READY);
      startTimeRef.current = performance.now();
    }, delay);
  }, [onStateChange]);

  const handleAction = () => {
    switch (gameState) {
      case GameState.IDLE:
      case GameState.RESULT:
      case GameState.TOO_SOON:
        startWaiting();
        break;

      case GameState.WAITING:
        // User clicked too early
        if (timerRef.current !== undefined) {
          window.clearTimeout(timerRef.current);
          timerRef.current = undefined;
        }
        onStateChange(GameState.TOO_SOON);
        break;

      case GameState.READY:
        // User clicked correctly
        const endTime = performance.now();
        const reactionTime = Math.round(endTime - startTimeRef.current);
        onScore(reactionTime);
        onStateChange(GameState.RESULT);
        break;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    };
  }, []);

  // UI Configuration based on State
  const getConfig = () => {
    switch (gameState) {
      case GameState.IDLE:
        return {
          bgColor: 'bg-slate-800 hover:bg-slate-700',
          icon: <Play className="w-16 h-16 mb-4 animate-pulse" />,
          title: '反应速度测试',
          subtitle: '准备好了吗？点击屏幕任意位置开始。',
          textColor: 'text-white'
        };
      case GameState.WAITING:
        return {
          bgColor: 'bg-rose-600',
          icon: <Timer className="w-20 h-20 mb-4 animate-bounce" />,
          title: '等待变绿...',
          subtitle: '保持专注，看到绿色立即点击。',
          textColor: 'text-white'
        };
      case GameState.READY:
        return {
          bgColor: 'bg-emerald-500',
          icon: <MousePointer2 className="w-24 h-24 mb-4" />,
          title: '点击!!!',
          subtitle: '快！快！快！',
          textColor: 'text-white'
        };
      case GameState.RESULT:
        return {
          bgColor: 'bg-indigo-600 hover:bg-indigo-500',
          icon: <RotateCcw className="w-12 h-12 mb-6" />,
          title: `${score} ms`,
          subtitle: '点击屏幕再试一次',
          textColor: 'text-white'
        };
      case GameState.TOO_SOON:
        return {
          bgColor: 'bg-amber-500 hover:bg-amber-400',
          icon: <AlertCircle className="w-16 h-16 mb-4" />,
          title: '太快了!',
          subtitle: '要在变绿之后才能点击哦。点击重试。',
          textColor: 'text-white'
        };
    }
  };

  const config = getConfig();

  return (
    <div 
      className={`w-full h-screen flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer select-none ${config.bgColor}`}
      onPointerDown={handleAction} 
    >
      <div className={`text-center flex flex-col items-center p-8 max-w-xl ${config.textColor}`}>
        <div className="drop-shadow-lg transition-transform duration-300 transform scale-100 hover:scale-105">
          {config.icon}
        </div>
        
        <h1 className={`font-bold drop-shadow-md transition-all duration-300 ${gameState === GameState.RESULT ? 'text-8xl font-mono' : 'text-5xl mb-4'}`}>
          {config.title}
        </h1>
        
        <p className={`text-xl opacity-90 font-medium tracking-wide mt-4 ${gameState === GameState.RESULT ? 'mt-8' : ''}`}>
          {config.subtitle}
        </p>

        {gameState === GameState.RESULT && score && score < 200 && (
          <div className="mt-4 px-4 py-1 bg-white/20 rounded-full text-sm font-bold uppercase tracking-widest animate-pulse">
            神级反应!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionBoard;