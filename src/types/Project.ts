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
