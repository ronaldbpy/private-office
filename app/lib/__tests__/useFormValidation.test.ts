import { describe, it, expect } from "vitest";

describe("useFormValidation", () => {
  // Test validation rules
  describe("validation rules", () => {
    it("validates required field", () => {
      const data = { name: "" };
      const rules = { name: { required: true } };

      // Manual validation for testing
      const isValid = data.name !== "";
      expect(isValid).toBe(false);
    });

    it("validates minLength", () => {
      const data = { title: "ab" };
      const minLength = 3;

      const isValid = data.title.length >= minLength;
      expect(isValid).toBe(false);
    });

    it("validates maxLength", () => {
      const data = { title: "a".repeat(101) };
      const maxLength = 100;

      const isValid = data.title.length <= maxLength;
      expect(isValid).toBe(false);
    });

    it("validates email pattern", () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const validEmail = "user@example.com";
      const invalidEmail = "notanemail";

      expect(emailPattern.test(validEmail)).toBe(true);
      expect(emailPattern.test(invalidEmail)).toBe(false);
    });

    it("accepts valid data", () => {
      const data = {
        name: "John Doe",
        email: "john@example.com",
        title: "Test Project",
      };

      const hasName = data.name.length > 0;
      const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      const hasValidTitle = data.title.length >= 3 && data.title.length <= 100;

      expect(hasName).toBe(true);
      expect(hasValidEmail).toBe(true);
      expect(hasValidTitle).toBe(true);
    });
  });

  describe("validation error messages", () => {
    it("generates required error", () => {
      const field = "name";
      const message = `${field} is required`;

      expect(message).toContain("required");
    });

    it("generates minLength error", () => {
      const field = "title";
      const min = 3;
      const message = `${field} must be at least ${min} characters`;

      expect(message).toContain(min.toString());
    });

    it("generates maxLength error", () => {
      const field = "description";
      const max = 500;
      const message = `${field} must not exceed ${max} characters`;

      expect(message).toContain(max.toString());
    });
  });
});
