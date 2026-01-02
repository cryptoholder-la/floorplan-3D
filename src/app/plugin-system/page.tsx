'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Wrench, 
  Drill, 
  Calculator, 
  Settings, 
  FolderPlus, 
  Eye, 
  Scissors,
  Home,
  Zap,
  FileText,
  Download,
  Play,
  BarChart,
  Cpu,
  Database,
  Layers,
  Wrench as Tool,
  Grid3x3,
  Search,
  Filter
} from 'lucide-react';

// Plugin interface
interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  status: 'active' | 'inactive' | 'maintenance';
  category: string;
  features: string[];
  version: string;
  lastUpdated: string;
}

// Category interface
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// All available plugins
const allPlugins: Plugin[] = [
  {
    id: 'cabinet-catalog',
    name: 'Cabinet Catalog',
    description: 'Browse and manage 285+ cabinet designs with detailed specifications',
    icon: <Package className="w-6 h-6" />,
    route: '/cabinet-catalog',
    status: 'active',
    category: 'Core',
    features: ['285+ Designs', 'Search & Filter', 'DWG Integration', 'Specifications'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'design-tools',
    name: 'Design Tools',
    description: 'Advanced floorplan and kitchen design capabilities',
    icon: <Wrench className="w-6 h-6" />,
    route: '/design-tools',
    status: 'active',
    category: 'Core',
    features: ['Floorplan Builder', 'Kitchen Designer', '3D Visualization', 'Templates'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing Tools',
    description: 'CNC panel generation, G-Code creation, and cut lists',
    icon: <Cpu className="w-6 h-6" />,
    route: '/manufacturing-tools',
    status: 'active',
    category: 'Manufacturing',
    features: ['CNC Generation', 'G-Code Export', 'Cut Lists', 'Toolpaths'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'analysis',
    name: 'Analysis Tools',
    description: 'Cost analysis, time estimation, and material calculations',
    icon: <BarChart className="w-6 h-6" />,
    route: '/analysis',
    status: 'active',
    category: 'Analysis',
    features: ['Cost Analysis', 'Time Estimation', 'Material Reports', 'Spec Books'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'File upload, catalog import, and system utilities',
    icon: <Settings className="w-6 h-6" />,
    route: '/utilities',
    status: 'active',
    category: 'Utilities',
    features: ['File Upload', 'Catalog Import', 'Template Browser', 'Asset Viewer'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'project',
    name: 'Project Management',
    description: 'Create, manage, and organize design projects',
    icon: <FolderPlus className="w-6 h-6" />,
    route: '/projects',
    status: 'active',
    category: 'Management',
    features: ['Project Creation', 'Status Tracking', 'Import/Export', 'Backup'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'drilling',
    name: '32mm Drilling System',
    description: 'European 32mm drilling patterns and hardware layouts',
    icon: <Drill className="w-6 h-6" />,
    route: '/drilling',
    status: 'active',
    category: 'Manufacturing',
    features: ['32mm Patterns', 'Hardware Layouts', 'CNC Integration', 'Custom Patterns'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'cutlist',
    name: 'Cutlist Management',
    description: 'Advanced cutlist generation with material optimization',
    icon: <Scissors className="w-6 h-6" />,
    route: '/cutlist',
    status: 'active',
    category: 'Manufacturing',
    features: ['Material Optimization', 'Sheet Layout', 'Cost Calculation', 'CNC Jobs'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'hardware',
    name: 'Hardware Management',
    description: 'Blum hardware catalog with specifications and integration',
    icon: <Tool className="w-6 h-6" />,
    route: '/hardware',
    status: 'active',
    category: 'Hardware',
    features: ['Blum Catalog', 'Specifications', 'Pricing', 'CAD Integration'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'catalog',
    name: 'Master Catalog',
    description: 'Unified catalog management with search, filtering, and bulk operations',
    icon: <Database className="w-6 h-6" />,
    route: '/catalog',
    status: 'active',
    category: 'Core',
    features: ['285+ Items', 'Advanced Search', 'Import/Export', 'Bulk Operations'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'integration',
    name: 'Master Integration',
    description: 'System-wide integration workflows and data synchronization',
    icon: <Zap className="w-6 h-6" />,
    route: '/master-integration',
    status: 'active',
    category: 'Management',
    features: ['Workflow Automation', 'Data Sync', 'API Management', 'System Health'],
    version: '1.0.0',
    lastUpdated: '2026-01-01'
  }
];

// Categories for organization
const categories: Category[] = [
  { id: 'all', name: 'All Plugins', icon: <Grid3x3 className="w-4 h-4" /> },
  { id: 'core', name: 'Core', icon: <Package className="w-4 h-4" /> },
  { id: 'manufacturing', name: 'Manufacturing', icon: <Cpu className="w-4 h-4" /> },
  { id: 'analysis', name: 'Analysis', icon: <BarChart className="w-4 h-4" /> },
  { id: 'hardware', name: 'Hardware', icon: <Tool className="w-4 h-4" /> },
  { id: 'utilities', name: 'Utilities', icon: <Settings className="w-4 h-4" /> },
  { id: 'management', name: 'Management', icon: <FolderPlus className="w-4 h-4" /> }
];

export default function PluginSystemPage() {
  const [plugins, setPlugins] = useState<Plugin[]>(allPlugins);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  // Filter plugins based on category and search
  const filteredPlugins = plugins.filter(plugin => {
    const matchesCategory = selectedCategory === 'all' || plugin.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Navigate to plugin
  const navigateToPlugin = (plugin: Plugin): void => {
    window.location.href = plugin.route;
  };

  // Get status variant
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'maintenance': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plugin System</h1>
        <p className="text-gray-600">Complete modular architecture with 11 specialized plugins</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{plugins.length}</div>
                <div className="text-sm text-gray-600">Total Plugins</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{plugins.filter(p => p.status === 'active').length}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">285+</div>
                <div className="text-sm text-gray-600">Cabinet Designs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Layers className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">11</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPlugins.map(plugin => (
          <Card 
            key={plugin.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
            onClick={() => setSelectedPlugin(plugin)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {plugin.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{plugin.name}</h3>
                    <p className="text-sm text-gray-600">{plugin.category}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(plugin.status)}>
                  {plugin.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{plugin.description}</p>
              
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {plugin.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {plugin.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{plugin.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  v{plugin.version} • {plugin.lastUpdated}
                </div>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToPlugin(plugin);
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Launch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plugin Detail Modal */}
      {selectedPlugin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    {selectedPlugin.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPlugin.name}</h2>
                    <p className="text-gray-600">{selectedPlugin.description}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedPlugin(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Plugin Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge variant={getStatusVariant(selectedPlugin.status)} className="ml-2">
                        {selectedPlugin.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <span className="ml-2">{selectedPlugin.category}</span>
                    </div>
                    <div>
                      <span className="font-medium">Version:</span>
                      <span className="ml-2">{selectedPlugin.version}</span>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <span className="ml-2">{selectedPlugin.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlugin.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Actions</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigateToPlugin(selectedPlugin)}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Launch Plugin
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}