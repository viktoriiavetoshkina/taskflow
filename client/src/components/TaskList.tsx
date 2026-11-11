import { type Task, type TaskStatus, TASK_STATUSES } from '../types/task';

type TaskListProps = {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onStatusChange, onDeleteTask }: TaskListProps) {

    return (
            tasks.length === 0 ? <p>No tasks yet</p>
            : <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <h3>Title: {task.title}</h3> 
                        <p>Status: {task.status}</p> 
                        <p>Priority: {task.priority}</p>
                        <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}>
                            {TASK_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button type="button" onClick={() => onDeleteTask(task.id)}>Delete</button>
                    </li>
            ))}
            </ul>
    )
}

