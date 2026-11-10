'use client';

import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface HeroBarChartProps {
  monthlyData?: { month: string; count: number; isHighlighted?: boolean }[];
}

export default function HeroBarChart({ monthlyData }: HeroBarChartProps) {
  const data = monthlyData && monthlyData.length > 0 ? monthlyData : [
    { month: 'Mar', count: 98, isHighlighted: false },
    { month: 'Apr', count: 124, isHighlighted: false },
    { month: 'May', count: 156, isHighlighted: false },
    { month: 'Jun', count: 182, isHighlighted: false },
    { month: 'Jul', count: 215, isHighlighted: false },
    { month: 'Aug', count: 260, isHighlighted: true },
  ];

  const totalPostings = data.reduce((sum, item) => sum + (Number(item.count) || 0), 0);

  return (
    <div className="w-full bg-[#3B5BFF] rounded-2xl shadow-card-elevated p-5 sm:p-6 text-white relative flex flex-col justify-between h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100 leading-tight">
          Monthly Ledger Postings
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white shrink-0">
          Active
        </span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="month"
              stroke="#BFDBFE"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              formatter={(value: unknown) => [Number(value).toLocaleString(), 'Postings']}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8ECF6',
                borderRadius: '0.75rem',
                fontSize: '11px',
                color: '#1B0B5C',
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={32} isAnimationActive={false}>
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

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/15 text-xs text-blue-100">
        <span>Total Window</span>
        <span className="font-mono font-bold text-white tabular-nums">
          {totalPostings.toLocaleString()} txns
        </span>
      </div>
    </div>
  );
}
