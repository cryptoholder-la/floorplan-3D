"use client";

import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BaseCabinetWireframe from '@/components/BaseCabinetWireframe';
import WallCabinetWireframe from '@/components/WallCabinetWireframe';
import TallCabinetWireframe from '@/components/TallCabinetWireframe';
import { ScaleProvider } from '@/contexts/ScaleContext';

export default function CabinetsPage() {
  return (
    <ScaleProvider>
      <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white">
        <Navigation />

        <div className="flex-1 bg-background-light dark:bg-background-dark relative z-10 pt-20">
          <div className="p-5 flex flex-col gap-6">
            <div className="flex items-center justify-center">
              <h3 className="text-slate-900 dark:text-white text-3xl font-bold mb-4">Cabinet Wireframes</h3>
            </div>

            <div className="flex justify-center">
              <div className="bg-[#182334]/90 backdrop-blur-md rounded-full p-1.5 flex gap-1 shadow-xl border border-white/5">
                <Tabs defaultValue="base" className="w-full">
                  <TabsList className="bg-transparent gap-1">
                    <TabsTrigger 
                      value="base" 
                      className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">grid_on</span>
                      Base
                    </TabsTrigger>
                    <TabsTrigger 
                      value="wall" 
                      className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">vertical_distribute</span>
                      Wall
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tall" 
                      className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">border_vertical</span>
                      Tall
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="base" className="mt-6">
                    <BaseCabinetWireframe defaultWidth={24} />
                  </TabsContent>

                  <TabsContent value="wall" className="mt-6">
                    <WallCabinetWireframe defaultWidth={24} defaultHeight={30} />
                  </TabsContent>

                  <TabsContent value="tall" className="mt-6">
                    <TallCabinetWireframe defaultWidth={24} defaultHeight={85.5} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScaleProvider>
  );
}
