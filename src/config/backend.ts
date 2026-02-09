/**
 * Shared backend configuration.
 * Set NEXT_PUBLIC_BACKEND_URL in .env.local for production.
 */
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
