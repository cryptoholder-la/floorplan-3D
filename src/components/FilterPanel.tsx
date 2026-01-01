'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Filter, Search } from 'lucide-react';

interface FilterPanelProps {
  data: any[];
  onFilter: (filters: any) => void;
}

export default function FilterPanel({ data, onFilter }: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                onChange={(e) => onFilter({ search: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categories</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="">All Categories</option>
                <option value="cabinets">Cabinets</option>
                <option value="appliances">Appliances</option>
                <option value="materials">Materials</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {data.length} items found
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
