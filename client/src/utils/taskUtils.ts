import type { Task, TaskPriority, TaskStatus } from '../types/task';


type TaskGroups = {
    overdue: Task[];
    today: Task[];
    tomorrow: Task[];
    upcoming: Record<string, Task[]>;
    noDueDate: Task[];
};


export function groupTasksByDueDate(
    tasks: Task[],
    today: string,
    tomorrow: string
): TaskGroups {
    return tasks.reduce<TaskGroups>((groups, task) => {

        if(task.dueDate === null) {
            groups.noDueDate.push(task);
        } else if(task.dueDate < today) {
            groups.overdue.push(task);
        } else if(task.dueDate === today) {
            groups.today.push(task);
        } else if(task.dueDate === tomorrow) {
            groups.tomorrow.push(task);
        } else {
            if(groups.upcoming[task.dueDate]) {
                groups.upcoming[task.dueDate].push(task);
            } else {
                groups.upcoming[task.dueDate] = [task];
            }
        }

        return groups;
    }, {
        overdue: [],
        today: [],
        tomorrow: [],
        upcoming: {},
        noDueDate: []
    });
}

export function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function filterTasks(tasks: Task[], statusFilter: TaskStatus | 'all', priorityFilter: TaskPriority | 'all'): Task[] {
    return tasks.filter(task => (statusFilter === 'all' || task.status === statusFilter) && (priorityFilter === 'all' || task.priority === priorityFilter));
}