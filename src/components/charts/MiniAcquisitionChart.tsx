'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const SAMPLE_DATA = [
  { p: 10, v1: 24, v2: 15 },
  { p: 20, v1: 38, v2: 28 },
  { p: 30, v1: 28, v2: 32 },
  { p: 40, v1: 45, v2: 25 },
  { p: 50, v1: 32, v2: 40 },
  { p: 60, v1: 52, v2: 35 },
  { p: 70, v1: 42, v2: 48 },
  { p: 80, v1: 60, v2: 42 },
  { p: 90, v1: 55, v2: 50 },
];

export default function MiniAcquisitionChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-24 bg-slate-50 animate-pulse rounded" />;
  }

  return (
    <div className="w-full h-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SAMPLE_DATA} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B5BFF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3B5BFF" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v1"
            stroke="#3B5BFF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBlue)"
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="v2"
            stroke="#94A3B8"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            fillOpacity={1}
            fill="url(#colorCyan)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

