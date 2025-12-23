import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CatalogFile, CatalogItem } from '@/lib/catalog';

export interface CatalogState {
  items: CatalogItem[];
  loading: boolean;
  error?: string;
  lastImport?: {
    created: number;
    updated: number;
  };
}

const initialState: CatalogState = {
  items: [],
  loading: false,
};

export const fetchCatalog = createAsyncThunk<CatalogFile>('catalog/fetch', async () => {
  const res = await fetch('/api/catalog', { method: 'GET' });
  if (!res.ok) throw new Error(`Failed to fetch catalog: ${res.status}`);
  return (await res.json()) as CatalogFile;
});

export const importCatalogFiles = createAsyncThunk<
  { items: CatalogItem[]; created: number; updated: number },
  { files: File[] }
>('catalog/import', async ({ files }) => {
  const fd = new FormData();
  for (const f of files) fd.append('files', f, f.name);

  const res = await fetch('/api/catalog/import', {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Import failed: ${res.status}`);
  }

  return (await res.json()) as { items: CatalogItem[]; created: number; updated: number };
});

const slice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(importCatalogFiles.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.lastImport = undefined;
      })
      .addCase(importCatalogFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.lastImport = { created: action.payload.created, updated: action.payload.updated };
      })
      .addCase(importCatalogFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const catalogReducer = slice.reducer;
