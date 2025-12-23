import type { CatalogItem, CatalogPart } from './types';
import { CatalogFileSchema, CatalogItemSchema } from './types';
import { parseSkuInfo } from './sku';

function nowIso() {
  return new Date().toISOString();
}

function safeNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^0-9.+-]/g, ''));
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function safeString(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v == null) return '';
  return String(v);
}

function parsePartsCell(partsRaw: unknown): CatalogPart[] {
  if (partsRaw == null) return [];
  if (Array.isArray(partsRaw)) {
    return partsRaw.map((p, idx) => ({
      id: safeString((p as any)?.id || `part-${idx}`),
      name: safeString((p as any)?.name || (p as any)?.part || `Part ${idx + 1}`),
      qty: (p as any)?.qty != null ? safeNumber((p as any)?.qty) : undefined,
      data: typeof p === 'object' && p != null ? (p as any) : undefined,
    }));
  }

  const s = safeString(partsRaw).trim();
  if (!s) return [];

  // Prefer JSON if it looks like JSON
  if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
    try {
      const parsed = JSON.parse(s);
      return parsePartsCell(parsed);
    } catch {
      // fallthrough
    }
  }

  // Fallback: semicolon separated parts, each part optionally key=value pairs
  // Example: "panel:qty=2;width=24;height=30;drillPattern=32mm; hinge:qty=2"
  const parts = s.split(';').map((x) => x.trim()).filter(Boolean);
  return parts.map((token, idx) => {
    const [namePart, ...rest] = token.split(',').map((x) => x.trim());
    const data: Record<string, any> = {};

    for (const seg of rest) {
      const [k, ...vr] = seg.split('=');
      if (!k || vr.length === 0) continue;
      const v = vr.join('=').trim();
      data[k.trim()] = v;
    }

    const qty = data.qty != null ? safeNumber(data.qty) : undefined;

    return {
      id: `part-${idx + 1}`,
      name: namePart || `Part ${idx + 1}`,
      qty,
      data: Object.keys(data).length ? data : undefined,
    };
  });
}

export type CsvRow = Record<string, string>;

export function parseCsv(text: string): CsvRow[] {
  // Minimal CSV parser: supports quoted fields and commas.
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuotes = false;

  const pushCell = () => {
    row.push(cur);
    cur = '';
  };

  const pushRow = () => {
    // ignore empty trailing row
    if (row.length === 1 && row[0] === '' && rows.length === 0) return;
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && ch === ',') {
      pushCell();
      continue;
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && next === '\n') i++;
      pushCell();
      pushRow();
      continue;
    }

    cur += ch;
  }

  pushCell();
  if (row.length) pushRow();

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
  const out: CsvRow[] = [];

  for (let r = 1; r < rows.length; r++) {
    const rec: CsvRow = {};
    for (let c = 0; c < headers.length; c++) {
      rec[headers[c]] = (rows[r][c] ?? '').trim();
    }
    // skip empty row
    const hasAny = Object.values(rec).some((v) => v);
    if (hasAny) out.push(rec);
  }

  return out;
}

export function catalogItemsFromCsvRows(rows: CsvRow[]): CatalogItem[] {
  const iso = nowIso();

  return rows.map((r, idx) => {
    const sku = safeString(r.SKU || r.Sku || r.sku).trim() || undefined;
    const name = safeString(r.Item || r.item || r.Name || r.name).trim() || `Item ${idx + 1}`;
    const qty = safeNumber(r.Qty ?? r.qty ?? r.Quantity ?? r.quantity, 0);
    const cost = safeNumber(r.Cost ?? r.cost ?? r.UnitCost ?? r.unitCost, 0);
    const parts = parsePartsCell(r.parts ?? r.Parts);

    const base: CatalogItem = {
      id: sku ? `sku:${sku}` : `name:${name.toLowerCase()}`,
      sku,
      name,
      qty,
      cost,
      category: 'Catalog',
      parts,
      skuInfo: parseSkuInfo(sku),
      attachments: [],
      createdAt: iso,
      updatedAt: iso,
    };

    return CatalogItemSchema.parse(base);
  });
}

export function catalogItemsFromJson(json: unknown): CatalogItem[] {
  // Accept either {items:[...]} or an array
  if (Array.isArray(json)) {
    const iso = nowIso();
    return json.map((item: any, idx) => {
      const sku = safeString(item?.sku ?? item?.SKU).trim() || undefined;
      const name = safeString(item?.name ?? item?.Item ?? item?.item).trim() || `Item ${idx + 1}`;
      const createdAt = safeString(item?.createdAt) || iso;
      const updatedAt = safeString(item?.updatedAt) || iso;

      const normalized: CatalogItem = {
        id: safeString(item?.id) || (sku ? `sku:${sku}` : `name:${name.toLowerCase()}`),
        sku,
        name,
        qty: safeNumber(item?.qty ?? item?.Qty ?? item?.quantity, 0),
        cost: safeNumber(item?.cost ?? item?.Cost ?? item?.costPerUnit, 0),
        category: safeString(item?.category) || 'Catalog',
        parts: parsePartsCell(item?.parts ?? item?.Parts),
        skuInfo: item?.skuInfo ? item.skuInfo : parseSkuInfo(sku),
        attachments: Array.isArray(item?.attachments) ? item.attachments : [],
        createdAt,
        updatedAt,
      };

      return CatalogItemSchema.parse(normalized);
    });
  }

  const parsed = CatalogFileSchema.safeParse(json);
  if (parsed.success) return parsed.data.items;

  return [];
}
