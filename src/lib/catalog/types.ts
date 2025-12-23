import { z } from 'zod';

export type CatalogAttachmentType = 'dxf' | 'dwg' | 'dxg' | 'json' | 'csv' | 'other';

export const CatalogAttachmentSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  relativePath: z.string(),
  type: z.string().default('other'),
  uploadedAt: z.string(),
});

export type CatalogAttachment = z.infer<typeof CatalogAttachmentSchema>;

export const CatalogPartSchema = z.object({
  id: z.string(),
  name: z.string(),
  qty: z.number().optional(),
  data: z.record(z.any()).optional(),
});

export type CatalogPart = z.infer<typeof CatalogPartSchema>;

export const CatalogSkuInfoSchema = z.object({
  family: z.string().optional(),
  widthInches: z.number().optional(),
  heightInches: z.number().optional(),
  depthInches: z.number().optional(),
});

export type CatalogSkuInfo = z.infer<typeof CatalogSkuInfoSchema>;

export const CatalogItemSchema = z.object({
  id: z.string(),
  sku: z.string().optional(),
  name: z.string(),
  qty: z.number().default(0),
  cost: z.number().default(0),
  category: z.string().default('Uncategorized'),
  parts: z.array(CatalogPartSchema).default([]),
  skuInfo: CatalogSkuInfoSchema.optional(),
  attachments: z.array(CatalogAttachmentSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

export const CatalogFileSchema = z.object({
  items: z.array(CatalogItemSchema),
});

export type CatalogFile = z.infer<typeof CatalogFileSchema>;
