import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Anything matched here requires the user to be signed in. Everything else
 * (landing page, /pricing, /api/*, static files) is public.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/review(.*)",
  "/github(.*)",
  "/analytics(.*)",
  "/team(.*)",
  "/billing(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Skip Next.js internals and all static files, unless found in search params:
     * - `_next/`
     * - common assets (svg, png, jpg, webp, ico, txt, xml, woff, etc.)
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|ttf|woff2?|map|txt|xml)).*)",
    "/(api|trpc)(.*)",
  ],
};
