export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubURL: string;
  imageURL: string;
  createdAt: string;
}

export interface ProjectFormState {
  title: string;
  description: string;
  technologies: string;
  githubURL: string;
  imageURL: string;
}

export interface ProjectFormProps {
  formState: {
    title: string;
    description: string;
    technologies: string;
    githubURL: string;
    imageURL: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      technologies: string;
      githubURL: string;
      imageURL: string;
    }>
  >;
  handleAddOrUpdate: (e: React.FormEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingProjectId: string | null;
  resetForm: () => void;
}

export interface ProjectListProps {
  projects: Project[];
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  isAuthenticated: boolean;
}
