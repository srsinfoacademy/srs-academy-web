import type { Metadata } from "next";

import { Panel, PanelTitle } from "@/components/admin/ui";
import { requireAdminPage } from "@/lib/admin/auth";
import { SESSION_TTL_SECONDS } from "@/lib/admin/session";
import { ADMIN_PASSWORD_MIN } from "@/lib/data/schemas";
import { docPaths, storageMode } from "@/lib/data/store";

export const metadata: Metadata = { title: "Settings" };

const dt = "text-[13px] text-rd-soft";
const dd = "m-0 mt-0.5 text-[15px] text-rd-ink break-words";

export default async function AdminSettingsPage() {
  const session = await requireAdminPage();
  const mode = storageMode();
  const expires = new Date(session.expiresAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
      <Panel aria-labelledby="st-account">
        <PanelTitle id="st-account">Account</PanelTitle>
        <dl className="m-0 flex flex-col gap-3">
          <div>
            <dt className={dt}>Signed in as</dt>
            <dd className={dd}>{session.email}</dd>
          </div>
          <div>
            <dt className={dt}>Session</dt>
            <dd className={dd}>
              Lasts {SESSION_TTL_SECONDS / 3600} hours; this one ends {expires} (India time). Log out from the profile menu or the sidebar.
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel aria-labelledby="st-password">
        <PanelTitle id="st-password">Change password</PanelTitle>
        <div role="note" className="rounded-xl border border-ad-note-line bg-ad-note-bg px-4 py-3 text-[14.5px] leading-[1.55] text-ad-note-fg">
          For now the admin password is managed through the <code className="font-mono text-[13.5px]">ADMIN_PASSWORD</code> environment
          variable, not on this screen.
        </div>
        <ol className="m-0 flex list-decimal flex-col gap-1.5 pl-5 text-[14.5px] leading-[1.55] text-rd-body">
          <li>In Vercel, open the project → Settings → Environment Variables.</li>
          <li>
            Edit <code className="font-mono text-[13.5px]">ADMIN_PASSWORD</code> for Production (and Preview if used). Use at least {ADMIN_PASSWORD_MIN}{" "}
            characters; a longer passphrase is safer.
          </li>
          <li>Redeploy. The new password works from the next deployment.</li>
          <li>
            To sign everyone out at once, also change <code className="font-mono text-[13.5px]">AUTH_SECRET</code>.
          </li>
        </ol>
      </Panel>

      <Panel aria-labelledby="st-storage">
        <PanelTitle id="st-storage">Data storage</PanelTitle>
        <dl className="m-0 flex flex-col gap-3">
          <div>
            <dt className={dt}>Storage</dt>
            <dd className={dd}>
              {mode === "blob"
                ? "Vercel Blob (private store, BLOB_READ_WRITE_TOKEN is set)"
                : mode === "local"
                  ? "Local development folder .admin-data (no BLOB_READ_WRITE_TOKEN)"
                  : "Not configured: BLOB_READ_WRITE_TOKEN is missing, so saving is disabled"}
            </dd>
          </div>
          <div>
            <dt className={dt}>Documents</dt>
            <dd className={dd}>
              <code className="font-mono text-[13.5px]">{docPaths.courses}</code>, <code className="font-mono text-[13.5px]">{docPaths.categories}</code>,{" "}
              <code className="font-mono text-[13.5px]">{docPaths.contact}</code> and one <code className="font-mono text-[13.5px]">enquiries/&lt;id&gt;.json</code> per enquiry.
            </dd>
          </div>
          <div>
            <dt className={dt}>Before the first save</dt>
            <dd className={dd}>The website and this panel read the bundled course list and contact facts from the site code.</dd>
          </div>
          <div>
            <dt className={dt}>Publishing</dt>
            <dd className={dd}>Every save refreshes the affected public pages, the course menu and the sitemap within a few seconds.</dd>
          </div>
        </dl>
      </Panel>
    </div>
  );
}
