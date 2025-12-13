import { Schema, model, models } from 'mongoose';
import { Article } from '@/types/Article';

const ArticleSchema = new Schema<Article>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, unique: true },
    summary: { type: String },
    tags: { type: [String], required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true },
    images: { type: [String], default: [] },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
});

// Prevent Mongoose overlapping model definition error in Next.js dev mode
// Use a new model name to force schema refresh in dev environment
export default models.Article_v2 || model<Article>('Article_v2', ArticleSchema, 'articles');
