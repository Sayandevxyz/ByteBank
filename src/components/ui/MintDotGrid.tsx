import React from 'react';

interface MintDotGridProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export default function MintDotGrid({ rows = 6, cols = 8, className = '' }: MintDotGridProps) {
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(`${r}-${c}`);
    }
  }

  return (
    <div
      className={`grid gap-2.5 pointer-events-none select-none opacity-85 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      aria-hidden="true"
    >
      {dots.map((key) => (
        <span
          key={key}
          className="w-1.5 h-1.5 rounded-full bg-[#1FD6A0] inline-block"
        />
      ))}
    </div>
  );
}

