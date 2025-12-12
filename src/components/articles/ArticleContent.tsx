"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Calendar, User, LayoutList } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from "@/lib/api";
import { Article } from '@/types/Article';
import { Separator } from '@/components/ui/separator';
import ArticleForm from '@/components/articles/ArticleForm';
import { CustomImageRenderer, CustomParagraphRenderer } from './markdownRenderers';

interface ArticleDetailClientProps {
    initialArticle: Article;
}

export default function ArticleDetailClient({ initialArticle }: ArticleDetailClientProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();

    const [article, setArticle] = useState<Article>(initialArticle);
    const [isEditing, setIsEditing] = useState(false);

    // Initialize form data from the passed article
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        summary: string;
        tags: string[];
        author: string;
        createdAt: string;
        seoTitle: string;
        seoDescription: string;
        seoKeywords: string;
    }>({
        title: article.title,
        content: article.content,
        summary: article.summary || '',
        tags: article.tags,
        author: article.author,
        createdAt: new Date(article.createdAt).toISOString().split('T')[0],
        seoTitle: article.seoTitle || '',
        seoDescription: article.seoDescription || '',
        seoKeywords: article.seoKeywords || '',
    });

    // Update form data if article changes (e.g. after save)
    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                content: article.content,
                summary: article.summary || '',
                tags: article.tags,
                author: article.author,
                createdAt: new Date(article.createdAt).toISOString().split('T')[0],
                seoTitle: article.seoTitle || '',
                seoDescription: article.seoDescription || '',
                seoKeywords: article.seoKeywords || '',
            });
        }
    }, [article]);

    async function handleSave() {
        try {
            const res = await apiFetch(`/api/articles?id=${article._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setArticle(data.data);
                setIsEditing(false);
                toast({ title: "Success", description: "Article updated successfully." });
                router.refresh(); // Refresh server components to update metadata if needed
            } else {
                throw new Error("Update failed");
            }
        } catch {
            toast({ variant: "destructive", title: "Error", description: "Failed to update article." });
        }
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container max-w-4xl px-4 mx-auto">
                <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" onClick={() => router.push('/articles')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                </Button>

                {isEditing ? (
                    <ArticleForm
                        formState={formData}
                        setFormState={setFormData}
                        onSubmit={handleSave}
                        articleId={article._id}
                    />
                ) : (
                    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-foreground">
                        <div className="mb-8 text-center md:text-left space-y-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">{article.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(article.createdAt).toLocaleDateString('en-GB')}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <User className="h-4 w-4" />
                                    <span>{article.author}</span>
                                </div>
                                {article.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="rounded-full px-3">{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        {isAuthenticated && (
                            <div className="mb-8 flex justify-end">
                                <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                                    Edit Article
                                </Button>
                            </div>
                        )}

                        <Separator className="my-8" />

                        {/* Note: Summary is NOT displayed here as per requirements */}

                        <div className="rendered-article-content prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    img: CustomImageRenderer,
                                    p: CustomParagraphRenderer
                                }}
                            >
                                {article.content}
                            </ReactMarkdown>
                        </div>
                    </motion.article>
                )}
            </div>
        </div>
    );
}
