import { useState } from 'react';
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-simple';
import { Badge } from '@/components/ui/badge-simple';
import { completeTenTenSystem, TemplatePart } from '@/lib/10_10-complete';
import {
  Save,
  RotateCcw,
  Copy,
  Layout,
  Box,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Grid,
  Package,
  Layers
} from 'lucide-react';

export function CompleteTemplateMaker() {
  const [parts, setParts] = useState<TemplatePart[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('Custom Template');
  const [cabinetType, setCabinetType] = useState<'base' | 'wall' | 'tall'>('base');

  const partDefinitions = completeTenTenSystem.templates.getPartDefinitions();

  const createTemplate = (type: 'base' | 'wall' | 'tall') => {
    const newParts = completeTenTenSystem.templates.createTemplate(templateName, type);
    setParts(newParts);
    if (newParts.length > 0) {
      setSelectedId(newParts[0].id);
    }
  };

  const addPart = (partType: string) => {
    const definition = partDefinitions[partType as keyof typeof partDefinitions];
    if (!definition) return;

    const newPart: TemplatePart = {
      id: `${templateName}_${partType}_${Date.now()}`,
      type: partType,
      name: definition.name,
      width: 24,
      height: 24,
      depth: 24,
      thickness: definition.thickness,
      material: definition.material,
      color: definition.color
    };

    setParts([...parts, newPart]);
    setSelectedId(newPart.id);
  };

  const updatePart = (id: string, field: keyof TemplatePart, value: any) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ));
  };

  const deletePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
    if (selectedId === id) {
      setSelectedId(parts.find(p => p.id !== id)?.id || null);
    }
  };

  const duplicatePart = (id: string) => {
    const part = parts.find(p => p.id === id);
    if (part) {
      const newPart = {
        ...part,
        id: `${part.type}_${Date.now()}`,
        name: `${part.name} (Copy)`
      };
      setParts([...parts, newPart]);
      setSelectedId(newPart.id);
    }
  };

  const exportTemplate = () => {
    const json = completeTenTenSystem.templates.exportTemplate(parts);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedParts = completeTenTenSystem.templates.importTemplate(e.target?.result as string);
          setParts(importedParts);
          if (importedParts.length > 0) {
            setSelectedId(importedParts[0].id);
          }
        } catch (error) {
          console.error('Failed to import template:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const resetTemplate = () => {
    setParts([]);
    setSelectedId(null);
    setTemplateName('Custom Template');
  };

  const selectedPart = parts.find(p => p.id === selectedId);

  const renderPreview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Template Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-3 bg-gray-50 dark:bg-[#1a2230] border-gray-200 dark:border-gray-700 overflow-hidden">
          <svg width="100%" height="280" viewBox="0 0 600 280">
            {/* Grid */}
            {[...Array(12)].map((_, i) => (
              <line
                key={`gx${i}`}
                x1={i * 50}
                y1={0}
                x2={i * 50}
                y2={280}
                stroke="#e5e5e5"
                strokeOpacity={0.5}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <line
                key={`gy${i}`}
                x1={0}
                y1={i * 50}
                x2={600}
                y2={i * 50}
                stroke="#e5e5e5"
                strokeOpacity={0.5}
              />
            ))}
            
            {/* Parts */}
            {parts.map((part, idx) => {
              const x = 20 + (idx % 6) * 90;
              const y = 20 + Math.floor(idx / 6) * 90;
              const w = Math.max(40, part.width);
              const h = Math.max(20, part.height * 10);
              const isSel = selectedId === part.id;
              
              return (
                <g key={part.id} onClick={() => setSelectedId(part.id)} style={{ cursor: 'pointer' }}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={part.color}
                    stroke={isSel ? '#2563eb' : '#555'}
                    strokeWidth={isSel ? 3 : 1}
                  />
                  <text
                    x={x + 6}
                    y={y + 16}
                    fill="#fff"
                    fontSize="10"
                    style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {partDefinitions[part.type as keyof typeof partDefinitions]?.name || part.type}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {parts.length} parts • {cabinetType} cabinet
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{cabinetType}</Badge>
            <Badge variant="outline">{parts.length} parts</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPartLibrary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Part Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(partDefinitions).map(([key, definition]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => addPart(key)}
              className="h-auto p-2 flex flex-col items-center"
            >
              <div
                className="w-4 h-4 rounded mb-1"
                style={{ backgroundColor: definition.color }}
              />
              <span className="text-xs text-center">{definition.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderPartProperties = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Part Properties
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedPart ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={selectedPart.type}
                onChange={(e) => updatePart(selectedPart.id, 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(partDefinitions).map(key => (
                  <option key={key} value={key}>
                    {partDefinitions[key as keyof typeof partDefinitions].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Width (in)</label>
                <input
                  type="number"
                  value={selectedPart.width}
                  onChange={(e) => updatePart(selectedPart.id, 'width', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (in)</label>
                <input
                  type="number"
                  value={selectedPart.height}
                  onChange={(e) => updatePart(selectedPart.id, 'height', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Depth (in)</label>
                <input
                  type="number"
                  value={selectedPart.depth}
                  onChange={(e) => updatePart(selectedPart.id, 'depth', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Material</label>
                <input
                  type="text"
                  value={selectedPart.material}
                  onChange={(e) => updatePart(selectedPart.id, 'material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thickness</label>
                <input
                  type="number"
                  value={selectedPart.thickness}
                  onChange={(e) => updatePart(selectedPart.id, 'thickness', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="color"
                value={selectedPart.color}
                onChange={(e) => updatePart(selectedPart.id, 'color', e.target.value)}
                className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => duplicatePart(selectedPart.id)} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button onClick={() => deletePart(selectedPart.id)} variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Box className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No part selected</p>
            <p className="text-sm">Select a part from the preview or add a new one</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPartList = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Part List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {parts.map(part => (
            <div
              key={part.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedId === part.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-[#1a2230] border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setSelectedId(part.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: part.color }}
                  />
                  <div>
                    <div className="font-medium">{part.name}</div>
                    <div className="text-sm text-gray-500">
                      {part.width}" × {part.height}" × {part.depth}"
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePart(part.id);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePart(part.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Complete Template Maker</h2>
          <p className="text-gray-600">Create custom cabinet templates with detailed parts</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input type="file" accept=".json" onChange={importTemplate} className="hidden" />
          </label>
          <Button onClick={exportTemplate} disabled={parts.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Template Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Template Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cabinet Type</label>
              <select
                value={cabinetType}
                onChange={(e) => setCabinetType(e.target.value as 'base' | 'wall' | 'tall')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="base">Base Cabinet</option>
                <option value="wall">Wall Cabinet</option>
                <option value="tall">Tall Cabinet</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => createTemplate(cabinetType)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
              <Button onClick={resetTemplate} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {renderPartLibrary()}
          {renderPartList()}
        </div>
        
        <div className="space-y-6">
          {renderPreview()}
          {renderPartProperties()}
        </div>
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Template: {templateName} • Type: {cabinetType}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{parts.length} parts</span>
              </div>
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span>
                  {parts.reduce((sum, part) => sum + (part.width * part.height * part.depth), 0).toFixed(0)} in³
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
