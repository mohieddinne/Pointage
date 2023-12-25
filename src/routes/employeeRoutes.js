const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Create a new employee
router.post('/employees', (req, res) => employeeController.createEmployee(req, res));

// Get all employees
router.get('/employees', (req, res) => employeeController.getEmployees(req, res));

// Check-in an employee
router.post('/check-in', (req, res) => employeeController.checkIn(req, res));

// Check-out an employee
router.post('/check-out', (req, res) => employeeController.checkOut(req, res));

// Calculate time between check-in and check-out for a specific employee
router.get('/calculate-time/:employeeId', (req, res) => employeeController.calculateTimeBetweenCheckInAndOut(req, res));

module.exports = router;
