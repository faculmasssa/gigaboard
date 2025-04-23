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

export interface TaskInfo {
    name: string,
    status: TaskStatus
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

function addTask(tasks: TaskInfo[], setTasks: Dispatch<SetStateAction<TaskInfo[]>>) {
    let input = document.getElementById('task-name') as HTMLInputElement;
    if(!input.reportValidity()) {
        return;
    }
    let newTasks = [...tasks, { name: input.value, status: 'pending' as TaskStatus }];
    setTasks(newTasks);
    syncTasks(newTasks).catch(()=>{});
}


function deleteTask(tasks: TaskInfo[], setTasks: Dispatch<SetStateAction<TaskInfo[]>>, index: number) {
    let tasksClone = [...tasks];
    tasksClone.splice(index, 1);
    setTasks(tasksClone);
    syncTasks(tasksClone).catch(()=>{});
} 

function renameTask(tasks: TaskInfo[], setTasks: Dispatch<SetStateAction<TaskInfo[]>>, index: number) {
    let name = prompt('Editar');
    if(!name) {
        return;
    }
    let tasksClone = [...tasks];
    tasksClone[index].name = name;
    setTasks(tasksClone);
    syncTasks(tasksClone).catch(()=>{});
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
    syncTasks(tasksClone).catch(()=>{});
}

async function syncTasks(tasks: TaskInfo[]) {
    await fetch('/api/updatetasks', {
        method: 'POST',
        body: JSON.stringify(tasks),
        headers: {'Content-Type': 'application/json'},
    });
}

type Filter = TaskStatus|'all';

function changeFilter(filter: Filter, setFilter: Dispatch<SetStateAction<Filter>>, button: HTMLElement, buttons: HTMLElement[]) {
    buttons.find(button => button.classList.contains('active'))?.classList.remove('active');
    setFilter(filter);
    button.classList.add('active');
}

function Tasks() {
    const [tasks, setTasks] = useState((JSON.parse(cookie.get('data') as string) as TaskInfo[]));
    const [filter, setFilter] = useState('all' as Filter);
    const filterButtons = [...document.getElementsByClassName('filter-btn')] as HTMLElement[];
    filterButtons[0].addEventListener('click', ev => changeFilter('all', setFilter, ev.target as HTMLElement, filterButtons));
    filterButtons[1].addEventListener('click', ev => changeFilter('pending', setFilter, ev.target as HTMLElement, filterButtons));
    filterButtons[2].addEventListener('click', ev => changeFilter('ongoing', setFilter, ev.target as HTMLElement, filterButtons));
    filterButtons[3].addEventListener('click', ev => changeFilter('done', setFilter, ev.target as HTMLElement, filterButtons));
    (document.getElementById('task-add') as HTMLButtonElement)
        .addEventListener('click', () => addTask(tasks, setTasks));
    return <>{
        tasks.filter(task => filter === 'all' || task.status === filter).map((task, i) => 
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