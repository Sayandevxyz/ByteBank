'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

interface HeroBarChartProps {
  data?: Array<{ month: string; count: number; isHighlighted?: boolean }>;
}

const DEFAULT_BARS = [
  { month: 'Mar', count: 110, isHighlighted: false },
  { month: 'Apr', count: 145, isHighlighted: false },
  { month: 'May', count: 178, isHighlighted: false },
  { month: 'Jun', count: 210, isHighlighted: false },
  { month: 'Jul', count: 245, isHighlighted: false },
  { month: 'Aug', count: 295, isHighlighted: true },
];

export default function HeroBarChart({ data = DEFAULT_BARS }: HeroBarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-36 flex items-end justify-between px-4 pb-2">
        <div className="w-5 h-16 bg-white/30 rounded-t" />
        <div className="w-5 h-20 bg-white/30 rounded-t" />
        <div className="w-5 h-24 bg-white/30 rounded-t" />
        <div className="w-5 h-28 bg-white/30 rounded-t" />
      </div>
    );
  }

  return (
    <div className="w-full h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#E0E7FF', fontSize: 10, fontWeight: 500 }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={800}>
            {data.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={entry.isHighlighted ? '#FFAB2E' : '#FFFFFF'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

