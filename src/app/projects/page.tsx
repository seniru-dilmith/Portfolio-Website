"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types/Project";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectList from "@/components/projects/ProjectList";
import HeroForProjects from "@/components/projects/HeroForProjects";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import SmallLoadingSpinner from "@/util/SmallLoadingSpinner";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

interface FormState {
  title: string;
  description: string;
  technologies: string;
  githubURL: string;
  imageURL: string;
}

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewForm, setViewForm] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    technologies: "",
    githubURL: "",
    imageURL: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Fetch projects from API
  const fetchProjects = async (): Promise<Project[]> => {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    if (!data.success) throw new Error("Failed to fetch projects");
    return data.data as Project[];
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setProjects([]);
        const projectsData = await fetchProjects();
        for (const project of projectsData) {
          setProjects((prev) => [...prev, project]);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        setError(null);
      } catch {
        setError("Failed to fetch projects");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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

  // Helper for add or update project via API
  const addOrUpdateProject = async (
    formState: FormState,
    file: File | null,
    editingProjectId: string | null
  ): Promise<{ success: boolean; message: string }> => {
    try {
      let imageURL = formState.imageURL;

      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();

        if (uploadRes.ok && uploadJson.success) {
          imageURL = uploadJson.url;
        } else {
          console.error('Image upload failed:', uploadJson.message);
        }
      }

      const url = editingProjectId
        ? `/api/projects?id=${editingProjectId}`
        : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          imageURL,
          technologies: formState.technologies
            ? formState.technologies.split(",").map((tech: string) => tech.trim())
            : [],
        }),
      });

      const data = await res.json();

      if (data.success) {
        return {
          success: true,
          message: editingProjectId
            ? "Project updated successfully!"
            : "Project added successfully!",
        };
      } else {
        return { success: false, message: "Failed to add/update project." };
      }
    } catch (error) {
      console.error("Error adding/updating project:", error);
      return {
        success: false,
        message: "An error occurred while adding/updating the project.",
      };
    }
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, message } = await addOrUpdateProject(
      formState,
      file,
      editingProjectId
    );

    if (success) {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        resetForm();
        alert(message);
      } catch {
        alert("Failed to refresh projects after update.");
      }
    } else {
      alert(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        alert("Project deleted successfully!");
      } else {
        alert("Failed to delete project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("An error occurred while deleting the project.");
    }
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50 min-h-screen">
      <Head>
        <title>Projects - Seniru Dilmith</title>
        <meta
          name="description"
          content="Explore my projects in AI, Web Development, Cloud Computing, and Open Source contributions."
        />
        <meta
          name="keywords"
          content="Projects, AI, Web Development, Cloud, Open Source, Next.js, React"
        />
      </Head>
      <Navbar />
      <HeroForProjects />
      {error && <div className="p-8 text-center text-red-500">{error}</div>}
      <motion.div
        className="mx-auto max-w-7xl mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
          <div className="flex justify-between items-center mb-6">
            {isAuthenticated && (
              <button
                className="btn btn-primary"
                onClick={() => setViewForm((prev) => !prev)}
              >
                {viewForm
                  ? "Hide Form"
                  : editingProjectId
                  ? "Edit Project"
                  : "Add Project"}
              </button>
            )}
          </div>

          {viewForm && isAuthenticated && (
            <ProjectForm
              handleAddOrUpdate={handleAddOrUpdate}
              formState={formState}
              setFormState={setFormState}
              editingProjectId={editingProjectId}
              resetForm={resetForm}
              handleFileChange={handleFileChange}
            />
          )}

          <ProjectList
            projects={projects}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isAuthenticated={isAuthenticated}
          />
        {loading && <SmallLoadingSpinner />}
      </motion.div>
      <Footer />
    </div>
  );
};

export default Projects;
