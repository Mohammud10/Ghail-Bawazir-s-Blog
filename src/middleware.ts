import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths except static files, API routes, Next.js internals, and admin
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
    '/',
  ],
};
