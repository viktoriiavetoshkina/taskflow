import { useState } from 'react';
import { type Task, type TaskStatus, type TaskPriority, TASK_PRIORITIES, TASK_STATUSES } from '../types/task';
import { formatLocalDate, groupTasksByDueDate, filterTasks } from '../utils/taskUtils';

type TaskListProps = {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (id: string, title: string, priority: TaskPriority, dueDate: string) => void;
}

export function TaskList({ tasks, onStatusChange, onDeleteTask, onEditTask }: TaskListProps) {
    const [editTitle, setEditTitle] = useState('');
    const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
    const [editDueDate, setEditDueDate] = useState('');
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [curDate] = useState(() => new Date());
    const [status, setStatus] = useState<TaskStatus | 'all'>('all');
    const [priority, setPriority] = useState<TaskPriority | 'all'>('all');

    const now = curDate;
    const tomorrowDate = new Date(curDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const today = formatLocalDate(now);
    const tomorrow = formatLocalDate(tomorrowDate);

    const filteredTasks = filterTasks(tasks, status, priority)

    const groups = groupTasksByDueDate(filteredTasks, today, tomorrow);

    const upcomingDates = Object.keys(groups.upcoming).sort();


    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>, id: string) => {
        e.preventDefault();
        const cleanTitle = editTitle.trim()
        if(cleanTitle !== '') {
            onEditTask(id, cleanTitle, editPriority, editDueDate);
            setEditTitle('');
            setEditPriority('medium');
            setEditDueDate('');
            setCurrentId(null);
        }
    }

    const renderTask = (task: Task) => (
    <li key={task.id}>
        {currentId !== task.id
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
                setCurrentId(task.id);
                setEditTitle(task.title);
                setEditPriority(task.priority);
                setEditDueDate(task.dueDate ?? '');
            }}>Edit</button>
            </div>)
            : (<form onSubmit={e => handleSubmit(e, task.id)}>
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
                setEditTitle('');
                setEditPriority('medium');
                setCurrentId(null);
                setEditDueDate('');
            }}>Cancel</button>
            </form>)}
    </li>
);

    const renderTaskGroup = (
        title: string,
        groupTasks: Task[],
        key = title
    ) => {
        if (groupTasks.length === 0) return null;

        return (
            <section key={key}>
                <h2>{title}</h2>
                <ul>
                    {groupTasks.map(renderTask)}
                </ul>
            </section>
        );
    };

    return (
    <>
        <fieldset>
            <legend>Filter tasks</legend>
            <label htmlFor='filteredStatus'> Filter by status: </label>
        <select id="filteredStatus" value={status} onChange={e => setStatus(e.target.value as TaskStatus | 'all')}>
            <option key={'all'} value={'all'}>All</option>
            {TASK_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
        </select>
        <label htmlFor='filteredPriority'> Filter by priority: </label>
        <select id="filteredPriority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority | 'all')}>
            <option key={'all'} value={'all'}>All</option>
            {TASK_PRIORITIES.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
            ))}
        </select>
        </fieldset>
        {tasks.length === 0 ? <p>No tasks yet</p>
        : filteredTasks.length === 0 ? <p>No tasks match your filters</p>
        :
        <>
        {renderTaskGroup('Overdue', groups.overdue)}
        {renderTaskGroup('Today', groups.today)}
        {renderTaskGroup('Tomorrow', groups.tomorrow)}

        {upcomingDates.map(date =>
            renderTaskGroup(date, groups.upcoming[date], date)
        )}

        {renderTaskGroup('No due date', groups.noDueDate)}
        </>
        }
    </>
    );
}

