/**
 * Enhanced Utility Functions with Caching
 * 
 * @fileoverview Performance-optimized utility functions
 * @version 1.0.0
 * @author Development Team
 * @since 2024-01-01
 */

import { memoize, memoizeAsync, defaultCache, lruCache } from "./caching";
import { isEmpty } from "./array";

/**
 * Enhanced date formatting with caching
 */
export const formatDate = memoize((date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return format
    .replace('YYYY', d.getFullYear().toString())
    .replace('MM', (d.getMonth() + 1).toString().padStart(2, '0'))
    .replace('DD', d.getDate().toString().padStart(2, '0'));
}, 60000); // 1 minute cache

/**
 * Enhanced time formatting with caching
 */
export const formatTime = memoize((date: Date | string, format: string = 'HH:mm:ss'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return format
    .replace('HH', d.getHours().toString().padStart(2, '0'))
    .replace('mm', d.getMinutes().toString().padStart(2, '0'))
    .replace('ss', d.getSeconds().toString().padStart(2, '0'));
}, 60000); // 1 minute cache

/**
 * Enhanced array unique with caching for large arrays
 */
export const unique = memoize(<T>(array: T[]): T[] => {
  return [...new Set(array)];
}, 300000); // 5 minute cache

/**
 * Enhanced groupBy with caching
 */
export const groupBy = memoize(<T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = key(item);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}, 300000); // 5 minute cache

/**
 * Enhanced array sorting with caching
 */
export const sortBy = memoize(<T>(array: T[], key: keyof T | ((item: T) => any), direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}, 60000); // 1 minute cache

/**
 * Enhanced string operations with caching
 */
export const capitalize = memoize((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}, 300000); // 5 minute cache

export const camelCase = memoize((str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}, 300000); // 5 minute cache

export const kebabCase = memoize((str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}, 300000); // 5 minute cache

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  /**
   * Monitor function performance
   */
  measure<T extends (...args: any[]) => any>(fn: T, name: string): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    }) as T;
  },
  
  /**
   * Monitor async function performance
   */
  measureAsync<T extends (...args: any[]) => Promise<any>>(fn: T, name: string): T {
    return (async (...args: Parameters<T>) => {
      const start = performance.now();
      const result = await fn(...args);
      const end = performance.now();
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    }) as T;
  },
  
  /**
   * Create a performance budget
   */
  createBudget(maxTime: number) {
    return {
      check<T>(fn: () => T, name: string): T {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        const duration = end - start;
        
        if (duration > maxTime) {
          console.warn(`${name} exceeded budget: ${duration.toFixed(2)}ms > ${maxTime}ms`);
        }
        
        return result;
      }
    };
  }
};

/**
 * Cache management utilities
 */
export const cacheUtils = {
  /**
   * Clear all caches
   */
  clearAll(): void {
    defaultCache.clear();
    lruCache.clear();
  },
  
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      defaultCache: defaultCache.size(),
      lruCache: lruCache.size()
    };
  },
  
  /**
   * Preload common data
   */
  async preloadCommonData(): Promise<void> {
    // Preload frequently used data
    // This would be implemented based on application needs
    console.log('Preloading common data...');
  }
};
