import type { DragEvent } from "react";
import type { Task } from "@/lib/types";
import { Avatar, PriorityChip } from "./ui";

interface Props {
  task: Task;
  onOpen: (id: string) => void;
  onDragStart: (e: DragEvent<HTMLElement>, id: string) => void;
  onDragEnd: () => void;
}

export default function TaskCard({ task, onOpen, onDragStart, onDragEnd }: Props) {
  return (
    <article
      className="card"
      draggable
      tabIndex={0}
      aria-label={task.title}
      onClick={() => onOpen(task.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(task.id)}
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
    >
      <div className="ct">
        <span className="grip">⠿</span>
        {task.title}
      </div>
      <div className="cf">
        <PriorityChip p={task.priority} />
        <Avatar k={task.assignee} />
      </div>
    </article>
  );
}
