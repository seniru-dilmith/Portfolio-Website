"use client";

import { motion } from "framer-motion";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectList from "@/components/projects/ProjectList";
import HeroForProjects from "@/components/projects/HeroForProjects";
import { useAuth } from "@/context/AuthContext";
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
    projects, loading, initialLoading, error, viewForm, editingProjectId,
    formState, newFiles, setViewForm, setFormState,
    handleAddOrUpdate, handleDelete, handleEdit, handleFileChange,
    resetForm, removeNewFile, removeExistingImage, isUploading,
    // 1. Get the new link handlers from the hook
    handleLinkChange, addLinkField, removeLinkField
  } = useProjectManagement();

  const pageConfig = getPageConfig('projects');

  return (
    <PageLayout {...pageConfig}>
      <HeroForProjects />
      
      <ErrorDisplay error={error} />
      
      <LoadingIndicator show={initialLoading || (loading && projects.length === 0)} text="Loading projects..." />
      
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
                formState={formState}
                setFormState={setFormState}
                handleAddOrUpdate={handleAddOrUpdate}
                editingProjectId={editingProjectId}
                resetForm={resetForm}
                handleFileChange={handleFileChange}
                newFiles={newFiles}
                removeNewFile={removeNewFile}
                removeExistingImage={removeExistingImage}
                isUploading={isUploading}
                // 2. Pass the new handlers down as props
                handleLinkChange={handleLinkChange}
                addLinkField={addLinkField}
                removeLinkField={removeLinkField}
              />
            </motion.div>
          )}

          <ProjectList
            projects={projects}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isAuthenticated={isAuthenticated}
          />
          
          {loading && projects.length > 0 && (
             <LoadingIndicator show={true} text="Updating..." />
          )}
        </Container>
      )}
    </PageLayout>
  );
};

export default Projects;