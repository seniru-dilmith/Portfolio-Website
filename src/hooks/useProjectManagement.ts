import { useState, useEffect } from "react";
import { Project, ProjectFormState, ProjectLink } from "@/types/Project";
import { ProjectService } from "@/services/project-service";

// Use the corrected ProjectFormState type for the initial state
const initialFormState: ProjectFormState = {
  title: "",
  description: "",
  technologies: "",
  links: [{ name: "GitHub", url: "" }],
  imageURLs: [],
};

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewForm, setViewForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formState, setFormState] = useState<ProjectFormState>(initialFormState);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projectsData = await ProjectService.fetchProjects();
      setProjects(projectsData);
      setError(null);
    } catch {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setFormState(initialFormState);
    setNewFiles([]);
    setEditingProjectId(null);
    setViewForm(false);
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newFiles.length + formState.imageURLs.length > 5){
      alert("You can upload a maximum of 5 images per project.");
      return;
    }

    setIsUploading(true); // Start "uploading" state
    try {
      const { success } = await ProjectService.addOrUpdateProject(
        formState,
        newFiles,
        editingProjectId
      );
      if (success) {
        resetForm();
        await fetchProjects();
      }
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the project and all its images.")) return;
    setLoading(true);
    const { success } = await ProjectService.deleteProject(id);
    setLoading(false);
    if (success) {
      fetchProjects();
    }
  };

  // The error will be fixed here because the object now correctly matches ProjectFormState
  const handleEdit = (project: Project) => {
    setFormState({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      links: project.links.length > 0 ? project.links : [{ name: "GitHub", url: "" }],
      imageURLs: project.imageURLs || [],
    });
    setEditingProjectId(project._id);
    setNewFiles([]);
    setViewForm(true);
    window.scrollTo(0, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        if(newFiles.length + formState.imageURLs.length + filesArray.length > 5) {
            alert(`You can only add ${5 - (newFiles.length + formState.imageURLs.length)} more images.`);
            return;
        }
        setNewFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleLinkChange = (index: number, field: keyof ProjectLink, value: string) => {
    const updatedLinks = [...formState.links];
    updatedLinks[index][field] = value;
    setFormState(prev => ({ ...prev, links: updatedLinks }));
  };

  const addLinkField = () => {
    setFormState(prev => ({
      ...prev,
      links: [...prev.links, { name: "", url: "" }],
    }));
  };

  const removeLinkField = (index: number) => {
    setFormState(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      imageURLs: prev.imageURLs.filter((_, i) => i !== index),
    }));
  };

  return {
    projects, loading, initialLoading, error, viewForm, editingProjectId, formState, newFiles,
    setViewForm, setFormState,
    handleAddOrUpdate, handleDelete, handleEdit, handleFileChange, resetForm,
    removeNewFile, removeExistingImage, isUploading, handleLinkChange, addLinkField, removeLinkField
  };
};
