'use client';

import React, { useState, useEffect } from 'react';
import { pluginSystem, usePluginSystem } from '@/lib/core/PluginSystem';

function PluginSystemDashboard() {
  const api = usePluginSystem();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentPageComponent, setCurrentPageComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set initial path
    setCurrentPath(window.location.pathname);
    
    // Handle navigation
    const handleNavigation = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      loadPage(path);
    };

    window.addEventListener('popstate', handleNavigation);
    handleNavigation();

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const loadPage = async (path: string) => {
    setLoading(true);
    try {
      const PageComponent = await api.resolveRoute(path);
      setCurrentPageComponent(() => PageComponent || DefaultDashboard);
    } catch (error) {
      console.error('Failed to load page:', error);
      setCurrentPageComponent(() => DefaultDashboard);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    api.navigate(path);
  };

  const togglePlugin = async (pluginId: string) => {
    const plugin = api.getPlugin(pluginId);
    if (plugin) {
      if (plugin.enabled) {
        await api.disablePlugin(pluginId);
      } else {
        await api.enablePlugin(pluginId);
      }
    }
  };

  const DefaultDashboard = () => {
    const plugins = api.getAllPlugins();
    
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Plugin System Dashboard</h1>
        <p className="text-gray-600 mb-8">Production-ready modular architecture with centralized logic</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plugins.map(plugin => (
            <div key={plugin.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{plugin.name}</h3>
                <button
                  onClick={() => togglePlugin(plugin.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    plugin.enabled
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {plugin.enabled ? 'Active' : 'Inactive'}
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">{plugin.description}</p>
              <div className="text-xs text-gray-500 mb-4">
                <div>Version: {plugin.version}</div>
                <div>Routes: {Object.keys(plugin.routes).length}</div>
                <div>Services: {Object.keys(plugin.services).length}</div>
              </div>
              {plugin.enabled && (
                <div className="space-y-2">
                  {Object.keys(plugin.routes).map(route => (
                    <button
                      key={route}
                      onClick={() => navigateTo(route)}
                      className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
                    >
                      {route}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="font-medium text-blue-800">Cabinet Service</h3>
              <p className="text-sm text-blue-600">285+ cabinet designs</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <h3 className="font-medium text-green-800">Design Service</h3>
              <p className="text-sm text-green-600">3D visualization tools</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <h3 className="font-medium text-purple-800">Manufacturing Service</h3>
              <p className="text-sm text-purple-600">CNC and G-Code generation</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CurrentPageComponent = currentPageComponent;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Floorplan 3D</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => navigateTo('/')}
                className={`px-4 py-2 rounded ${
                  currentPath === '/' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('/cabinet-catalog')}
                className={`px-4 py-2 rounded ${
                  currentPath === '/cabinet-catalog' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cabinet Catalog
              </button>
              <button
                onClick={() => navigateTo('/unified-designer')}
                className={`px-4 py-2 rounded ${
                  currentPath === '/unified-designer' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Designer
              </button>
              <button
                onClick={() => navigateTo('/cnc-panel')}
                className={`px-4 py-2 rounded ${
                  currentPath === '/cnc-panel' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manufacturing
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          CurrentPageComponent ? <CurrentPageComponent /> : <DefaultDashboard />
        )}
      </main>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Active Plugins:</span>
              {api.getEnabledPlugins().map((plugin: any) => (
                <span key={plugin.id} className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  {plugin.name}
                </span>
              ))}
            </div>
            <div className="text-gray-500">
              Current Route: {currentPath}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PluginSystemPage() {
  return (
    <PluginSystemDashboard />
  );
}
