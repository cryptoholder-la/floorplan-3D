'use client';

import React, { useState } from 'react';
import { DWGAssetLibrary } from '@/components/DWGAssetLibrary';
import { DWGAssetViewer } from '@/components/DWGAssetViewer';
import { DWGFileUploader } from '@/components/DWGFileUploader';
import { DWGAsset } from '@/services/dwgService';

export default function DWGAssetsPage() {
  const [selectedAsset, setSelectedAsset] = useState<DWGAsset | null>(null);
  const [loadedModel, setLoadedModel] = useState<any>(null);
  const [showUploader, setShowUploader] = useState(false);

  const handleAssetSelect = (asset: DWGAsset) => {
    setSelectedAsset(asset);
    setLoadedModel(null); // Reset model when new asset is selected
  };

  const handleAssetLoad = (assetId: string, model: any) => {
    if (selectedAsset && selectedAsset.id === assetId) {
      setLoadedModel(model);
    }
  };

  const handleFileUploaded = (asset: DWGAsset) => {
    // Switch back to library view and select the uploaded asset
    setShowUploader(false);
    handleAssetSelect(asset);
  };

  const handleError = (error: string) => {
    console.error('DWG upload error:', error);
    // You could show a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DWG Asset Manager</h1>
              <p className="text-sm text-gray-600 mt-1">
                Browse, upload, and manage your CAD drawing assets for 3D floorplan design
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploader(!showUploader)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${showUploader 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }
                `}
              >
                {showUploader ? 'Back to Library' : 'Upload DWG'}
              </button>
              <div className="text-sm text-gray-500">
                {selectedAsset ? (
                  <span>Selected: <span className="font-medium text-gray-900">{selectedAsset.name}</span></span>
                ) : (
                  <span>No asset selected</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {showUploader ? (
            // File Upload View
            <div className="w-full flex items-center justify-center bg-gray-50">
              <DWGFileUploader 
                onFileUploaded={handleFileUploaded}
                onError={handleError}
              />
            </div>
          ) : (
            // Library and Viewer View
            <>
              {/* Asset Library - Left Panel */}
              <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white">
                <DWGAssetLibrary 
                  onAssetSelect={handleAssetSelect}
                  onAssetLoad={handleAssetLoad}
                />
              </div>

              {/* 3D Viewer - Right Panel */}
              <div className="w-1/2 bg-gray-100">
                <DWGAssetViewer 
                  asset={selectedAsset}
                  model={loadedModel}
                  className="w-full h-full"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
