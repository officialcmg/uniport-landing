"use client";

import { useActionState, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAppAction,
  deleteAppAction,
  renameAppAction,
  rotateAppIdAction,
  updateRecipientsAction,
  updateWebsitesAction,
  type FormState,
} from "@/app/dashboard/actions";

const initial: FormState = {};
type Action = (previous: FormState, form: FormData) => Promise<FormState>;

/**
 * Runs a server action from a form's submit event. Submitting this way, rather
 * than through the form's `action`, keeps what the person typed when the
 * server answers with an error.
 */
function useFormAction(action: Action) {
  const [state, dispatch] = useActionState(action, initial);
  const [pending, startTransition] = useTransition();
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(() => dispatch(form));
  }
  return { state, pending, onSubmit };
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-5 text-ink-300">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function FormMessage({ state, savedText = "Saved." }: { state: FormState; savedText?: string }) {
  if (state.error) {
    return (
      <p role="alert" className="text-sm leading-5 text-destructive">
        {state.error}
      </p>
    );
  }
  if (state.saved) {
    return (
      <p role="status" className="text-sm leading-5 text-success">
        {savedText}
      </p>
    );
  }
  return null;
}

export function CreateAppForm() {
  const { state, pending, onSubmit } = useFormAction(createAppAction);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field id="new-app-name" label="App name">
        <Input id="new-app-name" name="name" placeholder="My shop" maxLength={60} required autoComplete="off" />
      </Field>
      <Field
        id="new-app-website"
        label="Website (optional)"
        hint="Where the button will run, for example https://shop.example.com. You can add more in Settings. localhost works without listing it."
      >
        <Input
          id="new-app-website"
          name="origins"
          placeholder="https://shop.example.com"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby="new-app-website-hint"
          className="font-mono"
        />
      </Field>
      <FormMessage state={state} />
      <div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Creating…" : "Create app"}
        </Button>
      </div>
    </form>
  );
}

/**
 * One settings section: a card with its own fields and its own Save button, so
 * a change to one thing never rides along with a half-edited other thing.
 */
function SettingsForm({
  id,
  title,
  description,
  action,
  appId,
  savedText,
  fieldsKey,
  children,
}: {
  id: string;
  title: string;
  description: ReactNode;
  action: Action;
  appId: string;
  savedText?: string;
  /** Changes when the saved values change, so the fields show what was stored. */
  fieldsKey: string;
  children: ReactNode;
}) {
  const { state, pending, onSubmit } = useFormAction(action);
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 rounded-xl border border-line-100 bg-surface-200">
      <form onSubmit={onSubmit}>
        <input type="hidden" name="id" value={appId} />
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div>
            <h2 id={`${id}-title`} className="text-base font-medium text-ink-100">
              {title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-200">{description}</p>
          </div>
          <div key={fieldsKey} className="flex max-w-2xl flex-col gap-5">
            {children}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-b-xl border-t border-line-100 bg-surface-300/40 px-5 py-3 sm:px-6">
          <div className="min-h-5 min-w-0 flex-1 basis-48">
            <FormMessage state={state} savedText={savedText} />
          </div>
          <Button type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </section>
  );
}

const API_DELAY = "Saved. The API picks this up within about a minute.";

export function NameForm({ app }: { app: { id: string; name: string } }) {
  return (
    <SettingsForm
      id="general"
      title="App name"
      description="Only you see this. It labels the app in this dashboard."
      action={renameAppAction}
      appId={app.id}
      fieldsKey={app.name}
    >
      <Field id="app-name" label="Name">
        <Input id="app-name" name="name" defaultValue={app.name} maxLength={60} required autoComplete="off" className="max-w-sm" />
      </Field>
    </SettingsForm>
  );
}

