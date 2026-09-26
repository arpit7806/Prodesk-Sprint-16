import type { Priority, Status, UserKey } from "./types";

export const ME: UserKey = "JS";
export const POINTS = [1, 2, 3, 5, 8, 13];

export const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "#64748b" },
  { id: "todo", label: "To do", color: "#60a5fa" },
  { id: "progress", label: "In progress", color: "#22d3ee" },
  { id: "review", label: "Review", color: "#8b5cf6" },
  { id: "done", label: "Done", color: "#34d399" },
];

export const USERS: Record<UserKey, { name: string; color: string }> = {
  AK: { name: "Alex Kim", color: "#8b5cf6" },
  JS: { name: "Jamie Sinclair", color: "#22d3ee" },
  MR: { name: "Maya Reeves", color: "#ec4899" },
  WC: { name: "Will Chen", color: "#f97316" },
  TP: { name: "Tara Patel", color: "#34d399" },
};

export const PRIORITIES: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "var(--lo)" },
  medium: { label: "Medium", color: "var(--me)" },
  high: { label: "High", color: "var(--hi)" },
};
