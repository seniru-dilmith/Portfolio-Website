"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut",
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PrivacyContent() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 px-4 sm:px-8 md:px-16 py-12 pt-32">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl mx-auto space-y-8"
            >
                <div>
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4 drop-shadow-sm"
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-center text-muted-foreground text-lg">
                        Your privacy is important to us.
                    </motion.p>
                </div>

                <Card className="border-border/50 shadow-xl bg-background/60 backdrop-blur-md">
                    <CardHeader>
                        <h2 className="text-2xl font-bold tracking-tight">Introduction</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="leading-relaxed">
                            At Seniru Dilmith, we are committed to protecting your personal information and your right to privacy.
                            This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-xl bg-background/60 backdrop-blur-md">
                    <CardHeader>
                        <h2 className="text-2xl font-bold tracking-tight">Information We Collect</h2>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-foreground">Personal Information</h3>
                            <p className="text-muted-foreground">
                                We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services,
                                when you participate in activities on the Website (such as by posting messages in our online forums or entering competitions, contests or giveaways)
                                or otherwise when you contact us.
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-foreground">Usage Data</h3>
                            <p className="text-muted-foreground">
                                We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity
                                (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics,
                                operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website and other technical information.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-xl bg-background/60 backdrop-blur-md">
                    <CardHeader>
                        <h2 className="text-2xl font-bold tracking-tight">How We Use Your Information</h2>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>To provide and maintain our Service.</li>
                            <li>To notify you about changes to our Service.</li>
                            <li>To allow you to participate in interactive features of our Service.</li>
                            <li>To provide customer support.</li>
                            <li>To gather analysis or valuable information so that we can improve our Service.</li>
                            <li>To monitor the usage of our Service.</li>
                            <li>To detect, prevent and address technical issues.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-xl bg-background/60 backdrop-blur-md">
                    <CardHeader>
                        <h2 className="text-2xl font-bold tracking-tight">Contact Us</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            If you have questions or comments about this policy, you may email us at{" "}
                            <a href="mailto:dilmithseniru@gmail.com" className="text-primary hover:underline font-medium">
                                dilmithseniru@gmail.com
                            </a>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
