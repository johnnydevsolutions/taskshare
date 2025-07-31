import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation schema
const createCommentSchema = z.object({
  content: z.string().min(1).max(500)
});

// Helper function to check task access
const checkTaskAccess = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      list: {
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } }
        ]
      }
    }
  });
  return task;
};

/**
 * @swagger
 * /api/comments/tasks/{taskId}/comments:
 *   get:
 *     summary: Get all comments for a task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Task not found or access denied
 */
router.get('/tasks/:taskId/comments', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user!.id;

    // Check access
    const task = await checkTaskAccess(taskId, userId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/comments/tasks/{taskId}/comments:
 *   post:
 *     summary: Create a new comment for a task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
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
 *               content:
 *                 type: string
 *                 description: Comment content
 *                 example: This is a comment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Comment created
 *       404:
 *         description: Task not found or access denied
 */
router.post('/tasks/:taskId/comments', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { content } = createCommentSchema.parse(req.body);
    const { taskId } = req.params;
    const userId = req.user!.id;

    // Check access
    const task = await checkTaskAccess(taskId, userId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

export { router as commentRoutes };