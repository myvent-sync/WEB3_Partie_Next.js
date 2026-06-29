import Link from "next/link";
import { Speaker } from "@/types";

async function getSpeakers(): Promise<Speaker[]> {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/speakers`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
}

export default async function SpeakersPage() {
    const speakers = await getSpeakers();

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            {/* En-tête */}
            <div className="mb-10 sm:mb-16 fade-up">
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-3">Annuaire</p>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-none">
                    Intervenants
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                    Découvrez tous les intervenants et leurs sessions.
                </p>
            </div>

            {speakers.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-12 sm:p-20 text-center fade-up-1">
                    <p className="text-xs font-mono text-muted-foreground">Aucun intervenant pour le moment</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-up-1">
                    {speakers.map((speaker) => (
                        <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
                            <div className="glass-card p-6 group cursor-pointer transition-all hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shrink-0">
                                        {speaker.photo ? (
                                            <img
                                                src={speaker.photo}
                                                alt={speaker.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            speaker.fullName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                            {speaker.fullName}
                                        </h3>
                                        {speaker.bio && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                {speaker.bio}
                                            </p>
                                        )}
                                        <p className="text-xs text-foreground/40 mt-1">
                                            {speaker.sessions?.length ?? 0} session{(speaker.sessions?.length ?? 0) > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}