import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SpeakerSidebar from "@/components/SpeakerSidebar";

export default async function SpeakerLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "speaker") redirect("/login?error=unauthorized");

    const speaker = await prisma.speaker.findUnique({
        where: { email: session.user.email! },
        select: { fullName: true, email: true },
    });

    return (
        <div className="flex min-h-screen">
            <SpeakerSidebar
                fullName={speaker?.fullName ?? "Intervenant"}
                email={speaker?.email ?? ""}
            />
            <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
    );
}