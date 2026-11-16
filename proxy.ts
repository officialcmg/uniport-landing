import { auth } from "@/lib/auth/server";

// Sends signed-out visitors to the sign-in page. It only runs for the
// dashboard: the landing page and docs are public and never touch auth. Each
// dashboard page and action also checks the session itself.
export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
