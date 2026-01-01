'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Cpu, Play, Settings } from 'lucide-react';

interface CNCManufacturingPanelProps {
  data: {
    parts: any[];
    settings: any;
  };
  onOperation: (operation: any) => void;
}

export default function CNCManufacturingPanel({ data, onOperation }: CNCManufacturingPanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            CNC Manufacturing Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onOperation({ type: 'start', data })}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Play className="h-4 w-4" />
                Start Manufacturing
              </button>
              <button
                onClick={() => onOperation({ type: 'settings', data })}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Parts Queue</h4>
              <p className="text-sm text-gray-600">
                {data.parts.length} parts ready for manufacturing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
