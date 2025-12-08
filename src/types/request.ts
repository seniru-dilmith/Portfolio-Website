export interface WorkRequest {
  id: string;
  email: string;
  title: string;
  description: string;
  status: 'pending' | 'replied' | 'ignored';
  createdAt: FirebaseFirestore.Timestamp | Date; // Depending on where it's used (Server/Client)
  repliedAt?: FirebaseFirestore.Timestamp | Date;
}
