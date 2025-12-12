'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArticleFormProps } from '@/types/Article';
import { MDXEditorMethods } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Dynamically import the editor with SSR turned off.
const ForwardRefEditor = dynamic(
    () => import('@/components/editor/ForwardRefEditor').then(mod => mod.ForwardRefEditor),
    { ssr: false }
);

interface ArticleFormPropsWithId extends ArticleFormProps {
    articleId?: string;
}

const ArticleForm: React.FC<ArticleFormPropsWithId> = ({ formState, setFormState, onSubmit, articleId }) => {
    const editorRef = useRef<MDXEditorMethods>(null);

    return (
        <motion.form
            className="space-y-6 w-full max-w-3xl mx-auto"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    placeholder="Enter article title..."
                    value={formState.title}
                    onChange={(e) =>
                        setFormState((prev) => ({
                            ...prev,
                            title: e.target.value,
                        }))
                    }
                    required
                    className="text-lg"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">Summary (Displayed in Article List)</Label>
                <textarea
                    id="summary"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief summary of the article (50-150 characters)..."
                    value={formState.summary}
                    minLength={50}
                    maxLength={150}
                    onChange={(e) =>
                        setFormState((prev) => ({
                            ...prev,
                            summary: e.target.value,
                        }))
                    }
                />
                <p className="text-xs text-muted-foreground text-right">
                    {formState.summary.length}/150 (Min: 50)
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                        id="author"
                        placeholder="Author Name"
                        value={formState.author}
                        onChange={(e) =>
                            setFormState((prev) => ({
                                ...prev,
                                author: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Publish Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formState.createdAt}
                        onChange={(e) =>
                            setFormState((prev) => ({
                                ...prev,
                                createdAt: e.target.value,
                            }))
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Content {articleId ? '(Drag & Drop images supported)' : '(Save to enable image uploads)'}</Label>
                <div className="min-h-[400px] border rounded-md bg-background">
                    <ForwardRefEditor
                        ref={editorRef}
                        markdown={formState.content}
                        onChange={(newContent) =>
                            setFormState((prev) => ({
                                ...prev,
                                content: newContent,
                            }))
                        }
                        articleId={articleId}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                    id="tags"
                    placeholder="react, nextjs, design (comma separated)"
                    value={formState.tags.join(', ')}
                    onChange={(e) =>
                        setFormState((prev) => ({
                            ...prev,
                            tags: e.target.value.split(',').map((tag) => tag.trim()),
                        }))
                    }
                />
            </div>

            <div className="space-y-4 border p-4 rounded-md">
                <h3 className="text-lg font-medium">SEO Settings</h3>
                <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                        id="seoTitle"
                        placeholder="Meta Title"
                        value={formState.seoTitle}
                        onChange={(e) =>
                            setFormState((prev) => ({
                                ...prev,
                                seoTitle: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <textarea
                        id="seoDescription"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Meta Description"
                        value={formState.seoDescription}
                        onChange={(e) =>
                            setFormState((prev) => ({
                                ...prev,
                                seoDescription: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seoKeywords">SEO Keywords</Label>
                    <Input
                        id="seoKeywords"
                        placeholder="keyword1, keyword2, keyword3"
                        value={formState.seoKeywords}
                        onChange={(e) =>
                            setFormState((prev) => ({
                                ...prev,
                                seoKeywords: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
                Publish Article
            </Button>
        </motion.form>
    );
};

export default ArticleForm;
