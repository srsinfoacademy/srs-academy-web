"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";

import type { ContactEnquiryPayload, ContactEnquiryResponse } from "@/lib/contact/types";
import { cn } from "@/lib/cn";

export type EnquiryCourseOption = { slug: string; name: string; code: string };

const NOT_SURE = "Not sure yet";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** 10-digit Indian mobile after removing +91 / 91 / 0 and separators. */
const MOBILE_RE = /^[6-9]\d{9}$/;

type Values = { name: string; email: string; mobile: string; course: string; format: string; message: string; company: string };
type Errors = Partial<Record<"name" | "email" | "mobile" | "course", string>>;

function normaliseMobile(value: string): string {
  return value.replace(/[\s()-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your full name.";
  if (!values.email.trim()) errors.email = "Enter your email address so we can reply.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";
  if (values.mobile.trim() && !MOBILE_RE.test(normaliseMobile(values.mobile))) {
    errors.mobile = "Enter a 10-digit mobile number, or leave it blank.";
  }
  if (!values.course) errors.course = "Choose a course, or “Not sure yet”.";
  return errors;
}

const inputClass =
  "mt-2 h-[50px] w-full rounded-[10px] border bg-rd-elevated px-3.5 text-[16px] text-rd-ink placeholder:text-rd-soft focus:outline focus:outline-3 focus:outline-rd-accent/35";

/**
 * Enquiry form. Posts JSON to the existing /api/contact route (validation,
 * honeypot, fill-time check and rate limit all live there). Errors show
 * only after the first submit attempt.
 */
export function RdEnquiryForm({
  courses,
  formats,
  consent,
}: {
  courses: EnquiryCourseOption[];
  formats: readonly string[];
  consent: string;
}) {
  const params = useSearchParams();
  const prefill = params.get("course");
  const prefilled = prefill ? courses.find((course) => course.slug === prefill || course.code === prefill) : undefined;

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    mobile: "",
    course: prefilled?.slug ?? "",
    format: formats[0] ?? "",
    message: "",
    company: "",
  });
  const [filter, setFilter] = useState("");
  const [tried, setTried] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failure, setFailure] = useState("");
  const [formRenderedAt] = useState(() => Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const errors = tried ? validate(values) : {};
  const errorCount = Object.keys(errors).length;

  const options = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    const list = needle
      ? courses.filter((course) => `${course.name} ${course.code}`.toLowerCase().includes(needle))
      : courses;
    // Keep the current choice selectable even when the filter hides it.
    if (values.course && values.course !== NOT_SURE && !list.some((course) => course.slug === values.course)) {
      const current = courses.find((course) => course.slug === values.course);
      if (current) return [current, ...list];
    }
    return list;
  }, [courses, filter, values.course]);

  const chosen = courses.find((course) => course.slug === values.course);
  const courseLabel = chosen ? `${chosen.name} (${chosen.code})` : values.course;

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTried(true);
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const formatLine = values.format ? `Preferred format: ${values.format}` : "";
    const message = values.message.trim()
      ? [values.message.trim(), formatLine].filter(Boolean).join("\n\n")
      : [`Course of interest: ${courseLabel}`, formatLine].filter(Boolean).join("\n");

    const payload: ContactEnquiryPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.mobile.trim() ? normaliseMobile(values.mobile) : undefined,
      subject: courseLabel,
      message,
      honeypot: values.company,
      formRenderedAt,
      sourcePage: window.location.pathname,
    };

    setState("sending");
    setFailure("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as ContactEnquiryResponse | null;
      if (response.ok && result?.ok) {
        setState("sent");
        return;
      }
      const reason = result && !result.ok ? result.error : "server_error";
      setFailure(
        reason === "rate_limited"
          ? "Too many enquiries were sent from this connection. Please wait a few minutes and try again."
          : reason === "validation"
            ? "Some details could not be accepted. Check the form and try again."
            : "Your enquiry could not be sent just now. Please try again, or email us instead.",
      );
      setState("failed");
    } catch {
      setFailure("Your enquiry could not be sent. Check your connection and try again.");
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-3">
        <span
          aria-hidden="true"
          className="inline-flex size-12 items-center justify-center rounded-full bg-rd-tint-green text-2xl text-rd-link"
        >
          ✓
        </span>
        <h3 className="font-rd-display text-[26px] font-medium text-rd-ink">Thank you, {values.name.trim()}.</h3>
        <p className="text-[16px] leading-[1.6] text-rd-body">
          Your enquiry about <strong className="text-rd-ink">{courseLabel}</strong> has been sent. The SRS team
          will reply to {values.email.trim()}.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues((current) => ({ ...current, message: "" }));
            setTried(false);
            setState("idle");
          }}
          className="mt-2 inline-flex min-h-11 items-center rounded-[10px] border border-rd-line-strong bg-rd-elevated px-4 font-semibold text-rd-ink hover:border-rd-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${id}-${key}-error` : undefined,
  });
  const fieldBorder = (key: keyof Errors) => (errors[key] ? "border-rd-danger" : "border-rd-field");
  const errorText = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="mt-1.5 text-[14px] font-medium text-rd-danger">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      {errorCount > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-[10px] border border-rd-danger bg-rd-tint-saffron px-4 py-3 text-[15px] font-semibold text-rd-danger"
        >
          Please fix {errorCount} field{errorCount === 1 ? "" : "s"} below.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="text-[15px] font-semibold text-rd-ink">
            Full name <span aria-hidden="true" className="text-rd-accent">*</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            className={cn(inputClass, fieldBorder("name"))}
            {...field("name")}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-[15px] font-semibold text-rd-ink">
            Email <span aria-hidden="true" className="text-rd-accent">*</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            className={cn(inputClass, fieldBorder("email"))}
            {...field("email")}
          />
          {errorText("email")}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-mobile`} className="text-[15px] font-semibold text-rd-ink">
          Mobile number <span className="font-normal text-rd-soft">(optional)</span>
        </label>
        <input
          id={`${id}-mobile`}
          name="mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="10-digit mobile"
          value={values.mobile}
          onChange={(event) => set("mobile", event.target.value)}
          className={cn(inputClass, fieldBorder("mobile"))}
          {...field("mobile")}
        />
        {errorText("mobile")}
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-[15px] font-semibold text-rd-ink">
          Course of interest <span aria-hidden="true" className="text-rd-accent">*</span>
        </legend>
        <div>
          <label htmlFor={`${id}-filter`} className="text-[14px] text-rd-soft">
            Search the course list
          </label>
          <input
            id={`${id}-filter`}
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Type a course name or code"
            autoComplete="off"
            className={cn(inputClass, "mt-1 h-11 border-rd-field text-[15px]")}
          />
        </div>
        <div>
          <label htmlFor={`${id}-course`} className="sr-only">
            Course of interest
          </label>
          <select
            id={`${id}-course`}
            name="course"
            required
            value={values.course}
            onChange={(event) => set("course", event.target.value)}
            className={cn(inputClass, "mt-0", fieldBorder("course"))}
            {...field("course")}
          >
            <option value="">
              {filter.trim() ? `Select a course (${options.length} match)` : "Select a course"}
            </option>
            <option value={NOT_SURE}>{NOT_SURE}</option>
            {options.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
          {errorText("course")}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-format`} className="text-[15px] font-semibold text-rd-ink">
          Preferred format
        </label>
        <select
          id={`${id}-format`}
          name="format"
          value={values.format}
          onChange={(event) => set("format", event.target.value)}
          className={cn(inputClass, "border-rd-field")}
        >
          {formats.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="text-[15px] font-semibold text-rd-ink">
          Message <span className="font-normal text-rd-soft">(optional)</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={3}
          value={values.message}
          onChange={(event) => set("message", event.target.value)}
          className={cn(inputClass, "h-auto min-h-[110px] border-rd-field py-3")}
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          id={`${id}-company`}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => set("company", event.target.value)}
        />
      </div>

      {state === "failed" ? (
        <p role="alert" className="rounded-[10px] border border-rd-danger px-4 py-3 text-[15px] font-medium text-rd-danger">
          {failure}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        aria-disabled={state === "sending"}
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[10px] bg-rd-accent px-5 text-[16px] font-semibold text-rd-on-accent transition-colors hover:bg-rd-accent-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent disabled:cursor-wait disabled:opacity-70"
      >
        {state === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-[14px] text-rd-soft">
        {consent}{" "}
        <Link href="/privacy" className="text-rd-link underline underline-offset-4 hover:text-rd-accent">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
