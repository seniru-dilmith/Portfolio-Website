import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import * as ProjectServiceModule from '@/services/project-service';
import { useProjectManagement } from './useProjectManagement';

describe('useProjectManagement', () => {
  it('should initialize with default state and fetch projects', async () => {
    jest.spyOn(ProjectServiceModule.ProjectService, 'fetchProjects').mockResolvedValue([]);
    const { result } = renderHook(() => useProjectManagement());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.projects).toEqual([]);
  });
}); 