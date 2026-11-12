import { useState } from 'react';
import { type Task, type TaskStatus, type TaskPriority, TASK_PRIORITIES, TASK_STATUSES } from '../types/task';

type TaskListProps = {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (id: string, title: string, priority: TaskPriority) => void;
}

export function TaskList({ tasks, onStatusChange, onDeleteTask, onEditTask }: TaskListProps) {
    const [editTitle, setEditTitle] = useState('');
    const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
    const [currentId, setCurrentId] = useState<string | null>(null);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>, id: string) => {
        e.preventDefault();
        const cleanTitle = editTitle.trim()
        if(cleanTitle !== '') {
            onEditTask(id, cleanTitle, editPriority);
            setEditTitle('');
            setEditPriority('medium');
            setCurrentId(null);
        }
    }
    return (
            tasks.length === 0 ? <p>No tasks yet</p>
            : <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {currentId !== task.id
                        ? (<div>
                        <h3>Title: {task.title}</h3> 
                        <p>Status: {task.status}</p> 
                        <p>Priority: {task.priority}</p>
                        <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}>
                            {TASK_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button type="button" onClick={() => onDeleteTask(task.id)}>Delete</button>
                        <button type="button" onClick={() => {
                            setCurrentId(task.id);
                            setEditTitle(task.title);
                            setEditPriority(task.priority);
                            }}>Edit</button>
                            </div>)
                        : (<form onSubmit={e => handleSubmit(e, task.id)}>
                                <label>Title: </label>
                                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                <label>Priority: </label>
                                <select value={editPriority} onChange={e => setEditPriority(e.target.value as TaskPriority)}>
                                    {TASK_PRIORITIES.map(priority => (
                                        <option key={priority} value={priority}>{priority}</option>
                                    ))}
                                </select>
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => {
                                    setEditTitle('');
                                    setEditPriority('medium');
                                    setCurrentId(null);
                                }}>Cancel</button>
                         </form>)}
                        </li>  
            ))}
        </ul>
    )
}

