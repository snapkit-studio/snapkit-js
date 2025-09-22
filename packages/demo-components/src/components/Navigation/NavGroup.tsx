'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import type { NavGroup as NavGroupType } from '../../types';

interface NavGroupProps {
  group: NavGroupType;
  activeId: string;
  onItemClick: (href: string) => void;
}

export function NavGroup({ group, activeId, onItemClick }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(group.defaultOpen !== false);

  return (
    <div className="mb-4">
      <button
        className="flex w-full items-center justify-between px-2 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{group.title}</span>
        <svg
          className={clsx(
            'h-4 w-4 transition-transform',
            isOpen ? 'rotate-90' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-1">
          {group.items.map((item) => (
            <li key={item.id}>
              <button
                className={clsx(
                  'block w-full px-4 py-2 text-sm rounded-md text-left transition-colors cursor-pointer',
                  activeId === item.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                onClick={() => onItemClick(item.href)}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}