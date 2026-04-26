import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const PUBLIC_ROUTES = ["/", "/login"];

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Next internals
    if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // 2. Auth routes
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // 3. Public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await auth();

    // 4. Not logged in
    if (!session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const role = session.user?.role;

    // 5. Admin protection
    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ 6. Allow onboarding
    if (pathname.startsWith("/partner/onboarding")) {
        return NextResponse.next();
    }

    // ✅ 7. Protect partner routes
    if (pathname.startsWith("/partner") && role !== "partner") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.*\\.).*)'],
};