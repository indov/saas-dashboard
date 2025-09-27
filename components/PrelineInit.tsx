

'use client';
import { useEffect } from 'react';

/**
 * Initializes Preline UI once on the client.
 * We dynamically import to avoid SSR issues.
 */
export default function PrelineInit() {
  useEffect(() => {
    import('preline/preline');
  }, []);
  return null;
}