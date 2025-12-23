import path from 'node:path';
import fs from 'node:fs/promises';
import type { CatalogFile } from './types';
import { CatalogFileSchema } from './types';

export const PUBLIC_ROOT = path.join(process.cwd(), 'public');
export const CATALOG_ROOT = path.join(PUBLIC_ROOT, 'catalog');
export const CATALOG_JSON_PATH = path.join(CATALOG_ROOT, 'catalog.json');
export const ATTACHMENTS_ROOT = path.join(CATALOG_ROOT, 'attachments');

export async function ensureCatalogDirs(): Promise<void> {
  await fs.mkdir(CATALOG_ROOT, { recursive: true });
  await fs.mkdir(ATTACHMENTS_ROOT, { recursive: true });
}

export async function readCatalogFile(): Promise<CatalogFile> {
  try {
    const raw = await fs.readFile(CATALOG_JSON_PATH, 'utf8');
    const json = JSON.parse(raw);
    const parsed = CatalogFileSchema.safeParse(json);
    if (parsed.success) return parsed.data;
    return { items: [] };
  } catch {
    return { items: [] };
  }
}

export async function writeCatalogFile(catalog: CatalogFile): Promise<void> {
  await ensureCatalogDirs();
  const parsed = CatalogFileSchema.parse(catalog);
  await fs.writeFile(CATALOG_JSON_PATH, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
}

export function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function writeAttachment(params: {
  itemKey: string;
  fileName: string;
  bytes: Uint8Array;
}): Promise<{ relativePath: string; absolutePath: string }> {
  await ensureCatalogDirs();

  const itemDir = path.join(ATTACHMENTS_ROOT, safeFileName(params.itemKey));
  await fs.mkdir(itemDir, { recursive: true });

  const fileName = safeFileName(params.fileName);
  const abs = path.join(itemDir, fileName);
  await fs.writeFile(abs, params.bytes);

  const rel = path.relative(PUBLIC_ROOT, abs).replace(/\\/g, '/');
  return { relativePath: `/${rel}`, absolutePath: abs };
}
