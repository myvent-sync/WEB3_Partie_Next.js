import Link from "next/link";
import { Event } from "@/types";
import { MapPin, Calendar, LayoutList } from "lucide-react";

async function getEvents(): Promise<Event[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
}

function isEventLive(sessions: Event["sessions"]): boolean {
    const now = new Date();
    return sessions.some(s => new Date(s.startTime) <= now && new Date(s.endTime) >= now);
}

function formatDateRange(start: string, end: string) {
    const s = new Date(start), e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth())
        return `${s.getDate()} – ${e.toLocaleDateString("fr-FR", { ...opts, year: "numeric" })}`;
    return `${s.toLocaleDateString("fr-FR", opts)} – ${e.toLocaleDateString("fr-FR", { ...opts, year: "numeric" })}`;
}

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            {/* Header */}
            <div className="mb-10 sm:mb-16 fade-up">
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-3">Plateforme événementielle</p>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-none">Événements</h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                    Suivez les sessions en direct, posez vos questions et naviguez dans le planning en temps réel.
                </p>
            </div>

            {events.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-12 sm:p-20 text-center fade-up-1">
                    <p className="text-xs font-mono text-muted-foreground">Aucun événement disponible pour le moment</p>
                </div>
            ) : (
                <div className="fade-up-1">
                    {/* Header tableau — desktop uniquement */}
                    <div className="hidden md:grid grid-cols-[1fr_180px_160px_80px] gap-6 px-5 pb-3 border-b border-border">
                        {["Événement", "Lieu", "Dates", "Sessions"].map(h => (
                            <span key={h} className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground">{h}</span>
                        ))}
                    </div>

                    {/* Liste desktop */}
                    <div className="hidden md:block divide-y divide-border">
                        {events.map(event => {
                            const live = isEventLive(event.sessions);
                            return (
                                <Link key={event.id} href={`/events/${event.id}`}>
                                    <div className="grid grid-cols-[1fr_180px_160px_80px] gap-6 px-5 py-5 hover:bg-primary-soft/20 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {live && <span className="badge-live shrink-0"><span className="live-dot" />Live</span>}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{event.title}</p>
                                                {event.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{event.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm text-foreground/70 truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xs font-mono text-muted-foreground">{formatDateRange(event.startDate, event.endDate)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-2xl font-bold text-foreground">{event.sessions.length}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Liste mobile — cards */}
                    <div className="md:hidden flex flex-col gap-3">
                        {events.map(event => {
                            const live = isEventLive(event.sessions);
                            return (
                                <Link key={event.id} href={`/events/${event.id}`}>
                                    <div className="glass-card p-4 group cursor-pointer">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="min-w-0">
                                                {live && <span className="badge-live mb-2 inline-flex"><span className="live-dot" />Live</span>}
                                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{event.title}</p>
                                                {event.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{event.description}</p>}
                                            </div>
                                            <span className="text-foreground/30 group-hover:text-primary transition-colors shrink-0">→</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={11} />
                                                {event.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} />
                                                {formatDateRange(event.startDate, event.endDate)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <LayoutList size={11} />
                                                {event.sessions.length} session{event.sessions.length > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}