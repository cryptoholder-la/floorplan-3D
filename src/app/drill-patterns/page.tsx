import { useState } from 'react';
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ScrollArea } from '@/ui/scroll-area';
import { 
  Search, 
  Wrench, 
  DoorOpen, 
  Archive, 
  Grid3x3, 
  ArrowRight, 
  Filter,
  Package,
  Drill
} from 'lucide-react';
import {
  AVAILABLE_PATTERNS,
  PATTERN_CATEGORIES,
  getPatternsByCategory,
  PART_PRESETS,
  type PatternId
} from '@/lib/drill-patterns-library';

export default function DrillPatternsIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPartType, setSelectedPartType] = useState<string>('all');

  // Filter patterns based on search and filters
  const filteredPatterns = Object.entries(AVAILABLE_PATTERNS).filter(([id, pattern]) => {
    const matchesSearch = pattern.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pattern.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
    const matchesPartType = selectedPartType === 'all' || 
                          (pattern.partTypes && Array.isArray(pattern.partTypes) && pattern.partTypes.includes(selectedPartType as any));
    
    return matchesSearch && matchesCategory && matchesPartType;
  });

  // Get category info
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case PATTERN_CATEGORIES.HINGE:
        return { icon: DoorOpen, color: 'bg-blue-100 text-blue-800', label: 'Hinges' };
      case PATTERN_CATEGORIES.DRAWER:
        return { icon: Archive, color: 'bg-green-100 text-green-800', label: 'Drawer Slides' };
      case PATTERN_CATEGORIES.SYSTEM32:
        return { icon: Grid3x3, color: 'bg-purple-100 text-purple-800', label: 'System 32' };
      case PATTERN_CATEGORIES.DOWEL:
        return { icon: Package, color: 'bg-orange-100 text-orange-800', label: 'Dowel Joints' };
      default:
        return { icon: Wrench, color: 'bg-gray-100 text-gray-800', label: category };
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="pt-20 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Drill className="w-10 h-10" />
                CNC Drill Patterns Library
              </h1>
              <p className="text-lg text-slate-600 dark:text-[#90a7cb] mt-2">
                Professional 32mm system drilling patterns for cabinet hardware
              </p>
            </div>
            <Link href="/drill-configurator">
              <Button size="lg">
                <Wrench className="w-5 h-5 mr-2" />
                Open Configurator
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Object.keys(AVAILABLE_PATTERNS).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Total Patterns</div>
            </Card>
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Object.keys(PART_PRESETS).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Part Types</div>
            </Card>
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {getPatternsByCategory(PATTERN_CATEGORIES.HINGE).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Hinge Types</div>
            </Card>
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {getPatternsByCategory(PATTERN_CATEGORIES.DRAWER).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Drawer Systems</div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search patterns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value={PATTERN_CATEGORIES.HINGE}>Hinges</SelectItem>
                    <SelectItem value={PATTERN_CATEGORIES.DRAWER}>Drawer Slides</SelectItem>
                    <SelectItem value={PATTERN_CATEGORIES.SYSTEM32}>System 32</SelectItem>
                    <SelectItem value={PATTERN_CATEGORIES.DOWEL}>Dowel Joints</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedPartType} onValueChange={setSelectedPartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Part Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parts</SelectItem>
                    {Object.entries(PART_PRESETS).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.partType.charAt(0).toUpperCase() + preset.partType.slice(1).replace(/([A-Z])/g, ' $1')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatterns.map(([id, pattern]) => {
            const categoryInfo = getCategoryInfo(pattern.category);
            const Icon = categoryInfo.icon;
            
            return (
              <Card key={id} className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {pattern.label}
                      </h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {categoryInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-[#90a7cb] mb-4">
                  {pattern.description}
                </p>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {pattern.partTypes && Array.isArray(pattern.partTypes) && pattern.partTypes.map((partType: string) => (
                      <Badge key={partType} variant="outline" className="text-xs">
                        {partType.charAt(0).toUpperCase() + partType.slice(1).replace(/([A-Z])/g, ' $1')}
                      </Badge>
                    ))}
                  </div>

                  {pattern.defaultSettings && (
                    <div className="text-xs text-slate-500 dark:text-[#90a7cb]">
                      <div>Default: {pattern.defaultSettings.partWidth} × {pattern.defaultSettings.partHeight} mm</div>
                      {pattern.defaultSettings.thickness && (
                        <div>Thickness: {pattern.defaultSettings.thickness} mm</div>
                      )}
                    </div>
                  )}

                  <Link href={`/drill-configurator?partType=${pattern.partTypes && pattern.partTypes.length > 0 ? pattern.partTypes[0] : 'door'}&pattern=${id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Use This Pattern
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredPatterns.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No patterns found
            </h3>
            <p className="text-slate-500 dark:text-[#90a7cb]">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Category Sections */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(PATTERN_CATEGORIES).map((category) => {
              const categoryInfo = getCategoryInfo(category);
              const Icon = categoryInfo.icon;
              const patterns = getPatternsByCategory(category);
              
              return (
                <Link key={category} href={`/drill-configurator?category=${category}`}>
                  <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${categoryInfo.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {categoryInfo.label}
                        </h3>
                        <div className="text-sm text-slate-500 dark:text-[#90a7cb]">
                          {patterns ? patterns.length : 0} patterns
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                      {patterns && Array.isArray(patterns) && patterns.slice(0, 3).map(([_, pattern]) => pattern.label).join(', ')}
                      {patterns && patterns.length > 3 && ` +${patterns.length - 3} more`}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Part Types Section */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse by Part Type</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PART_PRESETS).map(([key, preset]) => (
              <Link key={key} href={`/drill-configurator?partType=${key}`}>
                <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {preset.partType.charAt(0).toUpperCase() + preset.partType.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h3>
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-600 dark:text-[#90a7cb] mb-3">
                    {preset.dimensions.width} × {preset.dimensions.height} × {preset.dimensions.thickness} mm
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {preset.compatiblePatterns && Array.isArray(preset.compatiblePatterns) && preset.compatiblePatterns.slice(0, 3).map((patternId) => {
                      const pattern = AVAILABLE_PATTERNS[patternId as PatternId];
                      return (
                        <Badge key={patternId} variant="outline" className="text-xs">
                          {pattern?.label.split(' ')[0]}
                        </Badge>
                      );
                    })}
                    {preset.compatiblePatterns && preset.compatiblePatterns.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{preset.compatiblePatterns.length - 3}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
