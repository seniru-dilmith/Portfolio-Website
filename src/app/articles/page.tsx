"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, FileText, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast"; // Fixed import
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { apiFetch } from "@/lib/api";
import { Article } from "@/types/Article"; // Ensure this type matches your API response

// Placeholder for missing hero if needed, but we'll use a simple header for now
// import HeroForArticles from '@/components/articles/HeroForArticles'; 

export default function ArticlesPage() {
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchArticles() {
        try {
            setLoading(true);
            const res = await apiFetch("/api/articles");
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                // Articles are already processed/stripped by the API
                setArticles(data.data);
            } else {
                // Fallback or empty if structure differs
                setArticles([]);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to load articles." });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            const res = await apiFetch(`/api/articles?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setArticles((prev) => prev.filter((a) => a._id !== id));
                toast({ title: "Deleted", description: "Article deleted successfully." });
            } else {
                throw new Error("Failed to delete");
            }
        } catch {
            toast({ variant: "destructive", title: "Error", description: "Could not delete article." });
        }
    }

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-background pt-24 pb-12">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4" data-testid="hero-for-articles">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Articles & Thoughts</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Insights on web development, system design, and my journey in tech.
                        </p>
                    </div>
                    {isAuthenticated && (
                        <Button onClick={() => router.push("/articles/new")} className="gap-2">
                            <Plus className="h-4 w-4" /> New Article
                        </Button>
                    )}
                </div>

                <LoadingIndicator show={loading} text="Loading articles..." />

                {!loading && articles.length === 0 && (
                    <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No articles yet</h3>
                        <p className="text-muted-foreground">Check back soon for new content!</p>
                    </div>
                )}

                {!loading && articles.length > 0 && (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        data-testid="article-list"
                    >
                        {articles.map((article) => (
                            <motion.div key={article._id} variants={item}>
                                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2 leading-tight">
                                            <Link href={`/articles/${article._id}`} className="hover:text-primary transition-colors">
                                                {article.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-2">
                                            {/* Assuming we might have a date, if not, omit or use mock */}
                                            {/* <Calendar className="h-3 w-3" /> {format(new Date(article.createdAt), 'MMM d, yyyy')} */}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-muted-foreground text-sm line-clamp-3">
                                            {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {article.tags.slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                                                    <Tag className="h-3 w-3 mr-1" /> {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t pt-4">
                                        <Button variant="ghost" className="text-sm p-0 h-auto" asChild>
                                            <Link href={`/articles/${article._id}`}>Read More &rarr;</Link>
                                        </Button>
                                        {isAuthenticated && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => router.push(`/articles/${article._id}?edit=true`)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDelete(article._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
