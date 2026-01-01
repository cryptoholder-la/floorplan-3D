'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export default function Sidebar({ children, className = '' }: SidebarProps) {
  return (
    <div className={cn('w-64 bg-white border-r border-gray-200 h-full', className)}>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
