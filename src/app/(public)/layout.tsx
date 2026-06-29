import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PublicSidebar from "@/components/PublicSidebar";

const baseNavItems = [
    { label: "Événements", href: "/events" },
];

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const showFavorites = session?.user?.role === "user";

    const navItems = showFavorites
        ? [...baseNavItems, { label: "Favoris", href: "/favorites" }]
        : baseNavItems;

    return (
        <div className="flex min-h-screen">
            <PublicSidebar navItems={navItems} />
            <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
    );
}