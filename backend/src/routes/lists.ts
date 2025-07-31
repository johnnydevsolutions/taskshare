import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation schemas
const createListSchema = z.object({
  title: z.string().min(1).max(100)
});

const updateListSchema = z.object({
  title: z.string().min(1).max(100)
});

const shareListSchema = z.object({
  email: z.string().email()
});

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all lists (owned + shared)
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lists retrieved successfully
 */
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const [ownedLists, sharedLists] = await Promise.all([
      prisma.taskList.findMany({
        where: { ownerId: userId },
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          },
          shares: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.taskList.findMany({
        where: {
          shares: {
            some: { userId }
          }
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      ownedLists,
      sharedLists
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: List title
 *                 example: My Task List
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: List created
 */
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { title } = createListSchema.parse(req.body);
    const userId = req.user!.id;

    const list = await prisma.taskList.create({
      data: {
        title,
        ownerId: userId
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/lists/{id}:
 *   put:
 *     summary: Update a list
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 description: List title
 *                 example: Updated List Title
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List updated
 *       404:
 *         description: List not found or access denied
 */
router.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { title } = updateListSchema.parse(req.body);
    const listId = req.params.id;
    const userId = req.user!.id;

    // Check if user owns the list
    const list = await prisma.taskList.findFirst({
      where: {
        id: listId,
        ownerId: userId
      }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }

    const updatedList = await prisma.taskList.update({
      where: { id: listId },
      data: { title },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    res.json(updatedList);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Delete a list
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List deleted
 *       404:
 *         description: List not found or access denied
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const listId = req.params.id;
    const userId = req.user!.id;

    const list = await prisma.taskList.findFirst({
      where: {
        id: listId,
        ownerId: userId
      }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }

    await prisma.taskList.delete({
      where: { id: listId }
    });

    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/lists/{id}/share:
 *   post:
 *     summary: Share a list with another user
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to share with
 *                 example: user@example.com
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: List shared successfully
 *       400:
 *         description: Cannot share with yourself
 *       404:
 *         description: List not found or user not found
 *       409:
 *         description: List already shared with this user
 */
router.post('/:id/share', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { email } = shareListSchema.parse(req.body);
    const listId = req.params.id;
    const userId = req.user!.id;

    // Check if user owns the list
    const list = await prisma.taskList.findFirst({
      where: {
        id: listId,
        ownerId: userId
      }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }

    // Find user to share with
    const userToShare = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });

    if (!userToShare) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToShare.id === userId) {
      return res.status(400).json({ error: 'Cannot share with yourself' });
    }

    // Create share
    const share = await prisma.listShare.create({
      data: {
        listId,
        userId: userToShare.id
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(share);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'List already shared with this user' });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/lists/{id}/share/{userId}:
 *   delete:
 *     summary: Remove a share from a list
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the list
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to remove share from
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Share removed successfully
 *       404:
 *         description: List not found or access denied
 */
router.delete('/:id/share/:userId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id: listId, userId: userIdToRemove } = req.params;
    const ownerId = req.user!.id;

    // Check if user owns the list
    const list = await prisma.taskList.findFirst({
      where: {
        id: listId,
        ownerId
      }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }

    await prisma.listShare.delete({
      where: {
        listId_userId: {
          listId,
          userId: userIdToRemove
        }
      }
    });

    res.json({ message: 'Share removed successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as listRoutes };