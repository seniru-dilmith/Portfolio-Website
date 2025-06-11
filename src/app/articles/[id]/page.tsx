"use client";
import React, { useState, useEffect } from 'react';
import { Article } from '@/types/Article';
import Footer from '@/components/footer/Footer';
import ArticleForm from '@/components/articles/ArticleForm';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

const ArticleDetail = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formState, setFormState] = useState<Omit<Article, '_id'>>({
    title: '',
    content: '',
    tags: [],
  });
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = params.id as string;

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setArticle(data.data);
        } else {
          setError(data.message || 'Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Check for edit parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('edit') === 'true' && article) {
      setFormState({
        title: article.title,
        content: article.content,
        tags: article.tags,
      });
      setIsEditing(true);
      // Remove the edit parameter from URL after entering edit mode
      router.replace(`/articles/${id}`);
    }
  }, [article, id, router]);

  const handleEdit = () => {
    if (article) {
      setFormState({
        title: article.title,
        content: article.content,
        tags: article.tags,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!article) return;

    try {
      const res = await fetch(`/api/articles?id=${article._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (data.success) {
        setArticle(data.data);
        setIsEditing(false);
      } else {
        setError('Failed to update article');
      }
    } catch (err) {
      setError('Failed to update article');
      console.error('Error updating article:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormState({
      title: '',
      content: '',
      tags: [],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-xl text-white mb-8">{error}</p>
            <motion.button
              className="btn btn-primary"
              onClick={() => router.push('/articles')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Articles
            </motion.button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.content.substring(0, 160)} />
        <meta name="keywords" content={article.tags.join(', ')} />
      </Head>
      
      <div className="bg-gradient-to-br from-primary via-secondary to-accent min-h-screen">
        <div className="container mx-auto py-8 px-4">
          {/* Back Button */}
          <motion.button
            className="btn btn-secondary mb-6"
            onClick={() => router.push('/articles')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            ← Back to Articles
          </motion.button>

          {/* Article Content */}
          <motion.article
            className="bg-base-100 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Article Header */}
            <div className="bg-accent text-accent-content px-8 py-6">
              <div className="flex justify-between items-start mb-4">
                <motion.h1
                  className="text-4xl font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {article.title}
                </motion.h1>
                
                {/* Edit Button - Only show if authenticated */}
                {isAuthenticated && (
                  <motion.button
                    className="btn btn-sm btn-primary"
                    onClick={handleEdit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Edit Article
                  </motion.button>
                )}
              </div>
              
              {/* Tags */}
              {article.tags.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge badge-secondary badge-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Article Body */}
            <motion.div
              className="px-8 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {isEditing ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-base-content mb-4">Edit Article</h2>
                  <ArticleForm
                    formState={formState}
                    setFormState={setFormState}
                    onSubmit={handleSave}
                  />
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-base-content leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.article>

          {/* Navigation */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              className="btn btn-primary btn-lg"
              onClick={() => router.push('/articles')}
              whileHover={{ scale: 1.05, backgroundColor: '#ff5722' }}
              whileTap={{ scale: 0.95 }}
            >
              Explore More Articles
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ArticleDetail;
