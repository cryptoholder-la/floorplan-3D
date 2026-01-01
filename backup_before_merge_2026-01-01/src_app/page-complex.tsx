import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Home, Eye, Layers, Settings, Zap, Package, Calculator, DollarSign, FileText, Box, Upload, Palette, Target, Ruler, Grid, Wrench } from 'lucide-react';

// Import navigation
import { Navigation } from '@/components/Navigation';

// Import 10_10 design system components
import { AgentDashboard } from '@/components/AgentDashboard';
import { KitchenDesignerCore } from '@/components/KitchenDesignerCore';
import { DesignStudio } from '@/components/DesignStudio';
import { CNCGenerator } from '@/components/CNCGenerator';
import { ComplianceHub } from '@/components/ComplianceHub';
import { ProjectDashboard } from '@/components/ProjectDashboard';
import { InventoryManager } from '@/components/InventoryManager';
import { FloorplanScanner } from '@/components/FloorplanScanner';
import { QuickCabinetPicker } from '@/components/QuickCabinetPicker';
import { BlueprintViewer } from '@/components/BlueprintViewer';
import { TemplateBuilder } from '@/components/TemplateBuilder';
import { MobileSync } from '@/components/MobileSync';
import { ReportingTools } from '@/components/ReportingTools';
import { ExperimentalTools } from '@/components/ExperimentalTools';

// Import Memlayer integration
import { MemlayerProvider } from '@/components/providers/MemlayerProvider';
import { useMemlayer } from '@/components/providers/MemlayerProvider';
import { Material } from '@/types';

// Types for 10_10 design system
interface ToolCard {
  id: string;
  title: string;
  description: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  meta?: {
    engine?: string;
    validation?: string;
    outputs?: string;
    input?: string;
  };
}

