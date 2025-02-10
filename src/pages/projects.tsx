import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types/Project";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectList from "@/components/projects/ProjectList";
import HeroForProjects from "@/components/projects/HeroForProjects";
import { useAuth } from "@/context/AuthContext";
import {
  fetchProjects,
  addOrUpdateProject,
  deleteProject,
} from "@/controllers/projectController";
import Head from "next/head";
import LoadingSpinnrer from "@/components/LoadingSpinner";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewForm, setViewForm] = useState(false);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    technologies: "",
    githubURL: "",
    imageURL: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { projects, error } = await fetchProjects();
      setProjects(projects);
      setError(error);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const { success, message } = await addOrUpdateProject(
      formState,
      file,
      editingProjectId,
      token
    );
    if (success) {
      const { projects } = await fetchProjects();
      setProjects(projects);
      resetForm();
      alert(message);
    } else {
      alert(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const { success, message } = await deleteProject(id, token);
    if (success) {
      const { projects } = await fetchProjects();
      setProjects(projects);
      alert(message);
    } else {
      alert(message);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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
        <meta property="og:title" content="My Projects - Seniru Dilmith" />
        <meta
          property="og:description"
          content="Discover my software engineering projects in AI, Web, and Cloud Computing."
        />
        <meta property="og:image" content="/images/projects-thumbnail.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/projects" />
        <meta name="twitter:title" content="My Projects - Seniru Dilmith" />
        <meta
          name="twitter:description"
          content="Explore my coding projects and open-source contributions."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <Navbar />
      <HeroForProjects />
      {loading ? (
        <LoadingSpinnrer />
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <>
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
                  {viewForm ? "Hide Form" : "Add Project"}
                </button>
              )}
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

            <ProjectList
              projects={projects}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Projects;
