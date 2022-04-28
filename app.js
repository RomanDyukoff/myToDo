;(function() {
    // globals
const todoList = document.querySelector('.todo__list');
const selectList = document.querySelector('.main__select');
const form = document.querySelector('.main__form');
let todos = [];
let users = [];


//attach events
document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);

// basik logic
function getUserId(userId) {
    const user = users.find(user => user.id === userId)
    return user.name
}

function createUserOption(user) {
    const option = document.createElement('option');

    option.value = user.id;
    option.innerHTML = user.name;

    selectList.append(option)
}

function printTodo({id, userId, title, completed}) {
    const li = document.createElement('li');
    li.className = 'todo__item';
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserId(userId)}</b></span>`

    const status = document.createElement('input');
    status.type = 'checkbox'
    status.checked = completed
    status.addEventListener('change', handleTodoChange)

    const close = document.createElement('span')
    close.innerHTML = '&times;'
    close.className = 'todo__close'
    close.addEventListener('click', handleClose)

    li.prepend(status);
    li.append(close);

    todoList.prepend(li)
}

function removeTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId)

    const todo = todoList.querySelector(`[data-id="${todoId}"]`)
    todo.querySelector('input').removeEventListener('change', handleTodoChange)
    todo.querySelector('.todo__close').removeEventListener('click', handleClose)

    todo.remove()
}

function alertMessage(error) {
    alert(error.message)
}

// event logic
function initApp() {
    Promise.all([getAllTodo(), getAllUsers()]).then(values => {
        [todos, users] = values;

        todos.forEach(todo => printTodo(todo))
        users.forEach(user => createUserOption(user))
    })
}

function handleSubmit(event) {
    event.preventDefault()

    createTodo({
        userId: Number(form.users.value),
        title: form.todo.value,
        completed: false,
    });
}

function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;

    toggleTodoCompleted(todoId, completed)
}

function handleClose() {
    const todoId = this.parentElement.dataset.id;

    deleteTodo(todoId)
}

// async fn

async function getAllTodo() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = response.json();

        return data
    } catch (error) {
        alertMessage(error)
    }
}

async function getAllUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = response.json();
    
        return data
    } catch (error) {
        alertMessage(error)
    }
}

async function createTodo(todo) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json'
            }
        })

        const newTodo = await response.json();

        printTodo(newTodo)
    } catch (error) {
        alertMessage(error)
    }
}

async function toggleTodoCompleted(todoId, completed) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({completed}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if (!response.ok) {
            throw new Error('Failed to connect with the server! Pleace try later.')
        }
    } catch (error) {
        alertMessage(error)
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if (response.ok) {
            removeTodo(todoId)
        } else {
            throw new Error('Failed to connect with the server! Pleace try later.')
        }
    } catch (error) {
        alertMessage(error)
    }
}
})()
