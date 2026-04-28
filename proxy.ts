import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define your matchers
const isProtectedRoute = createRouteMatcher(["/history(.*)", "/setting", "/"]);
const isPublicAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 2. Protect private routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 3. Redirect signed-in users away from Auth pages (Sign-in/Sign-up)
  if (isPublicAuthRoute(req) && userId) {
    // Construct the URL for the redirect
    const historyUrl = new URL("/history", req.url);
    return NextResponse.redirect(historyUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
