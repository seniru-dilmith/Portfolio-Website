"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(20, "Description must be at least 20 characters."),
});

export default function WorkWithMePage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            title: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/work-with-me", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Something went wrong.");

            setSuccess(true);
            toast({
                title: "Request Sent!",
                description: "I've received your request and sent you a confirmation email.",
            });
            form.reset();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send request.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (success) {
        return (
            <div className="container mx-auto min-h-[80vh] flex items-center justify-center pt-24">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-6 p-8 rounded-2xl bg-secondary/10 border border-border max-w-lg"
                >
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-20 w-20 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Request Received!</h1>
                    <p className="text-muted-foreground text-lg">
                        Thanks for reaching out. I&apos;ve sent a confirmation email to <strong>{form.getValues("email")}</strong>.
                        I&apos;ll review your project details and get back to you soon!
                    </p>
                    <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">
                        Send Another Request
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-32 pb-24 px-4">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            >
                {/* Left Column: Form */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Let&apos;s Build Something Amazing</h1>
                        <p className="text-muted-foreground text-lg">
                            Have a project in mind? Fill out the details below, and I&apos;ll get back to you regarding availability and feasibility.
                        </p>
                    </div>

                    <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                            <CardDescription>Tell me a bit about what you need.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="you@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Project Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. E-commerce Platform Redesign" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Timeline & Requirements</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell me about your idea, timeline, and requirements..."
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full text-lg h-12" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Submit Request"
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        By submitting this form, you agree to our{" "}
                                        <a href="/privacy" className="underline hover:text-primary transition-colors">
                                            Privacy Policy
                                        </a>
                                        .
                                    </p>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Image */}
                <div className="hidden lg:block relative h-[800px] w-full rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src="/work.jpg"
                        alt="Workspace"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 z-10">
                        <blockquote className="text-2xl font-semibold italic text-foreground/90">
                            &quot;Great design is not just what it looks like and feels like. Design is how it works.&quot;
                        </blockquote>
                        <cite className="block mt-4 text-muted-foreground not-italic">— Steve Jobs</cite>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
