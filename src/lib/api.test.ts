import { apiFetch } from './api';

describe('apiFetch', () => {
  it('should return a Response object for a successful fetch', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true } as unknown as Response);
    const res = await apiFetch('/api/test');
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
  });

  it('should attempt token refresh on 401', async () => {
    let fetchCount = 0;
    global.fetch = jest.fn().mockImplementation((url) => {
      fetchCount++;
      if (fetchCount === 1) return Promise.resolve({ status: 401, ok: false } as unknown as Response);
      if (url === '/api/admin/refresh') return Promise.resolve({ ok: true } as unknown as Response);
      return Promise.resolve({ status: 200, ok: true } as unknown as Response);
    });
    const res = await apiFetch('/api/test');
    expect(fetchCount).toBeGreaterThan(1);
    expect(res).toBeDefined();
  });
}); 