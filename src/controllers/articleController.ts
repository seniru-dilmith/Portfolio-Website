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
        let slug = generateSlug(articleData.title);
        // Ensure uniqueness
        let exists = await ArticleModel.findOne({ slug });
        let counter = 1;
        while (exists) {
            slug = `${generateSlug(articleData.title)}-${counter}`;
            exists = await ArticleModel.findOne({ slug });
            counter++;
        }
        articleData.slug = slug;
    } else if (articleData.slug) {
        // Validation if slug is explicitly provided
         let exists = await ArticleModel.findOne({ slug: articleData.slug });
         if (exists) {
             throw new Error("Slug already exists");
         }
    }
    return ArticleModel.create(articleData);
};

export const updateArticle = async (id: string, articleData: Partial<Article>) => {
    await dbConnect();

    // Check collision if updating slug specifically
    if (articleData.slug) {
        const exists = await ArticleModel.findOne({ slug: articleData.slug, _id: { $ne: id } });
        if (exists) {
             throw new Error("Slug already exists");
        }
    }
    
    // Auto-generate if title changes AND slug is missing/empty? 
    // Usually we don't want to change slug on title change to avoid breaking links.
    // But if it's explicitly requested:
    // If title changed and we wanted to sync slug, we'd need that logic here.
    // For now, adhering to: Only update slug if explicit or if it was missing (handeled migration).

    return ArticleModel.findByIdAndUpdate(id, articleData, { new: true, runValidators: true });
};

export const deleteArticle = async (id: string) => {
    await dbConnect();
    return ArticleModel.findByIdAndDelete(id);
};
