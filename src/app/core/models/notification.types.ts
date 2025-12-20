/**
 * Type de notification toast
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Interface pour un toast de notification
 */
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

// CTA for toast actions shown in UI
export interface ToastCta { label: string; action: () => void }

// Internal shape used by the toast component for progress tracking
export type InternalToast = Toast & {
  title?: string;
  cta?: ToastCta;
  progress?: number;
  startedAt?: number;
  remaining?: number;
  paused?: boolean;
};
