import { useState, useEffect, useMemo } from 'react';
import CabinetCard from '@/components/CabinetCard';
import FilterPanel from '@/components/FilterPanel';
import CabinetDetails from '@/components/CabinetDetails';
import { Cabinet, CabinetData, getAllCabinets, getUniqueValues, filterCabinets } from '@/lib/cabinetData';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  const [cabinetData, setCabinetData] = useState<CabinetData | null>(null);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    style: 'all',
    minHeight: 'all',
    maxHeight: 'all',
    doors: 'all',
    drawers: 'all',
    search: ''
  });

  useEffect(() => {
    fetch('/data/cabinets.json')
      .then(res => res.json())
      .then(data => setCabinetData(data))
      .catch(err => console.error('Error loading cabinet data:', err));
  }, []);

  const allCabinets = useMemo(() => {
    if (!cabinetData) return [];
    return getAllCabinets(cabinetData);
  }, [cabinetData]);

  const uniqueTypes = useMemo(() => 
    getUniqueValues(allCabinets, 'type') as string[], 
    [allCabinets]
  );

  const uniqueStyles = useMemo(() => 
    getUniqueValues(allCabinets, 'style') as string[], 
    [allCabinets]
  );

  const uniqueHeights = useMemo(() => 
    getUniqueValues(allCabinets, 'height') as number[], 
    [allCabinets]
  );

  const uniqueDoors = useMemo(() => 
    getUniqueValues(allCabinets, 'doors') as number[], 
    [allCabinets]
  );

  const uniqueDrawers = useMemo(() => {
    const drawers = allCabinets
      .map(c => c.drawers)
      .filter((d): d is number => d !== undefined);
    return Array.from(new Set(drawers)).sort((a, b) => a - b);
  }, [allCabinets]);

  const filteredCabinets = useMemo(() => {
    return filterCabinets(allCabinets, {
      type: filters.type !== 'all' ? filters.type : undefined,
      style: filters.style !== 'all' ? filters.style : undefined,
      minHeight: filters.minHeight !== 'all' ? Number(filters.minHeight) : undefined,
      maxHeight: filters.maxHeight !== 'all' ? Number(filters.maxHeight) : undefined,
      doors: filters.doors !== 'all' ? Number(filters.doors) : undefined,
      drawers: filters.drawers !== 'all' ? Number(filters.drawers) : undefined,
      search: filters.search
    });
  }, [allCabinets, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      type: 'all',
      style: 'all',
      minHeight: 'all',
      maxHeight: 'all',
      doors: 'all',
      drawers: 'all',
      search: ''
    });
  };

  const stats = useMemo(() => {
    if (!cabinetData) return { base: 0, tall: 0, wall: 0, total: 0 };
    return {
      base: cabinetData.base_units.length,
      tall: cabinetData.tall_units.length,
      wall: cabinetData.wall_units.length,
      total: allCabinets.length
    };
  }, [cabinetData, allCabinets]);

  if (!cabinetData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading cabinet catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Kitchen Cabinet Catalog
          </h1>
          <p className="text-slate-600">
            Browse and filter our complete collection of kitchen cabinets
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="outline" className="text-sm">
              <span className="font-semibold text-blue-600">{stats.base}</span>
              <span className="ml-1 text-slate-600">Base Units</span>
            </Badge>
            <Badge variant="outline" className="text-sm">
              <span className="font-semibold text-green-600">{stats.tall}</span>
              <span className="ml-1 text-slate-600">Tall Units</span>
            </Badge>
            <Badge variant="outline" className="text-sm">
              <span className="font-semibold text-purple-600">{stats.wall}</span>
              <span className="ml-1 text-slate-600">Wall Units</span>
            </Badge>
            <Badge variant="outline" className="text-sm">
              <span className="font-semibold text-slate-900">{stats.total}</span>
              <span className="ml-1 text-slate-600">Total</span>
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              uniqueTypes={uniqueTypes}
              uniqueStyles={uniqueStyles}
              uniqueHeights={uniqueHeights}
              uniqueDoors={uniqueDoors}
              uniqueDrawers={uniqueDrawers}
            />
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {filteredCabinets.length} Cabinet{filteredCabinets.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {filteredCabinets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <p className="text-slate-600 text-lg">No cabinets match your filters</p>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCabinets.map((cabinet, index) => (
                  <CabinetCard
                    key={`${cabinet.name}-${index}`}
                    cabinet={cabinet}
                    onClick={() => setSelectedCabinet(cabinet)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <CabinetDetails
        cabinet={selectedCabinet}
        open={!!selectedCabinet}
        onClose={() => setSelectedCabinet(null)}
      />
    </div>
  );
}