const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

/**
 * @openapi
 * /progress/leaderboard/top:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Get leaderboard (top users)
 *     responses:
 *       200:
 *         description: Leaderboard (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LeaderboardEntry'
 */
router.get('/leaderboard/top', progressController.getLeaderboard);

/**
 * @openapi
 * /progress/leaderboard/top/{limit}:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Get top N users from leaderboard
 *     parameters:
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top N users from leaderboard (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LeaderboardEntry'
 */
router.get('/leaderboard/top/:limit', progressController.getLeaderboard);

/**
 * @openapi
 * /progress/{userId}:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Get a user's progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User progress (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserProgress'
 */
router.get('/:userId', authMiddleware, progressController.getUserProgress);

/**
 * @openapi
 * /progress/{userId}/complete/{lessonId}:
 *   post:
 *     tags:
 *       - Progress
 *     summary: Mark a lesson as completed for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
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
 *               score:
 *                 type: number
 *               timeSpent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated progress (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserProgress'
 */
router.post('/:userId/complete/:lessonId', authMiddleware, progressController.saveLessonCompletion);

/**
 * @openapi
 * /progress/{userId}/score/{lessonId}:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Get user's score for a lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's score for the lesson (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: number
 */
router.get('/:userId/score/:lessonId', authMiddleware, progressController.getLessonScore);

/**
 * @openapi
 * /progress/{userId}/completed/{lessonId}:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Check if a lesson is completed
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Completed flag (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: boolean
 */
router.get('/:userId/completed/:lessonId', authMiddleware, progressController.isLessonCompleted);

/**
 * @openapi
 * /progress/{userId}/stats/categories:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Get category statistics for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category stats (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     category name:
 *                       type: object
 *                       description: The category of the lessons
 *                       properties:
 *                         completed:
 *                           type: number
 *                           description: The number of completed lessons in the category
 *                         points:
 *                           type: number
 *                           description: The total number of points earned in the category
 */
router.get('/:userId/stats/categories', authMiddleware, progressController.getCategoryStats);


/**
 * @openapi
 * /progress/{userId}/reset:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Reset a user's progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reset result (success boolean)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
router.post('/:userId/reset', authMiddleware, roleCheck('admin'), progressController.resetUserProgress);

// Streaks and achievements are handled automatically by lesson completion flow.

module.exports = router;
