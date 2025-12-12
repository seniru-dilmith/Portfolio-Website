"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, FileText, Tag, Calendar, User, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { apiFetch } from "@/lib/api";
import { Article } from "@/types/Article";

import ArticleHero from "@/components/articles/ArticleHero";
import ArticleSearch from "@/components/articles/ArticleSearch";

export default function ArticlesPage() {
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const res = await apiFetch("/api/articles");
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setArticles(data.data);
                } else {
                    setArticles([]);
                }
            } catch (error) {
                console.error("Failed to fetch articles:", error);
                toast({ variant: "destructive", title: "Error", description: "Failed to load articles." });
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [toast]);

    const filteredArticles = useMemo(() => {
        if (!searchQuery) return articles;

        const terms = searchQuery.toLowerCase().split(' ').filter(t => t.length > 0);

        return articles.filter(article => {
            const title = article.title.toLowerCase();
            const summary = (article.summary || "").toLowerCase();
            const tags = article.tags.map(t => t.toLowerCase()).join(" ");

            // Check if ALL terms match at least one field (AND logic for terms)
            return terms.every(term =>
                title.includes(term) ||
                summary.includes(term) ||
                tags.includes(term)
            );
        });
    }, [articles, searchQuery]);

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
        <div className="bg-background min-h-screen pb-20">
            {/* Hero Section */}
            <ArticleHero />

            <div className="container px-4 mx-auto -mt-10 relative z-20">
                {/* Search and Actions Bar */}
                <Card className="p-4 mb-12 border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="w-full md:w-1/3">
                            <ArticleSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        </div>

                        {isAuthenticated && (
                            <Button onClick={() => router.push("/articles/new")} className="gap-2 w-full md:w-auto shadow-md">
                                <Plus className="h-4 w-4" /> Write Article
                            </Button>
                        )}
                    </div>
                </Card>

                <LoadingIndicator show={loading} text="Loading thought stream..." />

                {!loading && filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-muted/30 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No articles found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery ? "Try adjusting your search terms" : "Check back soon for new content!"}
                        </p>
                    </div>
                )}

                {!loading && filteredArticles.length > 0 && (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        data-testid="article-list"
                    >
                        {filteredArticles.map((article) => {
                            return (
                                <motion.div
                                    key={article._id}
                                    variants={item}
                                >
                                    <Link href={`/articles/${article._id}`} className="group block h-full">
                                        <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl group-hover:-translate-y-1">

                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start gap-4 mb-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {article.tags.slice(0, 3).map(tag => (
                                                            <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/50 group-hover:bg-secondary transition-colors">
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <CardTitle className="leading-tight group-hover:text-primary transition-colors text-xl">
                                                    {article.title}
                                                </CardTitle>

                                                <CardDescription className="flex items-center gap-3 text-sm mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>{new Date(article.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3.5 w-3.5" />
                                                        <span>{article.author}</span>
                                                    </div>
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="flex-1">
                                                <p className="text-muted-foreground text-sm line-clamp-3">
                                                    {article.summary || article.content.replace(/<[^>]*>/g, '').substring(0, 150) + "..."}
                                                </p>
                                            </CardContent>

                                            <CardFooter className="pt-0 pb-6 flex justify-between items-center text-primary font-medium text-sm">
                                                <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read Article <ArrowRight className="h-4 w-4" />
                                                </span>

                                                {isAuthenticated && (
                                                    <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                router.push(`/articles/${article._id}?edit=true`);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDelete(article._id);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
