import User from "../models/user.js";
import Todo from "../models/todo.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import { CustomHttpError } from "../utils/customError.js";

// Get all users with their todos
const getAllUsersWithTodos = catchAsyncError(async (req, res) => {
    const users = await User.find().select("-password");

    const data = await Promise.all(
        users.map(async (user) => {
            const todos = await Todo.find({ user: user._id });
            return { ...user._doc, todos };
        })
    );

    res.json(data);
});

// Delete any user
const deleteUser = catchAsyncError(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    await Todo.deleteMany({ user: req.params.id });

    if (!user) {
        throw new CustomHttpError(404, "User not found");
    }

    res.json({ msg: "User and their todos deleted" });
});

// Delete any todo
const deleteAnyTodo = catchAsyncError(async (req, res) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
        throw new CustomHttpError(404, "Todo not found");
    }

    res.json({ msg: "Todo deleted by admin" });
});

export default {
    getAllUsersWithTodos,
    deleteUser,
    deleteAnyTodo,
};
