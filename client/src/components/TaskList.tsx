import { useState } from 'react';
import { type Task, type TaskStatus, type TaskPriority, TASK_PRIORITIES, TASK_STATUSES } from '../types/task';
import { formatLocalDate, groupTasksByDueDate, filterTasks } from '../utils/taskUtils';
import { TaskItem } from './TaskItem';

type TaskListProps = {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (id: string, title: string, priority: TaskPriority, dueDate: string) => void;
}

export function TaskList({ tasks, onStatusChange, onDeleteTask, onEditTask }: TaskListProps) {
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
                    {groupTasks.map((task) => (
                        <TaskItem key={task.id} task={task} isEditing={currentId === task.id} onStartEdit={(id) => setCurrentId(id)} onCancelEdit={() => setCurrentId(null)} onStatusChange={onStatusChange} onDeleteTask={onDeleteTask} onEditTask={onEditTask} />
                    ))}
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

