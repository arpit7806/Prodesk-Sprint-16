import { useEffect, useRef } from "react";
import type { Task } from "@/lib/types";

interface Props {
  task: Task | null; // null = closed
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteDialog({ task, onCancel, onConfirm }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (task && !d.open) d.showModal();
    else if (!task && d.open) d.close();
  }, [task]);

  return (
    <dialog ref={ref} onClose={onCancel}>
      <form method="dialog" onSubmit={(e) => e.preventDefault()}>
        <h2>Delete this task?</h2>
        <p className="sub">{task ? `“${task.title}” will be removed from the board.` : ""}</p>
        <div className="foot">
          <button type="button" className="btn" onClick={onCancel}>
            Keep it
          </button>
          <button type="button" className="btn dng" onClick={() => task && onConfirm(task.id)}>
            Delete task
          </button>
        </div>
      </form>
    </dialog>
  );
}
