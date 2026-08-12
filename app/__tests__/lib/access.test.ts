import { describe, it, expect } from 'vitest';
import { accessibleEntityIds } from '@/lib/access';

describe('Access Control — accessibleEntityIds', () => {
  it('should return entity IDs user has access to', () => {
    const access = [
      { entityId: 'entity-1', role: 'OWNER' },
      { entityId: 'entity-2', role: 'CONTADOR' },
    ];
    const ids = accessibleEntityIds(access);
    expect(ids).toContain('entity-1');
    expect(ids).toContain('entity-2');
    expect(ids.length).toBe(2);
  });

  it('should handle empty access list', () => {
    const ids = accessibleEntityIds([]);
    expect(ids).toEqual([]);
  });

  it('should map all access entries to entity IDs', () => {
    const access = [
      { entityId: 'entity-1', role: 'OWNER', entityName: 'E1', entityColorToken: null },
      { entityId: 'entity-2', role: 'CONTADOR', entityName: 'E2', entityColorToken: null },
      { entityId: 'entity-3', role: 'GERENTE', entityName: 'E3', entityColorToken: null },
    ];
    const ids = accessibleEntityIds(access);
    expect(ids.length).toBe(3);
    expect(ids).toEqual(['entity-1', 'entity-2', 'entity-3']);
  });
});
