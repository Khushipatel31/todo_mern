import API from './axios';

export const getAllUsersWithTodos = () => API.get('/admin/users');
export const deleteUserById = (id) => API.delete(`/admin/users/${id}`);
export const deleteAnyTodoById = (id) => API.delete(`/admin/todos/${id}`);
