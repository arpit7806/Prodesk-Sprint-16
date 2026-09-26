export type Status = "backlog" | "todo" | "progress" | "review" | "done";
export type Priority = "low" | "medium" | "high";
export type UserKey = "AK" | "JS" | "MR" | "WC" | "TP";

export interface LogEntry {
  w: UserKey;
  t: string;
  at: number;
  c: boolean; // true when this entry is a comment
}

export interface Task {
  id: string;
  title: string;
  desc: string;
  status: Status;
  priority: Priority;
  assignee: UserKey;
  reporter: UserKey;
  due: string;
  labels: string[];
  link: string;
  points: number;
  log: LogEntry[];
}

export interface NewTaskInput {
  title: string;
  status: Status;
  priority: Priority;
  assignee: UserKey;
}
