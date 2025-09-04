'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface GridToggleProps {
  currentGrid: number;
}

const GRID_OPTIONS = [2, 3, 4] as const;

const GridToggle: React.FC<GridToggleProps> = ({ currentGrid }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setGrid = (cols: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cols) {
      params.set('grid', String(cols));
    } else {
      params.delete('grid');
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className='flex items-center gap-2'>
      {GRID_OPTIONS.map((cols) => {
        const isActive = currentGrid === cols;
        return (
          <button
            key={cols}
            onClick={() => setGrid(cols)}
            aria-label={`${cols} columns`}
            className={`h-9 w-9 inline-flex items-center justify-center rounded-md border text-sm hover:bg-gray-50 transition-colors ${
              isActive
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-gray-300 text-gray-600 bg-white'
            }`}
            title={`${cols} columns`}
          >
            {/* simple grid icon */}
            <span
              className='grid gap-[2px]'
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: cols * 2 }).map((_, i) => (
                <span
                  key={i}
                  className={`block h-[6px] w-[6px] rounded ${
                    isActive ? 'bg-blue-600' : 'bg-gray-400'
                  }`}
                />
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default GridToggle;
