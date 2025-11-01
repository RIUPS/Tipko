const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @openapi
 * /achievements/{userId}:
 *   get:
 *     tags:
 *       - Achievements
 *     summary: Get all achievements for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve achievements for (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of achievements (wrapped)
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       achievement:
 *                         $ref: '#/components/schemas/Achievement'
 *                       earnedAt:
 *                         type: string
 *                         format: date-time
 *                       shown:
 *                         type: boolean
 */
router.get('/:userId', authMiddleware, achievementController.getAllAchievements);


/**
 * @openapi
 * /achievements/unshown/{userId}:
 *   get:
 *     tags:
 *       - Achievements
 *     summary: Get unshown achievements for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve unshown achievements for (can be 'self' for the authenticated user)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of unshown achievements (wrapped)
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       achievement:
 *                         $ref: '#/components/schemas/Achievement'
 *                       earnedAt:
 *                         type: string
 *                         format: date-time
 */
router.get('/unshown/:userId', authMiddleware, achievementController.getUnshownAchievements);

module.exports = router;
