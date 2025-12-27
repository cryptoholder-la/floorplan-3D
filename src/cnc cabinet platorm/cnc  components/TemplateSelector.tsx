import { CabinetTemplate } from '@/lib/cabinetTypes';
import { CABINET_TEMPLATES } from '@/lib/cabinetTemplates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface TemplateSelectorProps {
  onSelectTemplate: (template: CabinetTemplate) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const euroTemplates = CABINET_TEMPLATES.filter(t => t.style === 'euro');
  const insetTemplates = CABINET_TEMPLATES.filter(t => t.style === 'inset');
  const faceframeTemplates = CABINET_TEMPLATES.filter(t => t.style === 'faceframe');

  const renderTemplateCard = (template: CabinetTemplate) => (
    <Card key={template.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription>
          <Badge variant="outline" className="mr-2">{template.type}</Badge>
          <Badge variant="secondary">{template.style}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex justify-between">
            <span>Width:</span>
            <span className="font-medium">{template.dimensions.width}mm</span>
          </div>
          <div className="flex justify-between">
            <span>Height:</span>
            <span className="font-medium">{template.dimensions.height}mm</span>
          </div>
          <div className="flex justify-between">
            <span>Depth:</span>
            <span className="font-medium">{template.dimensions.depth}mm</span>
          </div>
          <div className="flex justify-between">
            <span>Doors:</span>
            <span className="font-medium">{template.doorCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Shelves:</span>
            <span className="font-medium">{template.shelfCount}</span>
          </div>
        </div>
        <Button 
          onClick={() => onSelectTemplate(template)}
          className="w-full"
        >
          Use Template
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Cabinet Templates</h2>
        <p className="text-muted-foreground">
          Select a pre-configured template to start your design
        </p>
      </div>

      <Tabs defaultValue="euro" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="euro">Euro (32mm)</TabsTrigger>
          <TabsTrigger value="inset">Inset</TabsTrigger>
          <TabsTrigger value="faceframe">Face Frame</TabsTrigger>
        </TabsList>

        <TabsContent value="euro" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {euroTemplates.map(renderTemplateCard)}
          </div>
        </TabsContent>

        <TabsContent value="inset" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insetTemplates.map(renderTemplateCard)}
          </div>
        </TabsContent>

        <TabsContent value="faceframe" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faceframeTemplates.map(renderTemplateCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}