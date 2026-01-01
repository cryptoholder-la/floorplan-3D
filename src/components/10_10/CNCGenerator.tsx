'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export function CNCGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          CNC Cutlist Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Detailed Parts & Barcodes</h3>
          <p className="text-gray-500">32mm system cutlist generator</p>
        </div>
      </CardContent>
    </Card>
  );
}
