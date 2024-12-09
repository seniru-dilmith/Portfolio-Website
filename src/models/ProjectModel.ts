import mongoose, { Schema, Document, model, models} from "mongoose";

interface IProject extends Document {
    title: string;
    description: string;
    technologies: string[];
    githubURL: string;
    createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required:true },
    technologies: { type: [String], required: true},
    githubURL: { type: String, required:true },
    createdAt: { type: Date, default: Date.now },
});

export default models.Project || model<IProject>('Project', ProjectSchema);