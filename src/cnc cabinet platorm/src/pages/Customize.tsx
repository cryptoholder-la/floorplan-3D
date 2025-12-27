import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Search, Check } from 'lucide-react';

type MaterialCategory = 'wood' | 'mdf' | 'laminate' | 'plywood';

interface Material {
  id: string;
  name: string;
  price: string;
  image: string;
  category: MaterialCategory;
  isNew?: boolean;
}

const materials: Material[] = [
  {
    id: '1',
    name: 'White Oak',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop',
    category: 'wood',
  },
  {
    id: '2',
    name: 'European Maple',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop',
    category: 'wood',
  },
  {
    id: '3',
    name: 'Black Walnut',
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop',
    category: 'wood',
  },
  {
    id: '4',
    name: 'Red Oak',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop',
    category: 'wood',
  },
  {
    id: '5',
    name: 'Natural Birch',
    price: '$',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop',
    category: 'wood',
    isNew: true,
  },
  {
    id: '6',
    name: 'Cherry Wood',
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop',
    category: 'wood',
  },
];

const finishes = [
  { id: 'f1', name: 'Matte Clear', price: '$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
  { id: 'f2', name: 'Satin', price: '$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
  { id: 'f3', name: 'High Gloss', price: '$$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
  { id: 'f4', name: 'Distressed', price: '$$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
];

const hardware = [
  { id: 'h1', name: 'Brushed Nickel', price: '$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
  { id: 'h2', name: 'Matte Black', price: '$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
  { id: 'h3', name: 'Brass', price: '$$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
  { id: 'h4', name: 'Chrome', price: '$', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop' },
];

export default function Customize() {
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(materials[0]);
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [selectedHardware, setSelectedHardware] = useState(hardware[0]);
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>('wood');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('materials');

  const filteredMaterials = materials.filter(
    (m) =>
      m.category === activeCategory &&
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: { id: MaterialCategory; label: string }[] = [
    { id: 'wood', label: 'Wood' },
    { id: 'mdf', label: 'MDF' },
    { id: 'laminate', label: 'Laminate' },
    { id: 'plywood', label: 'Plywood' },
  ];

  const getCurrentSelection = () => {
    if (activeTab === 'materials') return selectedMaterial;
    if (activeTab === 'finishes') return selectedFinish;
    return selectedHardware;
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex w-full flex-col bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="size-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
            Customize Your Cabinet
          </h1>
          <Button variant="ghost" size="icon" className="size-10">
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-3 bg-transparent border-b border-gray-200/20 dark:border-gray-700/30 rounded-none h-auto p-0">
              <TabsTrigger
                value="materials"
                className="rounded-none border-b-[3px] border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent pb-3 pt-2"
              >
                <p className="text-sm font-bold">Materials</p>
              </TabsTrigger>
              <TabsTrigger
                value="finishes"
                className="rounded-none border-b-[3px] border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent pb-3 pt-2"
              >
                <p className="text-sm font-bold">Finishes</p>
              </TabsTrigger>
              <TabsTrigger
                value="hardware"
                className="rounded-none border-b-[3px] border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent pb-3 pt-2"
              >
                <p className="text-sm font-bold">Hardware</p>
              </TabsTrigger>
            </TabsList>
          </div>

          <main className="flex-1 pb-28">
            <TabsContent value="materials" className="mt-0">
              {/* Search Bar */}
              <div className="px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search for Oak, Maple..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-white dark:bg-gray-800/40 border-gray-300/20 dark:border-gray-700/30"
                  />
                </div>
              </div>

              {/* Category Chips */}
              <div className="flex gap-3 px-4 pb-4 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-gray-800/40 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <p className="text-sm font-medium">{category.label}</p>
                  </button>
                ))}
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    onClick={() => setSelectedMaterial(material)}
                    className={`flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-2 transition-all ${
                      selectedMaterial.id === material.id
                        ? 'border-primary bg-white dark:bg-gray-800/40'
                        : 'border-transparent bg-white dark:bg-gray-800/40 hover:border-gray-300'
                    }`}
                  >
                    <div className="relative w-full">
                      <div
                        className="aspect-square w-full rounded-lg bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${material.image})` }}
                      />
                      {selectedMaterial.id === material.id && (
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary backdrop-blur-sm">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                      {material.isNew && (
                        <div className="absolute left-2 top-2">
                          <Badge className="bg-orange-500 text-white">NEW</Badge>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {material.name}
                      </p>
                      <p className="text-sm text-gray-600">{material.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="finishes" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pt-4">
                {finishes.map((finish) => (
                  <div
                    key={finish.id}
                    onClick={() => setSelectedFinish(finish)}
                    className={`flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-2 transition-all ${
                      selectedFinish.id === finish.id
                        ? 'border-primary bg-white dark:bg-gray-800/40'
                        : 'border-transparent bg-white dark:bg-gray-800/40 hover:border-gray-300'
                    }`}
                  >
                    <div className="relative w-full">
                      <div
                        className="aspect-square w-full rounded-lg bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${finish.image})` }}
                      />
                      {selectedFinish.id === finish.id && (
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary backdrop-blur-sm">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {finish.name}
                      </p>
                      <p className="text-sm text-gray-600">{finish.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hardware" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pt-4">
                {hardware.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedHardware(item)}
                    className={`flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-2 transition-all ${
                      selectedHardware.id === item.id
                        ? 'border-primary bg-white dark:bg-gray-800/40'
                        : 'border-transparent bg-white dark:bg-gray-800/40 hover:border-gray-300'
                    }`}
                  >
                    <div className="relative w-full">
                      <div
                        className="aspect-square w-full rounded-lg bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      {selectedHardware.id === item.id && (
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary backdrop-blur-sm">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </main>
        </Tabs>
      </header>

      {/* Persistent Bottom Bar */}
      <footer className="fixed bottom-0 left-0 z-10 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="border-t border-gray-200/20 dark:border-gray-700/30 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div
                className="h-14 w-14 rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getCurrentSelection().image})`,
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Selected {activeTab === 'materials' ? 'Material' : activeTab === 'finishes' ? 'Finish' : 'Hardware'}
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {getCurrentSelection().name}
              </p>
            </div>
            <Button
              onClick={() => navigate('/')}
              className="flex-shrink-0 h-12 px-6 bg-primary hover:bg-primary/90"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}