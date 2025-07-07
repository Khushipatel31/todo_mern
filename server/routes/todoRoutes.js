import express from 'express';
import todoController from '../controllers/todoController.js';


import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware.auth);

router.post('/', todoController.createTodo);
router.get('/', todoController.getUserTodos);
router.put('/:id', todoController.updateTodo);
router.patch('/:id/toggle', todoController.toggleCompleted);
router.delete('/:id', todoController.deleteTodo);

export default router;
