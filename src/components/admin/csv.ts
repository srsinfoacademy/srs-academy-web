/** Downloads rows as a UTF-8 CSV (with BOM so Excel keeps Devanagari and ₹-free symbols intact). */
export function downloadCsv(filename: string, rows: (string | number | boolean | null | undefined)[][]) {
  const escape = (value: string | number | boolean | null | undefined) => {
    let text = value == null ? "" : String(value);
    // Neutralise spreadsheet formulas in exported text (CSV injection).
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = "﻿" + rows.map((row) => row.map(escape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
