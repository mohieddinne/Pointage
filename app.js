const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 8000

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set('strictQuery', false); // Addressing the deprecation warning

const db = mongoose.connection;
db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const employeeRoutes = require('./src/routes/employeeRoutes');
app.use('/api', employeeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app;
