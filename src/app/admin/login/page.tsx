import type { Metadata } from "next";
import Link from "next/link";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Sign in" };

/** Only same-site admin paths are allowed as the post-login destination. */
function safeNext(value: string | string[] | undefined): string {
  const next = Array.isArray(value) ? value[0] : value;
  return next && /^\/admin(\/[\w\-/?=&%.]*)?$/.test(next) && !next.startsWith("/admin/login") ? next : "/admin";
}

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const next = safeNext((await searchParams).next);
  const studentHref = site.portals.student.href;
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-1">
      <div className="hidden flex-[0_0_42%] flex-col justify-between bg-ad-side p-14 text-ad-side-text [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.035)_0_1px,transparent_1px_22px),repeating-linear-gradient(-45deg,rgba(233,165,110,.06)_0_1px,transparent_1px_22px)] lg:flex">
        <span className="font-rd-display text-[32px] font-semibold text-ad-white">
          SRS<span className="text-[#e9a56e]">.</span>{" "}
          <span className="font-rd-sans text-[16px]">Academy Administration</span>
        </span>
        <div className="flex max-w-[420px] flex-col gap-3.5">
          <h2 className="m-0 font-rd-display text-[38px] font-medium leading-[1.1] text-ad-white">Staff access only</h2>
          <p className="m-0 text-[16px] leading-[1.6]">
            Manage courses, categories, enquiries and contact details for {site.name}.
          </p>
        </div>
        <span className="text-[13px] text-[#9aa3b5]">
          © {year} {site.copyrightHolder}
        </span>
      </div>

      <main className="flex flex-1 flex-col gap-7 p-[clamp(20px,4vw,56px)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-rd-display text-[28px] font-semibold text-rd-ink lg:hidden">
            SRS<span className="text-rd-accent">.</span> <span className="font-rd-sans text-[15px]">Admin</span>
          </span>
          <Link
            href="/"
            className="ml-auto inline-flex min-h-11 items-center text-[15px] font-semibold text-rd-link underline-offset-4 hover:text-rd-accent hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-focus"
          >
            ← Return to website
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center gap-5">
          <h1 className="m-0 font-rd-display text-[clamp(32px,3.6vw,42px)] font-medium leading-[1.1] text-rd-ink">
            Administration Login
          </h1>
          <AdminLoginForm next={next} />
          {studentHref ? (
            <p className="m-0 text-[14px] text-rd-soft">
              Students sign in through the{" "}
              <a href={studentHref} className="font-semibold text-rd-link underline">
                Student Portal
              </a>
              .
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
