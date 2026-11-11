import type { Task } from '../types/task';

type TaskListProps = {
    tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
    return (
            tasks.length === 0 ? <p>No tasks yet</p>
            : <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <h3>Title: {task.title}</h3> 
                        <p>Status: {task.status}</p> 
                        <p>Priority: {task.priority}</p>
                    </li>
            ))}
            </ul>
    )
}

