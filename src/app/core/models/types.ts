/**
 * Types globaux pour l'application Job Tracker
 */

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Types pour la pagination
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Types pour les formulaires
export type FormMode = 'create' | 'edit' | 'view';

export interface FormState {
  mode: FormMode;
  loading: boolean;
  error: string | null;
}

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  message: string;
  type: NotificationType;
  duration?: number;
  action?: string;
}

// Types pour les filtres
export interface FilterOption<T = string> {
  label: string;
  value: T;
  count?: number;
}

export interface FilterState {
  searchTerm: string;
  filters: Record<string, unknown>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Types pour les états de chargement
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Types utilitaires
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = number | string;
