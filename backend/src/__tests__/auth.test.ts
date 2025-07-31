import { hashPassword, comparePassword, generateToken } from '../lib/auth';

describe('Auth Utils', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(10);
    });

    it('should verify password correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
      
      const isInvalid = await comparePassword('wrongpassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });

    it('should handle empty password', async () => {
      const hashedEmpty = await hashPassword('');
      expect(hashedEmpty).toBeDefined();
      expect(hashedEmpty.length).toBeGreaterThan(10);
    });

    it('should handle null password comparison', async () => {
      const hashedPassword = await hashPassword('test123');
      const isValid = await comparePassword('', hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Token', () => {
    it('should generate valid JWT token', () => {
      const userId = 'test-user-id';
      const token = generateToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user1');
      const token2 = generateToken('user2');
      
      expect(token1).not.toBe(token2);
    });

    it('should handle empty userId', () => {
      const token = generateToken('');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });
});
