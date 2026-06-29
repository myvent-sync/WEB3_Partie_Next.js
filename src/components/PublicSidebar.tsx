"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Star, ChevronLeft, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const iconMap: Record<string, React.ElementType> = {
    "/events": Calendar,
    "/favorites": Star,
};

export default function PublicSidebar({
    navItems,
}: {
    navItems: { label: string; href: string }[];
}) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            <aside className={`
                ${collapsed ? "w-16" : "w-56"}
                transition-all duration-300
                border-r border-border
                bg-white/60 dark:bg-gray-900/60
                backdrop-blur-sm
                flex flex-col
                min-h-screen
                shrink-0
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-border">
                    {!collapsed && (
                        <Link href="/" className="text-lg font-bold text-foreground">
                            MyVent
                        </Link>
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
                    {navItems.map((item) => {
                        const Icon = iconMap[item.href] ?? Calendar;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    active
                                        ? "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-primary-soft/50 hover:text-primary"
                                }`}
                            >
                                <Icon size={17} className="shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-border">
                    <div className={`${collapsed ? "flex justify-center" : ""}`}>
                        <ThemeToggle />
                    </div>
                </div>
            </aside>
        </>
    );
}