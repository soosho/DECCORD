import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/pricing",
  "/documentation",
  "/api/webhooks/ccpayments"
];

const authPaths = [
  "/(auth)/sign-in",
  "/(auth)/sign-up",
  "/(auth)/sign-out",
];

export default authMiddleware({
  beforeAuth: (req) => {
    // Allow webhook requests before auth check
    if (req.nextUrl.pathname.startsWith('/api/webhooks/')) {
      return NextResponse.next();
    }
    return null;
  },
  publicRoutes: publicPaths,
  ignoredRoutes: ["/api/webhooks/(.*)"],
  afterAuth(auth, req) {
    const { userId } = auth;
    const { pathname } = req.nextUrl;

    // Handle auth paths
    const isAuthPath = authPaths.some(path => pathname.startsWith(path));
    if (isAuthPath) {
      if (userId) {
        // If user is signed in and tries to access auth pages, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Protected routes
    if (!userId) {
      const signInUrl = new URL("/(auth)/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
