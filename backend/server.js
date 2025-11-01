const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

// Naloži environment variables from backend/.env (works even when cwd is repository root)
dotenv.config({ path: path.resolve(__dirname, '.env') });

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
      lessons: '/api/lessons',
      progress: '/api/progress'
    }
  });
});

// API Routes
// Mount API routers
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
// Achievements endpoints
app.use('/api/achievements', require('./routes/achievementRoutes'));

// Swagger
try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerOptions = require('./swagger/swaggerOptions');
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (err) {
  console.warn('Swagger not available (missing packages). Install swagger-ui-express and swagger-jsdoc to enable API docs.');
}

// Centralized error handler (uses middleware/errorHandler.js)
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Strežnik teče na http://localhost:${PORT}`);
  console.log(`Okolje: ${process.env.NODE_ENV}`);
});