'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface HeroDonutChartProps {
  categories?: { name: string; value: number; color: string }[];
  totalCount?: number;
}

export default function HeroDonutChart({ categories, totalCount = 10 }: HeroDonutChartProps) {
  const data = categories && categories.length > 0 ? categories : [
    { name: 'Cryptocurrency', value: 70, color: '#3B5BFF' },
    { name: 'Simulated Equities', value: 30, color: '#F43F6E' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E8ECF6] shadow-card-white p-5 sm:p-6 relative flex flex-col justify-between h-full">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7090] mb-3">
        Total Assets By Category
      </div>

      <div className="relative w-full h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={74}
              paddingAngle={4}
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={3}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown) => [`${value}%`, 'Share']}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8ECF6',
                borderRadius: '0.75rem',
                fontSize: '11px',
                color: '#1B0B5C',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-[#1B0B5C] tracking-tight tabular-nums">
            {totalCount}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7090]">
            Instruments
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3 mt-2 border-t border-[#F3F7FF] text-xs font-medium text-[#2B2F4A]">
        {data.map((cat, idx) => (
          <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
