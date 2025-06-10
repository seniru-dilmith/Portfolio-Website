import { useState, useEffect, useRef } from "react";
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
  const cancelledRef = useRef(false);
  
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    technologies: "",
    githubURL: "",
    imageURL: "",
  });

  // Fetch projects with staggered loading animation
  const fetchProjects = async () => {
    setLoading(true);
    setProjects([]);

    try {
      const projectsData = await ProjectService.fetchProjects();
      for (const project of projectsData) {
        if (cancelledRef.current) break;
        setProjects((prev) => [...prev, project]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (!cancelledRef.current) {
        setInitialLoading(false);
        setError(null);
      }
    } catch {
      if (!cancelledRef.current) {
        setError("Failed to fetch projects");
        setInitialLoading(false);
      }
    }

    if (!cancelledRef.current) setLoading(false);
  };

  // Initialize projects on mount
  useEffect(() => {
    cancelledRef.current = false;
    fetchProjects();
    return () => {
      cancelledRef.current = true;
    };
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
