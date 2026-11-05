'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts';

const SESSION_DATA = [
  { x: '0', v1: 20, v2: 12 },
  { x: '10', v1: 32, v2: 18 },
  { x: '20', v1: 28, v2: 24 },
  { x: '30', v1: 42, v2: 20 },
  { x: '40', v1: 35, v2: 30 },
  { x: '50', v1: 58, v2: 36 },
  { x: '60', v1: 46, v2: 40 },
  { x: '70', v1: 65, v2: 48 },
  { x: '80', v1: 54, v2: 44 },
  { x: '90', v1: 72, v2: 52 },
];

export default function DeviceSessionChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-32 bg-slate-50 animate-pulse rounded" />;
  }

  return (
    <div className="w-full h-32">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SESSION_DATA} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sessionBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B5BFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B5BFF" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="sessionCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="x"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
          />
          <Area
            type="monotone"
            dataKey="v1"
            stroke="#3B5BFF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#sessionBlue)"
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="v2"
            stroke="#06B6D4"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#sessionCyan)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

