import { Schema, model, models } from 'mongoose';
import { Article } from '@/types/Article';

const ArticleSchema = new Schema<Article>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    tags: { type: [String], required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true },
    images: { type: [String], default: [] },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
});

export default models.Article || model<Article>('Article', ArticleSchema);
