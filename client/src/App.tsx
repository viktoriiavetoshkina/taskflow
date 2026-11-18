import './App.css'
import { useState, useEffect } from 'react';
import { QuickAdd } from './components/QuickAdd';
import { TaskList } from './components/TaskList';
import { loadTasks, saveTasks } from './components/taskStorage';
import type { TaskStatus, TaskPriority } from './types/task'

function App() {
  const [tasks, setTasks] = useState(() => loadTasks());

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const handleTaskAdd = (title: string, dueDate: string) => {
    setTasks(tasks => [{id: crypto.randomUUID(), title, status: 'todo', priority: 'medium', dueDate: dueDate === '' ? null : dueDate}, ...tasks])
  }

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(tasks => tasks.map(task => task.id === id ? {...task, status} : task))
  }

  const handleTaskDelete = (id: string) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  }

  const handleTaskEdit = (id: string, title: string, priority: TaskPriority, dueDate: string) => {
    setTasks(tasks => tasks.map(task => task.id === id ? {...task, title, priority, dueDate: dueDate === '' ? null : dueDate} : task))
  }

  return (
    <div>
      <QuickAdd onAddTask={handleTaskAdd}/>
      <TaskList tasks={tasks} onStatusChange={handleStatusChange} onDeleteTask={handleTaskDelete} onEditTask={handleTaskEdit} />
    </div>
  )
}


export default App
