import { useState } from "react";
import type { FormEvent } from "react";
import { COLUMNS, ME, POINTS, PRIORITIES, USERS } from "@/lib/constants";
import type { Priority, Status, Task, UserKey } from "@/lib/types";
import { ago, fmtDate, isOverdue } from "@/lib/utils";
import { Avatar } from "./ui";

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Task>, note?: string) => void;
  onMove: (id: string, status: Status) => void;
  onComment: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskDrawer({ task, onClose, onUpdate, onMove, onComment, onDelete }: Props) {
  return (
    <>
      <div className={`ov ${task ? "open" : ""}`} onClick={onClose} />
      <aside className={`dr ${task ? "open" : ""}`} aria-label="Task details">
        {task && (
          <Body
            key={task.id}
            task={task}
            onClose={onClose}
            onUpdate={onUpdate}
            onMove={onMove}
            onComment={onComment}
            onDelete={onDelete}
          />
        )}
      </aside>
    </>
  );
}

function Body({ task, onClose, onUpdate, onMove, onComment, onDelete }: Props & { task: Task }) {
  const [text, setText] = useState("");
  const id = task.id;

  const send = (e: FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    onComment(id, v);
    setText("");
  };

  return (
    <>
      <div className="dh">
        <span className="tid">{task.id}</span>
        <input
          className="ti"
          aria-label="Title"
          defaultValue={task.title}
          onBlur={(e) => {
            const v = e.currentTarget.value.trim();
            if (!v) e.currentTarget.value = task.title;
            else if (v !== task.title) onUpdate(id, { title: v }, "renamed this task");
          }}
        />
        <button className="btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="db">
        <div className="pills">
          <select aria-label="Status" value={task.status} onChange={(e) => onMove(id, e.target.value as Status)}>
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Priority"
            value={task.priority}
            onChange={(e) => {
              const p = e.target.value as Priority;
              onUpdate(id, { priority: p }, `set priority to ${PRIORITIES[p].label}`);
            }}
          >
            {(Object.keys(PRIORITIES) as Priority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITIES[p].label}
              </option>
            ))}
          </select>
        </div>

        <h4>Description</h4>
        <textarea
          rows={5}
          placeholder="Add a description"
          defaultValue={task.desc}
          onBlur={(e) => {
            const v = e.currentTarget.value.trim();
            if (v !== task.desc) onUpdate(id, { desc: v }, "updated the description");
          }}
        />

        <h4>Details</h4>
        <div className="det">
          <label>
            Assignee
            <select
              value={task.assignee}
              onChange={(e) => {
                const a = e.target.value as UserKey;
                onUpdate(id, { assignee: a }, `assigned this to ${USERS[a].name}`);
              }}
            >
              {(Object.keys(USERS) as UserKey[]).map((k) => (
                <option key={k} value={k}>
                  {USERS[k].name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Reporter
            <span>{USERS[task.reporter].name}</span>
          </label>
          <label>
            Due date
            <input
              type="date"
              className={isOverdue(task) ? "late" : ""}
              defaultValue={task.due}
              onChange={(e) =>
                onUpdate(
                  id,
                  { due: e.target.value },
                  e.target.value ? `set due date to ${fmtDate(e.target.value)}` : "cleared the due date"
                )
              }
            />
          </label>
          <label>
            Sprint
            <span>Sprint 7</span>
          </label>
          <label>
            Points
            <select
              value={task.points}
              onChange={(e) => onUpdate(id, { points: Number(e.target.value) }, `set points to ${e.target.value}`)}
            >
              {POINTS.map((n) => (
                <option key={n} value={n}>
                  {n} pts
                </option>
              ))}
            </select>
          </label>
          <label>
            Labels
            <input
              placeholder="backend, infra"
              defaultValue={task.labels.join(", ")}
              onBlur={(e) =>
                onUpdate(id, {
                  labels: e.currentTarget.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>
          <label>
            Linked task
            <input
              placeholder="NL-38"
              defaultValue={task.link}
              onBlur={(e) => onUpdate(id, { link: e.currentTarget.value.trim() })}
            />
          </label>
        </div>

        <h4>Activity</h4>
        <div>
          {task.log.map((l, i) => (
            <div className="lg" key={i}>
              <Avatar k={l.w} />
              <div>
                <b>{l.w}</b>{" "}
                {l.c ? (
                  <>
                    commented <small>· {ago(l.at)}</small>
                    <span className="cmt">{l.t}</span>
                  </>
                ) : (
                  <>
                    {l.t} <small>· {ago(l.at)}</small>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <button className="btn dng" onClick={() => onDelete(id)}>
            Delete task
          </button>
        </div>
      </div>

      <form className="cm" onSubmit={send}>
        <Avatar k={ME} />
        <input
          aria-label="Comment"
          placeholder="Write a comment…"
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn pri">Send</button>
      </form>
    </>
  );
}
