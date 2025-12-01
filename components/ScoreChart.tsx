import React from 'react';
import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { Attempt } from '../types';

interface ScoreChartProps {
  history: Attempt[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ history }) => {
  // Only show the last 20 attempts
  const data = history.slice(-20);

  if (data.length < 2) return null;

  return (
    <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-10 p-4 transition-opacity duration-500 opacity-80 hover:opacity-100">
      <div className="w-full h-full max-w-4xl mx-auto backdrop-blur-sm bg-black/20 rounded-xl p-4 border border-white/5">
        <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2 ml-2">最近成绩趋势</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="id" hide />
            <YAxis 
              hide 
              domain={['dataMin - 50', 'dataMax + 50']} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: number) => [`${value} ms`, '反应时间']}
            />
            <Line 
              type="monotone" 
              dataKey="time" 
              stroke="#fff" 
              strokeWidth={3} 
              dot={{ r: 3, fill: '#fff', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#4ade80' }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreChart;