import React from 'react'

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children }) {
  return (
    <div className="p-6 pb-4">
      {children}
    </div>
  )
}

export function CardTitle({ children }) {
  return (
    <h3 className="text-xl font-bold text-white">
      {children}
    </h3>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  )
}
