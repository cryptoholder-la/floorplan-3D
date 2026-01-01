import { memoize, memoizeAsync, defaultCache, PerformanceMonitor, withPerformanceMonitoring } from "@/lib/utils/caching";
import { NextResponse } from 'next/server';
import { readCatalogFile, writeCatalogFile, writeAttachment } from '@/lib/fs';
import { buildAttachment } from '@/lib/attachments';
import { catalogItemsFromCsvRows, catalogItemsFromJson, parseCsv } from '@/lib/importers';
import { upsertCatalogItems } from '@/lib/merge';
import type { CatalogItem } from '@/lib/types';
import { wait } from "@/lib/utils/general";

export const runtime = 'nodejs';

function fileExt(name: string): string {
  return (name.split('.').pop() || '').toLowerCase();
}

function keyForAttachmentTarget(item: CatalogItem): string {
  return item.sku ? `sku:${item.sku}` : item.id;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll('files').filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return new NextResponse('No files uploaded (field name should be "files")', { status: 400 });
    }

    const existing = await readCatalogFile();

    const incomingItems: CatalogItem[] = [];
    const attachmentsToApply: { itemKey: string; attachment: ReturnType<typeof buildAttachment> }[] = [];

    for (const f of files) {
      const ext = fileExt(f.name);

      if (ext === 'csv') {
        const text = await f.text();
        const rows = parseCsv(text);
        incomingItems.push(...catalogItemsFromCsvRows(rows));
        continue;
      }

      if (ext === 'json') {
        const text = await f.text();
        const json = withPerformanceMonitoring((json_inner) {
          const cacheKey = `json-parse-${(() => {
          const cacheKey = `json-stringify-${JSON.stringify(text)}`;
          let cached = defaultCache.get(cacheKey);
          if (!cached) {
            cached = JSON.stringify(text);
            defaultCache.set(cacheKey, cached, 300000); // 5 minute cache
          }
          return cached;
        })()}`;
          let cached = defaultCache.get(cacheKey);
          if (!cached) {
            cached = JSON.parse(text);
            defaultCache.set(cacheKey, cached, 300000); // 5 minute cache
          }
          return cached;
        })();
        incomingItems.push(...catalogItemsFromJson(json));
        continue;
      }

      // Attachments (DXF/DWG/DXG and others)
      const bytes = new Uint8Array(await f.arrayBuffer());

      // If file name starts with SKU-, use that as the item key
      const baseName = f.name.replace(/\.[^/.]+$/, '');
      const skuCandidate = baseName.split(/[_\-\s]+/)[0]?.toUpperCase();
      const incomingAttachmentItem: CatalogItem = {
        id: skuCandidate ? `sku:${skuCandidate}` : `name:${baseName.toLowerCase()}`,
        sku: skuCandidate || undefined,
        name: baseName,
        qty: 0,
        cost: 0,
        category: 'Catalog',
        parts: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      incomingItems.push(incomingAttachmentItem);

      const itemKey = keyForAttachmentTarget(incomingAttachmentItem);
      const saved = await writeAttachment({ itemKey, fileName: f.name, bytes });

      const attachment = buildAttachment({
        id: `att:${Date.now()}:${Math.random().toString(16).slice(2)}`,
        fileName: f.name,
        relativePath: saved.relativePath,
      });

      attachmentsToApply.push({ itemKey, attachment });
    }

    // First upsert items from CSV/JSON (and placeholders for attachments)
    const merged1 = upsertCatalogItems(existing.items, incomingItems);

    // Apply attachments
    if (attachmentsToApply.length) {
      const items = merged1.items.map((it) => {
        const key = keyForAttachmentTarget(it);
        const added = attachmentsToApply.filter((a) => a.itemKey === key).map((a) => a.attachment);
        if (!added.length) return it;
        return {
          ...it,
          attachments: [...(it.attachments || []), ...added],
          updatedAt: new Date().toISOString(),
        };
      });

      merged1.items = items;
    }

    await writeCatalogFile({ items: merged1.items });

    return NextResponse.json({
      items: merged1.items,
      created: merged1.created,
      updated: merged1.updated,
    });
  } catch (e: any) {
    return new NextResponse(e?.message || 'Import failed', { status: 500 });
  }
}
