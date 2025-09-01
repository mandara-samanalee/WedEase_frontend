"use client";

import { JSX, useMemo, useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
} from "lucide-react";

type Status = "todo" | "in_progress" | "done";
type Bucket = | "6m" | "5m" | "4m" | "3m" | "2m" | "1m" | "2w" | "1w" | "3d" | "day";

interface SubTask {
    id: number;
    text: string;
    status: Status;
    assignee: string;
    bucket: Bucket;
}

interface Task {
    id: number;
    title: string;
    description?: string;
    subtasks: SubTask[];
    expanded: boolean;
}

const BUCKETS: { key: Bucket; label: string }[] = [
    { key: "6m", label: "6 months to go" },
    { key: "5m", label: "5 months to go" },
    { key: "4m", label: "4 months to go" },
    { key: "3m", label: "3 months to go" },
    { key: "2m", label: "2 months to go" },
    { key: "1m", label: "1 month to go" },
    { key: "2w", label: "2 weeks to go" },
    { key: "1w", label: "1 week to go" },
    { key: "3d", label: "3 days to go" },
    { key: "day", label: "Day of" },
];

const STATUS_META: Record<
    Status,
    { label: string; badge: string; text: string; dot: string }
> = {
    todo: {
        label: "To‑do",
        badge: "bg-gray-100 text-gray-700",
        text: "text-gray-800",
        dot: "text-gray-400",
    },
    in_progress: {
        label: "In progress",
        badge: "bg-amber-100 text-amber-800",
        text: "text-amber-900",
        dot: "text-amber-500",
    },
    done: {
        label: "Done",
        badge: "bg-emerald-100 text-emerald-800",
        text: "text-emerald-900",
        dot: "text-emerald-500",
    },
};

const ASSIGNEE_SUGGESTIONS = [
    "Bride", "Groom", "Planner", "Photographer", "Best Man", "Maid of Honor"
];

