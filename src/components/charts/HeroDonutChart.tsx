'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HeroDonutChartProps {
  centerNumber?: string | number;
  centerLabel?: string;
  data?: Array<{ name: string; value: number; color: string }>;
}

const DEFAULT_DATA = [
  { name: 'Major Crypto', value: 52, color: '#3B5BFF' },
  { name: 'Simulated Stocks', value: 31, color: '#F43F6E' },
  { name: 'Reserve Assets', value: 17, color: '#FFAB2E' },
];

export default function HeroDonutChart({
  centerNumber = '528',
  centerLabel = 'Transfers',
  data = DEFAULT_DATA,
}: HeroDonutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-56 flex items-center justify-center">
        <div className="w-36 h-36 rounded-full border-8 border-slate-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={52}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1B0B5C] tracking-tight">
            {centerNumber}
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider -mt-0.5">
            {centerLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-2 text-xs font-medium text-[#1B0B5C]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-slate-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

