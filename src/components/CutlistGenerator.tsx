// Cutlist Generator Component - Placeholder
import React from 'react';

interface CutlistGeneratorProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function CutlistGenerator({ className, style }: CutlistGeneratorProps) {
  return (
    <div className={className} style={style}>
      <div className="p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Cutlist Generator</h3>
        <p className="text-gray-600">Cutlist Generator component - Coming Soon</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">This is a placeholder component.</p>
        </div>
      </div>
    </div>
  );
}
