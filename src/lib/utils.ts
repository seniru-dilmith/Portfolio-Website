import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseExpiryToSeconds(expiry: string): number {
  const value = parseInt(expiry.slice(0, -1), 10);
  const unit = expiry.slice(-1);

  if (isNaN(value)) return 60 * 60 * 24 * 7; // Default: 7 days

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: return value; // Default to seconds if unit unknown
  }
}
