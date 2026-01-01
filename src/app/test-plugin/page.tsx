'use client';

import React from 'react';

export default function TestPluginPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">Plugin System Test</h1>
      <p className="mt-4 text-lg">Testing the modular plugin architecture</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Cabinet Plugin</h2>
          <p className="mt-2 text-blue-600">285+ cabinet designs</p>
        </div>
        
        <div className="p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Design Plugin</h2>
          <p className="mt-2 text-green-600">3D visualization tools</p>
        </div>
        
        <div className="p-6 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800">Manufacturing Plugin</h2>
          <p className="mt-2 text-purple-600">CNC and G-Code tools</p>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/plugin-system" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go to Plugin System
        </a>
      </div>
    </div>
  );
}
