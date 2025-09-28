"use client";

import React, { useMemo, useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { Header } from "@/components/Checklist/HeaderSection";
import { TaskList } from "@/components/Checklist/TaskList";
import { Task, SubTask, Bucket } from "@/components/Checklist/ChecklistTypes";
import DefaultButton from "@/components/DefaultButton";
import { Plus, Save } from "lucide-react";
import toast from "react-hot-toast";

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

export default function ChecklistPage() {
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

  const addTask = () => {
    const newTask: Task = { id: Date.now(), title: "New Task", subtasks: [], expanded: true };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleSave = () => {
    try {
      localStorage.setItem("checklistTasks", JSON.stringify(tasks));
      toast.success("Checklist saved");
    } catch (err) {
      console.error("Save checklist error:", err);
      toast.error("Failed to save checklist");
    }
  };

  const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggleExpand = (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)));
  const addSubTask = (taskId: number) => {
    const sub: SubTask = { id: Date.now(), text: "New subtask", status: "todo", assignee: "", bucket: "6m" };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub] } : t)));
  };
  const updateSubTask = <K extends keyof SubTask>(taskId: number, subId: number, key: K, value: SubTask[K]) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, [key]: value } : s)) } : t)));
  const deleteSubTask = (taskId: number, subId: number) => setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) } : t)));
  const updateTaskDescription = (id: number, description: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, description } : t)));
  const updateTitle = (id: number, title: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

  const filteredTasks = useMemo(() => {
    if (activeBucket === "all") return tasks;
    return tasks.map((t) => ({ ...t, subtasks: t.subtasks.filter((s) => s.bucket === activeBucket) }));
  }, [tasks, activeBucket]);

  const bucketCount = (key: Bucket) => tasks.reduce((n, t) => n + t.subtasks.filter((s) => s.bucket === key).length, 0);

  return (
    <CustomerMainLayout>
      <div className="max-w-5xl pb-24 md:pb-32">
        <Header
          progress={progress}
          total={total}
          activeBucket={activeBucket}
          setActiveBucket={setActiveBucket}
          buckets={BUCKETS}
          bucketCount={bucketCount}
        />

        <div className="flex justify-end gap-3 mb-6 mt-4">
          <DefaultButton
            btnLabel="Add Task"
            Icon={<Plus size={16} />}
            handleClick={addTask}
            className="!w-auto px-8 bg-purple-600 text-white inline-flex items-center gap-2"
          />
          <DefaultButton
            btnLabel="Save"
            Icon={<Save size={16} />}
            handleClick={handleSave}
            className="!w-auto px-8 bg-purple-600 text-white inline-flex items-center gap-4"
          />
        </div>

        <TaskList
          tasks={filteredTasks}
          buckets={BUCKETS}
          onToggleExpand={toggleExpand}
          onDeleteTask={deleteTask}
          onTitleChange={updateTitle}
          onUpdateDescription={updateTaskDescription}
          onAddSub={addSubTask}
          onUpdateSub={updateSubTask}
          onDeleteSub={deleteSubTask}
        />
      </div>
    </CustomerMainLayout>
  );
}