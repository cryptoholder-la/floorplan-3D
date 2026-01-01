import { useState } from 'react';
'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleCabinetCatalog from '@/components/SimpleCabinetCatalog';
import SimpleCabinetViewer from './SimpleCabinetViewer';
import SimpleQuickAdd from './SimpleQuickAdd';
import SimpleCabinetDetails from './SimpleCabinetDetails';
import SimpleWireframeRenderer from './SimpleWireframeRenderer';
import { Package, Eye, Plus, Grid3x3, Settings, Utensils } from 'lucide-react';

export default function CabinetToolsPage() {
  const [selectedCabinet, setSelectedCabinet] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('catalog');

  const handleCabinetSelect = (cabinet: any) => {
    setSelectedCabinet(cabinet);
    setActiveTab('viewer');
  };

  return (
    <MainLayout 
      title="Cabinet Tools" 
      subtitle="Complete cabinet design and visualization toolkit"
    >
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Catalog
            </TabsTrigger>
            <TabsTrigger value="viewer" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              3D Viewer
            </TabsTrigger>
            <TabsTrigger value="quick-add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Quick Add
            </TabsTrigger>
            <TabsTrigger value="wireframe" className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Wireframe
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="renderer" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Renderer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cabinet Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleCabinetCatalog
                  onCabinetSelect={handleCabinetSelect}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viewer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>3D Cabinet Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleCabinetViewer cabinet={selectedCabinet} />
                </CardContent>
              </Card>
              
              {selectedCabinet && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cabinet Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleCabinetDetails cabinet={selectedCabinet} />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="quick-add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Add Cabinet</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleQuickAdd onAdd={handleCabinetSelect} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wireframe" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Base Cabinet Wireframe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center bg-gray-100 rounded">
                    <div className="w-12 h-12 border-2 border-gray-400"></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Wall Cabinet Wireframe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center bg-gray-100 rounded">
                    <div className="w-12 h-12 border-2 border-gray-400"></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tall Cabinet Wireframe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center bg-gray-100 rounded">
                    <div className="w-12 h-12 border-2 border-gray-400"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cabinet Details Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleCabinetDetails cabinet={selectedCabinet} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="renderer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wireframe Renderer</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleWireframeRenderer asset={selectedCabinet} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
