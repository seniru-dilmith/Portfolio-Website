import React from 'react';
import { motion } from 'framer-motion';
import { ArticleListProps } from '@/types/Article';

const ArticleList: React.FC<ArticleListProps> = ({ articles, onEdit, onDelete }) => {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {articles.map((article) => (
                <motion.div
                    key={article._id}
                    className="card shadow-lg hover:shadow-xl transition m-4"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="card-body">
                        <h3 className="card-title text-primary">{article.title}</h3>
                        <p className="text-gray-600 line-clamp-3">{article.content}</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-sm btn-outline" onClick={() => onEdit(article)}>
                                Edit
                            </button>
                            <button className="btn btn-sm btn-outline text-red-500" onClick={() => onDelete(article._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ArticleList;
