import type { CatalogSkuInfo } from './types';

export function parseSkuInfo(skuRaw?: string): CatalogSkuInfo | undefined {
  if (!skuRaw) return undefined;
  const sku = skuRaw.trim().toUpperCase();

  // Known families / patterns
  // Base: B15
  // Wall: W2430 (W + width + height)
  // Wall w/ depth override: W362424 (W + width + height + depth)
  // Tall: T2484 (not always standardized, but we try)
  // Sink Base: SB30
  // Corner examples: EZR33, LS36, DCB...

  const now: CatalogSkuInfo = {};

  if (sku.startsWith('LSB')) {
    now.family = 'Lazy Susan Base';
    const width = parseInt(sku.slice(3), 10);
    if (!Number.isNaN(width)) now.widthInches = width;
    now.depthInches = 24;
    now.heightInches = 34.5;
    return now;
  }

  if (sku.startsWith('DB')) {
    now.family = 'Drawer Base';
    const width = parseInt(sku.slice(2), 10);
    if (!Number.isNaN(width)) now.widthInches = width;
    now.depthInches = 24;
    now.heightInches = 24;
    return now;
  }

  if (sku.startsWith('SB')) {
    now.family = 'Sink Base';
    const width = parseInt(sku.slice(2), 10);
    if (!Number.isNaN(width)) now.widthInches = width;
    now.depthInches = 24;
    now.heightInches = 34.5;
    return now;
  }

  if (sku.startsWith('B')) {
    now.family = 'Base Cabinet';
    const width = parseInt(sku.slice(1), 10);
    if (!Number.isNaN(width)) now.widthInches = width;
    now.depthInches = 24;
    now.heightInches = 34.5;
    return now;
  }

  if (sku.startsWith('W')) {
    now.family = 'Wall Cabinet';
    const nums = sku.slice(1);
    // try 4-6 digits
    if (/^\d{4,6}$/.test(nums)) {
      const width = parseInt(nums.slice(0, 2), 10);
      const height = parseInt(nums.slice(2, 4), 10);
      if (!Number.isNaN(width)) now.widthInches = width;
      if (!Number.isNaN(height)) now.heightInches = height;
      if (nums.length === 6) {
        const depth = parseInt(nums.slice(4, 6), 10);
        if (!Number.isNaN(depth)) now.depthInches = depth;
      } else {
        now.depthInches = 12;
      }
      return now;
    }
    return now;
  }

  if (sku.startsWith('T')) {
    now.family = 'Tall Cabinet';
    const nums = sku.slice(1);
    // heuristics: first two digits width, remaining 2-3 digits height
    if (/^\d{4,5}$/.test(nums)) {
      const width = parseInt(nums.slice(0, 2), 10);
      const height = parseInt(nums.slice(2), 10);
      if (!Number.isNaN(width)) now.widthInches = width;
      if (!Number.isNaN(height)) now.heightInches = height;
      now.depthInches = 24;
      return now;
    }
    return now;
  }

  if (sku.startsWith('V')) {
    now.family = 'Vanity';
    const width = parseInt(sku.slice(1), 10);
    if (!Number.isNaN(width)) now.widthInches = width;
    now.depthInches = 21;
    return now;
  }

  if (sku.startsWith('EZR')) {
    now.family = 'Corner Easy Reach';
    const width = parseInt(sku.slice(3), 10);
    if (!Number.isNaN(width)) now.widthInches = width;
    return now;
  }

  if (sku.startsWith('LS')) {
    now.family = 'Corner Lazy Susan';
    const width = parseInt(sku.slice(2), 10);
    if (!Number.isNaN(width)) now.widthInches = width;
    return now;
  }

  if (sku.startsWith('DCB')) {
    now.family = 'Diagonal Corner Base';
    return now;
  }

  return undefined;
}
