import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number; // 0 to 100
  label: string;
  subLabel?: string;
}

const ScoreGauge = ({ score, label, subLabel }: ScoreGaugeProps) => {
  // Data for the gauge
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  const getColor = (val: number) => {
    if (val >= 90) return 'hsl(var(--success))';
    if (val >= 70) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[180px]">
      <div className="relative w-full h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="hsl(var(--muted))" opacity={0.2} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center">
          <span className="text-3xl font-bold font-mono">{Math.round(score)}%</span>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        </div>
      </div>
      {subLabel && (
        <p className="text-sm text-muted-foreground mt-2 px-4 text-center">
          {subLabel}
        </p>
      )}
    </div>
  );
};

export default ScoreGauge;
