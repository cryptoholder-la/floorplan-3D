
// ============================================================================
// CONSOLIDATED ARRAY/LIST UTILITIES
// Merged from 3+ files with array functionality
// ============================================================================

/**
 * Removes duplicate values from an array
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * unique(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Groups array elements by a specified key
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * groupBy(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = key(item);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

/**
 * Utility function for sortBy
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * sortBy(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const sortBy = <T>(array: T[], key: keyof T | ((item: T) => any), direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    /**
 * Utility function for bVal
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * bVal(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Utility function for chunk
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * chunk(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Utility function for flatten
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * flatten(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

/**
 * Utility function for isEmpty
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * isEmpty(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const isEmpty = (array: any[]): boolean => {
  return !array || array.length === 0;
};

/**
 * Utility function for first
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * first(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const first = <T>(array: T[]): T | undefined => {
  return array.length > 0 ? array[0] : undefined;
};

/**
 * Utility function for last
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * last(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const last = <T>(array: T[]): T | undefined => {
  return array.length > 0 ? array[array.length - 1] : undefined;
};
