'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid, Eye, Settings } from 'lucide-react';

export function DesignStudio() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Design Studio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Scene Controls & Outputs</h3>
            <p className="text-gray-500">Advanced design studio interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
