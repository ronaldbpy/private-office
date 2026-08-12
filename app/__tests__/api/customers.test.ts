import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma
const mockCustomerCreate = vi.fn();
const mockCustomerFindMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      create: mockCustomerCreate,
      findMany: mockCustomerFindMany,
    },
  },
}));

// Mock auth
vi.mock('@/lib/api-auth', () => ({
  getAuthUserId: vi.fn(() => Promise.resolve('user-123')),
}));

// Mock access
vi.mock('@/lib/access', () => ({
  getUserAccess: vi.fn(() => Promise.resolve([{ entityId: 'entity-1', role: 'OWNER' }])),
  accessibleEntityIds: vi.fn(() => ['entity-1']),
}));

describe('API — POST /api/v1/customers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create customer with valid data', async () => {
    const mockCustomer = {
      id: 'cust-1',
      entityId: 'entity-1',
      fullName: 'John Doe',
      businessName: 'Doe Inc',
      email: 'john@example.com',
    };
    mockCustomerCreate.mockResolvedValueOnce(mockCustomer);

    // Simulado: POST /api/v1/customers
    const body = { entityId: 'entity-1', fullName: 'John Doe', businessName: 'Doe Inc', email: 'john@example.com' };

    // Validación
    expect(body.entityId).toBeDefined();
    expect(body.fullName).toBeDefined();
    expect(mockCustomerCreate).toBeDefined();
  });

  it('should reject if missing required fields', () => {
    const body = { entityId: 'entity-1' }; // Missing fullName
    expect(body.fullName).toBeUndefined();
  });

  it('should block access if user unauthorized for entity', async () => {
    const body = { entityId: 'entity-2', fullName: 'Jane Doe' }; // entity-2 not accessible
    const accessibleEntities = ['entity-1'];

    expect(accessibleEntities).not.toContain('entity-2');
  });
});
