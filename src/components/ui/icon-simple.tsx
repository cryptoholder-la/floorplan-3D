'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Icons, IconSizes, IconColors } from '@/lib/icons-simple'

interface SimpleIconProps {
  name: keyof typeof Icons
  size?: keyof typeof IconSizes
  color?: keyof typeof IconColors
  className?: string
  onClick?: () => void
}

/**
 * Simple Icon Component
 * 
 * This component provides a consistent way to use icons across the entire application.
 * It uses the centralized icon configuration from @/lib/icons-simple.ts
 * 
 * @example
 * <SimpleIcon name="HOME" size="MD" color="PRIMARY" />
 * <SimpleIcon name="CHECK" size="SM" color="SUCCESS" onClick={handleClick} />
 */
export const SimpleIcon = ({ 
  name, 
  size = 'SM', 
  color = 'DEFAULT', 
  className = '',
  onClick 
}: SimpleIconProps) => {
  const IconComponent = Icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Icons configuration`)
    return <Icons.BOX className={`${IconSizes[size]} ${IconColors[color]} ${className}`} onClick={onClick} />
  }

  return (
    <IconComponent 
      className={`${IconSizes[size]} ${IconColors[color]} ${className}`}
      onClick={onClick}
    />
  )
}

// Specialized icon components for common use cases
export const CabinetTypeIcon = ({ type, ...props }: Omit<SimpleIconProps, 'name'> & { type: string }) => {
  const iconName = Icons[type as keyof typeof Icons] ? type as keyof typeof Icons : 'BOX'
  return <SimpleIcon name={iconName} {...props} />
}

export const StatusIcon = ({ status, ...props }: Omit<SimpleIconProps, 'name'> & { status: string }) => {
  const statusIconMap = {
    available: 'CHECK',
    out_of_stock: 'ALERT',
    discontinued: 'ERROR',
    pending: 'CLOCK',
    processing: 'LOADING',
    completed: 'CHECK',
    failed: 'ERROR',
    warning: 'ALERT'
  } as const
  
  const iconName = statusIconMap[status as keyof typeof statusIconMap] || 'CLOCK'
  return <SimpleIcon name={iconName} {...props} />
}

export const ToolCategoryIcon = ({ category, ...props }: Omit<SimpleIconProps, 'name'> & { category: string }) => {
  const categoryIconMap = {
    core: 'HOME',
    design: 'PALETTE',
    inventory: 'DATABASE',
    reporting: 'FILE',
    admin: 'SETTINGS',
    experimental: 'POWER'
  } as const
  
  const iconName = categoryIconMap[category as keyof typeof categoryIconMap] || 'SETTINGS'
  return <SimpleIcon name={iconName} {...props} />
}

// Icon button component for consistent icon buttons
interface IconButtonProps extends Omit<SimpleIconProps, 'onClick'> {
  onClick?: () => void
  variant?: 'ghost' | 'outline' | 'default'
  tooltip?: string
}

export const SimpleIconButton = ({ 
  name, 
  size = 'SM', 
  color = 'DEFAULT', 
  className = '',
  onClick,
  variant = 'ghost',
  tooltip
}: IconButtonProps) => {
  const baseClasses = 'p-2 rounded-md transition-colors flex items-center justify-center'
  
  const variantClasses = {
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
    default: 'bg-blue-500 text-white hover:bg-blue-600'
  }
  
  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    className
  )

  return (
    <button 
      className={combinedClasses}
      onClick={onClick}
      title={tooltip}
    >
      <SimpleIcon name={name} size={size} color={color} />
    </button>
  )
}

// Export default
export default SimpleIcon
