
// ============================================================================
// CONSOLIDATED DATE/TIME UTILITIES
// Merged from 31+ files with date/time functionality
// ============================================================================

/**
 * Formats a date object or string into a specified format
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * formatDate(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return format
    .replace('YYYY', d.getFullYear().toString())
    .replace('MM', (d.getMonth() + 1).toString().padStart(2, '0'))
    .replace('DD', d.getDate().toString().padStart(2, '0'));
};

/**
 * Formats a time object or string into a specified format
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * formatTime(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const formatTime = (date: Date | string, format: string = 'HH:mm:ss'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return format
    .replace('HH', d.getHours().toString().padStart(2, '0'))
    .replace('mm', d.getMinutes().toString().padStart(2, '0'))
    .replace('ss', d.getSeconds().toString().padStart(2, '0'));
};

/**
 * Utility function for getRelativeTime
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * getRelativeTime(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const getRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  /**
 * Utility function for now
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * now(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
const now = new Date();
  /**
 * Utility function for diffMs
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * diffMs(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
const diffMs = now.getTime() - d.getTime();
  /**
 * Utility function for diffDays
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * diffDays(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return diffDays + ' days ago';
  if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
  return Math.floor(diffDays / 30) + ' months ago';
};

/**
 * Utility function for isValidDate
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * isValidDate(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Utility function for addDays
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * addDays(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Utility function for startOfDay
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * startOfDay(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Utility function for endOfDay
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * endOfDay(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};
