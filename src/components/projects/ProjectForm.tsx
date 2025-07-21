import React from 'react';
import Image from 'next/image';
import { ProjectFormProps } from '@/types/Project';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ProjectForm: React.FC<ProjectFormProps> = ({
  formState, setFormState, handleAddOrUpdate, editingProjectId, resetForm,
  handleFileChange, newFiles, removeNewFile, removeExistingImage, isUploading,
  handleLinkChange, addLinkField, removeLinkField
}) => {
  const totalImages = formState.imageURLs.length + newFiles.length;

  return (
    <form onSubmit={handleAddOrUpdate} className="p-6 bg-base-200 rounded-lg shadow-md">
      <fieldset disabled={isUploading}> {/* Disable all inputs when uploading */}
        <h2 className="text-2xl font-bold mb-6 text-primary">
          {editingProjectId ? 'Update Project' : 'Add New Project'}
        </h2>
        
        {/* Text Inputs */}
        <div className="mb-4">
            <label htmlFor="project-title" className="block mb-1 font-medium">Title</label>
            <input id="project-title" type="text" placeholder="Project Title" value={formState.title}
              onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
              className="input input-bordered w-full" required />
        </div>

        <div className="mb-4">
          <label htmlFor="project-description" className="block mb-1 font-medium">Description</label>
          <textarea id="project-description" placeholder="Detailed description of the project" value={formState.description}
            onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            className="textarea textarea-bordered w-full h-24" required />
        </div>

        <div className="mb-6">
          <label htmlFor="project-technologies" className="block mb-1 font-medium">Technologies</label>
          <input id="project-technologies" type="text" placeholder="React, Node.js, Tailwind CSS" value={formState.technologies}
            onChange={(e) => setFormState(prev => ({ ...prev, technologies: e.target.value }))}
            className="input input-bordered w-full" required />
            <p className="text-xs text-gray-500 mt-1">Comma-separated values.</p>
        </div>

        {/* Dynamic Links Section */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Project Links</label>
          <div className="space-y-4">
            {formState.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Link Name (e.g., GitHub)"
                  value={link.name}
                  onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                  className="input input-bordered w-1/3"
                  required
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="input input-bordered w-2/3"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeLinkField(index)}
                  className="btn btn-error btn-square btn-outline"
                  disabled={formState.links.length <= 1}
                  aria-label="Remove link"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLinkField}
            className="btn btn-sm btn-outline btn-primary mt-4 gap-2"
          >
            <FaPlus /> Add Another Link
          </button>
        </div>

        {/* Image Upload and Preview */}
        <div className="mb-6">
          <label htmlFor="project-image" className="block mb-1 font-medium">Project Images (up to 5)</label>
          <input id="project-image" type='file' accept='image/*' onChange={handleFileChange} multiple
            className="file-input file-input-bordered w-full" disabled={totalImages >= 5} />
          
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {formState.imageURLs.map((url, index) => (
              <div key={url} className="relative group">
                <Image src={url} alt={`Existing image ${index + 1}`} width={150} height={100} className="rounded-lg object-cover w-full h-24" />
                <button type="button" onClick={() => removeExistingImage(index)} 
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity" aria-label={`Remove existing image ${index + 1}`}>&times;</button>
              </div>
            ))}
            {newFiles.map((file, index) => (
              <div key={file.name + index} className="relative group">
                <Image src={URL.createObjectURL(file)} alt={`New image ${index + 1}`} width={150} height={100} className="rounded-lg object-cover w-full h-24" />
                <button type="button" onClick={() => removeNewFile(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity" aria-label={`Remove new image ${index + 1}`}>&times;</button>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRESS BAR */}
        {isUploading && (
          <div className="my-4 space-y-2">
            <p className="text-sm font-medium text-center">Processing, please wait...</p>
            <progress className="progress progress-primary w-full"></progress>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button type="submit" className="btn btn-primary" disabled={isUploading}>
            {isUploading ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              editingProjectId ? 'Update Project' : 'Add Project'
            )}
          </button>
          {editingProjectId && (
            <button type="button" onClick={resetForm} className="btn btn-ghost">
              Cancel
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default ProjectForm;