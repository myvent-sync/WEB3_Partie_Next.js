"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ChevronLeft, ChevronRight, User, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
    { href: "/speaker/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
];

export default function SpeakerSidebar({ fullName, email }: { fullName: string; email: string }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside className={`${collapsed ? "w-16" : "w-56"} transition-all duration-300 border-r border-border bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex flex-col min-h-screen`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-border">
                {!collapsed && (
                    <Link href="/" className="text-lg font-bold text-foreground">MyVent</Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto p-1.5 rounded-lg hover:bg-primary-soft/50 text-muted-foreground hover:text-primary transition-colors"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 p-3 flex-1">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                active
                                    ? "bg-primary text-white"
                                    : "text-muted-foreground hover:bg-primary-soft/50 hover:text-primary"
                            }`}
                        >
                            <Icon size={17} className="shrink-0" />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-border flex flex-col gap-2">
                {/* Profil */}
                <Link
                    href="/speaker/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-soft/50 transition-colors group"
                >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User size={14} className="text-primary" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-foreground truncate">{fullName}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{email}</p>
                        </div>
                    )}
                </Link>

                {/* Theme toggle */}
                <div className={`${collapsed ? "flex justify-center" : ""}`}>
                    <ThemeToggle />
                </div>

                {/* Déconnexion */}
                <form action="/api/auth/signout" method="post">
                    <button
                        type="submit"
                        className={`flex items-center gap-3 px-3 py-2 w-full text-sm text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors ${collapsed ? "justify-center" : ""}`}
                    >
                        <LogOut size={15} className="shrink-0" />
                        {!collapsed && <span>Déconnexion</span>}
                    </button>
                </form>
            </div>
        </aside>
    );
}