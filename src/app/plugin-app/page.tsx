import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect } from 'react';
import { PluginProvider, usePluginAPI, usePluginManager } from '@/plugins/core/PluginManager';
import { availablePlugins, defaultPlugins } from '@/plugins/registry';
import { Status } from '@/types';

function PluginDashboard() {
  const manager = usePluginManager();
  const api = usePluginAPI();
  const [activePlugins, setActivePlugins] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState<string>('/');

  useEffect(() => {
    // Initialize default plugins
    const initializePlugins = async () => {
      for (const plugin of availablePlugins) {
        try {
          await manager.registerPlugin(plugin);
        } catch (error) {
          console.error(`Failed to register plugin ${plugin.metadata.id}:`, error);
        }
      }

      // Activate default plugins
      for (const pluginId of defaultPlugins) {
        try {
          await manager.activatePlugin(pluginId);
          setActivePlugins(prev => [...prev, pluginId]);
        } catch (error) {
          console.error(`Failed to activate plugin ${pluginId}:`, error);
        }
      }
    };

    initializePlugins();

    // Handle navigation
    const handleNavigation = () => {
      setCurrentRoute(window.location.pathname);
      
      // Find the route component
      const routeComponent = manager.getRoute(window.location.pathname);
      if (routeComponent) {
        // Route component will be rendered below
      }
    };

    window.addEventListener('popstate', handleNavigation);
    handleNavigation();

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [manager]);

  const togglePlugin = async (pluginId: string) => {
    if (activePlugins.includes(pluginId)) {
      await manager.deactivatePlugin(pluginId);
      setActivePlugins(prev => prev.filter(id => id !== pluginId));
    } else {
      await manager.activatePlugin(pluginId);
      setActivePlugins(prev => [...prev, pluginId]);
    }
  };

  const navigateTo = (path: string) => {
    api.navigate(path);
  };

  const getCurrentPageComponent = () => {
    const component = manager.getRoute(currentRoute);
    if (component) {
      const Component = component;
      return <Component />;
    }
    
    // Default dashboard
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800">Plugin Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome to the modular floorplan system</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePlugins.map(plugin => (
            <div key={plugin.metadata.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{plugin.metadata.name}</h3>
                <button
                  onClick={() => togglePlugin(plugin.metadata.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    activePlugins.includes(plugin.metadata.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {activePlugins.includes(plugin.metadata.id) ? 'Active' : 'Inactive'}
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">{plugin.metadata.description}</p>
              <div className="text-xs text-gray-500">
                <div>Version: {plugin.metadata.version}</div>
                <div>Category: {plugin.metadata.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
                  currentRoute === '/' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('/cabinet-catalog')}
                className={`px-4 py-2 rounded ${
                  currentRoute === '/cabinet-catalog' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cabinet Catalog
              </button>
              <button
                onClick={() => navigateTo('/unified-designer')}
                className={`px-4 py-2 rounded ${
                  currentRoute === '/unified-designer' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Designer
              </button>
              <button
                onClick={() => navigateTo('/cnc-panel')}
                className={`px-4 py-2 rounded ${
                  currentRoute === '/cnc-panel' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
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
        {getCurrentPageComponent()}
      </main>

      {/* Plugin Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Active Plugins:</span>
              {activePlugins.map(pluginId => {
                const plugin = availablePlugins.find(p => p.metadata.id === pluginId);
                return (
                  <span key={pluginId} className="px-2 py-1 bg-green-100 text-green-800 rounded">
                    {plugin?.metadata.name || pluginId}
                  </span>
                );
              })}
            </div>
            <div className="text-gray-500">
              Current Route: {currentRoute}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PluginAppPage() {
  return (
    <PluginProvider>
      <PluginDashboard />
    </PluginProvider>
  );
}
