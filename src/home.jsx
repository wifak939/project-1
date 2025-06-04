import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    const defaultColumns = {
        todo: {
            name: "To Do",
            items: [
                { id: "1", content: "task 1 to do" },
                { id: "2", content: "task 2 to do" }
            ],
        },
        encour: {
            name: "En cour",
            items: [{ id: "3", content: "task en cour" }],
        },
        done: {
            name: "Done",
            items: [{ id: "4", content: "Done task" }]
        }
    };

    const [columns, setColumns] = useState(() => {
        const saved = localStorage.getItem('columns');
        return saved ? JSON.parse(saved) : defaultColumns;
    });
    const [newTask, setNewTask] = useState('');
    const [active, setActive] = useState("todo");
    const [draggedItem, setDraggedItem] = useState(null);

    // Save columns to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(columns));
    }, [columns]);

    const addNewTask = () => {
        if (!newTask.trim()) return;
        const updatedColumns = { ...columns };
        updatedColumns[active].items.push({
            id: Date.now().toString(),
            content: newTask,
        });
        setColumns(updatedColumns);
        setNewTask('');
    };

    const removeTask = (columnId, taskId) => {
        const updatedColumns = { ...columns };
        updatedColumns[columnId].items = updatedColumns[columnId].items.filter((item) => item.id !== taskId);
        setColumns(updatedColumns);
    };

    const handleDragStart = (columnId, item) => {
        setDraggedItem({ columnId, item });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        if (!draggedItem) return;
        const { columnId: sourceColumnId, item } = draggedItem;
        if (sourceColumnId === columnId) return;
        const updatedColumns = { ...columns };
        updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter((i) => i.id !== item.id);
        updatedColumns[columnId].items.push(item);
        setColumns(updatedColumns);
        setDraggedItem(null);
    };

    return (
        <div className="container py-5 min-vh-100 bg-light">
            <div className="row justify-content-center mb-4">
                <div className="col-12 text-center">
                    <h1 className="display-4 fw-bold mb-4 text-primary">Task Board</h1>
                </div>
                <div className="col-12 col-md-8 mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="form-control"
                            placeholder="Add a new task..."
                            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
                        />
                        <select
                            value={active}
                            onChange={(e) => setActive(e.target.value)}
                            className="form-select"
                            style={{ maxWidth: 150 }}
                        >
                            {Object.keys(columns).map((columnId) => (
                                <option value={columnId} key={columnId}>
                                    {columns[columnId].name}
                                </option>
                            ))}
                        </select>
                        <button onClick={addNewTask} className="btn btn-warning fw-bold">
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <div className="row g-4">
                {Object.keys(columns).map((columnId) => (
                    <div className="col-12 col-md-4" key={columnId}>
                        <div
                            className="card border-top border-4 h-100"
                            style={{
                                borderTopColor:
                                    columnId === "todo"
                                        ? "#0d6efd"
                                        : columnId === "encour"
                                        ? "#ffc107"
                                        : "#198754",
                            }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, columnId)}
                        >
                            <div
                                className={`card-header text-white fw-bold ${
                                    columnId === "todo"
                                        ? "bg-primary"
                                        : columnId === "encour"
                                        ? "bg-warning"
                                        : "bg-success"
                                }`}
                            >
                                {columns[columnId].name}
                                <span className="badge bg-dark ms-2">
                                    {columns[columnId].items.length}
                                </span>
                            </div>
                            <div className="card-body" style={{ minHeight: 200 }}>
                                {columns[columnId].items.length === 0 ? (
                                    <div className="text-center text-muted fst-italic">
                                        Drop tasks here
                                    </div>
                                ) : (
                                    columns[columnId].items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="card mb-2 bg-secondary text-white d-flex flex-row align-items-center justify-content-between p-2"
                                            draggable
                                            onDragStart={() => handleDragStart(columnId, item)}
                                            style={{ cursor: "move" }}
                                        >
                                            <span>{item.content}</span>
                                            <button
                                                onClick={() => removeTask(columnId, item.id)}
                                                className="btn btn-sm btn-danger ms-2"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;