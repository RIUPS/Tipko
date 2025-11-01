const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/**
 * @openapi
 * /admin/lessons:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Pridobi vse lekcije (tudi neaktivne)
 *     security:
 *       - bearerAuth: []
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
router.get('/lessons', adminController.getAllLessonsAdmin);

/**
 * @openapi
 * /admin/backup:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Sproži varnostno kopijo baze
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup result (wrapped)
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
router.post('/backup', adminController.runBackup);

/**
 * @openapi
 * /admin/lessons/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Izbriši lekcijo
 *     security:
 *       - bearerAuth: []
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
router.delete('/lessons/:id', adminController.deleteLessonAdmin);

module.exports = router;
