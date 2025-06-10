"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <Frown className="w-24 h-24 text-primary" />
        <h1 className="text-6xl font-extrabold text-primary">404</h1>
        <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}