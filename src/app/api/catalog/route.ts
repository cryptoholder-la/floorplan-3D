import { NextResponse } from 'next/server';
import { readCatalogFile, ensureCatalogDirs, writeCatalogFile } from '@/lib/catalog/fs';

export const runtime = 'nodejs';

export async function GET() {
  await ensureCatalogDirs();
  const catalog = await readCatalogFile();
  return NextResponse.json(catalog);
}

// Convenience endpoint: initialize catalog file if missing
export async function POST() {
  await ensureCatalogDirs();
  const catalog = await readCatalogFile();
  await writeCatalogFile(catalog);
  return NextResponse.json(catalog);
}
