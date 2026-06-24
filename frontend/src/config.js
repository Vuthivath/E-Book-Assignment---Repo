/**
 * Application configuration.
 *
 * In development, set VITE_API_URL in .env to point to your Django backend:
 *   VITE_API_URL=http://127.0.0.1:8000
 *
 * In production (Vercel), the API is served from the same origin via rewrites.
 * If VITE_API_URL is not set, relative URLs are used (/api/...).
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Remove trailing slash
const base = API_BASE_URL.replace(/\/+$/, '');

export const API_BASE = base || '';
export const API_BASE_API = base ? `${base}/api` : '/api';

/**
 * Resolve a book image URL.
 * Returns a relative path in production or a full URL with the API base in dev.
 */
export function resolveImage(image) {
    if (!image) return 'https://via.placeholder.com/400x320?text=No+Image';
    const str = String(image).trim();
    if (str.startsWith('http')) return str;
    if (str.startsWith('/')) {
        // If it's already an absolute path, prefix with API_BASE only if set
        return base ? `${base}${str}` : str;
    }
    return base ? `${base}/${str}` : `/${str}`;
}
