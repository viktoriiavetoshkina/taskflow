import './App.css'
import { TaskList } from './components/TaskList';

function App() {

  return (
    <div>
    <TaskList tasks={[{id: 'djfhkgs', title: 'go shopping', status: 'done', priority: 'high'}, {id:'hejkd', title:'clean a room', status:'todo', priority:'low'}, {id: 'fhjkgdfl', title:'do homework', status:'in-progress', priority:'medium'}, {id: 'kfjsd', title: 'do laundry', status: 'todo', priority: 'low'}]}/>
    </div>
  )
}

export default App
