// Basic floorplan types
export const Point = { x: 0, y: 0 }
export const Wall = { start: Point, end: Point, thickness: 0.1 }
export const Room = { type: 'living', area: 20, position: Point, dimensions: { width: 5, height: 4 } }
export const Door = { position: Point, width: 0.8, rotation: 0 }
export const Window = { position: Point, width: 1.2, height: 1.0 }
export const Cabinet = { type: 'base', position: Point, dimensions: { width: 0.6, height: 0.9, depth: 0.6 } }

export const FloorPlan = {
  rooms: [Room],
  walls: [Wall],
  doors: [Door],
  windows: [Window],
  cabinets: [Cabinet]
}
