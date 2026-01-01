'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, Home, Box, Wrench } from 'lucide-react'

export default function HomePage() {
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
        opacity: 0; /* Start invisible to prevent flash before animation */
        animation-fill-mode: forwards;
      }
      
      .grid > a:nth-child(3n+1) {
        animation: slideInFromLeft 0.8s ease-out forwards;
      }
      
      .grid > a:nth-child(3n+2) {
        animation: slideInFromTop 0.8s ease-out 0.2s forwards;
      }
      
      .grid > a:nth-child(3n+3) {
        animation: slideInFromRight 0.8s ease-out 0.4s forwards;
      }
      
      @keyframes slideInFromLeft {
        0% { transform: translateX(-50px); opacity: 0; }
        60% { transform: translateX(10px); opacity: 1; }
        80% { transform: translateX(-5px); }
        100% { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInFromTop {
        0% { transform: translateY(-50px); opacity: 0; }
        60% { transform: translateY(10px); opacity: 1; }
        80% { transform: translateY(-5px); }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes slideInFromRight {
        0% { transform: translateX(50px); opacity: 0; }
        60% { transform: translateX(-10px); opacity: 1; }
        80% { transform: translateX(5px); }
        100% { transform: translateX(0); opacity: 1; }
      }
      
      /* Hover effects */
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
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!mounted) return null
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
            <div className="flex gap-4 justify-center">
              <Link 
                href="/demo"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover-lift"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/use-cases/workshop-manufacturing"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover-lift"
              >
                CNC Tools
                <Wrench className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Core Capabilities
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Floorplan Design */}
          <Link 
            href="/demo"
            className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500 transition-all duration-300 hover-lift"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Floorplan Design</h3>
            <p className="text-gray-300 mb-6">
              Create detailed 2D and 3D floorplans with intelligent room detection, 
              automatic furniture placement, and real-time collaboration.
            </p>
            <div className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
              Explore Tools
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 3D Visualization */}
          <Link 
            href="/demo"
            className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-purple-500 transition-all duration-300 hover-lift"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Box className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">3D Visualization</h3>
            <p className="text-gray-300 mb-6">
              Immersive 3D rendering with real-time lighting, material libraries, 
              and virtual walkthrough capabilities for stunning presentations.
            </p>
            <div className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2">
              View 3D
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* CNC Manufacturing */}
          <Link 
            href="/use-cases/workshop-manufacturing"
            className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-green-500 transition-all duration-300 hover-lift"
          >
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">CNC Manufacturing</h3>
            <p className="text-gray-300 mb-6">
              Generate optimized G-code, toolpaths, and cut lists for precision 
              CNC manufacturing. Support for multiple materials and machines.
            </p>
            <div className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-2">
              CNC Tools
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-6">Quick Start</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link 
              href="/demo"
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-300 hover-lift text-center"
            >
              <div className="text-blue-400 text-2xl mb-2 group-hover:scale-110 transition-transform">🍳</div>
              <h3 className="text-white font-semibold">Demo Designer</h3>
              <p className="text-gray-400 text-sm mt-1">Interactive demo</p>
            </Link>
            
            <Link 
              href="/demo"
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover-lift text-center"
            >
              <div className="text-purple-400 text-2xl mb-2 group-hover:scale-110 transition-transform">🏠</div>
              <h3 className="text-white font-semibold">3D Builder</h3>
              <p className="text-gray-400 text-sm mt-1">Real-time 3D editing</p>
            </Link>
            
            <Link 
              href="/use-cases/workshop-manufacturing"
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-green-500 transition-all duration-300 hover-lift text-center"
            >
              <div className="text-green-400 text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="text-white font-semibold">CNC Generator</h3>
              <p className="text-gray-400 text-sm mt-1">G-code & toolpaths</p>
            </Link>
            
            <Link 
              href="/catalog"
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-orange-500 transition-all duration-300 hover-lift text-center"
            >
              <div className="text-orange-400 text-2xl mb-2 group-hover:scale-110 transition-transform">🗄️</div>
              <h3 className="text-white font-semibold">Asset Library</h3>
              <p className="text-gray-400 text-sm mt-2">3D models catalog</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Floorplan 3D - Advanced Design & Manufacturing Platform
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Powered by Next.js, Three.js, and React with animations from 10_10 Design System
          </p>
        </div>
      </footer>
    </div>
  )
}
