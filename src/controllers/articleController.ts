import ArticleModel from '@/models/ArticleModel';
import dbConnect from '@/util/dbConnect';
import { Article } from '@/types/Article';

export const getArticles = async () => {
    await dbConnect();
    return ArticleModel.find().sort({ createdAt: -1 });
};

export const getArticleById = async (id: string) => {
    await dbConnect();
    return ArticleModel.findById(id);
};

export const createArticle = async (articleData: Partial<Article>) => {
    await dbConnect();
    return ArticleModel.create(articleData);
};

export const updateArticle = async (id: string, articleData: Partial<Article>) => {
    await dbConnect();
    return ArticleModel.findByIdAndUpdate(id, articleData, { new: true, runValidators: true });
};

export const deleteArticle = async (id: string) => {
    await dbConnect();
    return ArticleModel.findByIdAndDelete(id);
};
