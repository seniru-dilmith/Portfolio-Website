"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from "date-fns";
import { ArrowLeft, Edit, Save, X, Tag, Calendar, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from "@/lib/api";
import { Article } from '@/types/Article';
import { Separator } from '@/components/ui/separator';

export default function ArticleDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Omit<Article, '_id'>>({
        title: '',
        content: '',
        tags: [],
    });

    useEffect(() => {
        if (id) fetchArticle(id as string);
    }, [id]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('edit') === 'true' && article) {
            setIsEditing(true);
            setFormData({
                title: article.title,
                content: article.content,
                tags: article.tags,
            });
        }
    }, [article]);

    async function fetchArticle(articleId: string) {
        try {
            setLoading(true);
            const res = await apiFetch(`/api/articles/${articleId}`);
            const data = await res.json();
            if (data.success) {
                setArticle(data.data);
            } else {
                toast({ variant: "destructive", title: "Error", description: "Article not found" });
                router.push('/articles');
            }
        } catch (error) {
            console.error("Failed to fetch article", error);
            toast({ variant: "destructive", title: "Error", description: "Could not load article" });
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!article) return;
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
                router.replace(`/articles/${article._id}`); // Clear edit param
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update article." });
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
    }

    if (!article) return null;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container max-w-4xl px-4 mx-auto">
                <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" onClick={() => router.push('/articles')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                </Button>

                {isEditing ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="text-xl font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content (Markdown supported)</label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="min-h-[400px] font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags (comma separated)</label>
                            <Input
                                value={formData.tags.join(', ')}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2"><X className="h-4 w-4" /> Cancel</Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="mb-8 text-center md:text-left space-y-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{article.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                {/* Mock Metadata for now as API might not return it yet, or use createdAt if available */}
                                <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>Today</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <User className="h-4 w-4" />
                                    <span>Seniru Dilmith</span>
                                </div>
                                {article.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="rounded-full px-3">{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        {isAuthenticated && (
                            <div className="mb-8 flex justify-end">
                                <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                                    <Edit className="h-4 w-4" /> Edit Article
                                </Button>
                            </div>
                        )}

                        <Separator className="my-8" />

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {article.content}
                            </ReactMarkdown>
                        </div>
                    </motion.article>
                )}
            </div>
        </div>
    );
}
