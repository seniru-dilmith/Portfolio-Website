import { useEffect, useState } from 'react';
import { Project } from '@/types/Project';
import ProjectForm from '@/components/projects/ProjectForm';
import ProjectList from '@/components/projects/ProjectList';
import Hero from '@/components/Hero';
import { useAuth } from '@/components/context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import Head from 'next/head';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [ projects, setProjects ] = useState<Project[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ viewForm, setViewForm ] = useState(false);

  const [formState, setFormState] = useState({
    title: '',
    description: '',
    technologies: '',
    githubURL: '',
    imageURL: '',
  });

  const [file, setFile] = useState<File | null>(null);
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

    const token = localStorage.getItem('token');

    if (!token) {
      alert('first login....');
      return;
    }

    try {
      let imageURL = formState.imageURL;

      if (file) {
        const storageRef = ref(storage, `project-images/${file.name}`);
        await uploadBytes(storageRef, file);
        imageURL = await getDownloadURL(storageRef);
      }
      const res = await fetch(`/api/projects${isEditing ? `/${editingProjectId}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formState,
          imageURL,
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

    const token = localStorage.getItem('token');

    if (!token) {
      alert('First login...');
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        fetchProjects();
      } else {
        alert('Failed to delete project.');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleEdit = (project: Project) => {
    setFormState({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubURL: project.githubURL,
      imageURL: project.imageURL,
    });
    setEditingProjectId(project._id);
    setViewForm(true);
  };

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      technologies: '',
      githubURL: '',
      imageURL: '',
    });
    setFile(null);
    setEditingProjectId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormView = () => {
    setViewForm((prev) => !prev);
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-gray-500">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <Head>
        <meta name="description" content="Projects Page" />
      </Head>
      <Navbar />
      <Hero />
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-4">Projects</h1>
          {isAuthenticated && <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleFormView}
          >
            {viewForm ? 'Hide Form' : 'View Form'}
          </button>}
        </div>

        {viewForm && (
          <ProjectForm
            handleAddOrUpdate={handleAddOrUpdate}
            formState={formState}
            setFormState={setFormState}
            editingProjectId={editingProjectId}
            resetForm={resetForm}
            handleFileChange={handleFileChange}
          />
        )}
        <ProjectList projects={projects} handleEdit={handleEdit} handleDelete={handleDelete} isAuthenticated={isAuthenticated} />
      </div>
      <Footer />
    </>
  );
};

export default Projects;
