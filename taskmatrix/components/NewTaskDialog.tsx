import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { COLUMNS, ME, PRIORITIES, USERS } from "@/lib/constants";
import type { NewTaskInput, Priority, Status, UserKey } from "@/lib/types";

interface Props {
  status: Status | null; // null = closed
  onClose: () => void;
  onCreate: (input: NewTaskInput) => void;
}

export default function NewTaskDialog({ status, onClose, onCreate }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [st, setSt] = useState<Status>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assignee, setAssignee] = useState<UserKey>(ME);
  const [error, setError] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (status) {
      setTitle("");
      setSt(status);
      setPriority("medium");
      setAssignee(ME);
      setError("");
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [status]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) {
      setError("Enter a title to create the task.");
      return;
    }
    onCreate({ title: v, status: st, priority, assignee });
  };

  return (
    <dialog ref={ref} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <h2>New task</h2>
        <label>
          Title
          <input value={title} maxLength={100} autoComplete="off" autoFocus onChange={(e) => setTitle(e.target.value)} />
        </label>
        <div className="two">
          <label>
            Status
            <select value={st} onChange={(e) => setSt(e.target.value as Status)}>
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {(Object.keys(PRIORITIES) as Priority[]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITIES[p].label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Assignee
          <select value={assignee} onChange={(e) => setAssignee(e.target.value as UserKey)}>
            {(Object.keys(USERS) as UserKey[]).map((k) => (
              <option key={k} value={k}>
                {USERS[k].name}
              </option>
            ))}
          </select>
        </label>
        <p className="err" role="alert">
          {error}
        </p>
        <div className="foot">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn pri">Create task</button>
        </div>
      </form>
    </dialog>
  );
}
