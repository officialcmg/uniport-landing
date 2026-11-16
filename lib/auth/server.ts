import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";

// Sign-in for the dashboard, handled by Neon's managed auth. Users and sessions
// live in the neon_auth schema of the same database as the apps and payments.
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

/** The signed-in user, or null. Check this in every page and action that touches data. */
export async function currentUser(): Promise<{ id: string; email: string } | null> {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  return user ? { id: user.id, email: user.email } : null;
}