export default function Checklist(): JSX.Element {
    const [activeBucket, setActiveBucket] = useState<Bucket | "all">("all");
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Vendors",
            description: "Shortlist, negotiate, and confirm vendors",
            expanded: true,
            subtasks: [
                { id: 1, text: "Book photographer", status: "in_progress", assignee: "Bride", bucket: "3m" },
                { id: 2, text: "Confirm catering menu", status: "todo", assignee: "Groom", bucket: "2m" },
                { id: 3, text: "Sign venue contract", status: "done", assignee: "Planner", bucket: "4m" },
            ],
        },
    ]);

    // Overall progress (Done/Total)
    const { total, done } = useMemo(
        () =>
            tasks.reduce(
                (acc, t) => {
                    acc.total += t.subtasks.length;
                    acc.done += t.subtasks.filter((s) => s.status === "done").length;
                    return acc;
                },
                { total: 0, done: 0 }
            ),
        [tasks]
    );
    const progress = total ? Math.round((done / total) * 100) : 0;

    const circleLength = 283;
    const circleOffset = circleLength - (circleLength * progress) / 100;

    const addTask = () => {
        const newTask: Task = {
            id: Date.now(),
            title: "New Task",
            description: "Add description...",
            subtasks: [],
            expanded: true,
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const deleteTask = (id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const toggleExpand = (id: number) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)));
    };

    const addSubTask = (taskId: number) => {
        const sub: SubTask = {
            id: Date.now(),
            text: "New subtask",
            status: "todo",
            assignee: "",
            bucket: "6m",
        };
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub] } : t))
        );
    };

    const updateSubTask = <K extends keyof SubTask>(
        taskId: number,
        subId: number,
        key: K,
        value: SubTask[K]
    ) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, [key]: value } : s)),
                    }
                    : t
            )
        );
    };

    const deleteSubTask = (taskId: number, subId: number) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) } : t
            )
        );
    };

    const updateTaskDescription = (id: number, description: string) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, description } : t))
        );
    };

    const filteredTasks = useMemo(() => {
        if (activeBucket === "all") return tasks;
        return tasks.map((t) => ({
            ...t,
            subtasks: t.subtasks.filter((s) => s.bucket === activeBucket),
        }));
    }, [tasks, activeBucket]);

    const bucketCount = (key: Bucket) =>
        tasks.reduce((n, t) => n + t.subtasks.filter((s) => s.bucket === key).length, 0);

    return (
        <CustomerMainLayout>
            <div className="max-w-5xl pb-24 md:pb-32">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Checklist</h1>
                        <p className="text-gray-600">Plan everything from 6 months out to the day of.</p>
                    </div>

                    {/* Progress ring */}
                    <div className="relative w-20 h-20">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                className="stroke-brand-offWhite"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#overallGradient)"
                                strokeWidth="8"
                                strokeDasharray={circleLength}
                                strokeDashoffset={circleOffset}
                                className="transition-all duration-500"
                            />
                            <defs>
                                <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="currentColor" className="text-brand-violet" />
                                    <stop offset="100%" stopColor="currentColor" className="text-brand-pink" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-gray-900 font-medium">
                            {progress}%
                        </div>
                    </div>
                </div>

                {/* Bucket filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        className={`px-3 py-1.5 rounded-full text-sm border ${activeBucket === "all" ? "bg-purple-600 text-white border-purple-600" : "text-gray-600 hover:bg-gray-50 border-gray-300"
                            }`}
                        onClick={() => setActiveBucket("all")}
                    >
                        All ({total})
                    </button>
                    {BUCKETS.map((b) => (
                        <button
                            key={b.key}
                            className={`px-3 py-1.5 rounded-full text-sm border ${activeBucket === b.key
                                ? "bg-purple-600 text-white border-purple-600"
                                : "text-gray-600 hover:bg-gray-50 border-gray-300"
                                }`}
                            onClick={() => setActiveBucket(b.key)}
                        >
                            {b.label} ({bucketCount(b.key)})
                        </button>
                    ))}
                </div>

                {/* Add Task */}
                <div className="flex justify-end mb-4">
                    <DefaultButton
                        btnLabel="Add Task"
                        Icon={<Plus size={18} />}
                        handleClick={addTask}
                        className="w-auto px-4 text-white inline-flex items-center gap-2"
                    />
                </div>

                {/* Tasks */}
                <div className="space-y-4">
                    {filteredTasks.map((task) => {
                        const tDone = task.subtasks.filter((s) => s.status === "done").length;
                        const tTotal = task.subtasks.length;
                        const taskProgress = tTotal ? Math.round((tDone / tTotal) * 100) : 0;

                        return (
                            <div
                                key={task.id}
                                className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-pink p-[1px]">
                                <div className="bg-white rounded-[inherit] p-6">
                                    {/* Task header */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleExpand(task.id)}
                                                className="text-purple-600 hover:text-purple-800"
                                            >
                                                {task.expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </button>
                                            <input
                                                className="font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-purple-300 focus:outline-none"
                                                value={task.title}
                                                onChange={(e) =>
                                                    setTasks((prev) =>
                                                        prev.map((t) => (t.id === task.id ? { ...t, title: e.target.value } : t))
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 mr-4">
                                            <div className="text-sm text-gray-700">
                                                {tDone}/{tTotal}
                                            </div>
                                            <div className="relative w-12 h-12">
                                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        fill="none"
                                                        className="stroke-brand-offWhite"
                                                        strokeWidth="6"
                                                    />
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

                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Delete task"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    {task.expanded && (
                                        <div className="mt-3 ml-8 mr-4">
                                            {/* Description below header */}
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    value={task.description ?? ""}
                                                    onChange={(e) =>
                                                        updateTaskDescription(task.id, e.target.value)
                                                    }
                                                    placeholder="Add a short description for this task"
                                                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                                                />
                                            </div>

                                            {/* Subtasks table */}
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
                                                                {/* Title */}
                                                                <td className="py-2 pr-3">
                                                                    <input
                                                                        value={sub.text}
                                                                        onChange={(e) =>
                                                                            updateSubTask(task.id, sub.id, "text", e.target.value)
                                                                        }
                                                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                                                                    />
                                                                </td>

                                                                {/* Status */}
                                                                <td className="py-2 pr-3">
                                                                    <div className="flex gap-2">
                                                                        {(["todo", "in_progress", "done"] as Status[]).map((st) => (
                                                                            <button
                                                                                key={st}
                                                                                type="button"
                                                                                onClick={() => updateSubTask(task.id, sub.id, "status", st)}
                                                                                className={`px-2 py-1 rounded-full text-sm ${STATUS_META[st].badge} border border-transparent ${sub.status === st ? "ring-2 ring-offset-1 ring-purple-400" : ""
                                                                                    }`}
                                                                                title={STATUS_META[st].label}
                                                                            >
                                                                                <span className="inline-flex items-center gap-1">
                                                                                    {st === "done" ? (
                                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                                    ) : (
                                                                                        <Circle className={`w-3.5 h-3.5 ${STATUS_META[st].dot}`} />
                                                                                    )}
                                                                                    {STATUS_META[st].label}
                                                                                </span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </td>

                                                                {/* Assignee */}
                                                                <td className="py-2 pr-3">
                                                                    <input
                                                                        list={`assignees-${task.id}`}
                                                                        value={sub.assignee}
                                                                        onChange={(e) =>
                                                                            updateSubTask(task.id, sub.id, "assignee", e.target.value)
                                                                        }
                                                                        placeholder="Type a name"
                                                                        className="w-40 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                                                                    />
                                                                    <datalist id={`assignees-${task.id}`}>
                                                                        {ASSIGNEE_SUGGESTIONS.map((a) => (
                                                                            <option key={a} value={a} />
                                                                        ))}
                                                                    </datalist>
                                                                </td>

                                                                {/* Bucket */}
                                                                <td className="py-2 pr-3">
                                                                    <select
                                                                        value={sub.bucket}
                                                                        onChange={(e) =>
                                                                            updateSubTask(task.id, sub.id, "bucket", e.target.value as Bucket)
                                                                        }
                                                                        className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                                                                    >
                                                                        {BUCKETS.map((b) => (
                                                                            <option key={b.key} value={b.key}>
                                                                                {b.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </td>

                                                                {/* Actions */}
                                                                <td className="py-2 pr-0 text-right">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteSubTask(task.id, sub.id)}
                                                                        className="text-red-600 hover:text-red-800 px-2 py-1"
                                                                        title="Delete subtask"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* Add row */}
                                                        <tr className="border-t">
                                                            <td colSpan={5} className="py-2">
                                                                <button
                                                                    onClick={() => addSubTask(task.id)}
                                                                    className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
                                                                    type="button"
                                                                >
                                                                    <Plus size={16} /> Add subtask
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
                    })}
                </div>
            </div>
        </CustomerMainLayout>
    );
}