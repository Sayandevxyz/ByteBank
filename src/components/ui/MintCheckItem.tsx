import React from 'react';
import { Check } from 'lucide-react';

interface MintCheckItemProps {
  text: string;
  className?: string;
}

export default function MintCheckItem({ text, className = '' }: MintCheckItemProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="w-5 h-5 rounded-full bg-[#1FD6A0] flex items-center justify-center shrink-0 shadow-sm text-white">
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </span>
      <span className="text-sm sm:text-base font-medium text-[#1B0B5C]">
        {text}
      </span>
    </div>
  );
}

