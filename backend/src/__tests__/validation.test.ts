import { z } from 'zod';

// Test schemas similar to what we use in routes
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(6)
});

const taskSchema = z.object({
  title: z.string().min(1).max(200)
});

const listSchema = z.object({
  title: z.string().min(1).max(100)
});

describe('Validation Schemas', () => {
  describe('User Schema', () => {
    it('should validate correct user data', () => {
      const validUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'password123'
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: '123'
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const invalidUser = {
        email: 'test@example.com',
        name: 'T',
        password: 'password123'
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('Task Schema', () => {
    it('should validate correct task data', () => {
      const validTask = {
        title: 'Complete project'
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidTask = {
        title: ''
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject very long title', () => {
      const invalidTask = {
        title: 'a'.repeat(201)
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });

  describe('List Schema', () => {
    it('should validate correct list data', () => {
      const validList = {
        title: 'My Todo List'
      };

      const result = listSchema.safeParse(validList);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidList = {
        title: ''
      };

      const result = listSchema.safeParse(invalidList);
      expect(result.success).toBe(false);
    });

    it('should reject very long title', () => {
      const invalidList = {
        title: 'a'.repeat(101)
      };

      const result = listSchema.safeParse(invalidList);
      expect(result.success).toBe(false);
    });
  });
});
