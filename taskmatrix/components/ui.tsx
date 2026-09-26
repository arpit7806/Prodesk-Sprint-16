import type { CSSProperties } from "react";
import { PRIORITIES, USERS } from "@/lib/constants";
import type { Priority, UserKey } from "@/lib/types";

export const cv = (c: string) => ({ "--c": c }) as CSSProperties;

export function Avatar({ k }: { k: UserKey }) {
  return (
    <span className="av" style={cv(USERS[k].color)} title={USERS[k].name}>
      {k}
    </span>
  );
}

export function PriorityChip({ p }: { p: Priority }) {
  return (
    <span className="chip" style={cv(PRIORITIES[p].color)}>
      {PRIORITIES[p].label}
    </span>
  );
}
