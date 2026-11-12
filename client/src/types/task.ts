export const TASK_STATUSES = ['todo', 'in-progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type Task = {
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
}


