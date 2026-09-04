import { Reveal } from "@/components/light/ui/Reveal";

export function Certification() {
  return (
    <section className="sl-container flex flex-wrap items-center gap-10 py-16">
      <Reveal className="max-w-140 flex-1 basis-105">
        <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          CERTIFICATION
        </div>
        <h2 className="sl-h2 mb-4 text-[1.75rem]">Finish with something to show for it</h2>
        <p className="mb-4 text-[15px] leading-relaxed text-sl-ink/68">
          Learners who complete a program&apos;s required activities and completion
          criteria receive an SRS Academy Certificate of Completion — issued by SRS
          Academy, the training initiative of SPRS INFOTECH PVT LTD.
        </p>
        <p className="text-[13px] leading-relaxed text-sl-ink/55">
          SRS Academy does not claim government, university, or external accreditation
          unless such recognition has been formally obtained and stated on the
          relevant program page.
        </p>
      </Reveal>
      <Reveal className="flex flex-1 basis-70 justify-center" delay={100}>
        <div className="sl-glass flex h-52 w-40 flex-col items-center justify-center gap-3 rounded-[var(--radius-sl-lg)] text-center">
          <span className="text-4xl" aria-hidden="true">
            📜
          </span>
          <span className="font-sl-mono text-[10px] tracking-[0.1em] text-sl-ink/55">
            CERTIFICATE OF
            <br />
            COMPLETION
          </span>
        </div>
      </Reveal>
    </section>
  );
}
