import { Dispatch, SetStateAction } from 'react';

export interface Article {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    author: string;
    createdAt: string | Date;
}

export interface ArticleListProps {
    articles: Article[];
    onEdit: (article: Article) => void;
    onDelete: (id: string) => void;
}

export interface ArticleFormProps {
    formState: { title: string; content: string; tags: string[]; author: string; createdAt: string };
    setFormState: Dispatch<SetStateAction<{ title: string; content: string; tags: string[]; author: string; createdAt: string }>>;
    onSubmit: () => void;
}
