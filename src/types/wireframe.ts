export interface WireframeAsset {
  id: string;
  name: string;
  path: string;
  category: string;
  type: 'kitchen' | 'furniture' | 'floorplan' | 'utility' | 'cabinet';
  description?: string;
  geometry?: string;
  material?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  parts?: CabinetPart[];
  accessories?: CabinetAccessory[];
  renderSettings?: {
    opacity: number;
    color: string;
    showWireframe: boolean;
    showSolid: boolean;
  };
}

export interface CabinetPart {
  id: string;
  name: string;
  type: 'panel' | 'door' | 'drawer' | 'shelf' | 'frame' | 'back';
  dimensions: {
    width: number;
    height: number;
    thickness: number;
  };
  material: string;
  quantity: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  color?: string;
}

export interface CabinetAccessory {
  id: string;
  name: string;
  type: 'handle' | 'hinge' | 'knob' | 'pull' | 'slide' | 'bracket';
  position: {
    x: number;
    y: number;
    z: number;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  material: string;
  color?: string;
  quantity: number;
}
