"use client";

import Navigation from '@/components/Navigation';
import FloorPlanBuilder from '@/components/FloorPlanBuilder';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Toaster />
      <Navigation />
      
      <div className="pt-16">
        <FloorPlanBuilder />
      </div>
    </div>
  );
}