import { useEffect, useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  getUserTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "../../api/todo";

const Todos = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt");

  const handleSearch = useMemo(
    () =>
      debounce((query) => {
        setSearch(query);
      }, 300),
    []
  );

  const loadTodos = useCallback(async () => {
    try {
      const { data } = await getUserTodos({ search, status, sort });
      setTodos(data);
    } catch (err) {
      alert("Error loading todos" + err);
    }
  }, [search, status, sort]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const onSearchChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await createTodo({ title: newTodo });
    setNewTodo("");
    loadTodos();
  };

  const handleUpdate = async (id) => {
    await updateTodo(id, { title: editText });
    setEditingId(null);
    loadTodos();
  };

  const handleToggle = async (id) => {
    await toggleTodo(id);
    loadTodos();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    loadTodos();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="todos-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Your Todos</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          placeholder="Search todos..."
          onChange={onSearchChange}
          style={{ padding: "5px", width: "200px" }}
        />

        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
        </select>
      </div>

      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          placeholder="New todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.length === 0 ? (
          <li>No todos found.</li>
        ) : (
          todos.map((todo) => (
            <li key={todo._id}>
              {editingId === todo._id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(todo._id)}>Save</button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleToggle(todo._id)}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(todo._id);
                      setEditText(todo.title);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(todo._id)}>Delete</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Todos;
