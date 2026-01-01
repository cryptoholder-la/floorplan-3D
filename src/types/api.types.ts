
// ============================================================================
// API TYPES - All API and data exchange types
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  metadata?: ResponseMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface APIEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  authentication?: AuthRequirement;
  rateLimit?: RateLimit;
}

export interface AuthConfiguration {
  type: 'none' | 'basic' | 'bearer' | 'oauth' | 'api_key';
  credentials?: AuthCredentials;
  refresh?: TokenRefresh;
}

export interface DataValidation {
  rules: ValidationRule[];
  schema?: JSONSchema;
  customValidators?: CustomValidator[];
  errorHandling: ErrorHandlingStrategy;
}