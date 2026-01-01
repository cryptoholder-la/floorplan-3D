import React, { useState } from 'react'

export function Tabs({ children, value, onValueChange }) {
  return (
    <div className="w-full">
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { value, onValueChange })
        }
        if (child.type === TabsContent) {
          return child.props.value === value ? child : null
        }
        return child
      })}
    </div>
  )
}

export function TabsList({ children, value, onValueChange }) {
  return (
    <div className="flex space-x-1 rounded-lg bg-slate-800 p-1">
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          isActive: child.props.value === value,
          onClick: () => onValueChange?.(child.props.value)
        })
      )}
    </div>
  )
}

export function TabsTrigger({ children, value, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:text-white hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value }) {
  return (
    <div className="mt-6">
      {children}
    </div>
  )
}
