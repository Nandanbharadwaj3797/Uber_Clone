const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const cookieparser = require('cookie-parser');
const captainRoutes = require('./routes/captain-routes');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.send('Server running'));
app.use('/users', require('./routes/user-routes'));
app.use('/captain', captainRoutes);

module.exports = app;
