"use client";

import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import { importCatalogFiles } from '@/lib/store/catalogSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ACCEPTED_EXT = ['.csv', '.json', '.dxf', '.dwg', '.dxg'];

export default function CatalogImporter() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((s: RootState) => s.catalog.loading);

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => {
      const byKey = new Map(prev.map((f) => [`${f.name}:${f.size}`, f]));
      for (const f of accepted) byKey.set(`${f.name}:${f.size}`, f);
      return Array.from(byKey.values());
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    validator: (file) => {
      const lower = file.name.toLowerCase();
      if (!ACCEPTED_EXT.some((ext) => lower.endsWith(ext))) {
        return {
          code: 'file-invalid-type',
          message: `Unsupported file type. Allowed: ${ACCEPTED_EXT.join(', ')}`,
        };
      }
      return null;
    },
  });

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of files) {
      const ext = (f.name.split('.').pop() || 'unknown').toLowerCase();
      counts[ext] = (counts[ext] || 0) + 1;
    }
    return counts;
  }, [files]);

  const handleImport = async () => {
    if (files.length === 0) {
      toast.error('Add at least one file to import');
      return;
    }

    try {
      const res = await dispatch(importCatalogFiles({ files })).unwrap();
      toast.success(`Imported. Created: ${res.created}, Updated: ${res.updated}`);
      setFiles([]);
    } catch (e: any) {
      toast.error(e?.message || 'Import failed');
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-700'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-lg font-semibold">Drop files to import</div>
        <div className="text-sm text-muted-foreground mt-1">
          Supported: CSV (SKU, Item, Qty, Cost, parts), JSON, DXF/DWG/DXG attachments
        </div>
      </div>

      {files.length > 0 && (
        <div className="border rounded-xl p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Staged files ({files.length})</div>
            <Button variant="outline" size="sm" onClick={() => setFiles([])} disabled={loading}>
              Clear
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {files.map((f) => (
              <div key={`${f.name}:${f.size}`} className="text-sm flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-mono">{f.name}</span>
                  <span className="text-muted-foreground"> • {(f.size / 1024).toFixed(1)} KB</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Summary: {Object.entries(summary)
              .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
              .join(' | ')}
          </div>
        </div>
      )}

      <Button onClick={handleImport} disabled={loading}>
        {loading ? 'Importing…' : 'Import to Catalog'}
      </Button>
    </div>
  );
}
