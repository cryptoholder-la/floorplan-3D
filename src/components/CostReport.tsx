import { useState } from 'react';
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { DollarSign, TrendingUp, FileText, Download } from 'lucide-react';
import { Material } from '@/types';

export default function CostReport() {
  const [reportData, setReportData] = React.useState({
    totalCost: 0,
    materialCost: 0,
    laborCost: 0,
    overheadCost: 0,
    profitMargin: 20,
    items: []
  });

  const calculateSellingPrice = () => {
    return reportData.totalCost * (1 + reportData.profitMargin / 100);
  };

  const exportReport = () => {
    const reportContent = `
Cost Analysis Report
====================
Generated: ${new Date().toLocaleDateString()}

Cost Breakdown:
- Material Cost: $${reportData.materialCost.toFixed(2)}
- Labor Cost: $${reportData.laborCost.toFixed(2)}
- Overhead Cost: $${reportData.overheadCost.toFixed(2)}
- Total Cost: $${reportData.totalCost.toFixed(2)}
- Profit Margin: ${reportData.profitMargin}%
- Selling Price: $${calculateSellingPrice().toFixed(2)}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cost-report.txt';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reportData.totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.profitMargin}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selling Price</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${calculateSellingPrice().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${(calculateSellingPrice() - reportData.totalCost).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Breakdown</CardTitle>
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Cost Components</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Materials:</span>
                    <span>${reportData.materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor:</span>
                    <span>${reportData.laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overhead:</span>
                    <span>${reportData.overheadCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Profit Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span>${reportData.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit ({reportData.profitMargin}%):</span>
                    <span>${(calculateSellingPrice() - reportData.totalCost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Selling Price:</span>
                    <span>${calculateSellingPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
