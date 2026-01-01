"use client";

import { Metadata } from 'next';
import MobileFloorplanApp from '@/components/MobileFloorplanApp';

export const metadata: Metadata = {
  title: 'Mobile Floorplan - Phone Version with Sync',
  description: 'Mobile-optimized floorplan viewer with real-time synchronization and touch gestures',
  keywords: ['mobile', 'floorplan', 'sync', 'touch', 'responsive'],
};

export default function MobileFloorplanPage() {
  return <MobileFloorplanApp />;
}