// Tool categories with 10_10 design system structure
const toolCategories = {
  core: [
    {
      id: 'kitchen-designer',
      title: 'Kitchen Designer',
      description: '3D layout with cutlist',
      category: 'Core App',
      badge: 'Primary',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: Package,
      href: '/design-tools/kitchen-designer',
      meta: {
        engine: 'Three.js + WASD / Joystick',
        validation: 'Live NKBA + ADA prefilter',
        outputs: 'PDF job form, CNC cutlist',
        input: 'Presets + custom trace'
      }
    },
    {
      id: 'design-studio',
      title: 'Design Studio',
      description: 'Scene controls and outputs',
      category: 'Layouts',
      badge: 'Viewer',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: Grid,
      href: '/design-tools/studio'
    },
    {
      id: '3d-viewer',
      title: '3D Kitchen View',
      description: 'Presentation-ready view',
      category: 'Viewer',
      badge: 'Read-only',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      icon: Eye,
      href: '/design-tools/3d-viewer'
    },
    {
      id: 'cnc-cutlist',
      title: 'CNC Cutlist',
      description: 'Detailed parts and barcodes',
      category: 'Fabrication',
      badge: 'CNC',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: Package,
      href: '/manufacturing/cnc-cutlist'
    },
    {
      id: 'compliance-hub',
      title: 'Compliance Hub',
      description: 'Permits, forms, legal docs',
      category: 'Compliance',
      badge: 'Legal',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: FileText,
      href: '/design-tools/compliance'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Projects and activity',
      category: 'Overview',
      badge: 'Ops',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: Eye,
      href: '/dashboard'
    }
  ],
  design: [
    {
      id: '3d-builder',
      title: '3D Builder',
      description: 'Interactive room + cabinet placement',
      category: 'Three.js',
      badge: 'Interactive',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: Box,
      href: '/design-tools/3d-builder'
    },
    {
      id: 'floorplan-scanner',
      title: 'Floorplan Scanner',
      description: 'Generate dimensions from photos',
      category: 'AI',
      badge: 'Scanner',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300',
      icon: Home,
      href: '/design-tools/floorplan-scanner'
    },
    {
      id: 'quick-picker',
      title: 'Quick Cabinet Picker',
      description: 'Fast access to standard cabinets',
      category: 'Catalog',
      badge: 'Picker',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      icon: Package,
      href: '/design-tools/quick-picker'
    },
    {
      id: 'blueprint-viewer',
      title: 'Blueprint JS Viewer',
      description: 'Dedicated 2D/3D floorplan editing',
      category: 'Floorplan Tool',
      badge: '2D/3D',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: Layers,
      href: '/design-tools/blueprint'
    }
  ],
  inventory: [
    {
      id: 'project-cabinet-list',
      title: 'Project Cabinet List',
      description: 'Browse all cabinets in the current project',
      category: 'Inventory',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: Package,
      href: '/inventory/project-list'
    },
    {
      id: 'cabinet-management',
      title: 'Full Cabinet Management',
      description: 'Edit dimensions, metadata, and construction details',
      category: 'Inventory',
      badge: 'WIP',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: Settings,
      href: '/inventory/management'
    },
    {
      id: 'cutlist-inventory',
      title: 'Cutlist Inventory View',
      description: 'Manage cabinet definitions used for cutlists',
      category: 'Inventory',
      badge: 'Cutlist',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: Calculator,
      href: '/inventory/cutlist'
    }
  ],
  reporting: [
    {
      id: 'detailed-cutlist',
      title: 'Detailed Cutlist & NKBA',
      description: 'Cabinet part details and compliance checks',
      category: 'Reports',
      badge: 'NKBA',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: FileText,
      href: '/reports/detailed-cutlist'
    },
    {
      id: 'materials-summary',
      title: 'Materials Summary',
      description: 'Totals and rollups',
      category: 'Reports',
      badge: 'Summary',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: Calculator,
      href: '/reports/materials-summary'
    }
  ],
  admin: [
    {
      id: 'template-builder',
      title: 'Template Builder',
      description: 'Define custom cabinet parts (JSON)',
      category: 'Configuration',
      badge: 'Config',
      badgeColor: 'bg-gray-500/20 text-gray-300',
      icon: Settings,
      href: '/admin/template-builder'
    },
    {
      id: 'mobile-sync',
      title: 'Mobile Sync',
      description: 'Cloud and local settings',
      category: 'Sync',
      badge: 'Sync',
      badgeColor: 'bg-blue-500/20 text-blue-300',
      icon: Upload,
      href: '/admin/mobile-sync'
    }
  ],
  experimental: [
    {
      id: 'dashboard-overview',
      title: 'Dashboard Overview',
      description: 'High-level jobs and sync status prototype',
      category: 'Overview (Experimental)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: Eye,
      href: '/experimental/dashboard-overview'
    },
    {
      id: 'mobile-sync-cloud',
      title: 'Mobile Sync & Cloud',
      description: 'Mobile-first sync workflow mock',
      category: 'Sync (Prototype)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: Upload,
      href: '/experimental/mobile-sync'
    }
  ]
};

