const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authMiddleware, roleCheck } = require('../middleware/auth');
/**
 * @openapi
 * /lessons:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Pridobi vse lekcije
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seznam lekcij (wrapped)
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
 *                     $ref: '#/components/schemas/Lesson'
 */
router.get('/', lessonController.getAllLessons);

/**
 * @openapi
 * /lessons/{id}:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Pridobi lekcijo po ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lekcija (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Ni najdeno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', lessonController.getLessonById);

/**
 * @openapi
 * /lessons/category/{category}:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Pridobi lekcije po kategoriji
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seznam lekcij (wrapped)
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
 *                     $ref: '#/components/schemas/Lesson'
 */
router.get('/category/:category', lessonController.getLessonsByCategory);

/**
 * @openapi
 * /lessons/difficulty/{difficulty}:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Pridobi lekcije po težavnosti
 *     parameters:
 *       - in: path
 *         name: difficulty
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seznam lekcij (wrapped)
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
 *                     $ref: '#/components/schemas/Lesson'
 */
router.get('/difficulty/:difficulty', lessonController.getLessonsByDifficulty);

// Admin / management routes
/**
 * @openapi
 * /lessons:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new lesson
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonCreate'
 *     responses:
 *       201:
 *         description: Created lesson (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 */
router.post('/', authMiddleware, roleCheck('admin'), lessonController.createLesson);

/**
 * @openapi
 * /lessons/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update an existing lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonCreate'
 *     responses:
 *       200:
 *         description: Updated lesson (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 */
router.put('/:id', authMiddleware, roleCheck('admin'), lessonController.updateLesson);

/**
 * @openapi
 * /lessons/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted lesson (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 */
router.delete('/:id', authMiddleware, roleCheck('admin'), lessonController.deleteLesson);

/**
 * @openapi
 * /lessons/bulk:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Bulk create or update lessons
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/LessonCreate'
 *     responses:
 *       200:
 *         description: Bulk operation result (wrapped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.post('/bulk', authMiddleware, roleCheck('admin'), lessonController.bulkUpdateLessons);

module.exports = router;
