import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Providers from "@/components/Providers";
import NavUser from "@/components/NavUser";
import SessionConditionalLink from "@/components/SessionConditionalLink";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
    title: "MyVent",
    description: "Plateforme de gestion d'événements en temps réel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Providers>
            <header className="sticky top-0 z-50 border-b border-border bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link
                        href="/"
                        className="font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors"
                    >
                        MyVent
                    </Link>
                    <nav className="flex items-center gap-6">
                        <SessionConditionalLink />
                        <ThemeToggle />
                        <NavUser />
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border mt-32 py-8 bg-white/40 dark:bg-gray-900/40">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <span className="text-xs font-mono text-foreground/50">MyVent © 2026</span>
                    <span className="text-xs font-mono text-foreground/50">Plateforme événementielle</span>
                </div>
            </footer>
        </Providers>
        </ThemeProvider>
        </body>
        </html>
    );
}