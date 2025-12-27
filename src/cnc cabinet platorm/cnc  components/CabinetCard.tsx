import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cabinet } from '@/lib/cabinetData';

interface CabinetCardProps {
  cabinet: Cabinet;
  onClick: () => void;
}

export default function CabinetCard({ cabinet, onClick }: CabinetCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'base': return 'bg-blue-500';
      case 'tall': return 'bg-green-500';
      case 'wall': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'standard': return 'bg-slate-200 text-slate-800';
      case 'corner': return 'bg-amber-200 text-amber-800';
      case 'peninsula': return 'bg-cyan-200 text-cyan-800';
      case 'broom': return 'bg-rose-200 text-rose-800';
      case 'end': return 'bg-indigo-200 text-indigo-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold line-clamp-2 flex-1">
            {cabinet.name}
          </CardTitle>
          <Badge className={`${getTypeColor(cabinet.type)} text-white text-xs shrink-0`}>
            {cabinet.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            Height: {cabinet.height}U
          </Badge>
          <Badge variant="outline" className="text-xs">
            Doors: {cabinet.doors}
          </Badge>
          {cabinet.drawers !== undefined && cabinet.drawers > 0 && (
            <Badge variant="outline" className="text-xs">
              Drawers: {cabinet.drawers}
            </Badge>
          )}
        </div>
        <Badge className={`${getStyleColor(cabinet.style)} text-xs`}>
          {cabinet.style}
        </Badge>
      </CardContent>
    </Card>
  );
}