// Simple Quick Add Component - Placeholder
import React from 'react';

interface SimpleQuickAddProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function SimpleQuickAdd({ className, style }: SimpleQuickAddProps) {
  return (
    <div className={className} style={style}>
      <div className="p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Quick Add</h3>
        <p className="text-gray-600">Simple Quick Add component - Coming Soon</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">This is a placeholder component.</p>
        </div>
      </div>
    </div>
  );
}
