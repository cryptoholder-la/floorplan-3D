'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Box, RotateCw } from 'lucide-react';

export type ViewMode = 'perspective' | 'orthographic' | 'top' | 'front' | 'side';

interface ViewModeSelectorProps {
  currentViewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const viewModes = [
  { mode: 'perspective' as ViewMode, icon: Eye, label: 'Perspective' },
  { mode: 'orthographic' as ViewMode, icon: Box, label: 'Orthographic' },
  { mode: 'top' as ViewMode, icon: RotateCw, label: 'Top View' },
  { mode: 'front' as ViewMode, icon: Eye, label: 'Front View' },
  { mode: 'side' as ViewMode, icon: Eye, label: 'Side View' },
];

export default function ViewModeSelector({ 
  currentViewMode, 
  onViewModeChange, 
  className = '' 
}: ViewModeSelectorProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <CardContent className="p-0">
        <div className="flex flex-wrap gap-2">
          {viewModes.map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={currentViewMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange(mode)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
