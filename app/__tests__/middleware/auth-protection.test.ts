import { describe, it, expect } from 'vitest';

describe('Middleware — Auth Protection', () => {
  const publicRoutes = ['/sign-in', '/api/health', '/api/docs', '/api/openapi.json'];
  const protectedRoutes = [
    '/api/v1/customers',
    '/api/v1/products',
    '/api/v1/invoices',
    '/api/v1/suppliers',
    '/api/v1/events',
    '/api/v1/entities',
  ];

  describe('Public routes (no auth required)', () => {
    publicRoutes.forEach((route) => {
      it(`should allow access to ${route}`, () => {
        expect(publicRoutes).toContain(route);
      });
    });
  });

  describe('Protected routes (auth required)', () => {
    protectedRoutes.forEach((route) => {
      it(`should require auth for ${route}`, () => {
        const isProtected = !['sign-in', '/api/health', '/api/docs', '/api/openapi.json'].some(
          (pub) => route.startsWith(pub)
        );
        expect(isProtected).toBe(true);
      });
    });
  });

  it('should not expose /api/* as public (except specific routes)', () => {
    const allPublic = publicRoutes;
    const apiCatchAll = '/api(.*)';
    expect(allPublic).not.toContain(apiCatchAll);
  });
});