// Main HomePage component with 10_10 design system integration
function HomePageContent() {
  const [mounted, setMounted] = useState(false);
  const [showAgentDashboard, setShowAgentDashboard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('core');
  const { ready, insights, predict } = useMemlayer();

  // 10_10 animation system
  useEffect(() => {
    setMounted(true);
    
    // Advanced 10_10 design system animations
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced Card Entry Animations from 10_10 design system */
      .grid > a {
        position: relative;
        width: 100%;
        margin: 0 auto;
        opacity: 0;
        animation-fill-mode: forwards;
      }
      
      .grid > a:nth-child(3n+1) {
        animation: bounce1 2s ease-in forwards;
      }
      
      .grid > a:nth-child(3n+2) {
        animation: bounce2 2s ease-in forwards;
      }
      
      .grid > a:nth-child(3n+3) {
        animation: bounce3 2s ease-in forwards;
      }
      
      @keyframes bounce1 {
        0% { top: -5rem; width: 4rem; opacity: 0; }
        5% { top: -5rem; width: 4rem; opacity: 1; }
        10% { top: 0rem; width: 4rem; }
        15% { top: -2rem; width: 4rem; }
        20% { top: 0rem; width: 4rem; }
        25% { top: -1.5rem; width: 4rem; }
        30% { top: 0rem; width: 4rem; }
        50% { top: 0rem; width: 4rem; }
        60% { top: 0rem; width: 100%; }
        100% { top: 0rem; width: 100%; opacity: 1; }
      }
      
      @keyframes bounce2 {
        0% { top: -5rem; width: 4rem; opacity: 0; }
        20% { top: -5rem; width: 4rem; opacity: 1; }
        25% { top: 0rem; width: 4rem; }
        30% { top: -2rem; width: 4rem; }
        35% { top: 0rem; width: 4rem; }
        40% { top: -1.5rem; width: 4rem; }
        45% { top: 0rem; width: 4rem; }
        55% { top: 0rem; width: 4rem; }
        65% { top: 0rem; width: 100%; }
        100% { top: 0rem; width: 100%; opacity: 1; }
      }
      
      @keyframes bounce3 {
        0% { top: -5rem; width: 4rem; opacity: 0; }
        35% { top: -5rem; width: 4rem; opacity: 1; }
        40% { top: 0rem; width: 4rem; }
        45% { top: -2rem; width: 4rem; }
        50% { top: 0rem; width: 4rem; }
        55% { top: -1.5rem; width: 4rem; }
        60% { top: 0rem; width: 4rem; }
        70% { top: 0rem; width: 100%; }
        100% { top: 0rem; width: 100%; opacity: 1; }
      }
      
      /* Kitchen Designer section enhancements */
      .kd-meta {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px dashed rgba(148, 163, 184, 0.4);
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.35rem 0.5rem;
        font-size: 0.7rem;
        color: rgba(209, 213, 219, 0.9);
      }
      
      .kd-meta-label {
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 600;
        font-size: 0.65rem;
        color: rgba(156, 163, 175, 0.95);
      }
      
      .kd-meta-value {
        font-variant-numeric: tabular-nums;
      }
      
      /* Enhanced hover effects */
      .hover-lift {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .hover-lift:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
      
      /* Floating animation */
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }
      
      /* Gradient animations */
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .gradient-animation {
        background: linear-gradient(-45deg, #0d65f2, #06b6d4, #8b5cf6, #ec4899);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Agent dashboard toggle (Ctrl+~)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && e.ctrlKey) {
        setShowAgentDashboard(!showAgentDashboard);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAgentDashboard]);

  if (!mounted) return null;

  const renderToolCard = (tool: ToolCard) => (
    <Link 
      key={tool.id}
      href={tool.href}
      className="rounded-xl bg-card border border-white/10 p-5 hover:border-white/20 transition hover-lift group"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm text-white/70">{tool.category}</div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${tool.badgeColor}`}>
          {tool.badge}
        </span>
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <tool.icon className="w-4 h-4 text-white" />
        </div>
        <div className="text-lg font-semibold">{tool.title}</div>
      </div>
      
      <p className="text-xs text-white/60 mb-3">{tool.description}</p>
      
      {tool.meta && (
        <div className="kd-meta">
          {tool.meta.engine && (
            <div>
              <div className="kd-meta-label">3D Engine</div>
              <div className="kd-meta-value">{tool.meta.engine}</div>
            </div>
          )}
          {tool.meta.validation && (
            <div>
              <div className="kd-meta-label">Validation</div>
              <div className="kd-meta-value">{tool.meta.validation}</div>
            </div>
          )}
          {tool.meta.outputs && (
            <div>
              <div className="kd-meta-label">Outputs</div>
              <div className="kd-meta-value">{tool.meta.outputs}</div>
            </div>
          )}
          {tool.meta.input && (
            <div>
              <div className="kd-meta-label">Room Input</div>
              <div className="kd-meta-value">{tool.meta.input}</div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm mt-3">
        Launch Tool
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Agent Dashboard (Hidden by default, toggle with Ctrl+~) */}
      {showAgentDashboard && (
        <AgentDashboard onClose={() => setShowAgentDashboard(false)} />
      )}

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-animation"></div>
            <div>
              <h1 className="text-xl font-semibold">Floorplan 3D Design Suite</h1>
              <p className="text-xs text-white/60">Professional tools for remodeling workflows with AI integration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <nav className="flex flex-wrap gap-2 justify-start sm:justify-end text-xs">
              <button 
                onClick={() => setSelectedCategory('core')}
                className={`px-3 py-1 rounded-full border transition ${
                  selectedCategory === 'core' 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                Core
              </button>
              <button 
                onClick={() => setSelectedCategory('design')}
                className={`px-3 py-1 rounded-full border transition ${
                  selectedCategory === 'design' 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                Design
              </button>
              <button 
                onClick={() => setSelectedCategory('inventory')}
                className={`px-3 py-1 rounded-full border transition ${
                  selectedCategory === 'inventory' 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                Inventory
              </button>
              <button 
                onClick={() => setSelectedCategory('reporting')}
                className={`px-3 py-1 rounded-full border transition ${
                  selectedCategory === 'reporting' 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                Reports
              </button>
              <button 
                onClick={() => setSelectedCategory('admin')}
                className={`px-3 py-1 rounded-full border transition ${
                  selectedCategory === 'admin' 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                Admin
              </button>
              <button 
                onClick={() => setSelectedCategory('experimental')}
                className={`px-3 py-1 rounded-full border border-amber-400/40 text-amber-200 transition ${
                  selectedCategory === 'experimental' 
                    ? 'bg-amber-400/20 border-amber-400/60' 
                    : 'bg-white/5 hover:bg-amber-400/10'
                }`}
              >
                Experimental
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              Floorplan 3D
              <span className="block text-3xl text-blue-400 mt-2">
                Design • Visualize • Manufacture
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced 3D floorplan design, real-time visualization, and CNC manufacturing platform. 
              Transform your ideas into precision-cut components with smart animations and AI-powered tools.
            </p>
            
            {/* AI Status */}
            {ready && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">
                  🤖 AI System Ready • {insights.length} insights available • Memlayer integration active
                </p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/design-tools/kitchen-designer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover-lift"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/manufacturing/cnc-cutlist"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover-lift"
              >
                CNC Tools
                <Wrench className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Core Apps Section */}
        <section className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-semibold mb-6">
            {selectedCategory === 'core' && 'Start here'}
            {selectedCategory === 'design' && 'Design & Planning Tools'}
            {selectedCategory === 'inventory' && 'Inventory & Catalog'}
            {selectedCategory === 'reporting' && 'Reporting & Fabrication'}
            {selectedCategory === 'admin' && 'Administration & Utilities'}
            {selectedCategory === 'experimental' && 'WIP & Experimental Tools'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolCategories[selectedCategory as keyof typeof toolCategories].map(renderToolCard)}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6">Quick Start</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Link 
                href="/design-tools/kitchen-designer"
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-300 hover-lift text-center"
              >
                <div className="text-blue-400 text-2xl mb-2 group-hover:scale-110 transition-transform">🍳</div>
                <h3 className="text-white font-semibold">Kitchen Designer</h3>
                <p className="text-gray-400 text-sm mt-1">Smart kitchen layouts</p>
              </Link>
              
              <Link 
                href="/design-tools/3d-builder"
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover-lift text-center"
              >
                <div className="text-purple-400 text-2xl mb-2 group-hover:scale-110 transition-transform">🏠</div>
                <h3 className="text-white font-semibold">3D Builder</h3>
                <p className="text-gray-400 text-sm mt-1">Interactive design</p>
              </Link>
              
              <Link 
                href="/manufacturing/cnc-cutlist"
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-green-500 transition-all duration-300 hover-lift text-center"
              >
                <div className="text-green-400 text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
                <h3 className="text-white font-semibold">CNC Generator</h3>
                <p className="text-gray-400 text-sm mt-1">G-code & toolpaths</p>
              </Link>
              
              <Link 
                href="/design-tools/floorplan-scanner"
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-orange-500 transition-all duration-300 hover-lift text-center"
              >
                <div className="text-orange-400 text-2xl mb-2 group-hover:scale-110 transition-transform">📸</div>
                <h3 className="text-white font-semibold">AI Scanner</h3>
                <p className="text-gray-400 text-sm mt-2">Photo to floorplan</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Floorplan 3D Design Suite - Powered by 10_10 Design System & Memlayer AI
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Advanced design tools with Three.js, React, and AI integration
          </p>
        </div>
      </footer>
    </div>
  );
}

// Main component with Memlayer provider
export default function HomePage() {
  return (
    <MemlayerProvider>
      <div className="min-h-screen">
        <Navigation />
        <HomePageContent />
      </div>
    </MemlayerProvider>
  );
}
