'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ 
  title, 
  subtitle, 
  children, 
  className 
}: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            Floorplan 3D - Kitchen Design Suite
          </div>
        </div>
      </footer>
    </div>
  );
}
