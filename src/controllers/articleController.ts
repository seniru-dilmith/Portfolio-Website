import ArticleModel from '@/models/ArticleModel';
import dbConnect from '@/util/dbConnect';
import { Article } from '@/types/Article';

import { generateSlug } from '@/util/slug';

export const getArticles = async () => {
    await dbConnect();
    return ArticleModel.find().sort({ createdAt: -1 });
};

export const getArticleById = async (id: string) => {
    await dbConnect();
    return ArticleModel.findById(id);
};

export const getArticleBySlug = async (slug: string) => {
    await dbConnect();
    return ArticleModel.findOne({ slug });
};

export const getArticleByIdOrSlug = async (idOrSlug: string) => {
    await dbConnect();
    // Check if it's a valid ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    if (isObjectId) {
        const article = await ArticleModel.findById(idOrSlug);
        if (article) return article;
    }
    return ArticleModel.findOne({ slug: idOrSlug });
};

export const createArticle = async (articleData: Partial<Article>) => {
    await dbConnect();
    if (articleData.title && !articleData.slug) {
        articleData.slug = generateSlug(articleData.title);
    }
    return ArticleModel.create(articleData);
};

export const updateArticle = async (id: string, articleData: Partial<Article>) => {
    await dbConnect();
    
    // If updating title but no slug provided, check if we need to generate one
    // Only do this if we really want to enforce slugs. 
    // To handle the case where an article has no slug yet (migration pending), 
    // we can check if it exists or just rely on migration.
    // Ideally, the frontend form should send the slug.
    
    // Self-healing: if title is present and no slug, let's try to generate one IF the doc doesn't have one?
    // That requires a fetch. Let's keep it simple: simpler migration is better.
    
    if (articleData.title && !articleData.slug) {
         // We could auto-generate, but let's stick to the migration script for bulk fix.
         // However, let's add it here for single-edit fix via API if needed in future.
         // For now, I'll rely on the migration I'm about to run.
    }

    return ArticleModel.findByIdAndUpdate(id, articleData, { new: true, runValidators: true });
};

export const deleteArticle = async (id: string) => {
    await dbConnect();
    return ArticleModel.findByIdAndDelete(id);
};
