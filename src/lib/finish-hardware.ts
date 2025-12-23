const texturePath = (fileName: string) =>
  new URL(`../../assets/Textures/${fileName}`, import.meta.url).toString();

export type FinishId = 'matte-white' | 'textured-walnut' | 'brushed-nickel';
export type HardwareId = 'H-001' | 'H-002';

export interface FinishOption {
  id: FinishId;
  name: string;
  type: 'painted' | 'wood' | 'metal';
  code: string;
  baseColor: string;
  roughness: number;
  metalness: number;
  textureUrl?: string;
}

export const FINISH_OPTIONS: Record<FinishId, FinishOption> = {
  'matte-white': {
    id: 'matte-white',
    name: 'Matte White',
    type: 'painted',
    code: 'MW-101',
    baseColor: '#f4f4f2',
    roughness: 0.9,
    metalness: 0.05,
    textureUrl: texturePath('AGGLO.JPG'),
  },
  'textured-walnut': {
    id: 'textured-walnut',
    name: 'Textured Walnut',
    type: 'wood',
    code: 'TW-205',
    baseColor: '#5f4632',
    roughness: 0.7,
    metalness: 0.0,
    textureUrl: texturePath('Pippyoak.jpg'),
  },
  'brushed-nickel': {
    id: 'brushed-nickel',
    name: 'Brushed Nickel',
    type: 'metal',
    code: 'BN-307',
    baseColor: '#b3b7c4',
    roughness: 0.2,
    metalness: 0.9,
    textureUrl: texturePath('Stone4.jpg'),
  },
};

export const DEFAULT_FINISH_ID: FinishId = 'textured-walnut';

export interface HardwareHandleOption {
  id: HardwareId;
  name: string;
  styles: string[];
  sizes: number[];
  color: string;
  roughness: number;
  metalness: number;
}

export const HARDWARE_HANDLE_OPTIONS: Record<HardwareId, HardwareHandleOption> = {
  'H-001': {
    id: 'H-001',
    name: 'Bar Pull',
    styles: ['modern', 'industrial'],
    sizes: [96, 128, 160],
    color: '#d6d8df',
    roughness: 0.25,
    metalness: 0.85,
  },
  'H-002': {
    id: 'H-002',
    name: 'Cup Pull',
    styles: ['traditional', 'vintage'],
    sizes: [96, 128],
    color: '#a7865c',
    roughness: 0.3,
    metalness: 0.75,
  },
};

export const DEFAULT_HARDWARE_ID: HardwareId = 'H-001';

export const FINISH_SELECT_OPTIONS = Object.values(FINISH_OPTIONS).map((finish) => ({
  value: finish.id,
  label: finish.name,
}));

export const HARDWARE_SELECT_OPTIONS = Object.values(HARDWARE_HANDLE_OPTIONS).map((hardware) => ({
  value: hardware.id,
  label: `${hardware.name} (${hardware.styles[0] ?? 'standard'})`,
}));
