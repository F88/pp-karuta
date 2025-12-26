import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should pass dummy test', () => {
    expect(true).toBe(true);
  });

  it('should perform basic math', () => {
    expect(1 + 1).toBe(2);
  });
});
