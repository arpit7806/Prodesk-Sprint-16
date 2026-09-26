"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ME } from "@/lib/constants";
import { seedTasks } from "@/lib/seed";
import { nextId, statusLabel } from "@/lib/utils";
import type { NewTaskInput, Status, Task } from "@/lib/types";

const COLLECTION = "tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  // Real-time subscription — replaces the old localStorage read effect
  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTION), async (snap) => {
      if (snap.empty) {
        // First run ever: seed Firestore from this browser's real localStorage
        // data if it exists (it does, from before the Firestore migration).
        // Only falls back to the random seedTasks() generator if there's
        // truly nothing to migrate — e.g. a brand new browser.
        let seeds: Task[] = [];
        try {
          const raw = localStorage.getItem("taskmatrix.next.v1");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) seeds = parsed as Task[];
          }
        } catch {}
        if (!seeds.length) seeds = seedTasks();
        await Promise.all(seeds.map((t) => setDoc(doc(db, COLLECTION, t.id), t)));
        return;
      }
      const data = snap.docs.map((d) => d.data() as Task);
      setTasks(data);
      setReady(true);
    });
    return () => unsub();
  }, []);

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
    setDoc(doc(db, COLLECTION, task.id), task);
    return task;
  };

  // Update (optionally writes an activity entry)
  const update = (id: string, patch: Partial<Task>, note?: string) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const merged = { ...t, ...patch, log: note ? [entry(note), ...t.log] : t.log };
    updateDoc(doc(db, COLLECTION, id), merged as { [x: string]: unknown });
  };

  const move = (id: string, status: Status) => {
    const t = tasks.find((x) => x.id === id);
    if (!t || t.status === status) return;
    update(id, { status }, `moved this to ${statusLabel(status)}`);
  };

  const comment = (id: string, text: string) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    updateDoc(doc(db, COLLECTION, id), { log: [entry(text, true), ...t.log] });
  };

  // Delete
  const remove = (id: string) => {
    deleteDoc(doc(db, COLLECTION, id));
  };

  return { tasks, ready, create, update, move, comment, remove };
}