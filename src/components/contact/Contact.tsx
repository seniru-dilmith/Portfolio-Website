"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaYoutube, FaTiktok } from "react-icons/fa";

function Contact() {
  return (
    <section className="py-12 px-4 container mx-auto mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:dilmithseniru@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">dilmithseniru@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+94714625671" className="text-muted-foreground hover:text-primary transition-colors">+94 71 462 5671</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">Horana, Sri Lanka</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >
          <Card className="flex-1 flex flex-col justify-center text-center p-6">
            <h3 className="text-xl font-bold mb-6">Connect with Me</h3>
            <div className="flex justify-center gap-4 mb-8">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" asChild>
                <a href="https://www.youtube.com/channel/UCRmiVlt8wLBN3GSY5uZScgg" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="h-6 w-6 text-red-600" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" asChild>
                <a href="https://www.tiktok.com/@seniru.dilmith" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="h-6 w-6" />
                </a>
              </Button>
            </div>
            <Button size="lg" className="w-full" asChild>
              <a href="mailto:dilmithseniru@gmail.com">Send an Email</a>
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
