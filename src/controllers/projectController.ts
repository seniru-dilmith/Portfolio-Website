import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Project, ProjectFormState } from '@/types/Project';

export const fetchProjects = async (): Promise<{ projects: Project[]; error: string | null }> => {
    try {
        const res = await fetch('/api/projects');
        const data = await res.json();

        if (data.success) {
            return { projects: data.data, error: null };
        } else {
            return { projects: [], error: 'Failed to fetch projects.' };
        }
    } catch (err) {
        console.error('Error fetching projects:', err);
        return { projects: [], error: 'Failed to fetch projects.' };
    }
};

export const addOrUpdateProject = async (
    formState: ProjectFormState,
    file: File | null,
    editingProjectId: string | null,
    token: string
): Promise<{ success: boolean; message: string }> => {
    try {
        let imageURL = formState.imageURL;

        // Handle file upload
        if (file) {
            const storageRef = ref(storage, `project-images/${file.name}`);
            await uploadBytes(storageRef, file);
            imageURL = await getDownloadURL(storageRef);
        }

        const res = await fetch(`/api/projects${editingProjectId ? `/${editingProjectId}` : ''}`, {
            method: editingProjectId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formState,
                imageURL,
                technologies: formState.technologies.split(',').map((tech: string) => tech.trim()),
            }),
        });

        const data = await res.json();

        if (data.success) {
            return { success: true, message: `Project ${editingProjectId ? 'updated' : 'added'} successfully!` };
        } else {
            return { success: false, message: `Failed to ${editingProjectId ? 'update' : 'add'} project.` };
        }
    } catch (err) {
        console.error('Error adding/updating project:', err);
        return { success: false, message: 'An error occurred while adding/updating the project.' };
    }
};

export const deleteProject = async (id: string, token: string): Promise<{ success: boolean; message: string }> => {
    try {
        const res = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.success) {
            return { success: true, message: 'Project deleted successfully!' };
        } else {
            return { success: false, message: 'Failed to delete project.' };
        }
    } catch (err) {
        console.error('Error deleting project:', err);
        return { success: false, message: 'An error occurred while deleting the project.' };
    }
};
