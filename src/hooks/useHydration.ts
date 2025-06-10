import { useState, useEffect } from 'react';

/**
 * Custom hook to handle hydration state
 * Prevents hydration mismatches by ensuring components wait for client-side hydration
 * before accessing browser APIs like localStorage, window, etc.
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
