const Employee = require('../models/employee');
const CheckIn = require('../models/checkin');
const CheckOut = require('../models/checkout');

class EmployeeController {
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

  async getEmployees(req, res) {
    try {
      const { createdAfter } = req.body;
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

  async calculateTimeBetweenCheckInAndOut(req, res) {
    const { employeeId } = req.params;

    try {
      // Fetch checkins for the employee
      const checkins = await CheckIn.find({ employeeId }).lean();

      if (!checkins || checkins.length === 0) {
        return res.status(404).json({ error: `Checkins not found for employee with id ${employeeId}` });
      }

      const timeDifferences = [];

      // Fetch corresponding checkouts for each checkin
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
