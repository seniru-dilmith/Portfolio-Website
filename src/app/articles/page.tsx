"use client";
import React, { useState, useEffect } from 'react';
import { Article } from '@/types/Article';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ArticleForm from '@/components/articles/ArticleForm';
import ArticleList from '@/components/articles/ArticleList';
import Head from 'next/head';
import { motion } from 'framer-motion';
import SmallLoadingSpinner from '@/util/SmallLoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import HeroForArticles from '@/components/articles/HeroForArticles';

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [formState, setFormState] = useState<Omit<Article, '_id'>>({
    title: '',
    content: '',
    tags: [],
  });
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setArticles([]);
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) {
        for (const article of data.data as Article[]) {
          setArticles((prev) => [...prev, article]);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const handleSubmit = async () => {
    const method = editingArticleId ? 'PUT' : 'POST';
    const url = editingArticleId ? `/api/articles?id=${editingArticleId}` : '/api/articles';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });

    const data = await res.json();
    if (data.success) {
      setArticles((prev) =>
        editingArticleId ? prev.map((a) => (a._id === data.data._id ? data.data : a)) : [...prev, data.data]
      );
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
    if (res.ok) setArticles((prev) => prev.filter((a) => a._id !== id));
  };

  const handleEdit = (article: Article) => {
    setFormState({ title: article.title, content: article.content, tags: article.tags });
    setEditingArticleId(article._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormState({ title: '', content: '', tags: [] });
    setEditingArticleId(null);
  };

  return (
    <>
      <Head>
        <title>Articles</title>
        <meta name="description" content="Articles written by Seniru Dilmith" />
      </Head>
      <div className="bg-gradient-to-br from-primary via-secondary to-accent">
        <Navbar />
        <div className="container mx-auto py-8">
          <HeroForArticles />
          {isAuthenticated && (
            <div className="flex justify-center mt-8">
              <motion.button
                className="btn btn-primary"
                onClick={() => setShowForm((prev) => !prev)}
                whileHover={{ scale: 1.1, backgroundColor: '#ff5722' }}
                whileTap={{ scale: 0.9 }}
              >
                {showForm ? 'Hide Form' : 'View Form'}
              </motion.button>
            </div>
          )}
          {showForm && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="mt-8"
            >
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
