import { motion } from 'framer-motion';
import { ArticleFormProps } from '@/types/Article';

const ArticleForm: React.FC<ArticleFormProps> = ({ formState, setFormState, onSubmit }) => {
    return (
        <motion.form
            className="space-y-4  items-center flex flex-col"
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
                className="input input-bordered w-3/4"
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

            {/* Content Textarea */}
            <textarea
                className="textarea textarea-bordered w-3/4"
                placeholder="Content"
                value={formState.content}
                onChange={(e) =>
                    setFormState((prev) => ({
                        ...prev,
                        content: e.target.value,
                    }))
                }
                required
            />

            {/* Tags Input */}
            <input
                type="text"
                className="input input-bordered w-3/4"
                placeholder="Tags (comma-separated)"
                value={formState.tags.join(', ')}
                onChange={(e) =>
                    setFormState((prev) => ({
                        ...prev,
                        tags: e.target.value.split(',').map((tag) => tag.trim()),
                    }))
                }
            />

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-1/4">
                Submit
            </button>
        </motion.form>
    );
};

export default ArticleForm;
