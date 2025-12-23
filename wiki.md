This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





Comprehensive cabinet design system integrating parametric generation [1a], 3D visualization [2b], and CNC manufacturing [3b] with real-time simulation [4a]. Key flows include cabinet component creation [1d], floorplan-to-3D conversion [2c], and G-code generation [3f].






Cabinet Generation Pipeline
User Interface Entry Point
1e
React Cabinet Generation
BaseCabinetWireframe.tsx:36
const cabinet = useMemo(() => { const config: any = { shelfCount, }; if (drawerConfig !== 'none') { config.hasDrawer = true; } return generateBaseCabinet(selectedWidth, config); }, [selectedWidth, shelfCount, drawerConfig])
generateBaseCabinet() call
Base Cabinet Generator
1a
Generate Base Cabinet
cabinet-generator.ts:32
export function generateBaseCabinet(width: CabinetWidth, config: Partial<CabinetConfiguration> = {}): BaseCabinet
generateComponents() call
Component Creation
Side panels creation
Top/bottom panels
Door generation
Toe kick assembly
Unified Cabinet System
1c
Unified Cabinet Generation
unified-cabinet-generator.ts:55
export function generateCabinet(type: CabinetType, width: number, height: number): UnifiedCabinet
getCabinetDimensions()
getConfiguration()
generateComponents() call
Advanced Component Creation
1d
Create Side Panels
unified-cabinet-generator.ts:184
components.leftSide = createSidePanel(dims, mat, boxDepth, boxHeight)
Shelf pin holes
Grooves for assembly
createDoors() function
createToeKick() function


3D Visualization Pipeline
2a
3D Viewer Initialization
FloorPlan3DViewer.tsx:259
export default function FloorPlan3DViewer({ floorPlan, width = 800, height = 600, }: FloorPlan3DViewerProps) { const floorPlan3DData = convertFloorPlanTo3D(floorPlan)
2b
Floorplan to 3D Conversion
floorplan-3d-converter.ts:23
export function convertFloorPlanTo3D(floorPlan: FloorPlan): FloorPlan3DData
Process walls array
2c
Generate Wall Meshes
floorplan-3d-converter.ts:46
floorPlan.walls.forEach(wall => { const geometry = new THREE.BoxGeometry(pxToM(length), wallHeight, pxToM(wall.thickness))
Process rooms array
Create floor/ceiling
Process cabinets array
2d
Generate Cabinet Meshes
floorplan-3d-converter.ts:270
floorPlan.cabinets.forEach(cabinet => { const geometry = new THREE.BoxGeometry(pxToM(cabinet.width), cabinetHeightM, pxToM(cabinet.depth))
2e
Render 3D Scene
FloorPlan3DViewer.tsx:308
<Scene3D floorPlan3DData={floorPlan3DData} floorPlan={floorPlan} showMeasurements={showMeasurements} />
Three.js Canvas setup
OrbitControls integration
Measurement rendering
3D dimension labels








CNC Simulation System
4a
Initialize CNC Simulation
CNCSimulator.tsx:17
const CNCSimulator = ({ part, width = 600, height = 400 }: Props) => { const toolpath = generateToolpath(part)
generateToolpath(part) creates
Toolpath command array
Animation loop controller
4b
Animate Toolpath Execution
CNCSimulator.tsx:45
const animate = () => { setSimState((prev) => { const nextCommand = prev.currentCommand + speed; const cmd = toolpath.commands[Math.floor(nextCommand)]; const newPos = { x: cmd.x ?? prev.currentPosition.x, y: cmd.y ?? prev.currentPosition.y, z: cmd.z ?? prev.currentPosition.z, }; return { ...prev, currentCommand: Math.floor(nextCommand), currentPosition: newPos, spindleOn: cmd.type === 'spindle_on' ? true : cmd.type === 'spindle_off' ? false : prev.spindleOn, progress: (nextCommand / toolpath.commands.length) * 100, toolpathHistory: newHistory, }; }); }
Process next command
Update tool position
Update simulation state
Track toolpath history
Canvas rendering system
drawSimulation() renders
Draw part material
Draw hole patterns
4d
Draw Toolpath Trail
CNCSimulator.tsx:135
for (let i = 0; i < simState.toolpathHistory.length - 1; i++) { const p1 = simState.toolpathHistory[i]; const p2 = simState.toolpathHistory[i + 1]; ctx.lineTo(x2, y2); }
4c
Render CNC Tool
CNCSimulator.tsx:155
ctx.fillStyle = simState.spindleOn ? '#ef4444' : '#10b981'; ctx.beginPath(); ctx.arc(toolX, toolY, 8, 0, Math.PI * 2); ctx.fill()
Red spindle = ON
Green spindle = OFF






CNC Manufacturing Pipeline
3a
Generate Manufacturing Parts
CNCManufacturingPanel.tsx:106
const handleGenerateParts = () => { setTimeout(() => { const allParts: CabinetPart[] = []; for (const cabinet of floorPlan.cabinets) { const parts = generateCabinetParts(cabinet, selectedMaterial); allParts.push(...parts); } setGeneratedParts(allParts); }, 500); }
For each cabinet in floorplan
3b
Create CNC Parts
cnc-toolpath-generator.ts:16
export function generateCabinetParts(cabinet: Cabinet, material: Material): CabinetPart[]
3c
Generate Side Panel Parts
cnc-toolpath-generator.ts:25
parts.push({ id: `${cabinet.id}-left`, cabinetId: cabinet.id, name: `${type} Cabinet - Left Side`, type: 'side', width: depth, height: height, thickness, quantity: 1, material, edges: { top: true, bottom: true, left: false, right: true }, holes: generateShelfPinHoles(depth - 50, height, 32), })
Create top/bottom parts
Create door parts
Create shelf parts
For each generated part
3d
Generate Toolpath
cnc-toolpath-generator.ts:177
export function generateToolpath(part: CabinetPart, machine: CNCMachine = DEFAULT_MACHINE): Toolpath
3e
Generate Outline Operations
cnc-toolpath-generator.ts:184
commands.push(...generateOutlineToolpath(part, machine, safeHeight))
Generate holes toolpath
Generate pockets toolpath
3f
Convert to G-Code
cnc-toolpath-generator.ts:197
const gcode = generateGCode(commands, machine)
Export to .nc file for CNC



