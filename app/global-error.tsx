/// ./src/app/global-error.js
'use client';

import { ErrorFallBackComponent } from '@/components/common/ErrorFallBackComponent';
import { clientConfig } from '@/rollbar';
import { useEffect } from 'react';
import { FallbackProps } from 'react-error-boundary';
import Rollbar from 'rollbar';

export default function GlobalError({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    const rollbar = new Rollbar(clientConfig);

    rollbar.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorFallBackComponent
          error={error}
          resetErrorBoundary={resetErrorBoundary}
        />
      </body>
    </html>
  );
}
