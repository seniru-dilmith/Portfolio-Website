import type { Metadata } from 'next';
// Force re-compile
import { notFound } from 'next/navigation';
import ArticleDetailClient from '@/components/articles/ArticleContent';
import { getArticleById } from '@/controllers/articleController';
import { Article } from '@/types/Article';

type Props = {
    params: Promise<{ id: string }>;
};

async function getArticle(id: string): Promise<Article | null> {
    try {
        const articleFn = await getArticleById(id);
        if (!articleFn) return null;

        // Serialize Mongoose document to plain JSON
        return JSON.parse(JSON.stringify(articleFn));
    } catch (error) {
        console.error("Error fetching article:", error);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.summary || `Read ${article.title}`,
        keywords: article.seoKeywords ? article.seoKeywords.split(',').map(k => k.trim()) : article.tags,
        openGraph: {
            title: article.seoTitle || article.title,
            description: article.seoDescription || article.summary || `Read ${article.title}`,
            type: 'article',
            publishedTime: new Date(article.createdAt).toISOString(),
            authors: [article.author],
            tags: article.tags,
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    return <ArticleDetailClient initialArticle={article} />;
}
