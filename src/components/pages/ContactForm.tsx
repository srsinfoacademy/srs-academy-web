"use client";

import { useId, useRef, useState } from "react";

import { AlertMessage } from "@/components/ui/AlertMessage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "phone" | "subject" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;

const initial = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
};

function validate(values: typeof initial): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your full name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email address.";
  if (!values.subject.trim()) errors.subject = "Choose a subject.";
  if (!values.message.trim()) errors.message = "Enter a message.";
  if (!values.consent) errors.consent = "You must agree before sending.";
  return errors;
}

/**
 * Contact form.
 *
 * There is no backend in this phase, and the form does not pretend otherwise:
 * submitting validates, then states plainly that sending is not yet connected
 * and points at the published contact details. Showing a "message sent"
 * confirmation for a message that goes nowhere would be a lie to the reader.
 *
 * Validation is client-side and on submit rather than per-keystroke, so a
 * half-typed email is not marked wrong while it is being typed. Errors are
 * associated with their field through aria-describedby and announced through
 * a live region; they are never signalled by colour alone.
 */
export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const baseId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);

  const fieldId = (name: Field) => `${baseId}-${name}`;
  const errorId = (name: Field) => `${baseId}-${name}-error`;

  const set = (name: Field, value: string | boolean) =>
    setValues((current) => ({ ...current, [name]: value }));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move attention to the summary so the errors are announced and the
      // first invalid field is reachable.
      summaryRef.current?.focus();
      return;
    }

    setState("sending");
    // No network call: there is no endpoint yet.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setState("done");
  }

  const errorList = Object.entries(errors) as [Field, string][];

  const fieldClass = (name: Field) =>
    cn(
      "w-full rounded-[var(--srs-radius-md)] border bg-surface-2 px-3 py-3",
      "type-body-s text-primary placeholder:text-muted",
      "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
      errors[name]
        ? "border-[var(--srs-error)]"
        : "border-line hover:border-line-strong focus-visible:border-lime",
    );

  if (state === "done") {
    return (
      <div className="rise-in flex flex-col gap-6">
        <AlertMessage tone="info" role="status">
          <p>
            This form is not connected to a mail service yet, so your message has{" "}
            <strong>not</strong> been sent. Please use the contact details on this
            page in the meantime.
          </p>
        </AlertMessage>
        <div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setValues(initial);
              setErrors({});
              setState("idle");
            }}
          >
            Start again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <div
        ref={summaryRef}
        tabIndex={-1}
        aria-live="assertive"
        className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--srs-focus)]"
      >
        {errorList.length > 0 ? (
          <AlertMessage tone="error" className="rise-in">
            <p>Check the following before sending:</p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              {errorList.map(([name, message]) => (
                <li key={name}>
                  <a href={`#${fieldId(name)}`} className="underline">
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </AlertMessage>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Text
          id={fieldId("name")}
          errorId={errorId("name")}
          label="Full name"
          required
          value={values.name}
          error={errors.name}
          className={fieldClass("name")}
          onChange={(v) => set("name", v)}
          autoComplete="name"
        />
        <Text
          id={fieldId("email")}
          errorId={errorId("email")}
          label="Email"
          type="email"
          required
          value={values.email}
          error={errors.email}
          className={fieldClass("email")}
          onChange={(v) => set("email", v)}
          autoComplete="email"
        />
        <Text
          id={fieldId("phone")}
          errorId={errorId("phone")}
          label="Phone"
          type="tel"
          value={values.phone}
          error={errors.phone}
          className={fieldClass("phone")}
          onChange={(v) => set("phone", v)}
          autoComplete="tel"
        />
        <Text
          id={fieldId("subject")}
          errorId={errorId("subject")}
          label="Subject"
          required
          value={values.subject}
          error={errors.subject}
          className={fieldClass("subject")}
          onChange={(v) => set("subject", v)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("message")} className="type-index">
          Message <RequiredMark />
        </label>
        <textarea
          id={fieldId("message")}
          rows={6}
          required
          value={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          onChange={(e) => set("message", e.target.value)}
          className={fieldClass("message")}
        />
        <FieldError id={errorId("message")} message={errors.message} />
      </div>

      <div className="flex flex-col gap-2">
        {/*
          The box itself is 24px — WCAG 2.2 SC 2.5.8's minimum — and the
          associated label extends the effective target well past that, since
          clicking the label toggles the box.
        */}
        <div className="flex items-start gap-3 py-1.5">
          <input
            id={fieldId("consent")}
            type="checkbox"
            checked={values.consent}
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? errorId("consent") : undefined}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 size-6 shrink-0 accent-[var(--srs-lime)]"
          />
          {/* Never pre-checked, and the label states exactly what the data is for. */}
          <label htmlFor={fieldId("consent")} className="type-body-s">
            I agree that SRS Academy may use the details above to respond to this
            enquiry. [DATA USE WORDING — CONFIRM BEFORE PUBLISH.] <RequiredMark />
          </label>
        </div>
        <FieldError id={errorId("consent")} message={errors.consent} />
      </div>

      <AlertMessage tone="info">
        This form is a development placeholder. No message is transmitted, because
        no mail service is connected yet.
      </AlertMessage>

      <div>
        {/* Loading is a text change, not a spinner alone. */}
        <Button type="submit" size="md" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-lime">
        *
      </span>
      <span className="sr-only-srs">(required)</span>
    </>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="rise-in type-body-s text-[var(--srs-error)]">
      {message}
    </p>
  );
}

function Text({
  id,
  errorId,
  label,
  value,
  error,
  onChange,
  className,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  errorId: string;
  label: string;
  value: string;
  error?: string;
  onChange: (next: string) => void;
  className: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-index">
        {label} {required ? <RequiredMark /> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
