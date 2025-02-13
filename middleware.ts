import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

// Update application URLs to match Clerk's expected paths
const APP_URLS = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
} as const;

// Update auth route matchers to match new paths
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

// Rest of your public routes remain the same
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/documentation',
  '/api/webhooks/(.*)',
  '/account(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Handle webhook requests
    if (req.nextUrl.pathname.startsWith('/api/webhooks/')) {
      return NextResponse.next();
    }

    // Handle auth routes with updated paths
    if (isAuthRoute(req)) {
      const session = await auth();
      if (session?.userId) {
        return NextResponse.redirect(new URL(APP_URLS.dashboard, req.url));
      }
      return NextResponse.next();
    }

    // Protect all non-public routes
    if (!isPublicRoute(req)) {
      try {
        await auth.protect();
      } catch (error) {
        // Simplified redirect without redirect_url parameter
        return NextResponse.redirect(new URL(APP_URLS.signIn, req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    if ((error as any).clerk_digest?.includes('CLERK_PROTECT_REDIRECT_TO_SIGN_IN')) {
      // Simplified redirect without redirect_url parameter
      return NextResponse.redirect(new URL(APP_URLS.signIn, req.url));
    }
    return NextResponse.error();
  }
}, { 
  debug: false
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
