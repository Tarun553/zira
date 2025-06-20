import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  const { pathname } = req.nextUrl;

  // If user is not signed in and trying to access a protected route
  if (!userId && protectedRoutes(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is signed in but doesn't have an org and is not on the onboarding page
  if (userId && !orgId && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Allow the request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|_vercel|.*\\..*).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};