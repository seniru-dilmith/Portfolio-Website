import React from 'react';
import { motion } from 'framer-motion';
import { ArticleListProps } from '@/types/Article';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ArticleList: React.FC<ArticleListProps> = ({ articles, onEdit, onDelete }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {articles.map((article) => {
                return (
                    <motion.div
                        key={article._id}
                        className="card bg-base-100 shadow-lg hover:shadow-xl border border-gray-200 rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        {/* Card Header */}
                        <div className="card-header bg-accent text-accent-content px-4 py-2 font-semibold text-lg truncate">
                            {article.title}
                        </div>
                        {/* Card Body */}
                        <div className="card-body p-4 bg-neutral">
                            <p className="text-neutral-content text-sm h-16 line-clamp-3"> {/* Using a fixed height for a uniform look */}
                                {article.summary || "No summary available."}
                            </p>

                            {/* Read More Button */}
                            <div className="mt-4">
                                <motion.button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => router.push(`/articles/${article._id}`)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Read More
                                </motion.button>
                            </div>
                        </div>

                        {/* Card Actions */}
                        {isAuthenticated && (
                            <div className="card-actions flex justify-end space-x-2 p-4 bg-neutral">
                                <button
                                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                                    onClick={() => onEdit(article)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => onDelete(article._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default ArticleList;
