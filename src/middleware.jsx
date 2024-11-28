import { NextResponse } from "next/server";
import auth from "./auth";

export default async function middleware(request) {
    const user = await auth.getUser();
    
    // If user is not logged in, redirect to login
    if (!user) {
        request.cookies.delete("session");
        const response = NextResponse.redirect(new URL("/login", request.url));
        return response;
    }

    // Check if the user is the admin
    if (user.email === 'erdenebatbayar3@gmail.com') {
        // If accessing any admin routes, let through
        // You can specify which routes are for admin access if needed
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            console.log("Admin access granted");
            return NextResponse.next();
        } else {
            // If admin tries to access regular routes, you can redirect or just allow
            console.log("Admin accessing regular route");
            return NextResponse.next();
        }
    } else {
        // Non-admin users: if they try to access admin routes, redirect
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            console.log("Non-admin access denied, redirecting to home");
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    console.log("Middleware ran");
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*'], // Apply middleware to both main and admin routes
};
