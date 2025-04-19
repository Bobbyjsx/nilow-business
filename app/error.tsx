'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { FallbackProps } from 'react-error-boundary';

import { ErrorFallBackComponent } from '@/components/common/ErrorFallBackComponent';
import { useRollbar } from '@rollbar/react';

export default function Error({ error, resetErrorBoundary }: FallbackProps) {
  const rollbar = useRollbar();
  useEffect(() => {
    rollbar.error(error);
  }, [error, rollbar]);

  return (
    <ErrorFallBackComponent
      error={error}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}
