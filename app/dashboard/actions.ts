"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@/lib/auth/server";
import {
  createApp,
  deleteApp,
  getApp,
  renameApp,
  rotateAppId,
  setAllowedWebsites,
  setRecipients,
} from "@/lib/dashboard/apps";
import { parseAllowedOrigins, parseRecipients } from "@/lib/dashboard/origins";

export type FormState = { error?: string; saved?: boolean };

const GONE = "That app no longer exists.";

async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in");
  return user;
}

function appName(form: FormData): string {
  const name = String(form.get("name") ?? "").trim();
  if (!name) throw new Error("Give the app a name.");
  if (name.length > 60) throw new Error("Keep the name under 60 characters.");
  return name;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

/** The app name sits in the top bar and the app header, which are layouts, so refresh those too. */
function refreshDashboard() {
  revalidatePath("/dashboard", "layout");
}

export async function createAppAction(_previous: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  let id: string;
  try {
    id = await createApp(user.id, appName(form), parseAllowedOrigins(String(form.get("origins") ?? "")));
  } catch (error) {
    return { error: message(error) };
  }
  refreshDashboard();
  redirect(`/dashboard/apps/${id}`);
}

export async function renameAppAction(_previous: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  try {
    const saved = await renameApp(user.id, String(form.get("id") ?? ""), appName(form));
    if (!saved) return { error: GONE };
  } catch (error) {
    return { error: message(error) };
  }
  refreshDashboard();
  return { saved: true };
}

export async function updateWebsitesAction(_previous: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  try {
    const saved = await setAllowedWebsites(
      user.id,
      String(form.get("id") ?? ""),
      parseAllowedOrigins(String(form.get("origins") ?? "")),
      form.get("allowLocalhost") === "on",
    );
    if (!saved) return { error: GONE };
  } catch (error) {
    return { error: message(error) };
  }
  refreshDashboard();
  return { saved: true };
}

export async function updateRecipientsAction(_previous: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  try {
    const saved = await setRecipients(
      user.id,
      String(form.get("id") ?? ""),
      parseRecipients(String(form.get("recipients") ?? "")),
    );
    if (!saved) return { error: GONE };
  } catch (error) {
    return { error: message(error) };
  }
  refreshDashboard();
  return { saved: true };
}

export async function rotateAppIdAction(_previous: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  try {
    const publicId = await rotateAppId(user.id, String(form.get("id") ?? ""));
    if (!publicId) return { error: GONE };
  } catch (error) {
    return { error: message(error) };
  }
  refreshDashboard();
  return { saved: true };
}

export async function deleteAppAction(_previous: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = String(form.get("id") ?? "");
  try {
    const app = await getApp(user.id, id);
    if (!app) return { error: GONE };
    // The browser checks this too; the check here is the one that counts.
    if (String(form.get("confirm") ?? "").trim() !== app.name) {
      return { error: `Type "${app.name}" to confirm.` };
    }
    await deleteApp(user.id, id);
  } catch (error) {
    return { error: message(error) };
  }
  refreshDashboard();
  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  await auth.signOut();
  redirect("/");
}
