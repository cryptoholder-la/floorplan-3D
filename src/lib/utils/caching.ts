/**
 * Caching Utilities
 * 
 * @fileoverview Comprehensive caching utilities for performance optimization
 * @version 1.0.0
 * @author Development Team
 * @since 2024-01-01
 */

/**
 * Generic cache class with TTL support
 */
class Cache<T> {
  private cache = new Map<string, { value: T; timestamp: number; ttl: number }>();
  
  constructor(private defaultTTL: number = 300000) {} // 5 minutes default
  
  /**
   * Sets a value in the cache with optional TTL
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds
   */
  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }
  
  /**
   * Gets a value from the cache
   * @param key - Cache key
   * @returns Cached value or undefined if expired/not found
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  /**
   * Checks if a key exists in cache and is not expired
   * @param key - Cache key
   * @returns True if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }
  
  /**
   * Deletes a key from cache
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clears all cache entries
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Gets the number of entries in cache
   * @returns Number of cache entries
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Memoization utility for function results
 */
function memoize<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 300000
): T {
  const cache = new Cache<ReturnType<T>>(ttl);
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Async memoization utility for async functions
 */
function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttl: number = 300000
): T {
  const cache = new Cache<ReturnType<T>>(ttl);
  
  return (async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * LRU (Least Recently Used) Cache implementation
 */
class LRUCache<T> {
  private cache = new Map<string, T>();
  private maxSize: number;
  
  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }
  
  get(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  
  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
export const defaultCache = new Cache();
export const userCache = new Cache(600000); // 10 minutes
export const apiCache = new Cache(1800000); // 30 minutes
export const lruCache = new LRUCache(50);

// Export utilities
export { Cache, memoize, memoizeAsync, LRUCache };

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();
  
  /**
   * Starts timing an operation
   * @param name - Operation name
   * @returns Timer function
   */
  static startTimer(name: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMeasurement(name, duration);
      return duration;
    };
  }
  
  /**
   * Records a measurement
   * @param name - Operation name
   * @param duration - Duration in milliseconds
   */
  private static recordMeasurement(name: string, duration: number): void {
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);
  }
  
  /**
   * Gets statistics for an operation
   * @param name - Operation name
   * @returns Statistics object
   */
  static getStats(name: string): { count: number; avg: number; min: number; max: number } | undefined {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return undefined;
    
    const count = measurements.length;
    const avg = measurements.reduce((sum, val) => sum + val, 0) / count;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    
    return { count, avg, min, max };
  }
  
  /**
   * Gets all statistics
   * @returns All measurements statistics
   */
  static getAllStats(): Record<string, { count: number; avg: number; min: number; max: number }> {
    const stats: Record<string, { count: number; avg: number; min: number; max: number }> = {};
    
    for (const [name] of this.measurements) {
      const stat = this.getStats(name);
      if (stat) stats[name] = stat;
    }
    
    return stats;
  }
  
  /**
   * Clears all measurements
   */
  static clear(): void {
    this.measurements.clear();
  }
}

/**
 * Higher-order function for automatic performance monitoring
 */
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const endTimer = PerformanceMonitor.startTimer(name);
    const result = fn(...args);
    endTimer();
    return result;
  }) as T;
}

/**
 * Higher-order function for async performance monitoring
 */
export function withAsyncPerformanceMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name: string
): T {
  return (async (...args: Parameters<T>) => {
    const endTimer = PerformanceMonitor.startTimer(name);
    const result = await fn(...args);
    endTimer();
    return result;
  }) as T;
}
