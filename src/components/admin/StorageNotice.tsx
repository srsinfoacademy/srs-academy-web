import { storageMode } from "@/lib/data/store";

/** Shown only when saves would not reach Vercel Blob. */
export function StorageNotice() {
  const mode = storageMode();
  if (mode === "blob") return null;
  return (
    <div role="status" className="rounded-xl border border-ad-note-line bg-ad-note-bg px-4 py-3 text-[14.5px] leading-[1.5] text-ad-note-fg">
      {mode === "local"
        ? "Local development: changes are saved to the .admin-data folder on this machine, not to Vercel Blob."
        : "Storage isn't configured (BLOB_READ_WRITE_TOKEN is missing). The site shows the bundled course and contact data, and saving is disabled."}
    </div>
  );
}
