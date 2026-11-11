import './App.css'
import { useState } from 'react';
import { QuickAdd } from './components/QuickAdd';
import { TaskList } from './components/TaskList';
import type { Task, TaskStatus } from './types/task'

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskAdd = (title: string) => {
    setTasks(tasks => [{id: crypto.randomUUID(), title, status: 'todo', priority: 'medium'}, ...tasks])
  }

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(tasks => tasks.map(task => task.id === id ? {...task, status} : task))
  }

  return (
    <div>
      <QuickAdd onAddTask={handleTaskAdd}/>
      <TaskList tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  )
}


export default App
