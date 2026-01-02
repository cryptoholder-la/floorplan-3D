'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Button } from '@/ui/button'
import { Upload, FileText, CheckCircle } from 'lucide-react'

export default function DWGFileUploader() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle')

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && (file.name.endsWith('.dwg') || file.name.endsWith('.DXF'))) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setUploadStatus('loading')
    try {
      // Simulate DWG file upload and processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      setUploadStatus('success')
    } catch (error) {
      setUploadStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-4">
          Upload DWG or DXF files for conversion to 3D models
        </p>
        <input
          type="file"
          accept=".dwg,.DXF"
          onChange={handleFileSelect}
          className="hidden"
          id="dwg-upload"
        />
        <label htmlFor="dwg-upload">
          <Button variant="outline" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Select DWG File
          </Button>
        </label>
      </div>
      
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <span className="text-sm font-medium">{selectedFile.name}</span>
          <Button onClick={handleUpload} disabled={uploadStatus === 'loading'}>
            {uploadStatus === 'loading' ? 'Processing...' : 'Upload & Convert'}
          </Button>
        </div>
      )}
      
      {uploadStatus === 'loading' && (
        <div className="text-blue-600">Processing DWG file...</div>
      )}
      
      {uploadStatus === 'success' && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          DWG file processed successfully!
        </div>
      )}
    </div>
  )
}
