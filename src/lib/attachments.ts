import { promises as fs } from 'fs';
import path from 'path';

// Attachment management utilities
export interface Attachment {
  id: string;
  fileName: string;
  relativePath: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export async function buildAttachment(options: {
  id: string;
  fileName: string;
  relativePath: string;
}): Promise<Attachment> {
  const stats = await fs.stat(options.relativePath);
  
  return {
    id: options.id,
    fileName: options.fileName,
    relativePath: options.relativePath,
    mimeType: getMimeType(options.fileName),
    size: stats.size,
    createdAt: new Date().toISOString()
  };
}

export async function saveAttachment(options: {
  itemKey: string;
  fileName: string;
  bytes: Buffer;
}): Promise<{ relativePath: string }> {
  const attachmentsDir = path.join(process.cwd(), 'public', 'attachments');
  await fs.mkdir(attachmentsDir, { recursive: true });
  
  const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}-${options.fileName}`;
  const relativePath = path.join('attachments', fileName);
  const fullPath = path.join(process.cwd(), 'public', relativePath);
  
  await fs.writeFile(fullPath, options.bytes);
  
  return { relativePath };
}

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
    'dwg': 'application/acad',
    'dxf': 'application/dxf',
    'json': 'application/json',
    'csv': 'text/csv',
    'txt': 'text/plain'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}
