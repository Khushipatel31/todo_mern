import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
import User from '../models/user.js';
import sendMail from '../utils/sendMail.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import { CustomHttpError } from '../utils/customError.js';

const register = catchAsyncError(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new CustomHttpError(400, 'User already exists');
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    await sendMail({
        to: email,
        subject: 'Welcome to ToDo App 🎉',
        html: `<h3>Hello ${name},</h3><p>You have successfully registered to the ToDo App.</p>`,
    });

    res.status(201).json({ msg: 'User registered successfully' });
});

const login = catchAsyncError(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomHttpError(400, 'Invalid credentials');
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        throw new CustomHttpError(400, 'Invalid credentials');
    }

    const token = sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
        },
    });
});
export default {
    register,
    login,
};