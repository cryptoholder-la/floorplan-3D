import { CatalogItem } from '@/types';

// Merge utilities for combining catalog data
export interface MergeResult {
  items: CatalogItem[];
  created: string;
  updated: string;
  added: number;
  updatedCount: number;
  duplicates: number;
}

export function upsertCatalogItems(
  existingItems: CatalogItem[], 
  incomingItems: CatalogItem[]
): MergeResult {
  const existingMap = new Map<string, CatalogItem>(existingItems.map(item => [item.id, item]));
  const incomingMap = new Map<string, CatalogItem>(incomingItems.map(item => [item.id, item]));
  
  let added = 0;
  let updatedCount = 0;
  let duplicates = 0;
  
  const mergedItems: CatalogItem[] = [];
  
  // Add new items
  for (const [id, item] of incomingMap) {
    if (!existingMap.has(id)) {
      mergedItems.push({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      added++;
    } else {
      duplicates++;
    }
  }
  
  // Update existing items
  for (const [id, existingItem] of existingMap) {
    const incomingItem = incomingMap.get(id);
    if (incomingItem) {
      mergedItems.push({
        ...existingItem,
        ...incomingItem,
        updatedAt: new Date().toISOString()
      });
      updatedCount++;
    } else {
      mergedItems.push(existingItem);
    }
  }
  
  return {
    items: mergedItems,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    added,
    updatedCount,
    duplicates
  };
}
