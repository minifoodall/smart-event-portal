// Simple smoke test for the frontend (Jenkins will run this in the Test stage)
import { describe, it, expect } from 'vitest';

describe('frontend smoke', () => {
  it('truthy check', () => {
    expect(1 + 1).toBe(2);
  });
});
