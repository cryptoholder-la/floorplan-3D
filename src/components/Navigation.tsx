import { useState } from 'react';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/ui/button-simple';
import { Badge } from '@/ui/badge-simple';
import { 
  Home, 
  Grid, 
  Zap, 
  Settings, 
  Menu, 
  X, 
  ArrowRight,
  Activity,
  Box,
  Wrench
} from 'lucide-react';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      href: '/',
      label: 'Original App',
      icon: Home,
      description: 'Floorplan 3D with Memlayer AI',
      badge: null
    },
    {
      href: '/migrated-10-10',
      label: '10_10 Migrated',
      icon: Grid,
      description: 'Advanced design system with agents',
      badge: 'New'
    },
    {
      href: '/complete-10-10',
      label: 'Complete 10_10',
      icon: Zap,
      description: 'Full migration of all abilities',
      badge: 'Complete'
    },
    {
      href: '/unified-workflow',
      label: 'Unified Workflow',
      icon: Activity,
      description: 'Self-learning workflow system',
      badge: 'AI'
    },
    {
      href: '/master-integration',
      label: 'Master Integration',
      icon: Zap,
      description: 'Complete system integration',
      badge: 'Ultimate'
    },
    {
      href: '/design-tools',
      label: 'Design Tools',
      icon: Zap,
      description: 'Complete design toolkit',
      badge: null
    },
    {
      href: '/manufacturing',
      label: 'Manufacturing',
      icon: Wrench,
      description: 'CNC and fabrication tools',
      badge: null
    }
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div>
              <h1 className="text-lg font-semibold text-white">Floorplan 3D</h1>
              <p className="text-xs text-gray-400">Design Suite</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="default" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                  {item.badge && (
                    <Badge variant="default" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
