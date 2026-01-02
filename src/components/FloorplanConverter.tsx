"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Box, 
  Layers, 
  Settings, 
  Download, 
  Eye, 
  Grid3x3,
  Search,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { WireframeAsset } from '@/types/wireframe';

interface FloorplanConverterProps {
  onAssetsGenerated: (assets: WireframeAsset[]) => void;
}

export default function FloorplanConverter({ onAssetsGenerated }: FloorplanConverterProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [conversionSettings, setConversionSettings] = useState({
    generateWireframes: true,
    includeDimensions: true,
    autoDetectComponents: true,
    optimizeGeometry: true,
    wireframeDensity: 50,
    scale: 1.0
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['.json', '.js', '.obj', '.dxf', '.dwg'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        toast.error('Invalid file type. Please upload JSON, JS, OBJ, DXF, or DWG files.');
        return;
      }
      
      setUploadedFile(file);
      toast.success(`Uploaded: ${file.name}`);
    }
  };

  const processFile = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock wireframe assets based on the uploaded file
      const mockAssets: WireframeAsset[] = [
        {
          id: `converted-${uploadedFile.name.replace(/\.[^/.]+$/, '')}-cabinet`,
          name: `Converted Cabinet from ${uploadedFile.name}`,
          path: uploadedFile.name,
          category: 'kitchen',
          type: 'cabinet',
          description: `Automatically converted from ${uploadedFile.name}`,
          geometry: 'BoxGeometry',
          material: 'WireframeMaterial',
          dimensions: { width: 600, height: 720, depth: 560 },
          parts: [
            {
              id: 'converted-side-left',
              name: 'Left Side Panel',
              type: 'panel',
              dimensions: { width: 18, height: 720, thickness: 18 },
              material: 'Plywood',
              quantity: 1,
              position: { x: 0, y: 0, z: 0 },
              color: '#d4a574'
            },
            {
              id: 'converted-side-right',
              name: 'Right Side Panel',
              type: 'panel',
              dimensions: { width: 18, height: 720, thickness: 18 },
              material: 'Plywood',
              quantity: 1,
              position: { x: 582, y: 0, z: 0 },
              color: '#d4a574'
            }
          ],
          accessories: [
            {
              id: 'converted-handle',
              name: 'Door Handle',
              type: 'handle',
              position: { x: 200, y: 360, z: 542 },
              dimensions: { width: 160, height: 20, depth: 25 },
              material: 'Stainless Steel',
              color: '#c0c0c0',
              quantity: 2
            }
          ],
          renderSettings: {
            opacity: conversionSettings.wireframeDensity / 100,
            color: '#888888',
            showWireframe: true,
            showSolid: false
          }
        }
      ];

      onAssetsGenerated(mockAssets);
      toast.success(`Successfully converted ${uploadedFile.name} to wireframe assets`);
      
    } catch (error) {
      console.error('Conversion failed:', error);
      toast.error('Failed to convert file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Floorplan Converter
        </CardTitle>
        <CardDescription>
          Convert floorplan files, CAD drawings, and 3D models to wireframe assets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Upload Floorplan File</p>
              <p className="text-sm text-gray-600">
                Supported formats: JSON, JavaScript, OBJ, DXF, DWG
              </p>
              <input
                type="file"
                accept=".json,.js,.obj,.dxf,.dwg"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>

          {uploadedFile && (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">{uploadedFile.name}</span>
                <Badge variant="secondary">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setUploadedFile(null)}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Conversion Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Conversion Settings
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Switch
                checked={conversionSettings.generateWireframes}
                onCheckedChange={(checked) =>
                  setConversionSettings(prev => ({ ...prev, generateWireframes: checked }))
                }
              />
              <label className="text-sm font-medium">Generate Wireframes</label>
            </div>
            
            <div className="space-y-2">
              <Switch
                checked={conversionSettings.includeDimensions}
                onCheckedChange={(checked) =>
                  setConversionSettings(prev => ({ ...prev, includeDimensions: checked }))
                }
              />
              <label className="text-sm font-medium">Include Dimensions</label>
            </div>
            
            <div className="space-y-2">
              <Switch
                checked={conversionSettings.autoDetectComponents}
                onCheckedChange={(checked) =>
                  setConversionSettings(prev => ({ ...prev, autoDetectComponents: checked }))
                }
              />
              <label className="text-sm font-medium">Auto-Detect Components</label>
            </div>
            
            <div className="space-y-2">
              <Switch
                checked={conversionSettings.optimizeGeometry}
                onCheckedChange={(checked) =>
                  setConversionSettings(prev => ({ ...prev, optimizeGeometry: checked }))
                }
              />
              <label className="text-sm font-medium">Optimize Geometry</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Wireframe Density</label>
            <Slider
              value={[conversionSettings.wireframeDensity]}
              onValueChange={(value) =>
                setConversionSettings(prev => ({ ...prev, wireframeDensity: value[0] }))
              }
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
            <span className="text-xs text-gray-600">{conversionSettings.wireframeDensity}%</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Scale Factor</label>
            <Select 
              value={conversionSettings.scale.toString()} 
              onValueChange={(value) =>
                setConversionSettings(prev => ({ ...prev, scale: parseFloat(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1.0">1.0x (Original)</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2.0">2.0x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Process Button */}
        <Button 
          onClick={processFile}
          disabled={!uploadedFile || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Convert to Wireframe
            </>
          )}
        </Button>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">Conversion Information</p>
              <p className="text-blue-700 mt-1">
                The converter will analyze your uploaded file and automatically generate wireframe assets 
                with proper dimensions, materials, and component structure. Processing time varies based on file complexity.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
