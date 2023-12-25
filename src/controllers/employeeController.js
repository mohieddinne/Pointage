const Employee = require('../models/employee');
const CheckIn = require('../models/checkin');
const CheckOut = require('../models/checkout');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         firstName:
 *           type: string
 *         department:
 *           type: string
 */

class EmployeeController {
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
  async createEmployee(req, res) {
    const { name, firstName, department } = req.body;

    try {
      const employee = await Employee.create({ name, firstName, department });
      res.status(201).json(employee);
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

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
  async getEmployees(req, res) {
    try {
      const { createdAfter } = req.query;
      // Parse the date string if provided
      const filterDate = createdAfter ? new Date(createdAfter) : null;

      // Construct the query with the optional filter
      const query = filterDate ? { dateCreated: { $gt: filterDate } } : {};

      const employees = await Employee.find(query);

      res.json(employees);
    } catch (error) {
      console.error('Error getting employees:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

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
  async checkIn(req, res) {
    const { employeeId, comment } = req.body;

    try {
      const existingEmployee = await Employee.findById(employeeId);

      if (!existingEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const checkIn = await CheckIn.create({
        employeeId,
        checkInTime: new Date(),
        comment,
      });

      res.status(201).json(checkIn);
    } catch (error) {
      console.error('Error checking in employee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

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
  async checkOut(req, res) {
    try {
      const { employeeId, comment, checkInId } = req.body;

      const checkOutTime = new Date();

      const checkOut = await CheckOut.create({
        employeeId,
        checkOutTime,
        comment,
        checkInId
      });

      res.status(201).json(checkOut);
    } catch (error) {
      console.error('Error checking out:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

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
   *         content:
   *           application/json:
   */
  async calculateTimeBetweenCheckInAndOut(req, res) {
    const { employeeId } = req.params;

    try {
      // Fetch check-ins for the employee
      const checkins = await CheckIn.find({ employeeId }).lean();

      if (!checkins || checkins.length === 0) {
        return res.status(404).json({ error: `Check-ins not found for employee with id ${employeeId}` });
      }

      const timeDifferences = [];

      // Fetch corresponding check-outs for each check-in
      for (const checkin of checkins) {
        const checkout = await CheckOut.findOne({ checkInId: checkin._id }).lean();
        if (checkout) {
          const timeDifference = checkout.checkOutTime - checkin.checkInTime;
          timeDifferences.push(timeDifference);
        }
      }

      return res.status(200).json({ timeDifferences });
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new EmployeeController();
