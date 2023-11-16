import React, { useState, useEffect } from 'react'
import Header from './Header'
import Todo from './Todo'

export default function TodoList() {

    const [todos, setTodos] = useState([])
    const [todoTitle, setTodoTitle] = useState("")
    const [status, setStatus] = useState("all")
    const [getTodoes, setGetTodoes] = useState(false)


    useEffect(async () => {
        await fetch('https://todolist-b61f4-default-rtdb.firebaseio.com/todos.json')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    let todosArrey = Object.entries(data)
                    if (status == "all") {
                        todosArrey = [...todosArrey]
                    } else if (status == "completed") {
                        todosArrey = todosArrey.filter(todo => todo[1].isCompleted === true)
                    } else if (status == "uncompleted") {
                        todosArrey = todosArrey.filter(todo => todo[1].isCompleted === false)
                    }
                    setTodos(todosArrey)
                } else {
                    setTodos([])
                }
            })
    }, [getTodoes])

    const addTodoHandler = async (event) => {
        event.preventDefault()
        if (todoTitle) {
            let newTodo = {
                todoTitle,
                isCompleted: false
            }
            await fetch('https://todolist-b61f4-default-rtdb.firebaseio.com/todos.json', {
                method: 'POST',
                body: JSON.stringify(newTodo)
            }).then(response => (response.status == 200) && setGetTodoes(prev => !prev))
        }
        clearInputValue()
    }
    const clearInputValue = () => {
        setTodoTitle("")
    }
    const eventHandler = (event) => {
        if (event.keyCode == 13) {
            addTodoHandler(event)
        }
    }
    const removeTodoHandler = async (todoId) => {
        await fetch(`https://todolist-b61f4-default-rtdb.firebaseio.com/todos/${todoId}.json`, {
            method: 'DELETE'
        }).then(response => console.log(response))
        setGetTodoes(prev => !prev)
    }
    const editTodoHandler = async (mainItem) => {
        let mainTodo = todos.find(todo => todo[1].todoTitle == mainItem[1].todoTitle)
        mainTodo[1].isCompleted = !mainTodo[1].isCompleted
        await fetch(`https://todolist-b61f4-default-rtdb.firebaseio.com/todos/${mainTodo[0]}.json`, {
            method: 'PUT',
            body: JSON.stringify(mainTodo[1])
        }).then(response => console.log(response))
        setGetTodoes(prev => !prev)
    }
    const filterTodosHandler = (event) => {
        if (event.target.value == "all") {
            setStatus("all")
        } else if (event.target.value == "completed") {
            setStatus("completed")
        } else if (event.target.value == "uncompleted") {
            setStatus("uncompleted")
        }
        setGetTodoes(prev => !prev)
    }



    return (
        <>
            <Header />
            <form>
                <input type="text" className="todo-input" maxLength="40" value={todoTitle} onChange={(event) => setTodoTitle(event.target.value)}
                    onKeyDown={eventHandler} />
                <button className="todo-button" type="submit" onClick={addTodoHandler}>
                    <i className="fas fa-plus-square"></i>
                </button>
                <div className="select">
                    <select name="todos" className="filter-todo" onChange={filterTodosHandler}>
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="uncompleted">Uncompleted</option>
                    </select>
                </div>
            </form>

            <div className="todo-container">
                <ul className="todo-list">

                    {todos.map(todo => (
                        <Todo {...todo} onRemove={removeTodoHandler} onEdit={editTodoHandler} />
                    ))}

                </ul>
            </div>
        </>
    )

}
