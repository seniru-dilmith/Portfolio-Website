import { Project, ProjectFormState } from "@/types/Project";
import { apiFetch } from "@/lib/api";

export class ProjectService {
  static async fetchProjects(): Promise<Project[]> {
    const res = await apiFetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    return data.data as Project[];
  }

  static async uploadFiles(
    files: File[],
    projectId: string
  ): Promise<{ success: boolean; urls?: string[]; message?: string }> {
    try {
      const uploadData = new FormData();
      files.forEach((file) => {
        uploadData.append('files', file); // Use 'files' to append multiple
      });
      uploadData.append('projectId', projectId);

      const uploadRes = await apiFetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadData,
      });

      const uploadJson = await uploadRes.json();

      if (uploadRes.ok && uploadJson.success) {
        return { success: true, urls: uploadJson.urls };
      } else {
        return { success: false, message: uploadJson.message || 'Image upload failed' };
      }
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, message: 'Failed to upload files' };
    }
  }

  static async addOrUpdateProject(
    formState: ProjectFormState,
    newFiles: File[],
    editingProjectId: string | null
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (editingProjectId) {
        // --- UPDATE LOGIC ---
        let uploadedImageUrls: string[] = [];
        if (newFiles.length > 0) {
          const uploadResult = await this.uploadFiles(newFiles, editingProjectId);
          if (!uploadResult.success || !uploadResult.urls) {
            return { success: false, message: uploadResult.message || 'File upload failed' };
          }
          uploadedImageUrls = uploadResult.urls;
        }

        const finalImageURLs = [...formState.imageURLs, ...uploadedImageUrls];
        const res = await apiFetch(`/api/projects?id=${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...formState,
            imageURLs: finalImageURLs,
            technologies: formState.technologies.split(',').map((tech) => tech.trim()),
          }),
        });
        const data = await res.json();
        return { success: data.success, message: data.success ? "Project updated successfully!" : "Failed to update project." };

      } else {
        // --- ADD LOGIC ---
        // 1. Create project with text data first
        const initialRes = await apiFetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...formState,
            imageURLs: [], // Send empty array initially
            technologies: formState.technologies.split(',').map((tech) => tech.trim()),
          }),
        });

        const initialData = await initialRes.json();
        if (!initialData.success) {
          return { success: false, message: 'Failed to create project.' };
        }
        
        const newProjectId = initialData.data._id;

        // 2. If there are files, upload them
        if (newFiles.length > 0) {
          const uploadResult = await this.uploadFiles(newFiles, newProjectId);
          if (!uploadResult.success || !uploadResult.urls) {
             // Optional: delete the just-created project for cleanup
            await this.deleteProject(newProjectId);
            return { success: false, message: uploadResult.message || 'Project created, but image upload failed.' };
          }

          // 3. Update the new project with the image URLs
          const updateRes = await apiFetch(`/api/projects?id=${newProjectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ imageURLs: uploadResult.urls }),
          });
          const updateData = await updateRes.json();
          return { success: updateData.success, message: updateData.success ? "Project added successfully!" : "Project created, but failed to link images." };
        }

        return { success: true, message: "Project added successfully!" };
      }
    } catch (error) {
      console.error("Error adding/updating project:", error);
      return { success: false, message: "An error occurred." };
    }
  }

  static async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiFetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await res.json();
      return { success: data.success, message: data.success ? "Project deleted successfully!" : "Failed to delete project." };
    } catch (error) {
      console.error("Error deleting project:", error);
      return { success: false, message: "An error occurred while deleting." };
    }
  }
}
