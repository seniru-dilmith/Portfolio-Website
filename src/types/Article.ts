export interface Article {
    _id: string;
    title: string;
    content: string;
    tags: string[];
}

export interface ArticleListProps {
    articles: Article[];
    onEdit: (article: Article) => void;
    onDelete: (id: string) => void;
}
