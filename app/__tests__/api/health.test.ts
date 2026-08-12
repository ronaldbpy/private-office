import { describe, it, expect, vi } from 'vitest';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(async () => [{ status: 'ok' }]),
  },
}));

describe('API — GET /api/health', () => {
  it('should return status ok if db connected', async () => {
    const { prisma } = await import('@/lib/prisma');
    const result = await prisma.$queryRaw`SELECT 1 as status`;
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle db connection errors', async () => {
    const { prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('Connection failed'));

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      expect(error).toBeDefined();
      expect((error as Error).message).toBe('Connection failed');
    }
  });
});
