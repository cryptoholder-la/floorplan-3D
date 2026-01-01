'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Plus } from 'lucide-react';

interface TemplateSelectorProps {
  templates: any[];
  onSelect: (template: any) => void;
}

export default function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Template Selector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No templates available</p>
                </div>
              ) : (
                templates.map((template, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => onSelect(template)}
                  >
                    <h4 className="font-medium">{template.name || `Template ${index + 1}`}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description || 'No description available'}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Create New Template
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
