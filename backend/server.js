const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Naloži environment variables
dotenv.config();

// Poveži z MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🎮 Otroški računalnik API',
    status: 'Deluje!',
    endpoints: {
      lessons: '/not_implemented',
      progress: '/not_implemented/'
    }
  });
});

// API Routes


// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Napaka strežnika',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Strežnik teče na http://localhost:${PORT}`);
  console.log(`Okolje: ${process.env.NODE_ENV}`);
});