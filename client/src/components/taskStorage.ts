import { TASK_PRIORITIES, type Task, type TaskStatus, type TaskPriority, TASK_STATUSES } from '../types/task';


export function saveTasks(tasks: Task[]): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function isTask(data: unknown): data is Task {
    return (
        typeof data === 'object' &&
        !Array.isArray(data) &&
        data !== null &&
        'id' in data &&
        typeof data.id === 'string' &&
        'title' in data &&
        typeof data.title === 'string' &&
        'status' in data &&
        TASK_STATUSES.includes(data.status as TaskStatus) &&
        'priority' in data &&
        TASK_PRIORITIES.includes(data.priority as TaskPriority) &&
        'dueDate' in data &&
        (typeof data.dueDate === 'string' || data.dueDate === null)
    );
}

export function loadTasks(): Task[] {
    try {
        const saved = localStorage.getItem("tasks");
        if (saved !== null) {
            const tasks: unknown = JSON.parse(saved);
            if(Array.isArray(tasks)) {
                return tasks.filter(task => isTask(task));
            } else {
                return [];
            }
        } else {
            return [];
        }
    } catch(error) {
        if(error instanceof Error) {
            console.log(error.message);
        }
        return [];
    }
}