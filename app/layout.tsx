import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import {dark} from "@clerk/themes"
import {BGPattern} from "@/components/bg-pattern"
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "zira",
  description: "Project Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider appearance={{
        baseTheme: dark,
        elements: {
          rootBox: {
            backgroundColor: "#111827",
          },
         variables: {
          colorPrimary: "#111827",
          colorPrimaryText: "#111827",
          colorBackground: "#111827",
          colorInputBackground: "#111827",
          colorInputText: "#111827",
         }
        },
      }}>

      <body
        className={`${inter.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* header */}
          <Header />
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <BGPattern className="pointer-events-none" variant="dots" mask="fade-edges" size={24} fill="#252525" />
            {children}
          </main>
          {/* footer */}
          <footer className="w-full justify-center items-center">
            <div className="container mx-auto px-4 py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                &copy; {new Date().getFullYear()} zira. All rights reserved.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
      </ClerkProvider>
    </html>
  );
}
