'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value?: number
  max?: number
  className?: string
}

export function Progress({ value = 0, max = 100, className = "" }: ProgressProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0
  
  return (
    <div 
      className={cn(
        "w-full bg-gray-200 rounded-full h-2",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={percentage}
    >
      <div 
        className={cn(
          "bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out",
          "h-2 rounded-full"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
  )
}

export default Progress
