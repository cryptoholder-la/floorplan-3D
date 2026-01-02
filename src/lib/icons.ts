// Centralized icon configuration for the 10_10 design system
// This provides consistent icon usage and easy management across all components

import {
  // Navigation & Core
  Home,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Grid,
  Settings,
  Zap,
  Activity,
  
  // Design & 3D
  Move,
  Box,
  Layers,
  Eye,
  EyeOff,
  Palette,
  Sun,
  Camera,
  Maximize2,
  Minimize2,
  RotateCw,
  AlignCenter,
  AlignLeft,
  AlignRight,
  
  // Tools & Building
  Wrench,
  Hammer,
  Ruler,
  Scan,
  Upload,
  Download,
  Save,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Copy,
  MoreHorizontal,
  MousePointer,
  
  // Data & Files
  Database,
  FileText,
  Code,
  Package,
  Folder,
  FolderOpen,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  
  // Manufacturing & CNC
  Gauge,
  Scissors,
  Printer,
  Cpu,
  Truck,
  
  // UI & Interface
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Star,
  Heart,
  Bell,
  User,
  Users,
  Shield,
  Lock,
  Unlock,
  
  // Communication
  Share2,
  Send,
  MessageSquare,
  Phone,
  Mail,
  
  // Status & Indicators
  Loader2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  
  // Misc
  HelpCircle,
  Info,
  XCircle,
  CheckSquare,
  Square,
  
  // Kitchen & Cabinet
  Coffee,
  Lightbulb,
  
  // Measurement & Layout
  Compass,
  Triangle
} from 'lucide-react'

// Icon categories for better organization
export const IconCategories = {
  NAVIGATION: 'navigation',
  DESIGN: 'design',
  TOOLS: 'tools',
  DATA: 'data',
  MANUFACTURING: 'manufacturing',
  UI: 'ui',
  CABINETRY: 'cabinetry',
  STATUS: 'status',
  ACTIONS: 'actions'
} as const

// Centralized icon mapping with semantic names
export const Icons = {
  // Navigation Icons
  HOME: Home,
  BACK: ArrowLeft,
  FORWARD: ArrowRight,
  MENU: Menu,
  CLOSE: X,
  GRID: Grid,
  SETTINGS: Settings,
  POWER: Zap,
  ACTIVITY: Activity,
  
  // Design & 3D Icons
  MOVE: Move,
  BOX: Box,
  LAYERS: Layers,
  EYE: Eye,
  EYE_OFF: EyeOff,
  PALETTE: Palette,
  SUN: Sun,
  CAMERA: Camera,
  MAXIMIZE: Maximize2,
  MINIMIZE: Minimize2,
  ROTATE: RotateCw,
  ALIGN_CENTER: AlignCenter,
  ALIGN_LEFT: AlignLeft,
  ALIGN_RIGHT: AlignRight,
  
  // Tool Icons
  WRENCH: Wrench,
  HAMMER: Hammer,
  RULER: Ruler,
  SCAN: Scan,
  UPLOAD: Upload,
  DOWNLOAD: Download,
  SAVE: Save,
  PLAY: Play,
  PAUSE: Pause,
  REFRESH: RefreshCw,
  ADD: Plus,
  DELETE: Trash2,
  EDIT: Edit,
  COPY: Copy,
  MORE: MoreHorizontal,
  POINTER: MousePointer,
  
  // Data & File Icons
  DATABASE: Database,
  FILE: FileText,
  CODE: Code,
  PACKAGE: Package,
  FOLDER: Folder,
  FOLDER_OPEN: FolderOpen,
  SEARCH: Search,
  FILTER: Filter,
  SORT_ASC: SortAsc,
  SORT_DESC: SortDesc,
  
  // Manufacturing Icons
  GAUGE: Gauge,
  SCISSORS: Scissors,
  PRINTER: Printer,
  CPU: Cpu,
  TRUCK: Truck,
  
  // UI Icons
  CHECK: CheckCircle,
  ALERT: AlertCircle,
  CLOCK: Clock,
  DOLLAR: DollarSign,
  STAR: Star,
  HEART: Heart,
  BELL: Bell,
  USER: User,
  USERS: Users,
  SHIELD: Shield,
  LOCK: Lock,
  UNLOCK: Unlock,
  
  // Communication Icons
  SHARE: Share2,
  SEND: Send,
  MESSAGE: MessageSquare,
  PHONE: Phone,
  MAIL: Mail,
  
  // Status Icons
  LOADING: Loader2,
  CHEVRON_DOWN: ChevronDown,
  CHEVRON_UP: ChevronUp,
  CHEVRON_LEFT: ChevronLeft,
  CHEVRON_RIGHT: ChevronRight,
  HELP: HelpCircle,
  INFO: Info,
  ERROR: XCircle,
  CHECKBOX: CheckSquare,
  SQUARE: Square,
  
  // Kitchen & Cabinet Icons
  COFFEE: Coffee,
  LIGHT: Lightbulb,
  
  // Measurement Icons
  COMPASS: Compass,
  TRIANGLE: Triangle,
  
  // Action Icons
  VIEW: Eye,
  HIDE: EyeOff,
  SHOW: Eye,
  PREVIEW: Eye,
  EXPORT: Download,
  IMPORT: Upload
} as const

