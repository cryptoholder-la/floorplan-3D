'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Input } from '@/ui/input'
import { Button } from '@/ui/button'
import { Upload, Database, CheckCircle } from 'lucide-react'

export default function CatalogImporter() {
  const [importUrl, setImportUrl] = useState('')
  const [importStatus, setImportStatus] = useState('idle')

  const handleImport = async () => {
    if (!importUrl) return
    
    setImportStatus('loading')
    try {
      // Simulate catalog import
      await new Promise(resolve => setTimeout(resolve, 2000))
      setImportStatus('success')
    } catch (error) {
      setImportStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter catalog URL or select file..."
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleImport} disabled={!importUrl || importStatus === 'loading'}>
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </div>
      
      {importStatus === 'loading' && (
        <div className="flex items-center gap-2 text-blue-600">
          <Database className="w-4 h-4 animate-spin" />
          Importing catalog...
        </div>
      )}
      
      {importStatus === 'success' && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          Catalog imported successfully!
        </div>
      )}
    </div>
  )
}
