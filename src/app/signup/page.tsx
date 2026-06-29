"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Radio, MessageCircle, Calendar } from "lucide-react";

type Role = "user" | "speaker";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [role, setRole] = useState<Role>((searchParams.get("role") as Role) || "user");
    const [form, setForm] = useState({ email: "", password: "", name: "", fullName: "", bio: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function update(field: string, value: string) { setForm(prev => ({ ...prev, [field]: value })); }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (form.password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); return; }

        setLoading(true);
        try {
            const endpoint = role === "user" ? "/api/auth/signup/user" : "/api/auth/signup/speaker";
            const body = role === "user"
                ? { email: form.email, password: form.password, name: form.name }
                : { email: form.email, password: form.password, fullName: form.fullName, bio: form.bio };

            const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Une erreur s'est produite"); return; }

            const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
            if (result?.error) router.push("/login");
            else { router.push("/events"); router.refresh(); }
        } finally { setLoading(false); }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

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

                {/* Colonne droite */}
                <div className="fade-up-1 w-full">
                    {/* Logo mobile uniquement */}
                    <div className="flex md:hidden justify-center mb-6">
                        <span className="text-2xl font-extrabold text-foreground">MyVent</span>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">Créer votre compte</h1>
                        <p className="text-sm text-muted-foreground">Rejoignez MyVent et profitez des événements en direct.</p>
                    </div>

                    {/* Toggle rôle */}
                    <div className="flex bg-secondary border border-border rounded-xl p-1 mb-5">
                        {(["user", "speaker"] as Role[]).map(r => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === r ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {r === "user" ? "Participant" : "Intervenant"}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {role === "user" && (
                                <div>
                                    <label className="label">Prénom</label>
                                    <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Camille" required className="input" />
                                </div>
                            )}
                            {role === "speaker" && (
                                <>
                                    <div>
                                        <label className="label">Nom complet *</label>
                                        <input type="text" value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Camille Dupont" required className="input" />
                                    </div>
                                    <div>
                                        <label className="label">Bio courte</label>
                                        <textarea value={form.bio} onChange={e => update("bio", e.target.value)} placeholder="Designer chez..." rows={3} className="input resize-none" />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="label">Adresse e-mail</label>
                                <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="vous@exemple.com" required autoComplete="email" className="input" />
                            </div>
                            <div>
                                <label className="label">Mot de passe</label>
                                <input type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Au moins 6 caractères" required autoComplete="new-password" className="input" />
                            </div>
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                                    <p className="text-xs text-destructive font-mono">⚠ {error}</p>
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                                {loading
                                    ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Création...</>
                                    : "Créer mon compte →"
                                }
                            </button>
                        </form>
                    </div>

                    <p className="mt-5 text-center text-sm text-muted-foreground">
                        Déjà inscrit ?{" "}
                        <Link href="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}