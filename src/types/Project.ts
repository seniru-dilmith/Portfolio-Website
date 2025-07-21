import { Dispatch, SetStateAction } from "react";

// New interface for a single link
export interface ProjectLink {
  name: string;
  url: string;
}

// The main Project data structure from the database
export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  imageURLs: string[]; // Changed from imageURL
  createdAt: Date;
}

// The state for the project form
export interface ProjectFormState {
  title: string;
  description: string;
  technologies: string;
  links: ProjectLink[];
  imageURLs: string[];
}

// The props for the ProjectForm component
export interface ProjectFormProps {
  formState: ProjectFormState;
  setFormState: Dispatch<SetStateAction<ProjectFormState>>;
  handleAddOrUpdate: (e: React.FormEvent) => void;
  editingProjectId: string | null;
  resetForm: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newFiles: File[];
  removeNewFile: (index: number) => void;
  removeExistingImage: (index: number) => void;
  isUploading: boolean;
  handleLinkChange: (index: number, field: keyof ProjectLink, value: string) => void;
  addLinkField: () => void;
  removeLinkField: (index: number) => void;
}

// The props for the ProjectList component
export interface ProjectListProps {
  projects: Project[];
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  isAuthenticated: boolean;
}
