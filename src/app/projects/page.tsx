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
import FloatingSvg from "@/components/FloatingSvg";

interface FormState {
  title: string;
  description: string;
  technologies: string;
  githubURL: string;
  imageURL: string;
}

const Projects = () => {
  const { isAuthenticated } = useAuth();
  
  // Balloon-themed SVG paths for floating animations
  const balloonSvgPaths = [
    // Simple balloon
    "M12 2C8.69 2 6 4.69 6 8c0 2.5 1.5 4.67 3.67 5.67L8 22h8l-1.67-8.33C16.5 12.67 18 10.5 18 8c0-3.31-2.69-6-6-6z M12 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z",
    // Heart balloon
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z M12 18l.67-.63C16.71 13.79 19 11.57 19 8.5c0-1.93-1.57-3.5-3.5-3.5-1.04 0-2.04.52-2.57 1.36L12 7.82l-.93-1.46C10.54 5.52 9.54 5 8.5 5 6.57 5 5 6.57 5 8.5c0 3.07 2.29 5.29 6.33 9.87L12 18z",
    // Star balloon
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z M12 6.2L10.25 10.5l-4.55.66 3.29 3.21-.78 4.54L12 16.5l3.79 1.99-.78-4.54 3.29-3.21-4.55-.66L12 6.2z",
    // Round balloon
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M8 14l2-2 2 2 4-4 1.41 1.41L12 16.83 8 14z",
    // Gift balloon
    "M12 2l2 4h4l-2 2v12H8V8l-2-2h4l2-4z M12 4.5L10.5 7H7.41l1 1v10h7.18V8l1-1H13.5L12 4.5z M10 10v6h4v-6h-4z"
  ];
    const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
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
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setInitialLoading(true);
      try {
        setProjects([]);
        const projectsData = await fetchProjects();
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
        setInitialLoading(false); // Also set to false on error
      }
      if (!cancelled) setLoading(false);
    };

    fetchData();
    return () => {
      cancelled = true;
    };
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
    );    if (success) {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        // Reset initial loading state if projects were successfully fetched
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await res.json();      if (data.success) {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        // Update initial loading state based on remaining projects
        if (projectsData.length === 0) {
          setInitialLoading(true);
        }
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
    <div className="bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50 min-h-screen relative overflow-x-hidden">
      {/* Animated Background Overlay with subtle pulsing effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(45deg, var(--primary)/0.1, transparent, var(--accent)/0.1)",
            "linear-gradient(135deg, var(--accent)/0.2, transparent, var(--primary)/0.05)",
            "linear-gradient(225deg, var(--secondary)/0.15, transparent, var(--accent)/0.2)",
            "linear-gradient(315deg, var(--primary)/0.1, transparent, var(--accent)/0.1)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Balloon SVGs */}
      {balloonSvgPaths.map((path, index) => (
        <FloatingSvg key={`primary-${index}`} svgPath={path} />
      ))}
      {/* Additional floating elements for more density */}
      {Array.from({ length: 10 }).map((_, index) => (
        <FloatingSvg 
          key={`extra-${index}`} 
          svgPath={balloonSvgPaths[index % balloonSvgPaths.length]} 
          className={`opacity-${50 + (index % 4) * 15}`}
        />
      ))}
      {/* Smaller ambient particles */}
      {Array.from({ length: 8 }).map((_, index) => (
        <FloatingSvg 
          key={`ambient-${index}`} 
          svgPath={balloonSvgPaths[index % 3]} 
          className="opacity-25"
        />
      ))}
      
      {/* Subtle star-like particles */}
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={`star-${index}`}
          className="fixed pointer-events-none z-5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.3, 1.2, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
        >
          <div className="w-1.5 h-1.5 bg-accent/60 rounded-full" />
        </motion.div>
      ))}
      
      <Head>
        <title>Projects - Seniru Dilmith</title>
        <meta
          name="description"
          content="Explore my projects in AI, Web Development, Cloud Computing, and Open Source contributions."
        />
        <meta
          name="keywords"
          content="Projects, AI, Web Development, Cloud, Open Source, Next.js, React"
        />      </Head>
      <div className="relative z-30">
        <Navbar />
      </div>
      <div className="relative z-20">
        <HeroForProjects />
      </div>      {error && <div className="p-8 text-center text-red-500 relative z-20">{error}</div>}
      
      {/* Initial loading spinner - shows until at least one project is loaded */}
      {initialLoading && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 relative z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SmallLoadingSpinner />
          <motion.p 
            className="mt-4 text-muted-foreground text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading projects...
          </motion.p>
        </motion.div>
      )}      
      {/* Main content - only show when initial loading is complete */}
      {!initialLoading && (
        <motion.div
          className="mx-auto max-w-7xl mt-8 relative z-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              {isAuthenticated && (
                <motion.button
                  className="btn btn-primary shadow-lg"
                  onClick={() => setViewForm((prev) => !prev)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {viewForm
                    ? "Hide Form"
                    : editingProjectId
                    ? "Edit Project"
                    : "Add Project"}
                </motion.button>
              )}
            </div>

            {viewForm && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <ProjectForm
                  handleAddOrUpdate={handleAddOrUpdate}
                  formState={formState}
                  setFormState={setFormState}
                  editingProjectId={editingProjectId}
                  resetForm={resetForm}
                  handleFileChange={handleFileChange}
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProjectList
                projects={projects}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isAuthenticated={isAuthenticated}
              />
            </motion.div>
            {loading && (
              <div className="flex justify-center py-8">
                <SmallLoadingSpinner />
              </div>
            )}
          </div>
        </motion.div>
      )}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};

export default Projects;
