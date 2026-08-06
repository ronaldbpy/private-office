import { describe, it, expect } from "vitest";
import { accessibleEntityIds } from "../access";
import type { AccessEntry } from "../access";

describe("access.ts", () => {
  describe("accessibleEntityIds", () => {
    it("returns empty array for empty access list", () => {
      const result = accessibleEntityIds([]);
      expect(result).toEqual([]);
    });

    it("extracts entity IDs from access entries", () => {
      const access: AccessEntry[] = [
        {
          entityId: "ent-1",
          entityName: "Axentia EAS",
          entityColorToken: "cat-1",
          role: "OWNER",
        },
        {
          entityId: "ent-2",
          entityName: "Casa Amelia",
          entityColorToken: "cat-2",
          role: "ADMINISTRADOR_HOLDING",
        },
      ];

      const result = accessibleEntityIds(access);
      expect(result).toEqual(["ent-1", "ent-2"]);
    });

    it("includes cascaded access entries", () => {
      const access: AccessEntry[] = [
        {
          entityId: "ent-1",
          entityName: "Axentia EAS",
          entityColorToken: "cat-1",
          role: "OWNER",
        },
        {
          entityId: "ent-3",
          entityName: "Subsidiary Co",
          entityColorToken: "cat-3",
          role: "OWNER",
          cascadedFrom: "Axentia EAS",
        },
      ];

      const result = accessibleEntityIds(access);
      expect(result).toEqual(["ent-1", "ent-3"]);
      expect(result.length).toBe(2);
    });

    it("preserves order of access entries", () => {
      const access: AccessEntry[] = [
        {
          entityId: "first",
          entityName: "First",
          entityColorToken: null,
          role: "OWNER",
        },
        {
          entityId: "second",
          entityName: "Second",
          entityColorToken: null,
          role: "GERENTE",
        },
        {
          entityId: "third",
          entityName: "Third",
          entityColorToken: null,
          role: "CONTADOR",
        },
      ];

      const result = accessibleEntityIds(access);
      expect(result[0]).toBe("first");
      expect(result[1]).toBe("second");
      expect(result[2]).toBe("third");
    });
  });
});
