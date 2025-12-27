import { CutListItem } from '@/lib/cabinetTypes';
import { exportCutListToCSV } from '@/lib/cabinetCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';

interface CutListPanelProps {
  cutList: CutListItem[];
}

export default function CutListPanel({ cutList }: CutListPanelProps) {
  const handleExport = () => {
    const csv = exportCutListToCSV(cutList);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cabinet-cut-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalParts = cutList.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cut List</CardTitle>
            <CardDescription>
              {cutList.length} unique parts, {totalParts} total pieces
            </CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead className="text-right">Width</TableHead>
                <TableHead className="text-right">Height</TableHead>
                <TableHead className="text-right">Thickness</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Edge Banding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cutList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.width}mm</TableCell>
                  <TableCell className="text-right">{item.height}mm</TableCell>
                  <TableCell className="text-right">{item.thickness}mm</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="capitalize">{item.material}</TableCell>
                  <TableCell className="capitalize">
                    {item.edgeBanding.length > 0 ? item.edgeBanding.join(', ') : 'None'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}