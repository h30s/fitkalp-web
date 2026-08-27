/**
 * Central config for external service URLs.
 *
 * In development:   set NEXT_PUBLIC_CRM_URL=http://localhost:3001 in .env.local
 * In production:    set NEXT_PUBLIC_CRM_URL=https://app.fitkalp.com (or your domain)
 */
export const CRM_URL =
  process.env.NEXT_PUBLIC_CRM_URL ?? 'http://localhost:3001';
