"use client";

import { motion } from "framer-motion";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectList from "@/components/projects/ProjectList";
import HeroForProjects from "@/components/projects/HeroForProjects";
import { useAuth } from "@/context/AuthContext";
import SmallLoadingSpinner from "@/util/SmallLoadingSpinner";
import PageLayout from "@/components/layout/PageLayout";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import FormActions from "@/components/ui/FormActions";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import Container from "@/components/ui/Container";
import { getPageConfig } from "@/constants/pageConfigs";
import { useProjectManagement } from "@/hooks/useProjectManagement";

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const {
    projects,
    loading,
    initialLoading,
    error,
    viewForm,
    editingProjectId,
    formState,
    setViewForm,
    setFormState,
    handleAddOrUpdate,
    handleDelete,
    handleEdit,
    handleFileChange,
    resetForm,
  } = useProjectManagement();

  const pageConfig = getPageConfig('projects');

  return (
    <PageLayout {...pageConfig}>
      <HeroForProjects />
      
      <ErrorDisplay error={error} />
      
      {/* Initial loading spinner - shows until at least one project is loaded */}
      <LoadingIndicator 
        show={initialLoading}
        text="Loading projects..."
      />
      
      {/* Main content - only show when initial loading is complete */}
      {!initialLoading && (
        <Container className="mt-8">
          <FormActions
            isAuthenticated={isAuthenticated}
            viewForm={viewForm}
            onToggleForm={() => setViewForm((prev) => !prev)}
            isEditing={!!editingProjectId}
            addText="Add Project"
            editText="Edit Project"
          />

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

          <ProjectList
            projects={projects}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isAuthenticated={isAuthenticated}
          />
          
          {loading && (
            <div className="flex justify-center py-8">
              <SmallLoadingSpinner />
            </div>
          )}
        </Container>
      )}
    </PageLayout>
  );
};

export default Projects;
