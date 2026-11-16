import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getApp } from "@/lib/dashboard/apps";

/** The signed-in user; sends everyone else to sign in. Cached for the request. */
export const requireUser = cache(async () => {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in");
  return user;
});

/**
 * The signed-in user and one of their apps; 404 if the app is not theirs.
 * Cached for the request, so the app layout and its page share one lookup.
 * Layouts do not re-run on navigation, so every page calls this itself.
 */
export const requireApp = cache(async (appId: string) => {
  const user = await requireUser();
  const app = await getApp(user.id, appId);
  if (!app) notFound();
  return { user, app };
});
