import { ProjectService } from './project-service';

describe('ProjectService', () => {
  it('fetchProjects should call apiFetch and return projects', async () => {
    const mockProjects = [{ _id: '1', title: 'Test', description: '', technologies: [], links: [], imageURLs: [], createdAt: new Date() }];
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: mockProjects }) });
    const projects = await ProjectService.fetchProjects();
    expect(projects).toEqual(mockProjects);
  });
}); 