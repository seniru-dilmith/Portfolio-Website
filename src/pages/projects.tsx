import { useEffect, useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubURL: string;
  createdAt: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    title: '',
    description: '',
    technologies: '',
    githubURL: '',
  });

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
        setError(null);
      } else {
        setError('Failed to fetch projects.');
      }
    } catch (err) {
      setError('Failed to fetch projects.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingProjectId;

    try {
      const res = await fetch(`/api/projects${isEditing ? `/${editingProjectId}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          technologies: formState.technologies.split(',').map((tech) => tech.trim()),
        }),
      });

      const data = await res.json();

      if (data.success) {
        fetchProjects(); // Refresh projects after add/update
        resetForm();
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'add'} project.`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} project:`, err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        fetchProjects(); // Refresh projects after deletion
      } else {
        alert('Failed to delete project.');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      technologies: '',
      githubURL: '',
    });
    setEditingProjectId(null);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  const handleEdit = (project: Project) => {
    setFormState({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubURL: project.githubURL,
    });
    setEditingProjectId(project._id);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>

      {/* Add/Update Form */}
      <form onSubmit={handleAddOrUpdate} className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingProjectId ? 'Update Project' : 'Add New Project'}</h2>
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

      {/* Projects List */}
      <ul>
        {projects.map((project) => (
          <li key={project._id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p>{project.description}</p>
            <p className="text-sm text-gray-500">
              Technologies: {project.technologies.join(', ')}
            </p>
            <a
              href={project.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              GitHub
            </a>
            <div className="mt-4">
              <button
                onClick={ () => handleEdit(project) }
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
