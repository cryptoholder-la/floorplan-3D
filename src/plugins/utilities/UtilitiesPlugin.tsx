'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Eye, Settings, Search, Filter } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

interface DesignTemplate {
  id: string;
  name: string;
  type: 'kitchen' | 'bathroom' | 'closet' | 'office';
  description: string;
  preview: string;
  category: string;
}

export default function UtilitiesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates] = useState<DesignTemplate[]>([
    {
      id: 'modern-kitchen',
      name: 'Modern Kitchen',
      type: 'kitchen',
      description: 'Contemporary kitchen design with island',
      preview: '/templates/modern-kitchen.jpg',
      category: 'kitchen'
    },
    {
      id: 'classic-bathroom',
      name: 'Classic Bathroom',
      type: 'bathroom',
      description: 'Traditional bathroom layout',
      preview: '/templates/classic-bathroom.jpg',
      category: 'bathroom'
    },
    {
      id: 'walk-in-closet',
      name: 'Walk-in Closet',
      type: 'closet',
      description: 'Spacious walk-in closet design',
      preview: '/templates/walk-in-closet.jpg',
      category: 'closet'
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const newFile: UploadedFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'processing'
        };
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simulate processing
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === newFile.id ? { ...f, status: 'completed' } : f)
          );
        }, 2000);
      });
    }
  };

  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const exportFiles = () => {
    const dataStr = JSON.stringify(uploadedFiles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `files-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Utilities</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              File Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 mb-4">Drop files here or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild>
                  <label htmlFor="file-upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </label>
                </Button>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Files</h4>
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          file.status === 'completed' ? 'bg-green-500' :
                          file.status === 'processing' ? 'bg-yellow-500' :
                          file.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }>
                          {file.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {uploadedFiles.length > 0 && (
                <Button onClick={exportFiles} className="w-full mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Export Files
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Catalog Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Import Format</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="json">JSON File</SelectItem>
                    <SelectItem value="dwg">DWG File</SelectItem>
                    <SelectItem value="excel">Excel File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Import Options</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Update existing items</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Validate data</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Create backup</span>
                  </label>
                </div>
              </div>
              
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import Catalog
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Template Browser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="closet">Closet</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <Eye className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-gray-600">{template.description}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-center text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">3D Model Viewer</p>
                  <p className="text-xs">Supports DWG, STEP, 3DM files</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Load Model
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Error Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select error type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="performance">Performance Issue</SelectItem>
                    <SelectItem value="ui">UI Problem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Describe the issue..."
                />
              </div>
              
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Import Backup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                System Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}