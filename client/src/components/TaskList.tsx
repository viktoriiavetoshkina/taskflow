import { useState } from 'react';
import { type Task, type TaskStatus, type TaskPriority, TASK_PRIORITIES, TASK_STATUSES } from '../types/task';

type TaskListProps = {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (id: string, title: string, priority: TaskPriority, dueDate: string) => void;
}

function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


type TaskGroups = {
    overdue: Task[];
    today: Task[];
    tomorrow: Task[];
    upcoming: Record<string, Task[]>;
    noDueDate: Task[];
};

function groupTasksByDueDate(
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

export function TaskList({ tasks, onStatusChange, onDeleteTask, onEditTask }: TaskListProps) {
    const [editTitle, setEditTitle] = useState('');
    const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
    const [editDueDate, setEditDueDate] = useState('');
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [curDate] = useState(() => new Date());

    const now = curDate;
    const tomorrowDate = new Date(curDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const today = formatLocalDate(now);
    const tomorrow = formatLocalDate(tomorrowDate);

    const groups = groupTasksByDueDate(tasks, today, tomorrow);

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
            <h3>Title: {task.title}</h3> 
            <p>Status: {task.status}</p> 
            <p>Priority: {task.priority}</p>
            <p>Date: {task.dueDate === null ? 'No due date' : task.dueDate}</p>
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
                setEditDueDate(task.dueDate ?? '');
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
            <input value={editDueDate} onChange={e => setEditDueDate(e.target.value)} type="date" />
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
        {tasks.length === 0 ? <p>No tasks yet</p>
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

