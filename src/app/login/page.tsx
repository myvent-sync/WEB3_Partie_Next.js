"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Radio, MessageCircle, Calendar, Settings, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/events";
    const errorParam = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(errorParam === "unauthorized" ? "Accès refusé — droits insuffisants" : "");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signIn("credentials", { email, password, redirect: false });
            if (result?.error) setError("Email ou mot de passe incorrect");
            else { router.push(callbackUrl); router.refresh(); }
        } finally { setLoading(false); }
    }

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 sm:px-6 py-8">
            {/* Bouton Retour à l'accueil — fixe en haut à gauche */}
            <Link
                href="/"
                className="fixed top-5 left-5 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-primary/10 border border-border rounded-full px-5 h-12 items-center gap-2 transition-all duration-200 shadow-lg flex"
                title="Retour à l'accueil"
            >
                <ArrowLeft size={14} className="text-primary" />
                <span className="text-sm font-mono font-bold text-primary">Accueil</span>
            </Link>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

                {/* Colonne gauche — cachée sur mobile */}
                <div className="hidden md:block text-left fade-up space-y-6">
                    <div className="flex justify-start gap-2">
                        <span className="badge-live"><span className="live-dot" />Live</span>
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground/40 self-center">Q&A · Planning</span>
                    </div>
                    <h2 className="text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                        L&apos;événementiel<br />
                        <span className="text-primary">mérite mieux.</span>
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                        Suivez les sessions, posez vos questions et vibrez en temps réel avec les autres participants.
                    </p>
                    <div className="flex justify-start gap-8 pt-2">
                        {([
                            [Radio, "Sessions live"],
                            [MessageCircle, "Q&A temps réel"],
                            [Calendar, "Planning"],
                        ] as const).map(([Icon, label]) => (
                            <div key={label} className="flex flex-col items-center gap-1.5">
                                <Icon size={18} className="text-primary/70" />
                                <span className="text-[10px] font-mono text-foreground/40 tracking-wide">{label}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs font-mono text-foreground/30">© 2026 MyVent</p>
                </div>

                {/* Colonne droite — formulaire */}
                <div className="fade-up-1 w-full">
                    {/* Logo visible uniquement sur mobile */}
                    <div className="flex md:hidden justify-center mb-6">
                        <span className="text-2xl font-extrabold text-foreground">MyVent</span>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">Bon retour</h1>
                        <p className="text-sm text-muted-foreground">Connectez-vous pour retrouver vos événements.</p>
                    </div>

                    <div className="glass-card p-6 sm:p-8 space-y-5">
                        <div>
                            <label className="label">Adresse e-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="vous@exemple.com"
                                required
                                autoComplete="email"
                                className="input"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="label mb-0">Mot de passe</label>
                                <a href="#" className="text-[10px] font-mono text-primary hover:underline tracking-wide">Oublié ?</a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="input"
                            />
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                                <p className="text-xs text-destructive font-mono">⚠ {error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !email || !password}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
                        >
                            {loading
                                ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Connexion...</>
                                : "Se connecter →"
                            }
                        </button>

                        <p className="text-center text-xs text-muted-foreground pt-1">
                            Pas encore de compte ?{" "}
                            <Link href="/signup" className="text-primary font-semibold hover:underline">Créer un compte</Link>
                        </p>
                    </div>
                </div>
            </div>

            <Link
                href="http://localhost:3001/admin/login"
                className="hidden sm:flex fixed bottom-5 right-5 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-primary/10 border border-border rounded-full px-5 h-12 items-center gap-2 transition-all duration-200 shadow-lg"
                title="Accès admin"
            >
                <Settings size={14} className="text-primary" />
                <span className="text-sm font-mono font-bold text-primary">Admin Access</span>
            </Link>
        </div>
    );
}