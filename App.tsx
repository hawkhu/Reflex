import React, { useState, useEffect } from 'react';
import { GameState, Attempt } from './types';
import ReactionBoard from './components/ReactionBoard';
import Header from './components/Header';
import ScoreChart from './components/ScoreChart';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [score, setScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);

  // Load best score from local storage on mount
  useEffect(() => {
    const savedBest = localStorage.getItem('reaction_best_score');
    if (savedBest) {
      setBestScore(parseInt(savedBest, 10));
    }
    
    const savedHistory = localStorage.getItem('reaction_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleScore = (newTime: number) => {
    setScore(newTime);
    
    // Update Best Score
    if (!bestScore || newTime < bestScore) {
      setBestScore(newTime);
      localStorage.setItem('reaction_best_score', newTime.toString());
    }

    // Update History
    setHistory(prev => {
      const newEntry: Attempt = {
        id: Date.now(),
        time: newTime,
        timestamp: Date.now()
      };
      const newHistory = [...prev, newEntry];
      // Keep last 50 attempts in storage
      const trimmedHistory = newHistory.slice(-50); 
      localStorage.setItem('reaction_history', JSON.stringify(trimmedHistory));
      return trimmedHistory;
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Header bestScore={bestScore} />
      
      <ReactionBoard 
        gameState={gameState}
        score={score}
        onStateChange={setGameState}
        onScore={handleScore}
      />

      {(gameState === GameState.IDLE || gameState === GameState.RESULT) && (
        <ScoreChart history={history} />
      )}
    </div>
  );
};

export default App;