import { NestingSheet } from '@/lib/cabinetTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NestingOptimizerProps {
  sheets: NestingSheet[];
}

export default function NestingOptimizer({ sheets }: NestingOptimizerProps) {
  const totalWaste = sheets.reduce((sum, sheet) => sum + sheet.wastePercentage, 0) / sheets.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>CNC Nesting Optimization</CardTitle>
        <CardDescription>
          {sheets.length} sheet{sheets.length !== 1 ? 's' : ''} required • Average waste: {totalWaste.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sheet-0" className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(sheets.length, 4)}, 1fr)` }}>
            {sheets.slice(0, 4).map((sheet, index) => (
              <TabsTrigger key={sheet.id} value={`sheet-${index}`}>
                Sheet {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {sheets.map((sheet, index) => (
            <TabsContent key={sheet.id} value={`sheet-${index}`} className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Sheet size: 2440mm × 1220mm
                  </div>
                  <Badge variant={sheet.wastePercentage < 15 ? "default" : "secondary"}>
                    {sheet.wastePercentage.toFixed(1)}% waste
                  </Badge>
                </div>

                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '50%' }}>
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 2440 1220"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Sheet outline */}
                    <rect
                      x="0"
                      y="0"
                      width="2440"
                      height="1220"
                      fill="white"
                      stroke="#333"
                      strokeWidth="4"
                    />

                    {/* Parts */}
                    {sheet.parts.map((part, partIndex) => (
                      <g key={part.id}>
                        <rect
                          x={part.x}
                          y={part.y}
                          width={part.width}
                          height={part.height}
                          fill={`hsl(${(partIndex * 137.5) % 360}, 70%, 60%)`}
                          stroke="#333"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        <text
                          x={part.x + part.width / 2}
                          y={part.y + part.height / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#333"
                          fontSize="24"
                          fontWeight="bold"
                        >
                          {part.width}×{part.height}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Parts on sheet:</span>
                    <span className="ml-2 font-medium">{sheet.parts.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Material efficiency:</span>
                    <span className="ml-2 font-medium">{(100 - sheet.wastePercentage).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}