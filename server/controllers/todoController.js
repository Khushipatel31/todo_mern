import Todo from '../models/todo.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import { CustomHttpError } from '../utils/customError.js';
// Create Todo
const createTodo = catchAsyncError(async (req, res) => {
    const { title } = req.body;
    const todo = new Todo({ title, user: req.user.id });
    await todo.save();
    res.status(201).json(todo);
});

// Get User Todos with optional search/filter/sort
const getUserTodos = catchAsyncError(async (req, res) => {
    const { search = '', status, sort = 'createdAt' } = req.query;

    let query = {
        user: req.user.id,
        title: { $regex: search, $options: 'i' }
    };

    if (status === 'completed') query.completed = true;
    if (status === 'incomplete') query.completed = false;

    const todos = await Todo.find(query).sort({ [sort]: -1 });
    res.json(todos);
});

// Update Todo
const updateTodo = catchAsyncError(async (req, res) => {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
        throw new CustomHttpError(404, 'Todo not found');
    }

    todo.title = req.body.title || todo.title;
    await todo.save();
    res.json(todo);
});

// Toggle Completed
const toggleCompleted = catchAsyncError(async (req, res) => {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
        throw new CustomHttpError(404, 'Todo not found');
    }

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
});

// Delete Todo
const deleteTodo = catchAsyncError(async (req, res) => {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) {
        throw new CustomHttpError(404, 'Todo not found');
    }

    res.json({ msg: 'Todo deleted' });
});
export default {
    createTodo,
    getUserTodos,
    updateTodo,
    toggleCompleted,
    deleteTodo
};
