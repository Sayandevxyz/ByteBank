import React from 'react';

interface WaveDividerProps {
  fill?: string;
  className?: string;
  direction?: 'to-sky' | 'to-white';
}

export default function WaveDivider({
  fill = '#F3F7FF',
  className = '',
  direction = 'to-sky',
}: WaveDividerProps) {
  if (direction === 'to-sky') {
    return (
      <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 sm:h-16 lg:h-20 block preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C360,65 1080,65 1440,0 L1440,80 L0,80 Z"
            fill={fill}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-10 sm:h-16 lg:h-20 block preserve-3d"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C360,15 1080,15 1440,80 L1440,0 L0,0 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

