'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-simple';
import { Badge } from '@/components/ui/badge-simple';
import { completeTenTenSystem, CabinetItem } from '@/lib/10_10-complete';
import {
  Search,
  Plus,
  Filter,
  ChevronRight,
  Save,
  Trash2,
  Ruler,
  Box,
  Layers,
  Settings,
  ArrowLeft,
  Edit3,
  Download,
  Upload,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  Truck
} from 'lucide-react';

interface CompleteInventoryManagerProps {
  onClose?: () => void;
}

export function CompleteInventoryManager({ onClose }: CompleteInventoryManagerProps) {
  const [cabinets, setCabinets] = useState<CabinetItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState<CabinetItem | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    try {
      const raw = window.localStorage?.getItem('kitchen_scene_inventory');
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          const cleanData = data.map((c, i) => ({
            ...c,
            id: c.id || `cab-${Date.now()}-${i}`,
            name: c.name || c.code || `Cabinet ${i + 1}`,
            width: Number(c.width) || 0,
            height: Number(c.height) || 0,
            depth: Number(c.depth) || 0,
            category: c.category || 'base',
            material: c.material || 'Plywood',
            finish: c.finish || 'Matte White'
          }));
          setCabinets(cleanData);
          if (cleanData.length > 0) setSelectedId(cleanData[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load inventory:', e);
    }
  };

  const saveToStorage = (updatedCabinets: CabinetItem[]) => {
    try {
      window.localStorage.setItem('kitchen_scene_inventory', JSON.stringify(updatedCabinets));
      window.dispatchEvent(new Event('inventory-updated'));
    } catch (e) {
      console.error('Failed to save inventory:', e);
    }
  };

  const handleUpdate = (id: string, updates: Partial<CabinetItem>) => {
    const updated = cabinets.map((c) => c.id === id ? { ...c, ...updates } : c);
    setCabinets(updated);
    saveToStorage(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this cabinet?')) return;
    const updated = cabinets.filter((c) => c.id !== id);
    setCabinets(updated);
    if (selectedId === id) setSelectedId(updated[0]?.id || null);
    saveToStorage(updated);
  };

  const handleAdd = () => {
    const templates = completeTenTenSystem.cabinets.getTemplates();
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    const newCab = completeTenTenSystem.cabinets.createCabinet(randomTemplate);
    setCabinets([...cabinets, newCab]);
    setSelectedId(newCab.id);
    saveToStorage([...cabinets, newCab]);
  };

  const handleEdit = (cabinet: CabinetItem) => {
    setEditingCabinet({ ...cabinet });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingCabinet) {
      handleUpdate(editingCabinet.id, editingCabinet);
      setIsEditing(false);
      setEditingCabinet(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCabinet(null);
  };

  const handleExport = () => {
    const data = JSON.stringify(cabinets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) {
            setCabinets(data);
            saveToStorage(data);
          }
        } catch (error) {
          console.error('Failed to import inventory:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredCabinets = cabinets.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || c.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const selectedCabinet = cabinets.find((c) => c.id === selectedId);

  const categories = ['all', 'base', 'wall', 'tall', 'appliance', 'fixture'];

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-[#101722] text-gray-900 dark:text-gray-100 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2230] p-4">
        <div className="flex items-center gap-3">
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-bold">Complete Cabinet Inventory</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1a2230] border-b border-gray-200 dark:border-gray-800">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search cabinets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Cabinet
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Cabinet List */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <div className="p-4 space-y-2">
            {filteredCabinets.map((cabinet) => (
              <div
                key={cabinet.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedId === cabinet.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-[#1a2230] border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSelectedId(cabinet.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{cabinet.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {cabinet.code} • {cabinet.width}" × {cabinet.height}" × {cabinet.depth}"
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {cabinet.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {cabinet.material} • {cabinet.finish}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(cabinet);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cabinet.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cabinet Details */}
        <div className="w-1/2 overflow-y-auto">
          {isEditing && editingCabinet ? (
            <Card className="m-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Edit Cabinet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={editingCabinet.name}
                        onChange={(e) => setEditingCabinet({ ...editingCabinet, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Code</label>
                      <input
                        type="text"
                        value={editingCabinet.code}
                        onChange={(e) => setEditingCabinet({ ...editingCabinet, code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Width (in)</label>
                      <input
                        type="number"
                        value={editingCabinet.width}
                        onChange={(e) => setEditingCabinet({ ...editingCabinet, width: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Height (in)</label>
                      <input
                        type="number"
                        value={editingCabinet.height}
                        onChange={(e) => setEditingCabinet({ ...editingCabinet, height: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Depth (in)</label>
                      <input
                        type="number"
                        value={editingCabinet.depth}
                        onChange={(e) => setEditingCabinet({ ...editingCabinet, depth: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Material</label>
                      <input
                        type="text"
                        value={editingCabinet.material}
                        onChange={(e) => setEditingCabinet({ ...editingCabinet, material: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Finish</label>
                      <input
                        type="text"
                        value={editingCabinet.finish}
                        onChange={(e) => setEditingCabinet({ ...editingCabinet, finish: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedCabinet ? (
            <Card className="m-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {selectedCabinet.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Code</div>
                      <div className="font-medium">{selectedCabinet.code}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <Badge variant="outline">{selectedCabinet.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Width</div>
                      <div className="font-medium">{selectedCabinet.width}"</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Height</div>
                      <div className="font-medium">{selectedCabinet.height}"</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Depth</div>
                      <div className="font-medium">{selectedCabinet.depth}"</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Material</div>
                      <div className="font-medium">{selectedCabinet.material}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Finish</div>
                      <div className="font-medium">{selectedCabinet.finish}</div>
                    </div>
                  </div>
                  
                  {selectedCabinet.shipping && (
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-500 mb-2">Shipping Information</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedCabinet.shipping.cubicFootage} ft³</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">${selectedCabinet.shipping.shippingPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(selectedCabinet)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" onClick={() => handleDelete(selectedCabinet.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a cabinet to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2230] border-t border-gray-200 dark:border-gray-800">
        <div className="text-sm text-gray-500">
          {filteredCabinets.length} of {cabinets.length} cabinets
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>{cabinets.length} total</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>
              ${cabinets.reduce((sum, c) => sum + (c.shipping?.shippingPrice || 0), 0).toFixed(2)} shipping
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
