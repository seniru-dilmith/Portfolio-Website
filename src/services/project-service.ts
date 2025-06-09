import { Project } from "@/types/Project";

interface FormState {
  title: string;
  description: string;
  technologies: string;
  githubURL: string;
  imageURL: string;
}

export class ProjectService {
  // Fetch projects from API
  static async fetchProjects(): Promise<Project[]> {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    if (!data.success) throw new Error("Failed to fetch projects");
    return data.data as Project[];
  }

  // Upload file to server
  static async uploadFile(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadData,
      });

      const uploadJson = await uploadRes.json();

      if (uploadRes.ok && uploadJson.success) {
        return { success: true, url: uploadJson.url };
      } else {
        console.error('Image upload failed:', uploadJson.message);
        return { success: false, message: uploadJson.message };
      }
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, message: 'Failed to upload file' };
    }
  }

  // Add or update project via API
  static async addOrUpdateProject(
    formState: FormState,
    file: File | null,
    editingProjectId: string | null
  ): Promise<{ success: boolean; message: string }> {
    try {
      let imageURL = formState.imageURL;

      // Upload file if provided
      if (file) {
        const uploadResult = await this.uploadFile(file);
        if (uploadResult.success && uploadResult.url) {
          imageURL = uploadResult.url;
        } else {
          return { success: false, message: uploadResult.message || 'File upload failed' };
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
  }

  // Delete project via API
  static async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) {
        return { success: true, message: "Project deleted successfully!" };
      } else {
        return { success: false, message: "Failed to delete project." };
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      return { success: false, message: "An error occurred while deleting the project." };
    }
  }
}
