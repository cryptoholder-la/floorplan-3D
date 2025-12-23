import type { CatalogItem, CatalogPart, CatalogAttachment } from './types';

function nowIso() {
  return new Date().toISOString();
}

function keyFor(item: CatalogItem): string {
  if (item.sku && item.sku.trim()) return `sku:${item.sku.trim().toUpperCase()}`;
  return `name:${item.name.trim().toLowerCase()}`;
}

function mergeParts(existing: CatalogPart[], incoming: CatalogPart[]): CatalogPart[] {
  if (!incoming.length) return existing;
  if (!existing.length) return incoming;

  const byName = new Map(existing.map((p) => [p.name.trim().toLowerCase(), p]));
  const merged: CatalogPart[] = [...existing];

  for (const p of incoming) {
    const k = p.name.trim().toLowerCase();
    const ex = byName.get(k);
    if (!ex) {
      merged.push(p);
      byName.set(k, p);
      continue;
    }

    // merge qty + data shallowly
    const next: CatalogPart = {
      ...ex,
      qty: p.qty ?? ex.qty,
      data: { ...(ex.data || {}), ...(p.data || {}) },
    };

    const idx = merged.findIndex((x) => x.id === ex.id);
    if (idx >= 0) merged[idx] = next;
    byName.set(k, next);
  }

  return merged;
}

function mergeAttachments(existing: CatalogAttachment[], incoming: CatalogAttachment[]): CatalogAttachment[] {
  if (!incoming.length) return existing;
  const seen = new Set(existing.map((a) => a.relativePath));
  const out = [...existing];
  for (const a of incoming) {
    if (seen.has(a.relativePath)) continue;
    out.push(a);
    seen.add(a.relativePath);
  }
  return out;
}

export function upsertCatalogItems(existing: CatalogItem[], incoming: CatalogItem[]): {
  items: CatalogItem[];
  created: number;
  updated: number;
} {
  const map = new Map<string, CatalogItem>();
  for (const it of existing) map.set(keyFor(it), it);

  let created = 0;
  let updated = 0;
  const iso = nowIso();

  for (const inIt of incoming) {
    const k = keyFor(inIt);
    const ex = map.get(k);

    if (!ex) {
      map.set(k, { ...inIt, createdAt: inIt.createdAt || iso, updatedAt: iso });
      created++;
      continue;
    }

    // merge: prefer incoming for qty/cost/name/category when provided
    const next: CatalogItem = {
      ...ex,
      sku: inIt.sku ?? ex.sku,
      name: inIt.name || ex.name,
      category: inIt.category || ex.category,
      qty: typeof inIt.qty === 'number' ? inIt.qty : ex.qty,
      cost: typeof inIt.cost === 'number' ? inIt.cost : ex.cost,
      skuInfo: inIt.skuInfo ?? ex.skuInfo,
      parts: mergeParts(ex.parts || [], inIt.parts || []),
      attachments: mergeAttachments(ex.attachments || [], inIt.attachments || []),
      updatedAt: iso,
    };

    map.set(k, next);
    updated++;
  }

  const items = Array.from(map.values()).sort((a, b) => (a.sku || a.name).localeCompare(b.sku || b.name));
  return { items, created, updated };
}
