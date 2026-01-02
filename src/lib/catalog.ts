import { promises as fs } from 'fs';
import path from 'path';
import { join } from 'path';

// File system utilities for server-side operations
export async function readFile(filePath: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

export async function writeFile(filePath: string, data: string | Buffer): Promise<boolean> {
  try {
    const dir = path.dirname(filePath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, data);
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function mkdir(dirPath: string): Promise<boolean> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    return false;
  }
}

export function joinPath(...paths: string[]): string {
  return join(...paths);
}

export function getExt(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Catalog file operations
export async function readCatalogFile(): Promise<{ items: any[]; created: string; updated: string }> {
  const catalogPath = joinPath(process.cwd(), 'data', 'catalog.json');
  
  try {
    const data = await readFile(catalogPath);
    if (!data) {
      return { items: [], created: new Date().toISOString(), updated: new Date().toISOString() };
    }
    
    const catalog = JSON.parse(data.toString());
    return {
      items: catalog.items || [],
      created: catalog.created || new Date().toISOString(),
      updated: catalog.updated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error reading catalog file:', error);
    return { items: [], created: new Date().toISOString(), updated: new Date().toISOString() };
  }
}

export async function writeCatalogFile(catalog: { items: any[]; created: string; updated: string }): Promise<boolean> {
  const catalogPath = joinPath(process.cwd(), 'data', 'catalog.json');
  
  try {
    const catalogData = {
      ...catalog,
      updated: new Date().toISOString()
    };
    
    return await writeFile(catalogPath, JSON.stringify(catalogData, null, 2));
  } catch (error) {
    console.error('Error writing catalog file:', error);
    return false;
  }
}
