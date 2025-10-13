import React from "react";
import { ChevronDown, ChevronRight, Trash2, Plus as PlusIcon, CheckCircle2, Circle } from "lucide-react";
import { Task, SubTask, Status, Bucket } from "./ChecklistTypes";

const STATUS_META: Record<Status, { label: string; badge: string; dot: string }> = {
  todo: { label: "To‑do", badge: "bg-gray-100 text-gray-700", dot: "text-gray-400" },
  in_progress: { label: "In progress", badge: "bg-amber-100 text-amber-800", dot: "text-amber-500" },
  done: { label: "Done", badge: "bg-emerald-100 text-emerald-800", dot: "text-emerald-500" },
};

interface Props {
  task: Task;
  buckets: { key: Bucket; label: string }[];
  onToggleExpand: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onTitleChange: (id: number, title: string) => void;
  onUpdateDescription: (id: number, desc: string) => void;
  onAddSub: (taskId: number) => void;
  onUpdateSub: <K extends keyof SubTask>(taskId: number, subId: number, key: K, value: SubTask[K]) => void;
  onDeleteSub: (taskId: number, subId: number) => void;
}

export const TaskCard: React.FC<Props> = ({
  task,
  buckets,
  onToggleExpand,
  onDeleteTask,
  onTitleChange,
  onUpdateDescription,
  onAddSub,
  onUpdateSub,
  onDeleteSub,
}) => {
  const tDone = task.subtasks.filter((s) => s.status === "done").length;
  const tTotal = task.subtasks.length;
  const taskProgress = tTotal ? Math.round((tDone / tTotal) * 100) : 0;

  return (
    <div className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-pink p-[1px]">
      <div className="bg-white rounded-[inherit] p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => onToggleExpand(task.id)} className="text-purple-600 hover:text-purple-800">
              {task.expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <input
              className="font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-purple-300 focus:outline-none"
              value={task.title}
              onChange={(e) => onTitleChange(task.id, e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 mr-4">
            <div className="text-sm text-gray-700">{tDone}/{tTotal}</div>
            <div className="relative w-12 h-12">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" className="stroke-brand-offWhite" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#taskGradient)"
                  strokeWidth="6"
                  strokeDasharray={126}
                  strokeDashoffset={126 - (126 * taskProgress) / 100}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="taskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" className="text-brand-violet" />
                    <stop offset="100%" stopColor="currentColor" className="text-brand-pink" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-900 font-medium">
                {taskProgress}%
              </div>
            </div>

            <button onClick={() => onDeleteTask(task.id)} className="text-red-500 hover:text-red-700" title="Delete task">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {task.expanded && (
          <div className="mt-3 ml-8 mr-4">
            <div className="mb-3">
              <input
                type="text"
                value={task.description ?? ""}
                onChange={(e) => onUpdateDescription(task.id, e.target.value)}
                placeholder="Add a short description for this task"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-3">Subtask</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Assigned to</th>
                    <th className="py-2 pr-3">Timeline</th>
                    <th className="py-2 pr-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {task.subtasks.map((sub) => (
                    <tr key={sub.id} className="border-t">
                      <td className="py-2 pr-3">
                        <input
                          value={sub.text}
                          onChange={(e) => onUpdateSub(task.id, sub.id, "text", e.target.value)}
                          className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      </td>

                      <td className="py-2 pr-3">
                        <div className="flex gap-2">
                          {(["todo", "in_progress", "done"] as Status[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => onUpdateSub(task.id, sub.id, "status", st)}
                              className={`px-2 py-1 rounded-full text-sm ${STATUS_META[st].badge} border border-transparent ${sub.status === st ? "ring-2 ring-offset-1 ring-purple-400" : ""}`}
                              title={STATUS_META[st].label}
                            >
                              <span className="inline-flex items-center gap-1">
                                {st === "done" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className={`w-3.5 h-3.5 ${STATUS_META[st].dot}`} />}
                                {STATUS_META[st].label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="py-2 pr-3">
                        <input
                          list={`assignees-${task.id}`}
                          value={sub.assignee}
                          onChange={(e) => onUpdateSub(task.id, sub.id, "assignee", e.target.value)}
                          placeholder="Type a name"
                          className="w-40 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                        <datalist id={`assignees-${task.id}`}>
                          <option value="Bride" />
                          <option value="Groom" />
                          <option value="Planner" />
                          <option value="Photographer" />
                          <option value="Best Man" />
                          <option value="Maid of Honor" />
                        </datalist>
                      </td>

                      <td className="py-2 pr-3">
                        <select
                          value={sub.bucket}
                          onChange={(e) => onUpdateSub(task.id, sub.id, "bucket", e.target.value as Bucket)}
                          className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                        >
                          {buckets.map((b) => (
                            <option key={b.key} value={b.key}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2 pr-0 text-right">
                        <button type="button" onClick={() => onDeleteSub(task.id, sub.id)} className="text-red-600 hover:text-red-800 px-2 py-1" title="Delete subtask">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr className="border-t">
                    <td colSpan={5} className="py-2">
                      <button onClick={() => onAddSub(task.id)} className="text-purple-600 hover:text-purple-800 flex items-center gap-2" type="button">
                        <PlusIcon size={16} /> Add subtask
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};