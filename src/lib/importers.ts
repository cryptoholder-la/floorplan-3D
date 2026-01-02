import { promises as fs } from 'fs';
import path from 'path';

// Import utilities for different file formats
export interface ImportResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function parseCsv(text: string): Promise<string[][]> {
  const lines = text.split('\n').filter(line => line.trim());
  const result: string[][] = [];
  
  for (const line of lines) {
    // Simple CSV parsing - split by comma, handle quoted fields
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    fields.push(current.trim());
    result.push(fields);
  }
  
  return result;
}

export async function parseJson(text: string): Promise<any> {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

export function catalogItemsFromCsvRows(rows: string[][]): any[] {
  return rows.map((row, index) => ({
    id: `csv-${index}`,
    sku: row[0] || '',
    name: row[1] || '',
    description: row[2] || '',
    category: row[3] || 'Uncategorized',
    cost: parseFloat(row[4]) || 0,
    qty: parseInt(row[5]) || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

export function catalogItemsFromJson(data: any): any[] {
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      id: item.id || `json-${index}`,
      sku: item.sku || '',
      name: item.name || '',
      description: item.description || '',
      category: item.category || 'Uncategorized',
      cost: parseFloat(item.cost) || 0,
      qty: parseInt(item.qty) || 1,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    }));
  }
  
  return [];
}

export function detectFileType(fileName: string): 'csv' | 'json' | 'unknown' {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (ext === 'csv') return 'csv';
  if (ext === 'json') return 'json';
  
  return 'unknown';
}
