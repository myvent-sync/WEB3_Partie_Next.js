import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;
                // Ces routes sont publiques, pas besoin d'être connecté
                if (
                    path.startsWith("/events") ||
                    path.startsWith("/sessions") ||
                    path.startsWith("/speakers") ||
                    path === "/"
                ) {
                    return true;
                }
                // Les autres routes nécessitent d'être connecté
                return !!token;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: [
        "/",
        "/events/:path*",
        "/sessions/:path*",
        "/speakers/:path*",
        "/favorites/:path*",
        "/speaker/:path*",
        "/admin/((?!login).*)",
    ],
};