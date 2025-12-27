export interface Cabinet {
  name: string;
  height: number;
  doors: number;
  drawers?: number;
  style: string;
  type: 'base' | 'tall' | 'wall';
}

export interface CabinetData {
  base_units: Cabinet[];
  tall_units: Cabinet[];
  wall_units: Cabinet[];
}

export const getAllCabinets = (data: CabinetData): Cabinet[] => {
  return [
    ...data.base_units,
    ...data.tall_units,
    ...data.wall_units
  ];
};

export const getUniqueValues = (cabinets: Cabinet[], key: keyof Cabinet): (string | number)[] => {
  const values = cabinets.map(c => c[key]).filter(v => v !== undefined);
  return Array.from(new Set(values)).sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  });
};

export const filterCabinets = (
  cabinets: Cabinet[],
  filters: {
    type?: string;
    style?: string;
    minHeight?: number;
    maxHeight?: number;
    doors?: number;
    drawers?: number;
    search?: string;
  }
): Cabinet[] => {
  return cabinets.filter(cabinet => {
    if (filters.type && cabinet.type !== filters.type) return false;
    if (filters.style && cabinet.style !== filters.style) return false;
    if (filters.minHeight && cabinet.height < filters.minHeight) return false;
    if (filters.maxHeight && cabinet.height > filters.maxHeight) return false;
    if (filters.doors !== undefined && cabinet.doors !== filters.doors) return false;
    if (filters.drawers !== undefined && cabinet.drawers !== filters.drawers) return false;
    if (filters.search && !cabinet.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
};