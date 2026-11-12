import { useState } from 'react';

type QuickAddProps = {
    onAddTask: (title: string, date: string) => void;
}

export function QuickAdd({ onAddTask }: QuickAddProps) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const cleanTitle = title.trim()
        if(cleanTitle !== '') {
            onAddTask(cleanTitle, dueDate);
            setTitle('');
            setDueDate('');
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <input value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" />
            <button type='submit'>Add</button>
        </form>
    )
}