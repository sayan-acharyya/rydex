import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const PUBLIC_ROUTES = ["/", "/login"]; // add login if you have one

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ 1. Always allow Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // ✅ 2. Always allow auth routes (VERY IMPORTANT)
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // ✅ 3. Allow public pages
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    // ✅ 4. Get session correctly
    const session = await auth();

    // ✅ 5. If not logged in → redirect to home/login
    if (!session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const role = session.user?.role;

    // ✅ 6. Role-based protection
    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/partner") && role !== "partner") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ 7. Let everything else pass
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.*\\.).*)'],
};



//7:57:10