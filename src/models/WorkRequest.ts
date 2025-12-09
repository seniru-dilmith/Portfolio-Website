import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkRequest extends Document {
  name: string;
  email: string;
  title: string;
  description: string;
  status: 'pending' | 'replied';
  createdAt: Date;
}

const WorkRequestSchema: Schema<IWorkRequest> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'replied'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation error in Next.js hot reload
if (mongoose.models.WorkRequest) {
  delete mongoose.models.WorkRequest;
}

const WorkRequest: Model<IWorkRequest> = mongoose.model<IWorkRequest>('WorkRequest', WorkRequestSchema);

export default WorkRequest;
