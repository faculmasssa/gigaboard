import cookie from 'js-cookie';
import { Dispatch, SetStateAction, useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { LogoutInfo, Task, TaskStatus } from '../server';

(global as any).logout = async function () {
    await fetch('/api/logout', {
        method: 'POST',
        body: JSON.stringify(({
            token: cookie.get('token')
        }) as LogoutInfo),
        headers: { 'Content-Type': 'application/json' },
    });
    cookie.remove('token');
    window.location.reload();
}

interface TaskInfo {
    name: string,
    status: TaskStatus
}

function addTask(tasks: TaskInfo[], setTasks: Dispatch<SetStateAction<TaskInfo[]>>) {
    let input = document.getElementById('task-name') as HTMLInputElement;
    if(!input.reportValidity()) {
        return;
    }
    setTasks([...tasks, { name: input.value, status: 'pending' as TaskStatus }]);
}

function getStatusIcon(status: TaskStatus) {
    switch(status) {
        case 'pending':
            return null;
        case 'ongoing':
            return { path: '/assets/icons/arrow-repeat.svg', alt: 'Em andamento' };
        case 'done':
            return { path: '/assets/icons/check-circle.svg', alt: 'Concluída' };
    }
}

function deleteTask(tasks: TaskInfo[], setTasks: Dispatch<SetStateAction<TaskInfo[]>>, index: number) {
    let tasksClone = [...tasks];
    tasksClone.splice(index, 1);
    setTasks(tasksClone);
} 

function renameTask(tasks: TaskInfo[], setTasks: Dispatch<SetStateAction<TaskInfo[]>>, index: number) {
    let name = prompt('Editar');
    if(!name) {
        return;
    }
    let tasksClone = [...tasks];
    tasksClone[index].name = name;
    setTasks(tasksClone);
}

function changeTask(tasks: TaskInfo[], setTasks: Dispatch<SetStateAction<TaskInfo[]>>, index: number) {
    let tasksClone = [...tasks];
    switch(tasksClone[index].status) {
        case 'pending':
            tasksClone[index].status = 'ongoing';
            break;
        case 'ongoing':
            tasksClone[index].status = 'done';
            break;
        case 'done':
            tasksClone[index].status = 'pending';
            break;
    }
    setTasks(tasksClone);
}

function Tasks() {
    const [tasks, setTasks] = useState((JSON.parse(cookie.get('data') as string) as Task[]).map(task => { return {
        name: task.name,
        status: task.status
    } as TaskInfo}));
    (document.getElementById('task-add') as HTMLButtonElement)
        .addEventListener('click', () => addTask(tasks, setTasks));
    return <>{
        tasks.map((task, i) => 
            <TaskItem key={i} task={task} index={i} tasks={tasks} setTasks={setTasks}/>
        )
    }</>;
}

function TaskItem({task, index, tasks, setTasks}: {
    task: TaskInfo, index: number, tasks: TaskInfo[], setTasks:Dispatch<SetStateAction<TaskInfo[]>>
}) {
    let icon = getStatusIcon(task.status);
    return (
        <li className="task-item">
            {icon && <img src={icon.path} alt={icon.alt} width="20"/>}
            <span className="task-text">{task.name}</span>
            <div className="action-buttons">
                <button className="edit-btn" title="Editar" onClick={()=>renameTask(tasks, setTasks, index)}>
                    <img src="/assets/icons/pencil-square.svg" alt="Editar" width="20" />
                </button>
                <button className="toggle-btn" title="Alterar status" onClick={()=>changeTask(tasks, setTasks, index)}>
                    <img src="/assets/icons/check-circle.svg" alt="Status" width="20" />
                </button>
                <button className="delete-btn" title="Excluir" onClick={()=>deleteTask(tasks, setTasks, index)}>
                    <img src="/assets/icons/trash.svg" alt="Excluir" width="20" />
                </button>
            </div>
        </li>
    );
}

ReactDOM.createRoot(document.getElementsByClassName('task-list')[0]).render(<Tasks/>);