import { vi, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers'; 

expect.extend(matchers);

// very light fetch stub
globalThis.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({}),
}) as any;
