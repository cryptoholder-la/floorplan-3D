'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Plus, Package } from 'lucide-react';

interface QuickAddCabinetProps {
  onAdd: (cabinet: any) => void;
}

export default function QuickAddCabinet({ onAdd }: QuickAddCabinetProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Add Cabinet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'base', name: 'Base Cabinet' },
                { type: 'wall', name: 'Wall Cabinet' },
                { type: 'tall', name: 'Tall Cabinet' },
                { type: 'corner', name: 'Corner Cabinet' }
              ].map((cabinet, index) => (
                <button
                  key={index}
                  onClick={() => onAdd({ type: cabinet.type, name: cabinet.name })}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-center"
                >
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium">{cabinet.name}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
