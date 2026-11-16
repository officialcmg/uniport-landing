import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { Lockup } from "@/components/site/site-header";
import { SignInForm } from "@/components/dashboard/sign-in-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function SignInPage() {
  if (await currentUser()) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" aria-label="Uniport home" className="mb-8 inline-block">
          <Lockup height={22} />
        </Link>
        <div className="rounded-xl border border-line-100 bg-surface-200 p-6">
          <h1 className="text-lg font-medium text-ink-100">Sign in to your dashboard</h1>
          <p className="mt-1 mb-6 text-sm text-ink-200">
            Create an App ID and see your payments. New here? Signing in creates your account.
          </p>
          <SignInForm github={process.env.GITHUB_SIGN_IN === "on"} />
        </div>
      </div>
    </main>
  );
}
