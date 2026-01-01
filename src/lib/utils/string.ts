
// ============================================================================
// CONSOLIDATED STRING/TEXT UTILITIES
// Merged from multiple files with string functionality
// ============================================================================

/**
 * Capitalizes the first letter of a string
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * capitalize(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to camelCase format
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * camelCase(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const camelCase = (str: string): string => {
  return str
    .replace(/(?:^w|[A-Z]|w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/s+/g, '');
};

/**
 * Utility function for kebabCase
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * kebabCase(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[s_]+/g, '-')
    .toLowerCase();
};

/**
 * Utility function for snakeCase
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * snakeCase(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const snakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[s-]+/g, '_')
    .toLowerCase();
};

/**
 * Utility function for truncate
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * truncate(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Utility function for slugify
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * slugify(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^ws-]/g, '')
    .replace(/[s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Utility function for isValidEmail
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * isValidEmail(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
  return emailRegex.test(email);
};

/**
 * Utility function for stripHtml
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * // Example usage:
 * stripHtml(params);
 * 
 * @since 1.0.0
 * @author Development Team
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};
