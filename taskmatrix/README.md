# TaskMatrix (Next.js)

Kanban board with full CRUD, built with Next.js 15 (App Router) and TypeScript. Frontend only: tasks are saved in the browser with localStorage.

## Features
- Create: "New task" button or "Add task" in any column
- Read: five-column board, search by title or ID, task detail drawer with activity
- Update: drag cards between columns, or edit status, priority, assignee, due date, points, labels, linked task, and description in the drawer. Comments supported.
- Delete: confirmation dialog
- Sprint progress and velocity update from task points

## Run locally
```
npm install
npm run dev
```
Open http://localhost:3000

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com/new (Framework Preset: Next.js is detected automatically).
3. Click Deploy. No environment variables needed.

## Structure
- `app/`: layout, page, global styles
- `components/`: Board, TaskCard, TaskDrawer, NewTaskDialog, DeleteDialog, ui
- `hooks/useTasks.ts`: all CRUD logic and localStorage persistence
- `lib/`: types, constants, seed data, helpers

## Next steps
Swap the localStorage calls in `hooks/useTasks.ts` for API routes backed by a database, and add authentication.
