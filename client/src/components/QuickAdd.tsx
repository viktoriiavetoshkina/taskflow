import { useState } from 'react';

type QuickAddProps = {
    onAddTask: (title: string) => void;
}

export function QuickAdd({ onAddTask }: QuickAddProps) {
    const [title, setTitle] = useState('');
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const cleanTitle = title.trim()
        if(cleanTitle !== '') {
            onAddTask(cleanTitle);
            setTitle('');
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <button type='submit'>Add</button>
        </form>
    )
}