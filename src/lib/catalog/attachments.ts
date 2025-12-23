import type { CatalogAttachment } from './types';

export function attachmentTypeFromFileName(fileName: string): string {
  const ext = (fileName.split('.').pop() || '').toLowerCase();
  if (ext === 'dxf') return 'dxf';
  if (ext === 'dwg') return 'dwg';
  if (ext === 'dxg') return 'dxg';
  if (ext === 'csv') return 'csv';
  if (ext === 'json') return 'json';
  return 'other';
}

export function buildAttachment(params: {
  id: string;
  fileName: string;
  relativePath: string;
}): CatalogAttachment {
  return {
    id: params.id,
    fileName: params.fileName,
    relativePath: params.relativePath,
    type: attachmentTypeFromFileName(params.fileName),
    uploadedAt: new Date().toISOString(),
  };
}
