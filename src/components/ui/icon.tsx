'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Icons, IconSizes, IconColors, IconWrapper } from '@/lib/icons'

interface IconProps {
  name: keyof typeof Icons
  size?: keyof typeof IconSizes
  color?: keyof typeof IconColors
  className?: string
  onClick?: () => void
}

/**
 * Centralized Icon Component
 * 
 * This component provides a consistent way to use icons across the entire application.
 * It uses the centralized icon configuration from @/lib/icons.ts
 * 
 * @example
 * <Icon name="HOME" size="MD" color="PRIMARY" />
 * <Icon name="CHECK" size="SM" color="SUCCESS" onClick={handleClick} />
 */
export const Icon = ({ 
  name, 
  size = 'SM', 
  color = 'DEFAULT', 
  className = '',
  onClick 
}: IconProps) => {
  const IconComponent = Icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Icons configuration`)
    return <IconWrapper icon={Icons.BOX} size={size} color={color} className={className} onClick={onClick} />
  }

  return (
    <IconWrapper 
      icon={IconComponent} 
      size={size} 
      color={color} 
      className={className}
      onClick={onClick}
    />
  )
}

// Specialized icon components for common use cases
export const CabinetTypeIcon = ({ type, ...props }: Omit<IconProps, 'name'> & { type: string }) => {
  const iconName = Icons[type as keyof typeof Icons] ? type as keyof typeof Icons : 'BOX'
  return <Icon name={iconName} {...props} />
}

export const StatusIcon = ({ status, ...props }: Omit<IconProps, 'name'> & { status: string }) => {
  const statusIconMap = {
    available: 'CHECK',
    out_of_stock: 'ALERT',
    discontinued: 'ERROR',
    pending: 'CLOCK',
    processing: 'LOADING',
    completed: 'CHECK',
    failed: 'ERROR',
    warning: 'WARNING'
  } as const
  
  const iconName = statusIconMap[status as keyof typeof statusIconMap] || 'CLOCK'
  return <Icon name={iconName} {...props} />
}

export const ToolCategoryIcon = ({ category, ...props }: Omit<IconProps, 'name'> & { category: string }) => {
  const categoryIconMap = {
    core: 'HOME',
    design: 'PALETTE',
    inventory: 'DATABASE',
    reporting: 'FILE',
    admin: 'SETTINGS',
    experimental: 'ZAP'
  } as const
  
  const iconName = categoryIconMap[category as keyof typeof categoryIconMap] || 'TOOLS'
  return <Icon name={iconName} {...props} />
}

// Icon button component for consistent icon buttons
interface IconButtonProps extends Omit<IconProps, 'onClick'> {
  onClick?: () => void
  variant?: 'ghost' | 'outline' | 'default'
  tooltip?: string
}

export const IconButton = ({ 
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
      <Icon name={name} size={size} color={color} />
    </button>
  )
}

// Icon badge component
interface IconBadgeProps extends IconProps {
  badge: string | number
  badgeColor?: keyof typeof IconColors
}

export const IconBadge = ({ 
  name, 
  size = 'SM', 
  color = 'DEFAULT', 
  className = '',
  badge,
  badgeColor = 'ERROR'
}: IconBadgeProps) => {
  return (
    <div className={cn('relative inline-flex', className)}>
      <Icon name={name} size={size} color={color} />
      {badge && (
        <span className={cn(
          'absolute -top-1 -right-1 flex items-center justify-center',
          'w-4 h-4 text-xs font-bold rounded-full',
          IconColors[badgeColor],
          'bg-red-500 text-white'
        )}>
          {badge}
        </span>
      )}
    </div>
  )
}

// Loading icon component
export const LoadingIcon = ({ size = 'MD', className = '' }: Pick<IconProps, 'size' | 'className'>) => {
  return (
    <Icon 
      name="LOADING" 
      size={size} 
      color="PRIMARY" 
      className={cn('animate-spin', className)} 
    />
  )
}

// Export default
export default Icon
