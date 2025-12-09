export interface WorkRequest {
  id: string;
  name: string;
  email: string;
  title: string;
  description: string;
  status: 'pending' | 'replied' | 'ignored';
  createdAt: Date; // Depending on where it's used (Server/Client)
  repliedAt?: Date;
}
