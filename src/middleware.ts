import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // Extract the session token from the request
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    const userId = token.id as string;

    // Fetch user data from the API route
    const res = await fetch(`${request.nextUrl.origin}/api/get-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
        console.log('Failed to fetch user:', await res.text());
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const user = await res.json();

    if (request.nextUrl.pathname.includes("/dashboard") && !user.onboarded && user.subscriptions.some((s) => s.status === "ACTIVE")) {
        return Response.redirect(new URL('/onboarding', request.nextUrl))
    }
    if (request.nextUrl.pathname === '/onboarding' && user.onboarded) {
        return Response.redirect(new URL('/dashboard/home', request.nextUrl))
    }
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Expose-Headers", "");
    response.headers.set("Access-Control-Max-Age", (60 * 60 * 24 * 30).toString() ?? "");

    return response;
}

export const config = {
    matcher: ["/api/editor/:path*", '/dashboard/:path*', '/onboarding'],
};