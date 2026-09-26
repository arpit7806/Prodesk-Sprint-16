import type { Priority, Status, Task, UserKey } from "./types";

const H = 36e5;

export function seedTasks(): Task[] {
  const n = Date.now();
  const t = (
    num: number,
    title: string,
    status: Status,
    priority: Priority,
    assignee: UserKey,
    points: number,
    extra: Partial<Task> = {}
  ): Task => ({
    id: `NL-${num}`,
    title,
    desc: "",
    status,
    priority,
    assignee,
    reporter: "AK",
    due: "",
    labels: [],
    link: "",
    points,
    log: [{ w: "AK", t: "created this task", at: n - 30 * H, c: false }],
    ...extra,
  });

  return [
    t(21, "Audit onboarding flow for drop-offs", "backlog", "low", "AK", 3),
    t(22, "Research competitor pricing pages", "backlog", "medium", "WC", 5),
    t(31, "Redesign settings panel layout", "todo", "medium", "JS", 5),
    t(32, "Write API docs for /tasks endpoint", "todo", "high", "MR", 3),
    t(33, "Set up Sentry error tracking", "todo", "low", "TP", 2),
    t(47, "Build notification microservice", "progress", "high", "MR", 8, {
      reporter: "JS",
      due: "2026-09-26",
      labels: ["backend", "infra"],
      link: "NL-38",
      desc: "Design and implement a scalable notification microservice that handles in-app, email, and push delivery. Support priority queuing, retry logic with exponential backoff, and per-user preference overrides.",
      log: [
        { w: "MR", t: "moved this to In progress", at: n - 2 * H, c: false },
        { w: "JS", t: "set priority to High", at: n - 5 * H, c: false },
        { w: "AK", t: "created this task and assigned it to Maya Reeves", at: n - 30 * H, c: false },
      ],
    }),
    t(41, "Integrate Stripe billing webhooks", "progress", "high", "JS", 5),
    t(44, "Dark mode token audit", "review", "medium", "AK", 3),
    t(45, "A/B test hero copy variants", "review", "low", "WC", 2),
    t(36, "Launch sprint planning template", "done", "medium", "TP", 3),
    t(37, "Fix websocket reconnect loop", "done", "high", "JS", 5),
    t(38, "Write unit tests for auth service", "done", "low", "MR", 3),
  ];
}
