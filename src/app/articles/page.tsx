"use client";
import React, { useState, useEffect } from 'react';
import { Article } from '@/types/Article';
import Footer from '@/components/footer/Footer';
import ArticleForm from '@/components/articles/ArticleForm';
import ArticleList from '@/components/articles/ArticleList';
import Head from 'next/head';
import { motion } from 'framer-motion';
import SmallLoadingSpinner from '@/util/SmallLoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import HeroForArticles from '@/components/articles/HeroForArticles';
import { useRouter } from 'next/navigation';
import { apiFetch } from "@/lib/api";

const Articles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [formState, setFormState] = useState<Omit<Article, '_id'>>({
        title: '',
        content: '',
        tags: [],
    });
    const [showForm, setShowForm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        const fetchArticles = async () => {
            setLoading(true);
            setArticles([]);
            const res = await apiFetch('/api/articles');
            const data = await res.json();
            if (data.success) {
                for (const article of data.data as Article[]) {
                    if (cancelled) break;
                    setArticles((prev) => [...prev, article]);
                    await new Promise((resolve) => setTimeout(resolve, 50));
                }
            }
            if (!cancelled) setLoading(false);
        };

        fetchArticles();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSubmit = async () => {
        const method = 'POST';
        const url = '/api/articles';

        const res = await apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState),
        });

        const data = await res.json();
        if (data.success) {
            setArticles((prev) => [...prev, data.data]);
            resetForm();
            setShowForm(false); // Hide form after submission
        }
    };

    const handleDelete = async (id: string) => {
        const res = await apiFetch(`/api/articles?id=${id}`, { method: 'DELETE' });
        if (res.ok) setArticles((prev) => prev.filter((a) => a._id !== id));
    };

    const handleEdit = (article: Article) => {
        router.push(`/articles/${article._id}?edit=true`);
    };

    const resetForm = () => {
        setFormState({ title: '', content: '', tags: [] });
    };

    return (
        <>
            <Head>
                <title>Articles</title>
                <meta name="description" content="Articles written by Seniru Dilmith" />
            </Head>
            <div className="bg-gradient-to-br from-primary via-secondary to-accent min-h-screen">
                <div className="mx-auto py-8">
                    <HeroForArticles />
                    {isAuthenticated && (
                        <div className="flex justify-center mt-8">
                            <motion.button
                                className="btn btn-primary"
                                onClick={() => setShowForm((prev) => !prev)}
                                whileHover={{ scale: 1.1, backgroundColor: '#ff5722' }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {showForm ? 'Hide Form' : 'Create New Article'}
                            </motion.button>
                        </div>
                    )}
                    {showForm && isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -50, height: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="mt-8 overflow-hidden"
                        >
                            <h2 className="text-3xl font-bold text-center text-white mb-6">Create New Article</h2>
                            <ArticleForm
                                formState={formState}
                                setFormState={setFormState}
                                onSubmit={handleSubmit}
                            />
                        </motion.div>
                    )}
                    <ArticleList
                        articles={articles}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    {loading && <SmallLoadingSpinner />}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Articles;