export function WebsitesForm({ app }: { app: { id: string; allowedOrigins: string[]; allowLocalhost: boolean } }) {
  return (
    <SettingsForm
      id="websites"
      title="Allowed websites"
      description="Only these sites can use your App ID in a browser. The App ID is public, so this list is what stops other sites from using it."
      action={updateWebsitesAction}
      appId={app.id}
      savedText={API_DELAY}
      fieldsKey={`${app.allowedOrigins.join(" ")}|${app.allowLocalhost}`}
    >
      <Field
        id="app-websites"
        label="Websites"
        hint="One per line, without a path. Use https://*.example.com to allow every subdomain of a domain you own."
      >
        <Textarea
          id="app-websites"
          name="origins"
          defaultValue={app.allowedOrigins.join("\n")}
          placeholder={"https://shop.example.com\nhttps://*.preview.example.com"}
          rows={4}
          spellCheck={false}
          autoCapitalize="none"
          aria-describedby="app-websites-hint"
          className="font-mono"
        />
      </Field>
      <div className="flex items-start gap-3">
        <input
          id="app-localhost"
          type="checkbox"
          name="allowLocalhost"
          defaultChecked={app.allowLocalhost}
          aria-describedby="app-localhost-hint"
          className="mt-0.5 size-4 accent-[var(--brand)]"
        />
        <div>
          <Label htmlFor="app-localhost" className="leading-5">
            Allow localhost
          </Label>
          <p id="app-localhost-hint" className="text-xs leading-5 text-ink-300">
            Lets you use this App ID while developing on your own machine.
          </p>
        </div>
      </div>
    </SettingsForm>
  );
}

export function RecipientsForm({ app }: { app: { id: string; recipientAllowlist: string[] | null } }) {
  return (
    <SettingsForm
      id="recipients"
      title="Recipient addresses"
      description="Optional. If you list any, the app can only take payments to these addresses, so a tampered page cannot send a payment somewhere else."
      action={updateRecipientsAction}
      appId={app.id}
      savedText={API_DELAY}
      fieldsKey={(app.recipientAllowlist ?? []).join(" ")}
    >
      <Field id="app-recipients" label="Addresses" hint="One per line. Leave empty to allow any recipient.">
        <Textarea
          id="app-recipients"
          name="recipients"
          defaultValue={(app.recipientAllowlist ?? []).join("\n")}
          placeholder="0x…"
          rows={3}
          spellCheck={false}
          autoCapitalize="none"
          aria-describedby="app-recipients-hint"
          className="font-mono"
        />
      </Field>
    </SettingsForm>
  );
}

function ReplaceAppIdForm({ appId, onDone }: { appId: string; onDone: () => void }) {
  const { state, pending, onSubmit } = useFormAction(async (previous, form) => {
    const result = await rotateAppIdAction(previous, form);
    if (result.saved) onDone();
    return result;
  });
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="id" value={appId} />
      <DialogHeader>
        <DialogTitle>Replace the App ID?</DialogTitle>
        <DialogDescription>
          This creates a new App ID and switches the current one off within about a minute. Sites still using the
          old ID stop taking payments until you update them.
        </DialogDescription>
      </DialogHeader>
      {state.error ? <FormMessage state={state} /> : null}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Replacing…" : "Replace it"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ReplaceAppIdButton({ appId }: { appId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Replace App ID</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <ReplaceAppIdForm appId={appId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

const dangerButton =
  "border-destructive/40 bg-transparent text-destructive hover:border-destructive/60 hover:bg-[var(--danger-soft)]";

function DeleteAppForm({ appId, appName }: { appId: string; appName: string }) {
  const { state, pending, onSubmit } = useFormAction(deleteAppAction);
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === appName;
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="id" value={appId} />
      <DialogHeader>
        <DialogTitle>Delete {appName}?</DialogTitle>
        <DialogDescription>
          This switches the App ID off for good. Sites using it stop taking payments. Past payments stay on record,
          but you will no longer see them here.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Label htmlFor="delete-confirm" className="leading-5 font-normal text-ink-200">
          <span>
            Type <strong className="font-medium text-ink-100 select-all">{appName}</strong> to confirm
          </span>
        </Label>
        <Input
          id="delete-confirm"
          name="confirm"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>
      {state.error ? <FormMessage state={state} /> : null}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={!matches || pending}
          className="border-transparent bg-destructive text-on-ink hover:bg-destructive/85"
        >
          {pending ? "Deleting…" : "Delete app"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function DeleteAppButton({ appId, appName }: { appId: string; appName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className={dangerButton}>
          Delete app
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DeleteAppForm appId={appId} appName={appName} />
      </DialogContent>
    </Dialog>
  );
}
