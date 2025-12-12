import { Dispatch, SetStateAction } from 'react';

export interface Article {
    _id: string;
    title: string;
    content: string;
    summary?: string;
    tags: string[];
    author: string;
    createdAt: string | Date;
    images?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
}

export interface ArticleListProps {
    articles: Article[];
    onEdit: (article: Article) => void;
    onDelete: (id: string) => void;
}

export interface ArticleFormProps {
    formState: { title: string; content: string; summary: string; tags: string[]; author: string; createdAt: string; seoTitle: string; seoDescription: string; seoKeywords: string; };
    setFormState: Dispatch<SetStateAction<{ title: string; content: string; summary: string; tags: string[]; author: string; createdAt: string; seoTitle: string; seoDescription: string; seoKeywords: string; }>>;
    onSubmit: () => void;
}
