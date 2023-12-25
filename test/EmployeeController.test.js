const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app');
const Employee = require('../src/models/employee');
const CheckIn = require('../src/models/checkin');
const CheckOut = require('../src/models/checkout');
const { expect } = chai;
chai.use(chaiHttp);

// Use a test database for testing
mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

describe('Employee Routes', () => {
  before(async () => {
    // Clear the test database before running tests
    await Employee.deleteMany({});
    await CheckIn.deleteMany({});
    await CheckOut.deleteMany({});
  });

  describe('POST /employees', () => {
    it('should create a new employee', async () => {
      const response = await chai.request(app)
        .post('/api/employees')
        .send({ name: 'John Doe', firstName: 'John', department: 'IT' });

      expect(response).to.have.status(201);
      expect(response.body).to.have.property('name', 'John Doe');
    });

    it('should handle errors when creating an employee', async () => {
      const response = await chai.request(app)
        .post('/api/employees')
        .send({});

      expect(response).to.have.status(500);
      expect(response.body).to.have.property('error', 'Internal server error');
    });
  });

  describe('GET /employees', () => {
    it('should get all employees', async () => {
      // Create some test employees in the database
      await Employee.create({ name: 'Employee1', firstName: 'John', department: 'IT' });
      await Employee.create({ name: 'Employee2', firstName: 'Jane', department: 'HR' });

      const response = await chai.request(app).get('/api/employees');

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
    });

    it('should handle errors when getting employees', async () => {
      const response = await chai.request(app).get('/employees');

      expect(response).to.have.status(404);
    });
  });

  describe('POST /check-in', () => {
    it('should check-in an existing employee', async () => {
      // Create a test employee in the database
      const employee = await Employee.create({ name: 'John Doe', firstName: 'John', department: 'IT' });
  
      const response = await chai.request(app)
        .post('/api/check-in')
        .send({ employeeId: employee._id, comment: 'Checking in' });
  
      expect(response).to.have.status(201);
      expect(response.body).to.have.property('comment', 'Checking in');
    });
  
  
  });

  describe('POST /check-out', () => {
    it('should check-out an existing employee with a valid check-in record', async () => {
      // Create a test employee and check-in record in the database
      const employee = await Employee.create({ name: 'John Doe', firstName: 'John', department: 'IT' });
      const checkInRecord = await CheckIn.create({ employeeId: employee._id, checkInTime: new Date(), comment: 'Checking in' });
  
      const response = await chai.request(app)
        .post('/api/check-out')
        .send({ employeeId: employee._id, comment: 'Checking out', checkInId: checkInRecord._id });
  
      expect(response).to.have.status(201);
      expect(response.body).to.have.property('comment', 'Checking out');
    });
  
    it('should handle errors when checking out without a valid check-in record', async () => {
      const response = await chai.request(app)
        .post('/api/check-out')
        .send({ employeeId: 234567, comment: 'Checking out', checkInId: 456789  });
  
      expect(response).to.have.status(500);
      expect(response.body).to.have.property('error', 'Internal Server Error');
    });
  
    it('should handle errors when checking out without providing required parameters', async () => {
      const response = await chai.request(app)
        .post('/api/check-out')
        .send({});
  
      expect(response).to.have.status(500);
      expect(response.body).to.have.property('error', 'Internal Server Error');
    });
  });
  describe('GET /calculate-time/:employeeId', () => {
    it('should calculate time differences between check-in and check-out for an employee with valid records', async () => {
      // Create a test employee, check-in record, and check-out record in the database
      const employee = await Employee.create({ name: 'John Doe', firstName: 'John', department: 'IT' });
      const checkInRecord = await CheckIn.create({ employeeId: employee._id, checkInTime: new Date(), comment: 'Checking in' });
      const checkOutRecord = await CheckOut.create({ employeeId: employee._id, checkOutTime: new Date(), comment: 'Checking out', checkInId: checkInRecord._id });
  
      const response = await chai.request(app).get(`/api/calculate-time/${employee._id}`);
  
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('timeDifferences').to.be.an('array').of.length(1);
    });
  

    it('should handle errors when calculating time differences for an employee with no corresponding check-out records', async () => {
      // Create a test employee and check-in record in the database
      const employee = await Employee.create({ name: 'John Doe', firstName: 'John', department: 'IT' });
      const checkInRecord = await CheckIn.create({ employeeId:  new mongoose.Types.ObjectId(), checkInTime: new Date(), comment: 'Checking in' });
  
      const response = await chai.request(app).get(`/api/calculate-time/${employee._id}`);
  
      expect(response).to.have.status(404);
    });
  
  });
  
  
  
  
  after(async () => {
    // Disconnect from the test database after running tests
    await mongoose.connection.close();
  });

});
