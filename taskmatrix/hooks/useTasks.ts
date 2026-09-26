"use client";

import { useEffect, useState } from "react";
import { ME } from "@/lib/constants";
import { seedTasks } from "@/lib/seed";
import { nextId, statusLabel } from "@/lib/utils";
import type { NewTaskInput, Status, Task } from "@/lib/types";

const KEY = "taskmatrix.next.v1";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  // Read: load from localStorage once on the client
  useEffect(() => {
    let data: Task[] | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) data = parsed as Task[];
      }
    } catch {}
    setTasks(data ?? seedTasks());
    setReady(true);
  }, []);

  // Persist every change
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks, ready]);

  const entry = (t: string, c = false) => ({ w: ME, t, at: Date.now(), c });

  // Create
  const create = (input: NewTaskInput): Task => {
    const task: Task = {
      id: nextId(tasks),
      title: input.title,
      desc: "",
      status: input.status,
      priority: input.priority,
      assignee: input.assignee,
      reporter: ME,
      due: "",
      labels: [],
      link: "",
      points: 3,
      log: [entry("created this task")],
    };
    setTasks((prev) => [...prev, task]);
    return task;
  };

  // Update (optionally writes an activity entry)
  const update = (id: string, patch: Partial<Task>, note?: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...patch, log: note ? [entry(note), ...t.log] : t.log } : t
      )
    );

  const move = (id: string, status: Status) => {
    const t = tasks.find((x) => x.id === id);
    if (!t || t.status === status) return;
    update(id, { status }, `moved this to ${statusLabel(status)}`);
  };

  const comment = (id: string, text: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, log: [entry(text, true), ...t.log] } : t))
    );

  // Delete
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return { tasks, ready, create, update, move, comment, remove };
}
