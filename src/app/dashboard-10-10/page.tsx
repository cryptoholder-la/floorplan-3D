'use client'

import { SimpleIcon } from '@/components/ui/icon-simple'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/lib/icons-simple'

interface ToolCard {
  id: string
  title: string
  description: string
  category: string
  badge: string
  badgeColor: string
  icon: keyof typeof Icons
  href: string
  metadata?: Record<string, string>
}

export default function Dashboard10_10() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Add animations from the 10_10 design system
    const style = document.createElement('style')
    style.textContent = `
      /* Card Entry Animations */
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

      /* Smooth scroll behavior */
      html { scroll-behavior: smooth; }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const coreApps: ToolCard[] = [
    {
      id: 'kitchen-designer',
      title: 'Kitchen Designer',
      description: '3D layout with cutlist',
      category: 'Core App',
      badge: 'Primary',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: 'HOME',
      href: '/kitchen-designer',
      metadata: {
        '3D Engine': 'Three.js + WASD / Joystick',
        'Validation': 'Live NKBA + ADA prefilter',
        'Outputs': 'PDF job form, CNC cutlist',
        'Room Input': 'Presets + custom trace'
      }
    },
    {
      id: 'design-studio',
      title: 'Design Studio',
      description: 'Scene controls and outputs',
      category: 'Layouts',
      badge: 'Viewer',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: 'LAYERS',
      href: '/design-studio'
    },
    {
      id: '3d-kitchen-view',
      title: '3D Kitchen View',
      description: 'Presentation-ready view',
      category: 'Viewer',
      badge: 'Read-only',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      icon: 'EYE',
      href: '/3d-kitchen-view'
    },
    {
      id: 'cnc-cutlist',
      title: 'CNC Cutlist',
      description: 'Detailed parts and barcodes',
      category: 'Fabrication',
      badge: 'CNC',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: 'GAUGE',
      href: '/cnc-cutlist'
    },
    {
      id: 'compliance-hub',
      title: 'Compliance Hub',
      description: 'Permits, forms, legal docs',
      category: 'Compliance',
      badge: 'Legal',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: 'SHIELD',
      href: '/compliance-hub'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Projects and activity',
      category: 'Overview',
      badge: 'Ops',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: 'DATABASE',
      href: '/dashboard'
    }
  ]

  const designPlanningTools: ToolCard[] = [
    {
      id: '3d-builder',
      title: '3D Builder',
      description: 'Interactive room + cabinet placement',
      category: 'Three.js',
      badge: 'Interactive',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: 'BOX',
      href: '/3d-builder'
    },
    {
      id: 'floorplan-scanner',
      title: 'Floorplan Scanner',
      description: 'Generate dimensions from photos',
      category: 'AI',
      badge: 'Scanner',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300',
      icon: 'SCAN',
      href: '/floorplan-scanner'
    },
    {
      id: 'quick-cabinet-picker',
      title: 'Quick Cabinet Picker',
      description: 'Fast access to standard cabinets',
      category: 'Catalog',
      badge: 'Picker',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      icon: 'PACKAGE',
      href: '/quick-cabinet-picker'
    },
    {
      id: 'blueprint-viewer',
      title: 'Blueprint JS Viewer',
      description: 'Dedicated 2D/3D floorplan editing',
      category: 'Floorplan Tool',
      badge: '2D/3D',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: 'GRID',
      href: '/blueprint-viewer'
    }
  ]

  const inventoryCatalog: ToolCard[] = [
    {
      id: 'project-cabinet-list',
      title: 'Project Cabinet List',
      description: 'Browse all cabinets in the current project',
      category: 'Inventory',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: 'DATABASE',
      href: '/project-cabinet-list'
    },
    {
      id: 'full-cabinet-management',
      title: 'Full Cabinet Management',
      description: 'Edit dimensions, metadata, and construction details',
      category: 'Inventory',
      badge: 'WIP',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: 'EDIT',
      href: '/full-cabinet-management'
    },
    {
      id: 'cutlist-inventory-view',
      title: 'Cutlist Inventory View',
      description: 'Manage cabinet definitions used for cutlists',
      category: 'Inventory',
      badge: 'Cutlist',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: 'COPY',
      href: '/cutlist-inventory-view'
    },
    {
      id: 'cabinet-list-compact',
      title: 'Cabinet List (Compact)',
      description: 'Phone-optimized list of project cabinets for quick review',
      category: 'Inventory',
      badge: 'Mobile',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      icon: 'USER',
      href: '/cabinet-list-compact'
    },
    {
      id: 'edit-cabinet-form',
      title: 'Edit Cabinet Form',
      description: 'Focused, mobile-friendly editor for a single cabinet record',
      category: 'Inventory',
      badge: 'Detail',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300',
      icon: 'EDIT',
      href: '/edit-cabinet-form'
    }
  ]

  const reportingFabrication: ToolCard[] = [
    {
      id: 'detailed-cutlist-nkba',
      title: 'Detailed Cutlist & NKBA',
      description: 'Cabinet part details and compliance checks',
      category: 'Reports',
      badge: 'NKBA',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: 'FILE',
      href: '/detailed-cutlist-nkba'
    },
    {
      id: 'materials-summary',
      title: 'Materials Summary',
      description: 'Totals and rollups',
      category: 'Reports',
      badge: 'Summary',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      icon: 'DATABASE',
      href: '/materials-summary'
    }
  ]

  const adminUtilities: ToolCard[] = [
    {
      id: 'template-builder',
      title: 'Template Builder',
      description: 'Define custom cabinet parts (JSON)',
      category: 'Configuration',
      badge: 'Config',
      badgeColor: 'bg-gray-500/20 text-gray-300',
      icon: 'SETTINGS',
      href: '/template-builder'
    },
    {
      id: 'cabinet-management-admin',
      title: 'Cabinet Management',
      description: 'Edit specs and meta',
      category: 'Admin',
      badge: 'Admin',
      badgeColor: 'bg-gray-500/20 text-gray-300',
      icon: 'WRENCH',
      href: '/cabinet-management-admin'
    },
    {
      id: 'mobile-sync',
      title: 'Mobile Sync',
      description: 'Cloud and local settings',
      category: 'Sync',
      badge: 'Sync',
      badgeColor: 'bg-gray-500/20 text-gray-300',
      icon: 'UPLOAD',
      href: '/mobile-sync'
    },
    {
      id: 'react-drag-drop-panel',
      title: 'React Drag/Drop Panel',
      description: 'Standalone item selection interface (React)',
      category: 'Dev Tool',
      badge: 'Dev',
      badgeColor: 'bg-gray-500/20 text-gray-300',
      icon: 'POWER',
      href: '/react-drag-drop-panel'
    }
  ]

  const experimentalTools: ToolCard[] = [
    {
      id: 'dashboard-overview',
      title: 'Dashboard Overview',
      description: 'High-level jobs and sync status prototype',
      category: 'Overview (Experimental)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
      icon: 'DATABASE',
      href: '/dashboard-overview'
    },
    {
      id: 'mobile-sync-cloud',
      title: 'Mobile Sync & Cloud',
      description: 'Mobile-first sync workflow mock powered by unused logic',
      category: 'Sync (Prototype)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
      icon: 'USER',
      href: '/mobile-sync-cloud'
    },
    {
      id: 'sync-settings-panel',
      title: 'Sync Settings Panel',
      description: 'Alternate cloud/device settings concept screen',
      category: 'Sync (Alt UI)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
      icon: 'SETTINGS',
      href: '/sync-settings-panel'
    },
    {
      id: 'compliance-hub-interactive',
      title: 'Compliance Hub Interactive',
      description: 'Dynamic compliance forms and change-order logic',
      category: 'Compliance (Alt Flow)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
      icon: 'SHIELD',
      href: '/compliance-hub-interactive'
    },
    {
      id: 'cabinet-management-layout-a',
      title: 'Cabinet Management Layout A',
      description: 'First-pass full cabinet editor UI using programmatic inventory',
      category: 'Inventory (V1)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
      icon: 'DATABASE',
      href: '/cabinet-management-layout-a'
    },
    {
      id: 'cabinet-management-layout-b',
      title: 'Cabinet Management Layout B',
      description: 'Refined management screen exploring unused editing logic',
      category: 'Inventory (V2)',
      badge: 'Prototype',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
      icon: 'DATABASE',
      href: '/cabinet-management-layout-b'
    }
  ]

  const renderToolCard = (tool: ToolCard) => {
    return (
      <Link 
        href={tool.href}
        className={`
          rounded-xl bg-card border border-white/10 p-5 hover:border-white/20 transition
          ${tool.badgeColor.includes('amber') ? 'border-amber-400/40 hover:border-amber-300' : ''}
        `}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm text-white/70">{tool.category}</div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${tool.badgeColor}`}>
            {tool.badge}
          </span>
        </div>
        <div className="text-lg font-semibold">{tool.title}</div>
        <p className="text-xs text-white/60 mt-1">{tool.description}</p>
        
        {tool.metadata && (
          <div className="kd-meta">
            {Object.entries(tool.metadata).map(([key, value]) => (
              <div key={key}>
                <div className="kd-meta-label">{key}</div>
                <div className="kd-meta-value">{value}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-3 text-xs text-blue-400">
          <SimpleIcon name={tool.icon as keyof typeof Icons} />
          <span>Launch Tool</span>
          <SimpleIcon name="FORWARD" />
        </div>
      </Link>
    )
  }

  const renderSection = (title: string, tools: ToolCard[], id: string) => (
    <section id={id} className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => (
          <div key={tool.id}>
            {renderToolCard(tool)}
          </div>
        ))}
      </div>
    </section>
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div>
              <h1 className="text-xl font-semibold">Kitchen Design Suite</h1>
              <p className="text-xs text-white/60">Professional tools for remodeling workflows</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex flex-wrap gap-2 justify-start sm:justify-end text-xs">
              <a href="#core-apps" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">Core</a>
              <a href="#design-planning" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">Design</a>
              <a href="#inventory-catalog" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">Inventory</a>
              <a href="#reporting-fab" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">Reports</a>
              <a href="#admin-utilities" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">Admin</a>
              <a href="#wip-experimental" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-amber-400/40 text-amber-200">Experimental</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderSection("Start here", coreApps, "core-apps")}
        {renderSection("Design & Planning Tools", designPlanningTools, "design-planning")}
        {renderSection("Inventory & Catalog", inventoryCatalog, "inventory-catalog")}
        {renderSection("Reporting & Fabrication", reportingFabrication, "reporting-fab")}
        {renderSection("Administration & Utilities", adminUtilities, "admin-utilities")}
        {renderSection("WIP & Experimental Tools", experimentalTools, "wip-experimental")}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-white/60">
          © 2025 Kitchen Design Suite - Powered by Floorplan 3D
        </div>
      </footer>
    </div>
  )
}
