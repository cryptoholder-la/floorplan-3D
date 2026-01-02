'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import FileUpload from '@/components/FileUpload';
import CatalogImporter from '@/components/CatalogImporter';
import TemplateSelector from '@/components/TemplateSelector';
import ErrorReporter from '@/components/ErrorReporter';
import DWGFileUploader from '@/components/DWGFileUploader';
import AssetViewer from '@/components/AssetViewer';
import ModelViewer from '@/components/ModelViewer';
import { Upload, Download, Layers, AlertTriangle, Database, Eye, File } from 'lucide-react';

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <MainLayout 
      title="Utilities" 
      subtitle="File management and system utilities"
    >
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              File Upload
            </TabsTrigger>
            <TabsTrigger value="dwg" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              DWG Upload
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Catalog Import
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="viewer" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Asset Viewer
            </TabsTrigger>
            <TabsTrigger value="model" className="flex items-center gap-2">
              <File className="w-4 h-4" />
              Model Viewer
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Error Reporter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>File Upload Utility</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dwg" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DWG File Uploader</CardTitle>
              </CardHeader>
              <CardContent>
                <DWGFileUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catalog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Catalog Importer</CardTitle>
              </CardHeader>
              <CardContent>
                <CatalogImporter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Selector</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelector />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viewer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <AssetViewer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>3D Model Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <ModelViewer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Reporter</CardTitle>
              </CardHeader>
              <CardContent>
                <ErrorReporter />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
