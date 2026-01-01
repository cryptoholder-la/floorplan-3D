import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { unique } from "@/lib/utils/array";
import { wait } from "@/lib/utils/general";

export const runtime = 'nodejs';

const UPLOAD_DIR = join(process.cwd(), 'assets', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

function sanitizeFileName(fileName: string): string {
  // Remove special characters and keep only alphanumeric, dots, hyphens, and underscores
  return fileName.replace(/[^a-zA-Z0-9.-_]/g, '_');
}

export async function POST(req: Request) {
  try {
    await ensureUploadDir();
    
    const form = await req.formData();
    const files = form.getAll('files').filter((f): f is File => f instanceof File);
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedFiles = [];
    
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename to avoid conflicts
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const sanitizedName = sanitizeFileName(file.name);
      const uniqueFileName = `${timestamp}_${randomString}_${sanitizedName}`;
      
      const filePath = join(UPLOAD_DIR, uniqueFileName);
      
      await writeFile(filePath, buffer);
      
      uploadedFiles.push({
        originalName: file.name,
        fileName: uniqueFileName,
        size: file.size,
        type: file.type,
        path: `/assets/uploads/${uniqueFileName}`,
        uploadDate: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
