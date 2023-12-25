const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee operations
 */

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       '201':
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             example:
 *               name: John Doe
 *               firstName: John
 *               department: IT
 */
router.post('/employees', (req, res) => employeeController.createEmployee(req, res));

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: createdAfter
 *         schema:
 *           type: string
 *         description: Filter employees created after the specified date
 *     responses:
 *       '200':
 *         description: List of employees
 *         content:
 *           application/json:
 *             example:
 *               - name: John Doe
 *                 firstName: John
 *                 department: IT
 */
router.get('/employees', (req, res) => employeeController.getEmployees(req, res));

/**
 * @swagger
 * /check-in:
 *   post:
 *     summary: Check-in an employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Check-in successful
 *         content:
 *           application/json:
 *             example:
 *               comment: Employee checked in successfully
 *               checkInTime: '2023-12-25T12:00:00Z'
 */
router.post('/check-in', (req, res) => employeeController.checkIn(req, res));

/**
 * @swagger
 * /check-out:
 *   post:
 *     summary: Check-out an employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               comment:
 *                 type: string
 *               checkInId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Check-out successful
 *         content:
 *           application/json:
 *             example:
 *               comment: Employee checked out successfully
 *               checkOutTime: '2023-12-25T18:00:00Z'
 */
router.post('/check-out', (req, res) => employeeController.checkOut(req, res));

/**
 * @swagger
 * /calculate-time/{employeeId}:
 *   get:
 *     summary: Calculate time differences between check-in and check-out for a specific employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the employee
 *     responses:
 *       '200':
 *         description: Time differences calculated successfully
 */
router.get('/calculate-time/:employeeId', (req, res) => employeeController.calculateTimeBetweenCheckInAndOut(req, res));

module.exports = router;
