import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { storage } from '../../../firebase';

interface ProjectFormProps {
  formState: {
    title: string;
    description: string;
    technologies: string;
    githubURL: string;
    imageURL: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      technologies: string;
      githubURL: string;
      imageURL: string;
    }>
  >;
  handleAddOrUpdate: (e: React.FormEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingProjectId: string | null;
  resetForm: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  formState,
  setFormState,
  handleAddOrUpdate,
  editingProjectId,
  resetForm,
}) => {
  const [ upLoading, setUpLoading ] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `project-images/${file.name}`);
    setUpLoading(true);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormState({ ...formState, imageURL: url });
    } catch (err) {
      console.error('Image Upload error:', err);
    } finally {
      setUpLoading(false);
    }
  }
  return (
    <form onSubmit={handleAddOrUpdate} className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingProjectId ? 'Update Project' : 'Add New Project'}
      </h2>
      <input
        type="text"
        placeholder="Title"
        value={formState.title}
        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <textarea
        placeholder="Description"
        value={formState.description}
        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <input
        type="text"
        placeholder="Technologies (comma-separated)"
        value={formState.technologies}
        onChange={(e) => setFormState({ ...formState, technologies: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <input
        type="url"
        placeholder="GitHub URL"
        value={formState.githubURL}
        onChange={(e) => setFormState({ ...formState, githubURL: e.target.value })}
        className="border p-2 mb-4 block w-full"
        required
      />
      <input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className="border p-2 mb-4 block w-full"
      />
      {upLoading && <p className="text-gray-500">Uploading image...</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={upLoading}
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
