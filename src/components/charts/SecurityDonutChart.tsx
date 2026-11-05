'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SecurityDonutChartProps {
  percentage?: number | string;
  label?: string;
}

const SECURITY_DATA = [
  { name: 'Row Locks', value: 45, color: '#3B5BFF' },
  { name: 'Idempotency', value: 25, color: '#F43F6E' },
  { name: 'Ledger Audit', value: 18, color: '#FFAB2E' },
  { name: 'RLS Security', value: 12, color: '#1FD6A0' },
];

export default function SecurityDonutChart({
  percentage = '82%',
  label = 'Reached',
}: SecurityDonutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-40 bg-slate-50 animate-pulse rounded-full" />;
  }

  return (
    <div className="relative w-full h-40 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={SECURITY_DATA}
            innerRadius={46}
            outerRadius={62}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            animationDuration={800}
          >
            {SECURITY_DATA.map((entry, index) => (
              <Cell key={`sec-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl sm:text-2xl font-extrabold text-[#1B0B5C] tracking-tight">
          {percentage}
        </span>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider -mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

