const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/owners', require('./routes/owners'));
app.use('/api/v1/animals', require('./routes/animals'));
app.use('/api/v1/vaccinations', require('./routes/vaccinations'));
app.use('/api/v1/nutrition', require('./routes/nutrition'));

app.get('/', (req, res) => {
  res.json({ message: 'Livestock Manager API' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});