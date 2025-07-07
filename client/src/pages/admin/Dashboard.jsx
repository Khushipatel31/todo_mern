import { useEffect, useState } from "react";
import {
  getAllUsersWithTodos,
  deleteUserById,
  deleteAnyTodoById,
} from "../../api/admin";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const { data } = await getAllUsersWithTodos();
      setUsers(data);
    } catch (err) {
      alert("Failed to fetch users" + err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm("Delete this user and all their todos?")) {
      await deleteUserById(id);
      loadUsers();
    }
  };

  const handleDeleteTodo = async (id) => {
    await deleteAnyTodoById(id);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button
        type="submit"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Logout
      </button>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="user-card">
            <h3>
              {user.name} ({user.email})
              <button
                onClick={() => handleDeleteUser(user._id)}
                style={{ marginLeft: "10px" }}
              >
                Delete User
              </button>
            </h3>
            <ul>
              {user.todos.map((todo) => (
                <li key={todo._id}>
                  {todo.title} {todo.completed ? "(✔)" : ""}
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete Todo
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
