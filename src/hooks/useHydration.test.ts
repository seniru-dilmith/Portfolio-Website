import { renderHook } from '@testing-library/react';
import { useHydration } from './useHydration';

describe('useHydration', () => {
  it('should set isHydrated to true after mount', () => {
    const { result } = renderHook(() => useHydration());
    expect(result.current).toBe(true);
  });
}); 