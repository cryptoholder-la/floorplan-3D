import { useState } from 'react';
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-simple';
import { Badge } from '@/components/ui/badge-simple';
import { completeTenTenSystem, DrillingPattern } from '@/lib/10_10-complete';
import {
  Settings,
  Grid,
  ArrowDown,
  ArrowRight,
  Save,
  Copy,
  RotateCcw,
  FileJson,
  FileText,
  Check,
  Download,
  Eye,
  EyeOff,
  Ruler,
  Target,
  Zap
} from 'lucide-react';

export function CompleteDrillingPatterns() {
  const [config, setConfig] = useState({
    panelType: 'side',
    systemPreset: '32mm',
    patternPreset: '32mm_shelf',
    height: 720,
    depth: 560,
    thickness: 18,
    baselineTop: 37,
    baselineBottom: 37,
    spacing: 32,
    offsetFront: 37,
    mirrorRows: true,
    includeCenterRow: false
  });
  
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const panelDefaults = {
    side: { height: 720, depth: 560 },
    back: { height: 720, depth: 700 },
    custom: { height: 720, depth: 560 }
  };

  const patternPresets = completeTenTenSystem.drilling.getPresets();

  const pattern = useMemo(() => {
    return completeTenTenSystem.drilling.calculateDrillingPattern(config);
  }, [config]);

  const applyPreset = (presetKey: string) => {
    const updatedConfig = completeTenTenSystem.drilling.applyPreset(presetKey, config);
    setConfig(updatedConfig);
  };

  const handleSystemChange = (system: string) => {
    const updates = { systemPreset: system };
    if (system === '32mm') {
      Object.assign(updates, { spacing: 32, baselineTop: 37, baselineBottom: 37, offsetFront: 37 });
    } else if (system === '1in') {
      Object.assign(updates, { spacing: 25.4, baselineTop: 25.4, baselineBottom: 25.4, offsetFront: 25.4 });
    }
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handlePanelTypeChange = (type: string) => {
    const def = panelDefaults[type as keyof typeof panelDefaults];
    setConfig(prev => ({ ...prev, panelType: type, height: def.height, depth: def.depth }));
  };

  const downloadJSON = () => {
    const data = { meta: config, holes: pattern };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drilling_${config.panelType}_${config.patternPreset}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyCSV = () => {
    const csv = [
      'index,row,y_mm,x_mm',
      ...pattern.map(p => `${p.index},${p.row},${p.y.toFixed(2)},${p.x.toFixed(2)}`)
    ].join('\n');
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPatternPreview = () => {
    const scale = 0.5;
    const panelWidth = 300;
    const panelHeight = 400;
    
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium mb-4">Pattern Preview</h4>
        <svg width={panelWidth} height={panelHeight} className="border border-gray-300 dark:border-gray-600 rounded">
          {/* Panel background */}
          <rect x={0} y={0} width={panelWidth} height={panelHeight} fill="#f3f4f6" stroke="#d1d5db" />
          
          {/* Grid lines */}
          {[...Array(13)].map((_, i) => (
            <line
              key={`gx${i}`}
              x1={i * 25}
              y1={0}
              x2={i * 25}
              y2={panelHeight}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          ))}
          {[...Array(17)].map((_, i) => (
            <line
              key={`gy${i}`}
              x1={0}
              y1={i * 25}
              x2={panelWidth}
              y2={i * 25}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          ))}
          
          {/* Drilling holes */}
          {pattern.map((hole, index) => {
            const x = (hole.x / config.depth) * panelWidth;
            const y = (hole.y / config.height) * panelHeight;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill={hole.row === 'front' ? '#3b82f6' : hole.row === 'rear' ? '#10b981' : '#f59e0b'}
                  stroke="#1f2937"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={y - 8}
                  fontSize={8}
                  textAnchor="middle"
                  fill="#374151"
                >
                  {hole.index}
                </text>
              </g>
            );
          })}
          
          {/* Labels */}
          <text x={10} y={20} fontSize={12} fill="#6b7280">Front</text>
          <text x={panelWidth - 40} y={20} fontSize={12} fill="#6b7280">Rear</text>
          <text x={panelWidth / 2 - 20} y={20} fontSize={12} fill="#6b7280">Center</text>
        </svg>
        
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Front</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Rear</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Center</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPatternTable = () => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h4 className="font-medium mb-4">Drilling Coordinates</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Row</th>
              <th className="text-left p-2">Y (mm)</th>
              <th className="text-left p-2">X (mm)</th>
            </tr>
          </thead>
          <tbody>
            {pattern.map((hole, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="p-2">{hole.index}</td>
                <td className="p-2">
                  <Badge variant="outline" className="text-xs">
                    {hole.row}
                  </Badge>
                </td>
                <td className="p-2 font-mono">{hole.y.toFixed(2)}</td>
                <td className="p-2 font-mono">{hole.x.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Complete Drilling Patterns</h2>
          <p className="text-gray-600">32mm system drilling patterns for cabinet construction</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Panel Type</label>
                <select
                  value={config.panelType}
                  onChange={(e) => handlePanelTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="side">Side Panel</option>
                  <option value="back">Back Panel</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">System Preset</label>
                <select
                  value={config.systemPreset}
                  onChange={(e) => handleSystemChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="32mm">32mm System</option>
                  <option value="1in">1 Inch System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pattern Preset</label>
                <select
                  value={config.patternPreset}
                  onChange={(e) => applyPreset(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(patternPresets).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Height (mm)</label>
                  <input
                    type="number"
                    value={config.height}
                    onChange={(e) => setConfig(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Depth (mm)</label>
                  <input
                    type="number"
                    value={config.depth}
                    onChange={(e) => setConfig(prev => ({ ...prev, depth: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Baseline Top</label>
                  <input
                    type="number"
                    value={config.baselineTop}
                    onChange={(e) => setConfig(prev => ({ ...prev, baselineTop: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Baseline Bottom</label>
                  <input
                    type="number"
                    value={config.baselineBottom}
                    onChange={(e) => setConfig(prev => ({ ...prev, baselineBottom: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Spacing</label>
                  <input
                    type="number"
                    value={config.spacing}
                    onChange={(e) => setConfig(prev => ({ ...prev, spacing: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Offset Front</label>
                  <input
                    type="number"
                    value={config.offsetFront}
                    onChange={(e) => setConfig(prev => ({ ...prev, offsetFront: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.mirrorRows}
                    onChange={(e) => setConfig(prev => ({ ...prev, mirrorRows: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Mirror Rows (Front/Rear)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.includeCenterRow}
                    onChange={(e) => setConfig(prev => ({ ...prev, includeCenterRow: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include Center Row</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={downloadJSON} className="w-full">
                <FileJson className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
              <Button onClick={copyCSV} variant="outline" className="w-full">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy CSV'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Results */}
        <div className="lg:col-span-2 space-y-6">
          {showPreview && renderPatternPreview()}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Pattern Results
                <Badge variant="outline">{pattern.length} holes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pattern.length > 0 ? (
                renderPatternTable()
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No drilling holes generated</p>
                  <p className="text-sm">Adjust configuration to generate pattern</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                Pattern Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{pattern.length}</div>
                  <div className="text-sm text-gray-600">Total Holes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {pattern.filter(p => p.row === 'front').length}
                  </div>
                  <div className="text-sm text-gray-600">Front Row</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {pattern.filter(p => p.row === 'rear').length}
                  </div>
                  <div className="text-sm text-gray-600">Rear Row</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {pattern.filter(p => p.row === 'center').length}
                  </div>
                  <div className="text-sm text-gray-600">Center Row</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
