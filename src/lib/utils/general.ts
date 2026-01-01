
// ============================================================================
// CONSOLIDATED GENERAL UTILITIES
// Common utility functions used across the application
// ============================================================================

/**
 * Delays function execution until after a specified wait time
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * debounce(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Limits function execution to once per specified time period
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * throttle(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Utility function for clamp
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * clamp(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Utility function for randomBetween
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * randomBetween(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Utility function for generateId
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * generateId(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const generateId = (prefix: string = '', length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? prefix + '_' + result : result;
};

/**
 * Utility function for deepClone
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * deepClone(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  
  /**
 * Utility function for cloned
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * cloned(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Utility function for isEqual
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * isEqual(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const isEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => isEqual(val, b[index]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    /**
 * Utility function for keysA
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * keysA(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
const keysA = Object.keys(a);
    /**
 * Utility function for keysB
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * keysB(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => isEqual(a[key], b[key]));
  }
  return false;
};

/**
 * Utility function for wait
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * wait(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
