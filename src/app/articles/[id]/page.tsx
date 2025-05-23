import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Article } from '@/types/Article';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const ArticleDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles/${id}`);
                const data = await res.json();
                if (data.success) {
                    setArticle(data.data);
                } else {
                    setError('Failed to fetch the article');
                }
            } catch {
                setError('An error occurred while fetching the article.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    return (
        <div className="bg-gradient-to-br from-primary via-secondary to-accent min-h-screen">
            <Navbar />
            <div className="container mx-auto py-8">
                {loading ? (
                    <div className="p-8 text-center animate-pulse text-gray-500">Loading article...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (
                    article && (
                        <div className="p-8 bg-base-100/90 rounded-lg shadow-lg">
                            <h1 className="text-4xl font-bold text-primary-content">{article.title}</h1>
                            <p className="text-lg text-gray-700 mt-4">{article.content}</p>
                            <div className="flex mt-4 space-x-2">
                                {article.tags.map((tag, idx) => (
                                    <span key={idx} className="badge badge-accent">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ArticleDetailsPage;
