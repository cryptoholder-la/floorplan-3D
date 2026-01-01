import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-simple';
import { Badge } from '@/components/ui/badge-simple';
import { completeTenTenSystem, FloorplanData } from '@/lib/10_10-complete';
import {
  Camera,
  Ruler,
  Layers,
  Eye,
  EyeOff,
  Save,
  Upload,
  Download,
  Grid,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Move,
  Scale,
  Hash,
  Edit3,
  Plus,
  Minus,
  X,
  Loader,
  RefreshCw
} from 'lucide-react';

interface DetectedFeatures {
  ceilingHeight: number | null;
  floorLevel: number | null;
  walls: any[];
  windows: any[];
  doors: any[];
  obstacles: any[];
  lowSpots: any[];
}

export function CompletePhoto2Plan() {
  const [step, setStep] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [referenceMeasurements, setReferenceMeasurements] = useState<Array<{pixels: number; millimeters: number}>>([]);
  const [detectedFeatures, setDetectedFeatures] = useState<DetectedFeatures>({
    ceilingHeight: null,
    floorLevel: null,
    walls: [],
    windows: [],
    doors: [],
    obstacles: [],
    lowSpots: []
  });
  const [scaleFactor, setScaleFactor] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTool, setActiveTool] = useState('measure');
  const [manualPoints, setManualPoints] = useState<Array<{x: number; y: number}>>([]);
  const [floorplanData, setFloorplanData] = useState<FloorplanData | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setStep('calibrate');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReference = () => {
    const newRef = {
      pixels: Math.floor(Math.random() * 100) + 50,
      millimeters: Math.floor(Math.random() * 1000) + 500
    };
    setReferenceMeasurements([...referenceMeasurements, newRef]);
  };

  const handleCalibrate = () => {
    if (referenceMeasurements.length > 0) {
      const scale = completeTenTenSystem.scanner.calibrateScale(referenceMeasurements);
      setScaleFactor(scale);
      setStep('detect');
    }
  };

  const handleDetectFeatures = async () => {
    setIsProcessing(true);
    
    // Simulate feature detection
    setTimeout(() => {
      const mockFeatures: DetectedFeatures = {
        ceilingHeight: 2400,
        floorLevel: 0,
        walls: [
          { id: 'wall1', start: { x: 0, y: 0 }, end: { x: 6000, y: 0 } },
          { id: 'wall2', start: { x: 6000, y: 0 }, end: { x: 6000, y: 4000 } },
          { id: 'wall3', start: { x: 6000, y: 4000 }, end: { x: 0, y: 4000 } },
          { id: 'wall4', start: { x: 0, y: 4000 }, end: { x: 0, y: 0 } }
        ],
        windows: [
          { id: 'window1', position: { x: 1000, y: 1200 }, width: 1200, height: 1200 }
        ],
        doors: [
          { id: 'door1', position: { x: 3000, y: 100 }, width: 900, height: 2000 }
        ],
        obstacles: [],
        lowSpots: []
      };
      
      setDetectedFeatures(mockFeatures);
      setIsProcessing(false);
      setStep('refine');
    }, 2000);
  };

  const handleRefine = () => {
    setStep('export');
  };

  const handleExport = () => {
    if (detectedFeatures) {
      const mockFloorplan: FloorplanData = {
        walls: detectedFeatures.walls.map(wall => ({
          id: wall.id,
          start: wall.start,
          end: wall.end,
          height: 2400,
          thickness: 120
        })),
        rooms: [
          {
            id: 'room1',
            name: 'Kitchen',
            points: [
              { x: 100, y: 100 },
              { x: 5900, y: 100 },
              { x: 5900, y: 3900 },
              { x: 100, y: 3900 }
            ],
            color: '#e3f2fd'
          }
        ],
        openings: [
          ...detectedFeatures.doors.map(door => ({
            id: door.id,
            type: 'door' as const,
            position: door.position,
            width: door.width,
            height: door.height
          })),
          ...detectedFeatures.windows.map(window => ({
            id: window.id,
            type: 'window' as const,
            position: window.position,
            width: window.width,
            height: window.height
          }))
        ],
        detectedFeatures
      };

      setFloorplanData(mockFloorplan);
    }
  };

  const handleDownloadJSON = () => {
    if (floorplanData) {
      const json = completeTenTenSystem.scanner.exportToJSON(floorplanData);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'floorplan.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadDXF = () => {
    if (floorplanData) {
      const dxf = completeTenTenSystem.scanner.exportToDXF(floorplanData);
      const blob = new Blob([dxf], { type: 'application/dxf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'floorplan.dxf';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderUploadStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Floorplan Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderCalibrateStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="w-5 h-5" />
          Calibrate Scale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Reference Measurements</h4>
            <p className="text-sm text-gray-600 mb-4">
              Add reference measurements to calibrate the scale. Click on known measurements in the image.
            </p>
            
            <div className="space-y-2">
              {referenceMeasurements.map((ref, index) => (
                <div key={index} className="flex items-center gap-4 p-2 bg-white rounded border">
                  <span className="text-sm">Reference {index + 1}</span>
                  <span className="text-sm font-mono">{ref.pixels}px</span>
                  <span className="text-sm">=</span>
                  <span className="text-sm font-mono">{ref.millimeters}mm</span>
                </div>
              ))}
            </div>
            
            <Button onClick={handleAddReference} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Reference
            </Button>
          </div>
          
          {uploadedImage && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Preview</h4>
              <img src={uploadedImage} alt="Uploaded" className="w-full rounded" />
            </div>
          )}
          
          <Button onClick={handleCalibrate} disabled={referenceMeasurements.length === 0}>
            <Target className="w-4 h-4 mr-2" />
            Calibrate Scale
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDetectStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Detect Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Feature Detection</h4>
            <p className="text-sm text-gray-600 mb-4">
              AI will detect walls, doors, windows, and other features from your image.
            </p>
            
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing image...</span>
              </div>
            ) : (
              <Button onClick={handleDetectFeatures}>
                <Eye className="w-4 h-4 mr-2" />
                Start Detection
              </Button>
            )}
          </div>
          
          {detectedFeatures.walls.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-green-800">Detection Results</h4>
              <div className="space-y-1 text-sm">
                <div>Walls detected: {detectedFeatures.walls.length}</div>
                <div>Windows detected: {detectedFeatures.windows.length}</div>
                <div>Doors detected: {detectedFeatures.doors.length}</div>
                <div>Ceiling height: {detectedFeatures.ceilingHeight}mm</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderRefineStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Refine Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Manual Corrections</h4>
            <p className="text-sm text-gray-600 mb-4">
              Review and correct the detected features before exporting.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Walls</Badge>
                <span>{detectedFeatures.walls.length} detected</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Windows</Badge>
                <span>{detectedFeatures.windows.length} detected</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Doors</Badge>
                <span>{detectedFeatures.doors.length} detected</span>
              </div>
            </div>
          </div>
          
          <Button onClick={handleRefine}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Continue to Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderExportStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Floorplan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Export Options</h4>
            <p className="text-sm text-gray-600 mb-4">
              Export your floorplan in various formats for use in other tools.
            </p>
            
            <div className="space-y-2">
              <Button onClick={handleExport} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Generate Floorplan
              </Button>
              
              {floorplanData && (
                <>
                  <Button onClick={handleDownloadJSON} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON
                  </Button>
                  
                  <Button onClick={handleDownloadDXF} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download DXF
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {floorplanData && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-green-800">Export Summary</h4>
              <div className="space-y-1 text-sm">
                <div>Walls: {floorplanData.walls.length}</div>
                <div>Rooms: {floorplanData.rooms.length}</div>
                <div>Openings: {floorplanData.openings.length}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const steps = [
    { id: 'upload', title: 'Upload', icon: Upload },
    { id: 'calibrate', title: 'Calibrate', icon: Ruler },
    { id: 'detect', title: 'Detect', icon: Eye },
    { id: 'refine', title: 'Refine', icon: Edit3 },
    { id: 'export', title: 'Export', icon: Download }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === stepItem.id ? 'bg-blue-600 text-white' : 
                  steps.findIndex(s => s.id === step) > index ? 'bg-green-600 text-white' : 
                  'bg-gray-200 text-gray-600'
                }`}>
                  <stepItem.icon className="w-4 h-4" />
                </div>
                <span className={`ml-2 text-sm ${
                  step === stepItem.id ? 'text-blue-600 font-medium' : 
                  steps.findIndex(s => s.id === step) > index ? 'text-green-600' : 
                  'text-gray-600'
                }`}>
                  {stepItem.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    steps.findIndex(s => s.id === step) > index ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {step === 'upload' && renderUploadStep()}
      {step === 'calibrate' && renderCalibrateStep()}
      {step === 'detect' && renderDetectStep()}
      {step === 'refine' && renderRefineStep()}
      {step === 'export' && renderExportStep()}
    </div>
  );
}
