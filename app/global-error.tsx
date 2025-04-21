'use client';

import { ErrorFallBackComponent } from '@/components/common/ErrorFallBackComponent';
import { clientConfig } from '@/rollbar';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { FallbackProps } from 'react-error-boundary';
import Rollbar from 'rollbar';

export default function GlobalError({ error }: FallbackProps) {
  useEffect(() => {
    const rollbar = new Rollbar(clientConfig);
    rollbar.error(error);

    Sentry.captureException(error);
  }, [error]);

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <html>
      <body className='flex h-screen w-screen items-center justify-center'>
        <ErrorFallBackComponent
          error={error}
          resetErrorBoundary={handleReset}
        />
      </body>
    </html>
  );
}
