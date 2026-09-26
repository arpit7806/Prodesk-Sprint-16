"use client";

import { useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";
import { useTasks } from "@/hooks/useTasks";
import { COLUMNS, ME } from "@/lib/constants";
import type { Status } from "@/lib/types";
import DeleteDialog from "./DeleteDialog";
import NewTaskDialog from "./NewTaskDialog";
import TaskCard from "./TaskCard";
import TaskDrawer from "./TaskDrawer";
import { Avatar, cv } from "./ui";
import { useToast } from "./ToastProvider";
import { AIInsights } from "./AIInsights";
import { ErrorBoundary } from "./ErrorBoundary";

export default function Board() {
  const { tasks, ready, create, update, move, comment, remove } = useTasks();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Status | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);

  const openTask = tasks.find((t) => t.id === openId) ?? null;
  const deleteTask = tasks.find((t) => t.id === deleteId) ?? null;
  const q = query.trim().toLowerCase();

  const { pct, done } = useMemo(() => {
    const total = tasks.reduce((s, t) => s + t.points, 0);
    const d = tasks.filter((t) => t.status === "done").reduce((s, t) => s + t.points, 0);
    return { pct: total ? Math.round((d / total) * 100) : 0, done: d };
  }, [tasks]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  if (!ready) return <div className="boot">Loading board…</div>;

  const onDragStart = (e: DragEvent<HTMLElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDragId(id);
  };
  const endDrag = () => {
    setDragId(null);
    setOverCol(null);
  };

  return (
    <>
      <div className="top">
        <span className="logo">TASKMATRIX</span>
        <span className="proj">Nova Launch</span>
        <input
          id="q"
          type="search"
          placeholder="Search tasks by title or ID"
          aria-label="Search tasks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="me">
          <Avatar k={ME} />
        </span>
      </div>

      <main>
        <section className="sprint">
          <div>
            <h1>Sprint 7</h1>
            <div className="sub">Sep 15 – Sep 28</div>
          </div>
          <div className="prog">
            <div className="lb">
              <span>Progress</span>
              <b>{pct}%</b>
            </div>
            <div className="bar">
              <i style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="vel">
            <span className="sub">Velocity</span>
            <b>
              {done} <span className="sub">pts</span>
            </b>
          </div>
          <button className="btn pri" onClick={() => setNewStatus("todo")}>
            + New task
          </button>
        </section>

        <AIInsights dashboardData={{ tasks, pct, done }} />

        <div className="board">
          <ErrorBoundary label="Task board">
            {COLUMNS.map((c) => {
              const list = tasks.filter((t) => t.status === c.id && (!q || `${t.title} ${t.id}`.toLowerCase().includes(q)));
              return (
                <section
                  key={c.id}
                  className={`col ${overCol === c.id ? "over" : ""}`}
                  onDragOver={(e) => {
                    if (!dragId) return;
                    e.preventDefault();
                    setOverCol(c.id);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragId) move(dragId, c.id);
                    endDrag();
                  }}
                >
                  <div className="ch">
                    <span className="dot" style={{ background: c.color }} />
                    <b>{c.label}</b>
                    <span className="cnt">{list.length}</span>
                  </div>
                  {list.map((t) => (
                    <TaskCard key={t.id} task={t} onOpen={setOpenId} onDragStart={onDragStart} onDragEnd={endDrag} />
                  ))}
                  <button className="add" onClick={() => setNewStatus(c.id)}>
                    + Add task
                  </button>
                </section>
              );
            })}
          </ErrorBoundary>
        </div>
      </main>

      <TaskDrawer
        task={openTask}
        onClose={() => setOpenId(null)}
        onUpdate={update}
        onMove={move}
        onComment={comment}
        onDelete={setDeleteId}
      />
      <NewTaskDialog
        status={newStatus}
        onClose={() => setNewStatus(null)}
        onCreate={(input) => {
          const t = create(input);
          setNewStatus(null);
          setOpenId(t.id);
          showToast("Task created", { type: "success" });
        }}
      />
      <DeleteDialog
        task={deleteTask}
        onCancel={() => setDeleteId(null)}
        onConfirm={(id) => {
          remove(id);
          setDeleteId(null);
          setOpenId(null);
          showToast("Task deleted", { type: "error" });
        }}
      />
    </>
  );
}