// Icon size variants for consistent sizing
export const IconSizes = {
  XS: 'w-3 h-3',
  SM: 'w-4 h-4',
  MD: 'w-5 h-5',
  LG: 'w-6 h-6',
  XL: 'w-8 h-8',
  XXL: 'w-10 h-10',
  XXXL: 'w-12 h-12'
} as const

// Icon color variants for consistent theming
export const IconColors = {
  DEFAULT: 'text-current',
  PRIMARY: 'text-blue-500',
  SECONDARY: 'text-gray-500',
  SUCCESS: 'text-green-500',
  WARNING: 'text-yellow-500',
  ERROR: 'text-red-500',
  INFO: 'text-blue-400',
  MUTED: 'text-gray-400',
  WHITE: 'text-white',
  BLACK: 'text-black'
} as const

// Icon component wrapper for consistent styling
interface IconWrapperProps {
  icon: React.ComponentType<any>
  size?: keyof typeof IconSizes
  color?: keyof typeof IconColors
  className?: string
  onClick?: () => void
}

export const IconWrapper = ({ 
  icon: IconComponent, 
  size = 'SM', 
  color = 'DEFAULT', 
  className = '',
  onClick
}: IconWrapperProps) => {
  const Component = IconComponent
  return (
    <Component 
      className={`${IconSizes[size]} ${IconColors[color]} ${className}`}
      onClick={onClick}
    />
  )
}

// Cabinet type specific icons
export const CabinetTypeIcons = {
  base: Icons.BOX,
  wall: Icons.LAYERS,
  tall: Icons.PACKAGE,
  sink: Icons.BOX,
  cooktop: Icons.CPU,
  oven: Icons.CPU,
  microwave: Icons.CPU,
  range: Icons.CPU,
  custom: Icons.BOX
} as const

// Status specific icons
export const StatusIcons = {
  available: Icons.CHECK,
  out_of_stock: Icons.ALERT,
  discontinued: Icons.ERROR,
  pending: Icons.CLOCK,
  processing: Icons.LOADING,
  completed: Icons.CHECK,
  failed: Icons.ERROR,
  warning: Icons.ALERT
} as const

// Tool category specific icons
export const ToolCategoryIcons = {
  core: Icons.HOME,
  design: Icons.PALETTE,
  inventory: Icons.DATABASE,
  reporting: Icons.FILE,
  admin: Icons.SETTINGS,
  experimental: Icons.POWER
} as const

// Export a function to get icon by name (for dynamic usage)
export const getIcon = (iconName: keyof typeof Icons) => {
  return Icons[iconName] || Icons.BOX
}

// Export a function to get cabinet type icon
export const getCabinetTypeIcon = (type: string) => {
  return CabinetTypeIcons[type as keyof typeof CabinetTypeIcons] || Icons.BOX
}

// Export a function to get status icon
export const getStatusIcon = (status: string) => {
  return StatusIcons[status as keyof typeof StatusIcons] || Icons.CLOCK
}

// Export a function to get tool category icon
export const getToolCategoryIcon = (category: string) => {
  return ToolCategoryIcons[category as keyof typeof ToolCategoryIcons] || Icons.SETTINGS
}

// Icon mapping for navigation items
export const NavigationIcons = {
  'dashboard-10-10': Icons.GRID,
  'kitchen-designer': Icons.BOX,
  'design-studio': Icons.PALETTE,
  '3d-builder': Icons.MOVE,
  'floorplan-scanner': Icons.SCAN,
  'project-cabinet-list': Icons.DATABASE,
  'cnc-cutlist': Icons.GAUGE,
  'template-builder': Icons.SETTINGS,
  'compliance-hub': Icons.SHIELD,
  'materials-summary': Icons.FILE
} as const

// Default export
export default Icons
