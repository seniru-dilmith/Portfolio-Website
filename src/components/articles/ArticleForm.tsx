'use client'; // This must now be a client component

import { motion } from 'framer-motion';
import { ArticleFormProps } from '@/types/Article';
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import the editor with SSR turned off.
// This is the correct pattern.
const ForwardRefEditor = dynamic(
    () => import('@/components/editor/ForwardRefEditor').then(mod => mod.ForwardRefEditor),
    { ssr: false }
);

const ArticleForm: React.FC<ArticleFormProps> = ({ formState, setFormState, onSubmit }) => {
    return (
        <motion.form
            className="space-y-6 items-center flex flex-col"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Title Input */}
            <input
                type="text"
                className="input input-bordered w-full max-w-3xl"
                placeholder="Title"
                value={formState.title}
                onChange={(e) =>
                    setFormState((prev) => ({
                        ...prev,
                        title: e.target.value,
                    }))
                }
                required
            />

            {/* MDX Editor for Content */}
            <div className="w-full max-w-3xl bg-base-200 rounded-lg p-1 border border-base-300 shadow-inner">
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

            {/* Tags Input */}
            <input
                type="text"
                className="input input-bordered w-full max-w-3xl"
                placeholder="Tags (comma-separated)"
                value={formState.tags.join(', ')}
                onChange={(e) =>
                    setFormState((prev) => ({
                        ...prev,
                        tags: e.target.value.split(',').map((tag) => tag.trim()),
                    }))
                }
            />
        </motion.form>
    );
};

export default ArticleForm;
