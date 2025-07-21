import { Schema, Document, model, models } from "mongoose";

// structure for a single link
const LinkSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });
interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  links: { name: string; url: string; }[];
  imageURLs: string[];
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  links: { type: [LinkSchema], default: [] },
  imageURLs: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default models.Project || model<IProject>('Project', ProjectSchema);