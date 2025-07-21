import React from 'react';
import { ProjectFormProps } from '@/types/Project';

const ProjectForm: React.FC<ProjectFormProps> = ({
  formState,
  setFormState,
  handleAddOrUpdate,
  editingProjectId,
  resetForm,
  handleFileChange,
}) => {
  return (
    <form onSubmit={handleAddOrUpdate} className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-primary">
        {editingProjectId ? 'Update Project' : 'Add New Project'}
      </h2>
      <label htmlFor="project-title" className="block mb-1 font-medium">Title</label>
      <input
        type="text"
        placeholder="Title"
        value={formState.title}
        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <label htmlFor="project-description" className="block mb-1 font-medium">Description</label>
      <textarea
        placeholder="Description"
        value={formState.description}
        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <label htmlFor="project-technologies" className="block mb-1 font-medium">Technologies</label>
      <input
        type="text"
        placeholder="Technologies (comma-separated)"
        value={formState.technologies}
        onChange={(e) => setFormState({ ...formState, technologies: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <label htmlFor="project-github-url" className="block mb-1 font-medium">GitHub URL</label>
      <input
        type="url"
        placeholder="GitHub URL"
        value={formState.githubURL}
        onChange={(e) => setFormState({ ...formState, githubURL: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <label htmlFor="project-image" className="block mb-1 font-medium">Project Image</label>
      <input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className="border p-2 mb-4 block w-full"
        placeholder="Upload project image"
        title="Upload project image"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editingProjectId ? 'Update' : 'Add'}
      </button>
      {editingProjectId && (
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-4 hover:bg-gray-700"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProjectForm;
