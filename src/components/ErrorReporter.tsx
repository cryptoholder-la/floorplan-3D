'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { AlertTriangle, Trash2, Download } from 'lucide-react';

interface ErrorReporterProps {
  errors: any[];
  onReport: () => void;
  onClear: () => void;
}

export default function ErrorReporter({ errors, onReport, onClear }: ErrorReporterProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Reporter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {errors.length} errors detected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={onReport}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Download className="h-3 w-3" />
                  Report
                </button>
                <button
                  onClick={onClear}
                  className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recent Errors</h4>
              {errors.length === 0 ? (
                <p className="text-sm text-gray-600">No errors detected</p>
              ) : (
                <div className="space-y-2">
                  {errors.slice(0, 5).map((error, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error.message || 'Unknown error'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
