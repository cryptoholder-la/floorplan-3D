
// ============================================================================
// UI TYPES - All user interface component types
// ============================================================================

export interface UIComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  state: ComponentState;
  events: ComponentEvent[];
  styling: ComponentStyling;
}

export type ComponentType = 'button' | 'input' | 'select' | 'modal' | 'card' | 'table' | 'form' | 'navigation';

export interface ComponentProps {
  [key: string]: any;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: any) => void;
  onChange?: (value: any) => void;
}

export interface ComponentState {
  loading?: boolean;
  error?: string;
  value?: any;
  disabled?: boolean;
  visible?: boolean;
}

export interface ComponentEvent {
  type: 'click' | 'change' | 'focus' | 'blur' | 'submit' | 'cancel';
  handler: (event: any) => void;
  payload?: any;
}

export interface ComponentStyling {
  theme: Theme;
  variant: ComponentVariant;
  size: ComponentSize;
  customClasses?: string[];
  responsive?: ResponsiveBreakpoints;
}

export type Theme = 'light' | 'dark' | 'auto';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';