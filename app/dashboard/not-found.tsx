import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h1 className="text-xl font-medium text-ink-100">App not found</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-200">
        It may have been deleted, or it belongs to a different account.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">Back to apps</Link>
      </Button>
    </div>
  );
}
