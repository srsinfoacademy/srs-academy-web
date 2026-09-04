"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { lightRoutes } from "@/lib/light/routes";

export function CourseSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function go() {
    const q = value.trim();
    router.push(q ? `${lightRoutes.courses}?q=${encodeURIComponent(q)}` : lightRoutes.courses);
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="sl-glass flex max-w-195 items-center gap-3 rounded-full py-2 pr-2 pl-5.5"
      style={{ boxShadow: "0 20px 40px -28px rgba(17,17,17,.2)" }}
    >
      <span aria-hidden="true" className="text-lg">
        🔍
      </span>
      <label htmlFor="home-course-search" className="sr-only">
        Search courses, skills or careers
      </label>
      <input
        id="home-course-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search courses, skills or careers — e.g. AI basics, Mehendi, Tally, Spoken English"
        className="sl-focus min-w-0 flex-1 bg-transparent text-[15px] text-sl-ink placeholder:text-sl-ink/45"
      />
      <button
        type="submit"
        className="sl-focus flex h-11.5 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-sl-ink px-5 text-sm font-semibold text-sl-paper transition-transform active:translate-y-px"
      >
        Search <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
