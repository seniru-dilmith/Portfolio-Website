'use client';

import { motion } from 'framer-motion';
import { ArticleFormProps } from '@/types/Article';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Dynamically import the editor with SSR turned off.
const ForwardRefEditor = dynamic(
    () => import('@/components/editor/ForwardRefEditor').then(mod => mod.ForwardRefEditor),
    { ssr: false }
);

const ArticleForm: React.FC<ArticleFormProps> = ({ formState, setFormState, onSubmit }) => {
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
                <Label>Content</Label>
                <div className="min-h-[400px] border rounded-md overflow-hidden bg-background">
                    <ForwardRefEditor
                        markdown={formState.content}
                        onChange={(newContent) =>
                            setFormState((prev) => ({
                                ...prev,
                                content: newContent,
                            }))
                        }
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

            <Button type="submit" size="lg" className="w-full">
                Publish Article
            </Button>
        </motion.form>
    );
};

export default ArticleForm;
