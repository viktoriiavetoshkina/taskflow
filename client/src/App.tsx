import './App.css'
import { useState } from 'react';
import { QuickAdd } from './components/QuickAdd';
import { TaskList } from './components/TaskList';
import type { Task } from './types/task'

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskAdd = (title: string) => {
    setTasks(tasks => [{id: crypto.randomUUID(), title, status: 'todo', priority: 'medium'}, ...tasks])
  }
  return (
    <div>
      <QuickAdd onAddTask={handleTaskAdd}/>
      <TaskList tasks={tasks} />
    </div>
  )
}


export default App
