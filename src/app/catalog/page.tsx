"use client";

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CatalogImporter from '@/components/CatalogImporter';
import type { AppDispatch, RootState } from '@/lib/store';
import { fetchCatalog } from '@/lib/store/catalogSlice';

export default function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, lastImport } = useSelector((s: RootState) => s.catalog);

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  const stats = useMemo(() => {
    const withSku = items.filter((i) => i.sku).length;
    const totalQty = items.reduce((a, i) => a + (i.qty || 0), 0);
    const totalValue = items.reduce((a, i) => a + (i.qty || 0) * (i.cost || 0), 0);
    return { withSku, totalQty, totalValue };
  }, [items]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="pt-20 p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Catalog & Inventory</h1>
            <p className="text-muted-foreground">
              Import CSV/JSON, attach DXF/DWG/DXG to SKUs, and auto-create new catalog items.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <div>Total items: {items.length}</div>
            <div>With SKU: {stats.withSku}</div>
            <div>Total qty: {stats.totalQty}</div>
            <div>Total value: ${stats.totalValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-5 bg-card">
            <h2 className="text-xl font-semibold mb-3">Import</h2>
            <CatalogImporter />
            {lastImport && (
              <div className="mt-3 text-sm text-muted-foreground">
                Last import: created {lastImport.created}, updated {lastImport.updated}
              </div>
            )}
            {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
          </div>

          <div className="border rounded-2xl p-5 bg-card">
            <h2 className="text-xl font-semibold mb-3">Catalog Preview</h2>
            {loading ? (
              <div className="text-muted-foreground">Loading…</div>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-auto">
                {items.slice(0, 100).map((it) => (
                  <div key={it.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{it.sku ? it.sku : it.name}</div>
                        <div className="text-xs text-muted-foreground">{it.name}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div>Qty: {it.qty}</div>
                        <div>${it.cost.toFixed(2)}</div>
                      </div>
                    </div>
                    {it.parts?.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Parts: {it.parts.length}
                      </div>
                    )}
                    {it.attachments?.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Attachments: {it.attachments.length}
                      </div>
                    )}
                  </div>
                ))}
                {items.length > 100 && (
                  <div className="text-xs text-muted-foreground">Showing first 100 items</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
