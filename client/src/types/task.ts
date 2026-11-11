export const TASK_STATUSES = ['todo', 'in-progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
}


