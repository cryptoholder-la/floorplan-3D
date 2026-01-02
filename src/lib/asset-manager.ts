import { promises as fs } from 'fs';
import path from 'path';
import { join } from 'path';

// Asset management utilities
export async function readAssetFile(filePath: string): Promise<Buffer | null> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', filePath);
    return await fs.readFile(fullPath);
  } catch (error) {
    console.error('Error reading asset file:', error);
    return null;
  }
}

export async function writeAssetFile(filePath: string, data: Buffer): Promise<boolean> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(fullPath, data);
    return true;
  } catch (error) {
    console.error('Error writing asset file:', error);
    return false;
  }
}

export async function listAssets(directory: string = ''): Promise<string[]> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', directory);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    return entries
      .filter(entry => entry.isFile())
      .map(entry => join(directory, entry.name));
  } catch (error) {
    console.error('Error listing assets:', error);
    return [];
  }
}

export async function deleteAsset(filePath: string): Promise<boolean> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting asset:', error);
    return false;
  }
}

export function getAssetUrl(filePath: string): string {
  return `/assets/${filePath}`;
}
