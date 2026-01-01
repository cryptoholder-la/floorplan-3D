import React from 'react'

export default function MainLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
            </div>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/design-tools" className="text-gray-300 hover:text-white transition-colors">Design Tools</a>
              <a href="/manufacturing" className="text-gray-300 hover:text-white transition-colors">CNC</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Floorplan 3D - Advanced Design & Manufacturing Platform
          </p>
        </div>
      </footer>
    </div>
  )
}
