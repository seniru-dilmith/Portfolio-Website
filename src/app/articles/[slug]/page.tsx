import type { Metadata } from 'next';
// Force re-compile
import { notFound } from 'next/navigation';
import ArticleDetailClient from '@/components/articles/ArticleContent';
import { getArticleByIdOrSlug } from '@/controllers/articleController';
import { Article } from '@/types/Article';

type Props = {
    params: Promise<{ slug: string }>;
};

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const articleFn = await getArticleByIdOrSlug(slug);
        if (!articleFn) return null;

        // Serialize Mongoose document to plain JSON
        return JSON.parse(JSON.stringify(articleFn));
    } catch (error) {
        console.error("Error fetching article:", error);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

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

import { redirect } from 'next/navigation';

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    // Redirect if accessing via ID and slug exists
    if (article.slug && slug === article._id && article.slug !== slug) {
        redirect(`/articles/${article.slug}`);
    }

    return <ArticleDetailClient initialArticle={article} />;
}
