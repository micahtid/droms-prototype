'use client';

import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 px-5 py-3 text-sm bg-gray-50 border-b border-gray-200 overflow-x-auto">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 flex-shrink-0">
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors truncate max-w-[120px]"
              title={item.label}
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-600 font-medium truncate max-w-[150px]" title={item.label}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          )}
        </div>
      ))}
    </nav>
  );
}
