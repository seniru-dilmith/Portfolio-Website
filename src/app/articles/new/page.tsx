"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleForm from "@/components/articles/ArticleForm";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

export default function NewArticlePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();

    const [formState, setFormState] = useState({
        title: "",
        content: "",
        summary: "",
        tags: [] as string[],
        author: "",
        createdAt: new Date().toISOString().split('T')[0], // Default to today
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
    });

    // Protect route
    useEffect(() => {
        // A simple check, mostly client-side UX. Server API should also protect.
        const timer = setTimeout(() => {
            if (!isAuthenticated) router.push("/articles");
        }, 1000);
        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    const handleSubmit = async () => {
        try {
            const res = await apiFetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });

            const data = await res.json();
            if (data.success) {
                toast({ title: "Published", description: "Article created successfully." });
                router.push('/articles');
            } else {
                throw new Error(data.message || "Failed to create");
            }
        } catch {
            toast({ variant: "destructive", title: "Error", description: "Failed to create article." });
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container max-w-4xl px-4 mx-auto">
                <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" onClick={() => router.push('/articles')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                </Button>

                <h1 className="text-3xl font-bold mb-8">Create New Article</h1>

                <ArticleForm
                    formState={formState}
                    setFormState={setFormState}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
