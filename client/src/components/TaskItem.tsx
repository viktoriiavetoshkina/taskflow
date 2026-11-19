import { type Task, type TaskStatus, type TaskPriority, TASK_STATUSES, TASK_PRIORITIES } from '../types/task';
import { useState } from 'react';

type TaskItemProps = {
    task: Task;
    isEditing: boolean;
    onStartEdit: (id: string) => void;
    onCancelEdit: () => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (id: string, title: string, priority: TaskPriority, dueDate: string) => void;
}

export function TaskItem({ task, isEditing, onStartEdit, onCancelEdit, onStatusChange, onDeleteTask, onEditTask }: TaskItemProps) {
    const [editTitle, setEditTitle] = useState('');
    const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
    const [editDueDate, setEditDueDate] = useState('');

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cleanTitle = editTitle.trim()
        if(cleanTitle !== '') {
            onEditTask(task.id, cleanTitle, editPriority, editDueDate);
            setEditTitle('');
            setEditPriority('medium');
            setEditDueDate('');
            onCancelEdit();
        }
    }

    return (<li>
            {!isEditing
                ? (<div>
                <h3>{task.title}</h3> 
                <p>Status: {task.status}</p> 
                <p>Priority: {task.priority}</p>
                <p>Date: {task.dueDate === null ? 'No due date' : task.dueDate}</p>
                <label htmlFor={`${task.id}-status`}> Change status: </label>
                <select id={`${task.id}-status`} value={task.status} onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}>
                    {TASK_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button type="button" onClick={() => onDeleteTask(task.id)}>Delete</button>
                <button type="button" onClick={() => {
                    onStartEdit(task.id);
                    setEditTitle(task.title);
                    setEditPriority(task.priority);
                    setEditDueDate(task.dueDate ?? '');
                }}>Edit</button>
                </div>)
                : (<form onSubmit={e => handleSubmit(e)}>
                <label htmlFor={`${task.id}-title`}> Title: </label>
                <input id={`${task.id}-title`} value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                <label htmlFor={`${task.id}-priority`}> Priority: </label>
                <select id={`${task.id}-priority`} value={editPriority} onChange={e => setEditPriority(e.target.value as TaskPriority)}>
                    {TASK_PRIORITIES.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                    ))}
                </select>
                <label htmlFor={`${task.id}-dueDate`}> Date: </label>
                <input id={`${task.id}-dueDate`} value={editDueDate} onChange={e => setEditDueDate(e.target.value)} type="date" />
                <button type="submit">Save</button>
                <button type="button" onClick={() => {
                    onCancelEdit();
                    setEditTitle('');
                    setEditPriority('medium');
                    setEditDueDate('');
                }}>Cancel</button>
                </form>)}
        </li>
    );
}