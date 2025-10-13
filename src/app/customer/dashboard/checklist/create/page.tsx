"use client";

import React, { useMemo, useState, useEffect } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { Header } from "@/components/Checklist/HeaderSection";
import { TaskList } from "@/components/Checklist/TaskList";
import { Task, SubTask, Bucket } from "@/components/Checklist/ChecklistTypes";
import DefaultButton from "@/components/DefaultButton";
import { Plus, Loader } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextTempId, setNextTempId] = useState(-1);

  const getSession = () => {
    try {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        return { userId: user?.userId, token };
      }
      return { userId: undefined, token: token || "" };
    } catch {
      return { userId: undefined, token: "" };
    }
  };

  const getEventId = (): string | null => {
    try {
      const raw = localStorage.getItem("wedeaseEvent");
      if (raw) {
        const ev = JSON.parse(raw);
        if (ev?.id) return String(ev.id);
        if (ev?.eventId) return String(ev.eventId);
      }
    } catch {
      // ignore
    }
    return null;
  };

  const generateTempId = () => {
    const id = nextTempId;
    setNextTempId(prev => prev - 1);
    return id;
  };

  // Fetch checklist from API
  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    const { token } = getSession();
    const eventId = getEventId();

    if (!eventId || !token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/checklist/${eventId}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No checklist exists yet, start with empty
          setTasks([]);
          return;
        }
        throw new Error(`Failed to load checklist: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success && Array.isArray(result.data)) {
        const transformedTasks = transformApiResponse(result.data);
        setTasks(transformedTasks);
      } else {
        setTasks([]);
      }
      
    } catch (error) {
      console.error("Error fetching checklist:", error);
      toast.error("Error loading checklist");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

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
    const newTask: Task = { 
      id: generateTempId(),
      title: "New Task", 
      description: "",
      subtasks: [], 
      expanded: true 
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleSave = async () => {
    const { token } = getSession();
    const eventId = getEventId();

    if (!eventId || !token) {
      toast.error("Please select an event and login to continue.");
      return;
    }

    try {
      const payload = {
        eventId,
        tasks: tasks.map(task => ({
          ...(task.id > 0 ? { id: task.id } : {}),
          taskTitle: task.title,
          description: task.description || "",
          subtasks: task.subtasks.map(subtask => ({
            ...(subtask.id > 0 ? { id: subtask.id } : {}),
            subtask: subtask.text,
            status: subtask.status,
            assignedTo: subtask.assignee,
            bucket: subtask.bucket
          }))
        }))
      };

      console.log('Saving payload:', payload);

      const response = await fetch(`${BASE_URL}/checklist/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Failed to save checklist: ${response.status}`);
      }

      const result = await response.json();
      console.log('Save successful:', result);
      
      // Refetch to get updated data 
      await fetchChecklist();
      
      toast.success("Checklist saved successfully!");
      
    } catch (error) {
      console.error("Save checklist error:", error);
      toast.error("Failed to save checklist");
    }
  };

  // Delete task with all subtasks
  const deleteTask = async (id: number) => {
    const { token } = getSession();

    // If it's a temporary task (negative ID), just remove from local state
    if (id < 0) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task removed");
      return;
    }

    if (!token) {
      toast.error("Please login to continue.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/checklist/task/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`);
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted successfully");
      
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  // Delete subtask
  const deleteSubTask = async (taskId: number, subId: number) => {
    const { token } = getSession();

    // If it's a temporary subtask (negative ID), just remove from local state
    if (subId < 0) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) } : t)));
      toast.success("Subtask removed");
      return;
    }

    if (!token) {
      toast.error("Please login to continue.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/checklist/subtask/${subId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete subtask: ${response.status}`);
      }

      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) } : t)));
      toast.success("Subtask deleted successfully");
      
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error("Failed to delete subtask");
    }
  };

  // Helper function to transform API response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformApiResponse = (apiTasks: any[]): Task[] => {
    return apiTasks.map(task => ({
      id: task.id,
      title: task.taskTitle,
      description: task.description || "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      subtasks: task.subtasks.map((subtask: any) => ({
        id: subtask.id,
        text: subtask.subtask,
        status: subtask.status,
        assignee: subtask.assignedTo || "",
        bucket: subtask.bucket as Bucket
      })),
      expanded: false
    }));
  };

  const toggleExpand = (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)));
  
  const addSubTask = (taskId: number) => {
    const sub: SubTask = { 
      id: generateTempId(),
      text: "New subtask", 
      status: "todo", 
      assignee: "", 
      bucket: "6m" 
    };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub] } : t)));
  };
  
  const updateSubTask = <K extends keyof SubTask>(taskId: number, subId: number, key: K, value: SubTask[K]) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, [key]: value } : s)) } : t)));
  
  const updateTaskDescription = (id: number, description: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, description } : t)));
  
  const updateTitle = (id: number, title: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

  const filteredTasks = useMemo(() => {
    if (activeBucket === "all") return tasks;
    return tasks.map((t) => ({ 
      ...t, 
      subtasks: t.subtasks.filter((s) => s.bucket === activeBucket) 
    })).filter(t => t.subtasks.length > 0);
  }, [tasks, activeBucket]);

  const bucketCount = (key: Bucket) => tasks.reduce((n, t) => n + t.subtasks.filter((s) => s.bucket === key).length, 0);

  if (loading) {
    return (
      <CustomerMainLayout>
        <div className="max-w-5xl pb-24 md:pb-32">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your Tasklist...</p>
            </div>
          </div>
        </div>
      </CustomerMainLayout>
    );
  } 

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
            handleClick={handleSave}
            className="!w-auto px-12 bg-purple-600 text-white inline-flex items-center gap-2"
          />
        </div>

        {tasks.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No tasks yet. Add your first task to get started!</div>
          </div>
        ) : (
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
        )}
      </div>
    </CustomerMainLayout>
  );
}