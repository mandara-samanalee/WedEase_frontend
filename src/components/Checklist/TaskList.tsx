import React from "react";
import { Task, SubTask } from "./ChecklistTypes";
import { TaskCard } from "./TaskCard";
import type { Bucket } from "./ChecklistTypes";

interface Props {
  tasks: Task[];
  buckets: { key: Bucket; label: string }[];
  onToggleExpand: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onTitleChange: (id: number, title: string) => void;
  onUpdateDescription: (id: number, desc: string) => void;
  onAddSub: (taskId: number) => void;
  onUpdateSub: <K extends keyof SubTask>(taskId: number, subId: number, key: K, value: SubTask[K]) => void;
  onDeleteSub: (taskId: number, subId: number) => void;
}

export const TaskList: React.FC<Props> = (props) => {
  const { tasks } = props;
  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          buckets={props.buckets}
          onToggleExpand={props.onToggleExpand}
          onDeleteTask={props.onDeleteTask}
          onTitleChange={props.onTitleChange}
          onUpdateDescription={props.onUpdateDescription}
          onAddSub={props.onAddSub}
          onUpdateSub={props.onUpdateSub}
          onDeleteSub={props.onDeleteSub}
        />
      ))}
    </div>
  );
};