import API from './axios';

export const getUserTodos = (params) =>
    API.get('/todos', { params });
export const createTodo = (todo) => API.post('/todos', todo);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const toggleTodo = (id) => API.patch(`/todos/${id}/toggle`);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
