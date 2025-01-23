import { Schema, model, models } from 'mongoose';
import { Article } from '@/types/Article';

const ArticleSchema = new Schema<Article>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], required: true },
});

export default models.Article || model<Article>('Article', ArticleSchema);
