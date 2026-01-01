// Centralized Routing Master File for Floorplan 3D
// This file contains all application routes and component mappings

export interface RouteConfig {
  path: string;
  component: string;
  title: string;
  description?: string;
  icon?: string;
  children?: RouteConfig[];
  permissions?: string[];
  middleware?: string[];
}

export const APP_ROUTES: RouteConfig[] = [
  {
    path: '/',
    component: 'HomePage',
    title: 'Home',
    description: 'Main dashboard and overview',
    icon: 'Home'
  },
  {
    path: '/analysis-tools',
    component: 'AnalysisToolsPage',
    title: 'Analysis Tools',
    description: 'Cost analysis and specification tools',
    icon: 'Calculator',
    children: [
      {
        path: '/analysis-tools/estimator',
        component: 'CostEstimator',
        title: 'Cost Estimator',
        icon: 'DollarSign'
      },
      {
        path: '/analysis-tools/report',
        component: 'CostReport',
        title: 'Cost Report',
        icon: 'FileText'
      },
      {
        path: '/analysis-tools/specbook',
        component: 'SpecBookUI',
        title: 'Specification Book',
        icon: 'Book'
      },
      {
        path: '/analysis-tools/cnc',
        component: 'CNCManufacturingPanel',
        title: 'CNC Tools',
        icon: 'Cpu'
      },
      {
        path: '/analysis-tools/diagnostics',
        component: 'ErrorReporter',
        title: 'Diagnostics',
        icon: 'AlertTriangle'
      },
      {
        path: '/analysis-tools/templates',
        component: 'TemplateSelector',
        title: 'Templates',
        icon: 'Filter'
      }
    ]
  }
];

// Component registry for dynamic imports - ONLY EXISTING COMPONENTS
export const COMPONENT_REGISTRY = {
  // Main pages
  HomePage: () => import('@/app/page'),
  AnalysisToolsPage: () => import('@/app/analysis-tools/page'),
  
  // Analysis tools components
  CostEstimator: () => import('@/components/CostEstimator'),
  CostReport: () => import('@/components/CostReport'),
  SpecBookUI: () => import('@/components/SpecBookUI'),
  CNCManufacturingPanel: () => import('@/components/CNCManufacturingPanel'),
  ErrorReporter: () => import('@/components/ErrorReporter'),
  FilterPanel: () => import('@/components/FilterPanel'),
  TemplateSelector: () => import('@/components/TemplateSelector'),
  QuickAddCabinet: () => import('@/components/QuickAddCabinet'),
  
  // Floorplan components
  FloorPlan2DEditor: () => import('@/components/FloorPlan2DEditor'),
  
  // UI components
  MainLayout: () => import('@/components/MainLayout'),
  Tabs: () => import('@/components/ui/tabs'),
  Card: () => import('@/components/ui/card'),
};

// Route helper functions
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  const findRoute = (routes: RouteConfig[], targetPath: string): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.path === targetPath) return route;
      if (route.children) {
        const childRoute = findRoute(route.children, targetPath);
        if (childRoute) return childRoute;
      }
    }
    return undefined;
  };
  
  return findRoute(APP_ROUTES, path);
};

export const getComponent = (componentName: string) => {
  const component = COMPONENT_REGISTRY[componentName as keyof typeof COMPONENT_REGISTRY];
  if (!component) {
    console.warn(`Component ${componentName} not found in registry`);
    return null;
  }
  return component;
};

export const getAllRoutes = (): RouteConfig[] => {
  const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
    return routes.reduce((acc: RouteConfig[], route) => {
      acc.push(route);
      if (route.children) {
        acc.push(...flattenRoutes(route.children));
      }
      return acc;
    }, []);
  };
  
  return flattenRoutes(APP_ROUTES);
};

// Navigation menu generator
export const generateNavigationMenu = (maxDepth: number = 2): RouteConfig[] => {
  const limitDepth = (routes: RouteConfig[], currentDepth: number = 0): RouteConfig[] => {
    if (currentDepth >= maxDepth) {
      return routes.map(route => ({ ...route, children: undefined }));
    }
    
    return routes.map(route => ({
      ...route,
      children: route.children ? limitDepth(route.children, currentDepth + 1) : undefined
    }));
  };
  
  return limitDepth(APP_ROUTES);
};

// Breadcrumb generator
export const generateBreadcrumbs = (currentPath: string): RouteConfig[] => {
  const breadcrumbs: RouteConfig[] = [];
  const pathSegments = currentPath.split('/').filter(Boolean);
  
  let currentPathSegment = '';
  for (const segment of pathSegments) {
    currentPathSegment += `/${segment}`;
    const route = getRouteByPath(currentPathSegment);
    if (route) {
      breadcrumbs.push(route);
    }
  }
  
  return breadcrumbs;
};

export default APP_ROUTES;
