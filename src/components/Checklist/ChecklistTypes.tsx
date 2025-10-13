export type Status = "todo" | "in_progress" | "done";
export type Bucket = "6m" | "5m" | "4m" | "3m" | "2m" | "1m" | "2w" | "1w" | "3d" | "day";

export interface SubTask {
    id: number;
    text: string;
    status: Status;
    assignee: string;
    bucket: Bucket;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    subtasks: SubTask[];
    expanded: boolean;
}