'use client';

import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JSX } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastProps = {
  title?: string;
  message: string;
  duration?: number;
};

const TOAST_DURATION = 4000;

const ICON_MAP: Record<ToastType, JSX.Element> = {
  success: <CheckCircle className='h-5 w-5 text-green-500' />,
  error: <AlertCircle className='h-5 w-5 text-red-500' />,
  warning: <AlertTriangle className='h-5 w-5 text-amber-500' />,
  info: <AlertCircle className='h-5 w-5 text-blue-500' />,
};

const STYLE_MAP: Record<ToastType, string> = {
  success: 'border-green-100 dark:border-green-900 bg-green-50 dark:bg-zinc-900 text-green-900 dark:text-green-400',
  error: 'border-red-100 dark:border-red-900 bg-red-100 dark:bg-zinc-900 text-red-900 dark:text-red-400',
  warning: 'border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-zinc-900 text-amber-900 dark:text-amber-400',
  info: 'border-blue-100 dark:border-blue-900 bg-white dark:bg-zinc-900 text-blue-900 dark:text-blue-400',
};

const renderToast = (type: ToastType, { title, message, duration = TOAST_DURATION }: ToastProps) => {
  sonnerToast.custom(
    (id) => (
      <div className={cn('relative flex w-full gap-3 rounded-lg border p-2 px-4 shadow-2xl items-center justify-between ', STYLE_MAP[type])}>
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className='absolute top-2 right-2'
        >
          <X className='h-4 w-4 text-zinc-600 hover:text-zinc-500' />
        </button>

        <section className='flec flec-col'>
          <div className='flex items-center'>
            <div className='mr-2'>{ICON_MAP[type]}</div>
            {title && <h3 className='font-medium'>{title}</h3>}
          </div>

          <div className='flex-1 mt-1 text-sm text-zinc-600 dark:text-zinc-400'>{message}</div>
        </section>
      </div>
    ),
    { duration },
  );
};

export const toast = {
  success: (props: ToastProps) => renderToast('success', { title: props.title ?? 'Success', ...props }),
  error: (props: ToastProps) => renderToast('error', { title: props.title ?? 'Error', ...props }),
  warning: (props: ToastProps) => renderToast('warning', { title: props.title ?? 'Warning', ...props }),
  info: (props: ToastProps) => renderToast('info', { title: props.title ?? 'Info', ...props }),

  default: {
    custom: sonnerToast.custom,
    dismiss: sonnerToast.dismiss,
    error: sonnerToast.error,
    success: sonnerToast.success,
    warning: sonnerToast.warning,
    info: sonnerToast.info,
  },
};

export function Toaster() {
  return (
    <SonnerToaster
      position='top-right'
      toastOptions={{
        className: '!bg-transparent !border-0 !shadow-none !p-0 !min-w-[200px] !w-fit !max-w-[100vw]',
        duration: TOAST_DURATION,
      }}
    />
  );
}
