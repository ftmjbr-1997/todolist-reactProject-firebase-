import React, { Component } from 'react'

export default function Todo(props) {

    const removefunc = () => {
        props.onRemove(props[0])
    }
    const editFunc = () => {
        props.onEdit(props)
    }

    return (
        <div className={props[1].isCompleted ? "todo completed" : "todo"} style={{ display: 'flex' }}>
            <li className="todo-item">{props[1].todoTitle}</li>

            <button className="check-btn" onClick={editFunc}>
                <i className="fas fa-check" aria-hidden="true"></i>
            </button>

            <button className="trash-btn" onClick={removefunc}>
                <i className="fas fa-trash" aria-hidden="true"></i>
            </button>
        </div>
    )

}