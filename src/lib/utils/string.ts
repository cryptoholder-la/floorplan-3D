
// ============================================================================
// CONSOLIDATED STRING/TEXT UTILITIES
// Merged from multiple files with string functionality
// ============================================================================

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelCase = (str: string): string => {
  return str
    .replace(/(?:^w|[A-Z]|w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/s+/g, '');
};

export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[s_]+/g, '-')
    .toLowerCase();
};

export const snakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[s-]+/g, '_')
    .toLowerCase();
};

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^ws-]/g, '')
    .replace(/[s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
  return emailRegex.test(email);
};

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};
