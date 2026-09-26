import { COLUMNS } from "./constants";
import type { Status, Task } from "./types";

export const statusLabel = (s: Status) => COLUMNS.find((c) => c.id === s)?.label ?? s;

export function fmtDate(v: string) {
  return new Date(`${v}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ago(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d}d ago`;
}

export function nextId(tasks: Task[]) {
  const n = Math.max(0, ...tasks.map((t) => parseInt(t.id.slice(3), 10) || 0));
  return `NL-${n + 1}`;
}

export function isOverdue(t: Task) {
  return !!t.due && t.status !== "done" && new Date(`${t.due}T23:59:59`) < new Date();
}
