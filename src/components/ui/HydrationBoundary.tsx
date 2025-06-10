"use client";

import { ReactNode } from "react";
import { useHydration } from "@/hooks/useHydration";

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * Component that prevents rendering children until hydration is complete
 * Useful for components that use browser APIs or localStorage
 */
export const HydrationBoundary: React.FC<HydrationBoundaryProps> = ({
  children,
  fallback = null,
  className = "",
}) => {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return <>{children}</>;
};

export default HydrationBoundary;
