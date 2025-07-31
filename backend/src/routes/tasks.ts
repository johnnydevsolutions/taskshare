import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1).max(200)
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200)
});

const reorderTasksSchema = z.object({
  taskIds: z.array(z.string())
});

// Helper function to check list access
const checkListAccess = async (listId: string, userId: string) => {
  const list = await prisma.taskList.findFirst({
    where: {
      id: listId,
      OR: [
        { ownerId: userId },
        { shares: { some: { userId } } }
      ]
    }
  });
  return list;
};

/**
 * @swagger
 * /api/tasks/lists/{listId}/tasks:
 *   get:
 *     summary: Get all tasks for a list
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       404:
 *         description: List not found or access denied
 */
router.get('/lists/:listId/tasks', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { listId } = req.params;
    const userId = req.user!.id;

    // Check access
    const list = await checkListAccess(listId, userId);
    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }

    const tasks = await prisma.task.findMany({
      where: { listId },
      include: {
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/lists/{listId}/tasks:
 *   post:
 *     summary: Create a new task in a list
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *                 example: Complete project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Task created
 *       404:
 *         description: List not found or access denied
 */
router.post('/lists/:listId/tasks', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { title } = createTaskSchema.parse(req.body);
    const { listId } = req.params;
    const userId = req.user!.id;

    // Check access
    const list = await checkListAccess(listId, userId);
    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        listId
      },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *                 example: Updated task title
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.put('/tasks/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { title } = updateTaskSchema.parse(req.body);
    const taskId = req.params.id;
    const userId = req.user!.id;

    // Get task and check access
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const hasAccess = await checkListAccess(task.listId, userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}/toggle:
 *   patch:
 *     summary: Toggle task completion status
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task status toggled
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.patch('/tasks/:id/toggle', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user!.id;

    // Get task and check access
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const hasAccess = await checkListAccess(task.listId, userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed: !task.completed },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.delete('/tasks/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user!.id;

    // Get task and check access
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const hasAccess = await checkListAccess(task.listId, userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/lists/{listId}/tasks/reorder:
 *   patch:
 *     summary: Reorder tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Tasks reordered successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: List not found
 */
router.patch('/lists/:listId/tasks/reorder', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { taskIds } = reorderTasksSchema.parse(req.body);
    const { listId } = req.params;
    const userId = req.user!.id;

    // Check access
    const hasAccess = await checkListAccess(listId, userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update task orders
    const updatePromises = taskIds.map((taskId, index) =>
      prisma.task.update({
        where: { id: taskId },
        data: { order: index }
      })
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as taskRoutes };