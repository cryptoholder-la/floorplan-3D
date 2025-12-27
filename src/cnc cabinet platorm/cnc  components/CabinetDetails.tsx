import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Cabinet } from '@/lib/cabinetData';

interface CabinetDetailsProps {
  cabinet: Cabinet | null;
  open: boolean;
  onClose: () => void;
}

export default function CabinetDetails({ cabinet, open, onClose }: CabinetDetailsProps) {
  if (!cabinet) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'base': return 'bg-blue-500';
      case 'tall': return 'bg-green-500';
      case 'wall': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{cabinet.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Type</div>
              <Badge className={`${getTypeColor(cabinet.type)} text-white`}>
                {cabinet.type.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Style</div>
              <Badge variant="outline" className="text-sm">
                {cabinet.style}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{cabinet.height}U</div>
              <div className="text-sm text-muted-foreground">Height</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{cabinet.doors}</div>
              <div className="text-sm text-muted-foreground">Doors</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {cabinet.drawers !== undefined ? cabinet.drawers : '-'}
              </div>
              <div className="text-sm text-muted-foreground">Drawers</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Cabinet Code</div>
            <div className="text-xs text-blue-700 font-mono">{cabinet.name}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}