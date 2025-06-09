import { useState, useEffect } from "react";
import { Project } from "@/types/Project";
import { ProjectService } from "@/services/project-service";

interface FormState {
  title: string;
  description: string;
  technologies: string;
  githubURL: string;
  imageURL: string;
}

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewForm, setViewForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    technologies: "",
    githubURL: "",
    imageURL: "",
  });

  // Fetch projects with staggered loading animation
  const fetchProjects = async () => {
    let cancelled = false;
    setLoading(true);
    setInitialLoading(true);
    
    try {
      setProjects([]);
      const projectsData = await ProjectService.fetchProjects();
      
      for (const project of projectsData) {
        if (cancelled) break;
        setProjects((prev) => {
          const newProjects = [...prev, project];
          // Set initial loading to false after first project is added
          if (newProjects.length === 1) {
            setInitialLoading(false);
          }
          return newProjects;
        });
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setError(null);
    } catch {
      setError("Failed to fetch projects");
      setInitialLoading(false);
    }
    
    if (!cancelled) setLoading(false);
    return () => { cancelled = true; };
  };

  // Initialize projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Reset form state
  const resetForm = () => {
    setFormState({
      title: "",
      description: "",
      technologies: "",
      githubURL: "",
      imageURL: "",
    });
    setFile(null);
    setEditingProjectId(null);
    setViewForm(false);
  };

  // Handle add or update project
  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, message } = await ProjectService.addOrUpdateProject(
      formState,
      file,
      editingProjectId
    );

    if (success) {
      try {
        const projectsData = await ProjectService.fetchProjects();
        setProjects(projectsData);
        if (projectsData.length > 0) {
          setInitialLoading(false);
        }
        resetForm();
        alert(message);
      } catch {
        alert("Failed to refresh projects after update.");
      }
    } else {
      alert(message);
    }
  };

  // Handle delete project
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { success, message } = await ProjectService.deleteProject(id);

    if (success) {
      const projectsData = await ProjectService.fetchProjects();
      setProjects(projectsData);
      if (projectsData.length === 0) {
        setInitialLoading(true);
      }
      alert(message);
    } else {
      alert(message);
    }
  };

  // Handle edit project
  const handleEdit = (project: Project) => {
    setFormState({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      githubURL: project.githubURL,
      imageURL: project.imageURL,
    });
    setEditingProjectId(project._id);
    setViewForm(true);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return {
    // State
    projects,
    loading,
    initialLoading,
    error,
    viewForm,
    editingProjectId,
    file,
    formState,
    
    // Setters
    setViewForm,
    setFormState,
    
    // Handlers
    handleAddOrUpdate,
    handleDelete,
    handleEdit,
    handleFileChange,
    resetForm,
  };
};
