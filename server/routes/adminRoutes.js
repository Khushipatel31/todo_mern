import { Router } from 'express';
import adminController from '../controllers/adminController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware.auth, authMiddleware.authorizeRole('admin')); // Protect all admin routes

router.get('/users', adminController.getAllUsersWithTodos);
router.delete('/users/:id', adminController.deleteUser);
router.delete('/todos/:id', adminController.deleteAnyTodo);

export default router;
